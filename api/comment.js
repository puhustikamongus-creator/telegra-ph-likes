import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const path = req.method === 'POST' ? req.body.path : req.query.path;
  if (!path) return res.status(400).json({ error: 'No path' });

  if (req.method === 'POST') {
    const { author = 'Аноним', text } = req.body;
    if (text?.trim()) {
      await supabase.from('comments').insert({ page_path: path, author, text }).catch(() => {});
    }
  }

  const { data } = await supabase
    .from('comments')
    .select('author, text, created_at')
    .eq('page_path', path)
    .order('created_at', { ascending: false });

  res.status(200).json(data || []);
}
