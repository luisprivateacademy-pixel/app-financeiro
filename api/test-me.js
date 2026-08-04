const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

webpush.setVapidDetails(
  'mailto:contato@financas.app',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

module.exports = async function handler(req, res) {
  try {
    const { data: subs, error } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (error) throw error;
    if (!subs || subs.length === 0) {
      return res.json({ ok: false, error: 'Nenhuma subscription cadastrada' });
    }

    const payload = JSON.stringify({
      title: 'Teste funcionando!',
      body: 'Se voce viu essa notificacao, esta tudo OK.',
      tag: 'test',
      url: '/',
    });

    let sent = 0, failed = 0;
    for (const sub of subs) {
      try {
        await webpush.sendNotification({
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth_key }
        }, payload);
        sent++;
      } catch (err) {
        failed++;
      }
    }

    return res.json({ ok: true, sent, failed, total: subs.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
