const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:contato@financas.app',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization' });
  }
  const token = authHeader.replace('Bearer ', '');

  try {
    const { data: userData, error: uErr } = await supabaseAdmin.auth.getUser(token);
    if (uErr || !userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const userId = userData.user.id;

    const { data: subs, error: sErr } = await supabaseAdmin
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth_key, device_label')
      .eq('user_id', userId);

    if (sErr) throw sErr;

    if (!subs || subs.length === 0) {
      return res.status(400).json({
        error: 'Nenhuma subscription encontrada.'
      });
    }

    const payload = JSON.stringify({
      title: 'Teste de notificacao',
      body: 'Se voce esta vendo isso, tudo funcionando!',
      tag: 'financas-test',
      url: '/',
    });

    let sent = 0;
    let failed = 0;
    const deadSubs = [];

    for (const sub of subs) {
      try {
        await webpush.sendNotification({
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth_key }
        }, payload);
        sent++;
      } catch (err) {
        failed++;
        if (err.statusCode === 410 || err.statusCode === 404) {
          deadSubs.push(sub.id);
        }
      }
    }

    if (deadSubs.length > 0) {
      await supabaseAdmin.from('push_subscriptions').delete().in('id', deadSubs);
    }

    return res.json({ ok: sent > 0, sent, failed, total: subs.length });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
