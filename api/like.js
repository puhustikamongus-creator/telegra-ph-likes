import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { path } = req.query;
  if (!path) return res.status(400).json({ error: 'No path' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);

  if (req.method === 'POST') {
    await supabase.from('likes').insert({ page_path: path, ip_hash: ipHash });
  }

  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('page_path', path);

  res.status(200).json({ likes: count || 0 });
}
