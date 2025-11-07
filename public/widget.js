<div id="reactions" style="margin:30px 0; padding:20px; border:1px solid #ddd; border-radius:12px; font-family:system-ui;">
  <div style="display:flex; gap:10px; align-items:center; margin-bottom:15px;">
    <button onclick="like()" style="background:#ef4444; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">Лайк</button>
    <strong>Лайков: <span id="count">0</span></strong>
  </div>
  <textarea id="text" placeholder="Комментарий..." style="width:100%; height:60px; padding:8px; border:1px solid #ccc; border-radius:6px; margin-bottom:8px;"></textarea>
  <button onclick="comment()" style="background:#3b82f6; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">Отправить</button>
  <div id="list" style="margin-top:15px;"></div>
</div>

<script>
const path = location.pathname.split('/').pop();
const API = 'https://telegra-ph-like.vercel.app/api';  // ← ТВОЙ URL!

async function load() {
  try {
    const [l, c] = await Promise.all([
      fetch(`${API}/like?path=${path}`).then(r => r.json()),
      fetch(`${API}/comment?path=${path}`, {method:'POST', body:JSON.stringify({path}), headers:{'Content-Type':'application/json'}}).then(r => r.json())
    ]);
    document.getElementById('count').textContent = l.likes;
    document.getElementById('list').innerHTML = c.map(x => `
      <div style="margin:8px 0; padding:8px; background:#f9f9f9; border-radius:6px;">
        <b>${x.author}</b>: ${x.text}
        <br><small style="color:#888;">${new Date(x.created_at).toLocaleString()}</small>
      </div>
    `).join('') || '<i style="color:#888;">Нет комментариев</i>';
  } catch (e) {
    document.getElementById('list').innerHTML = '<i style="color:red;">Ошибка загрузки</i>';
  }
}

async function like() { await fetch(`${API}/like?path=${path}`, {method:'POST'}); load(); }
async function comment() {
  const text = document.getElementById('text').value.trim();
  if (!text) return;
  await fetch(`${API}/comment`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({path, text})});
  document.getElementById('text').value = '';
  load();
}

load();
</script>
