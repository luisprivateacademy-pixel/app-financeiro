const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:contato@financas.app',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

module.exports = async function handler(req, res) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
  const isVercelCron = req.headers['x-vercel-cron'] === '1' || req.headers['user-agent']?.includes('vercel-cron');

  if (!isVercelCron && authHeader !== expectedAuth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const now = new Date();
    const todayDay = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const currentMonthKey = `${currentYear}-${String(currentMonth).padStart(2,'0')}`;

    const nextDate = new Date(currentYear, currentMonth, 1);
    const nextMonthKey = `${nextDate.getFullYear()}-${String(nextDate.getMonth()+1).padStart(2,'0')}`;

    const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();

    const { data: bills, error: bErr } = await supabase
      .from('bills')
      .select('id, user_id, name, day, value, month_key, status, category')
      .in('month_key', [currentMonthKey, nextMonthKey])
      .in('status', ['pending', 'partial', 'overdue']);

    if (bErr) throw bErr;

    const targetBills = [];
    for (const b of bills || []) {
      let daysUntil = null;
      if (b.month_key === currentMonthKey) {
        daysUntil = b.day - todayDay;
      } else if (b.month_key === nextMonthKey) {
        daysUntil = (daysInCurrentMonth - todayDay) + b.day;
      }
      if (daysUntil !== null && daysUntil >= 0 && daysUntil <= 3) {
        targetBills.push({ ...b, daysUntil });
      }
    }

    if (targetBills.length === 0) {
      return res.json({ ok: true, message: 'Nenhuma conta proxima do vencimento', sent: 0 });
    }

    const byUser = {};
    for (const b of targetBills) {
      if (!byUser[b.user_id]) byUser[b.user_id] = [];
      byUser[b.user_id].push(b);
    }

    const userIds = Object.keys(byUser);
    const { data: subs, error: sErr } = await supabase
      .from('push_subscriptions')
      .select('id, user_id, endpoint, p256dh, auth_key')
      .in('user_id', userIds);

    if (sErr) throw sErr;

    let totalSent = 0;
    let totalFailed = 0;
    const deadSubs = [];

    for (const [userId, userBills] of Object.entries(byUser)) {
      const userSubs = (subs || []).filter(s => s.user_id === userId);
      if (userSubs.length === 0) continue;

      const title = buildTitle(userBills);
      const body = buildBody(userBills);

      const payload = JSON.stringify({
        title,
        body,
        tag: `financas-${new Date().toISOString().slice(0,10)}`,
        url: '/',
      });

      for (const sub of userSubs) {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth_key,
          }
        };

        try {
          await webpush.sendNotification(pushSubscription, payload);
          totalSent++;
        } catch (err) {
          totalFailed++;
          if (err.statusCode === 410 || err.statusCode === 404) {
            deadSubs.push(sub.id);
          }
          console.error(`Failed to send to sub ${sub.id}:`, err.statusCode, err.body);
        }
      }
    }

    if (deadSubs.length > 0) {
      await supabase.from('push_subscriptions').delete().in('id', deadSubs);
    }

    return res.json({
      ok: true,
      sent: totalSent,
      failed: totalFailed,
      users: userIds.length,
      bills: targetBills.length,
      cleaned: deadSubs.length,
    });

  } catch (err) {
    console.error('send-notifications error:', err);
    return res.status(500).json({ error: err.message });
  }
};

function buildTitle(bills) {
  const hoje = bills.filter(b => b.daysUntil === 0);
  if (hoje.length > 0) return `${hoje.length} conta(s) vencem HOJE`;

  const amanha = bills.filter(b => b.daysUntil === 1);
  if (amanha.length > 0 && amanha.length === bills.length) return `Conta vence amanha`;

  return `${bills.length} conta(s) proxima(s) do vencimento`;
}

function buildBody(bills) {
  bills.sort((a, b) => a.daysUntil - b.daysUntil);
  const top = bills.slice(0, 3);
  const parts = top.map(b => {
    const value = Number(b.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    let when;
    if (b.daysUntil === 0) when = 'hoje';
    else if (b.daysUntil === 1) when = 'amanha';
    else when = `em ${b.daysUntil}d`;
    return `${b.name} R$ ${value} · ${when}`;
  });
  let body = parts.join('\n');
  if (bills.length > 3) body += `\n+${bills.length - 3} mais`;
  return body;
}
