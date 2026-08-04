// api/send-notifications.js
// Roda todo dia (via Vercel Cron) e envia notificações push
// pras contas vencendo em 3, 2, 1 dia OU hoje

const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

// Configuração
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
  // Autenticação: só permite chamada via Vercel Cron (usa CRON_SECRET)
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

    // Formato YYYY-MM do mês atual
    const currentMonthKey = `${currentYear}-${String(currentMonth).padStart(2,'0')}`;

    // Mês seguinte (para contas que vencem nos primeiros dias do próximo mês)
    const nextDate
