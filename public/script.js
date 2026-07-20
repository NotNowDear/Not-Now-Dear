const NND = {
  posts: [
    { id: 'summer-reading', date: 'July 12, 2026', title: 'A note from a very quiet summer', text: 'There is a particular kind of freedom in being a little unavailable. This summer, I have been thinking about the small spaces we make for ourselves—and the stories that grow there.' },
    { id: 'behind-cover', date: 'June 3, 2026', title: 'Behind the cover', text: 'A cover is an invitation before it is anything else. I wanted this one to feel warm, slightly mischievous, and like it had been waiting for you.' },
    { id: 'reader-letters', date: 'May 18, 2026', title: 'Letters from readers', text: 'The best part of sending a book into the world is hearing what it finds when it arrives. Thank you for every thoughtful note.' }
  ],
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};

function nav() {
  const toggle = document.querySelector('.menu-toggle'); const menu = document.querySelector('.nav');
  if (toggle) toggle.addEventListener('click', () => { menu.classList.toggle('open'); toggle.setAttribute('aria-expanded', menu.classList.contains('open')); });
}
function subscribe() {
  document.querySelectorAll('.subscribe-form').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault(); const data = Object.fromEntries(new FormData(form)); const subscribers = NND.get('nnd-subscribers', []);
    if (!data.email) return; if (!subscribers.some(item => item.email === data.email)) subscribers.push({ ...data, date: new Date().toLocaleDateString() });
    NND.set('nnd-subscribers', subscribers); form.reset(); const note = form.nextElementSibling; if (note) note.textContent = 'You’re on the list. Welcome in.';
  }));
}
function sharing(title) { if (navigator.share) return navigator.share({ title, url: location.href }); return navigator.clipboard.writeText(location.href).then(() => alert('Link copied to your clipboard.')); }
function blog() {
  const root = document.querySelector('[data-blog-posts]'); if (!root) return;
  const custom = NND.get('nnd-posts', []); const posts = [...custom, ...NND.posts];
  root.innerHTML = posts.map(post => {
    const likes = NND.get(`nnd-likes-${post.id}`, 0); const comments = NND.get(`nnd-comments-${post.id}`, []);
    return `<article class="blog-post" id="${post.id}"><div class="post-meta">${post.date}</div><h2>${post.title}</h2><div class="post-body"><p>${post.text}</p></div><div class="post-actions"><button class="action like" data-id="${post.id}">♡ <span>${likes}</span> likes</button><button class="action share" data-title="${post.title}">Share</button></div><section class="comments"><h3>Notes <span data-count="${post.id}">(${comments.length})</span></h3><div data-comments="${post.id}">${comments.map(c => `<div class="comment"><strong>${escapeHtml(c.name)}</strong><p>${escapeHtml(c.text)}</p></div>`).join('')}</div><form class="comment-form" data-comment-form="${post.id}"><input name="name" maxlength="40" placeholder="Your name" required><textarea name="text" maxlength="500" placeholder="Leave a kind note…" required></textarea><button class="button" type="submit">Post note</button></form></section></article>`;
  }).join('');
  root.addEventListener('click', e => { const button = e.target.closest('button'); if (!button) return; if (button.classList.contains('like')) { const key=`nnd-likes-${button.dataset.id}`; const total=NND.get(key,0)+1; NND.set(key,total); button.querySelector('span').textContent=total; } if (button.classList.contains('share')) sharing(button.dataset.title); });
  root.addEventListener('submit', e => { if (!e.target.matches('[data-comment-form]')) return; e.preventDefault(); const id=e.target.dataset.commentForm, data=Object.fromEntries(new FormData(e.target)), key=`nnd-comments-${id}`, comments=NND.get(key,[]); comments.push(data); NND.set(key,comments); e.target.reset(); blog(); });
}
function escapeHtml(value) { const div=document.createElement('div'); div.textContent=value; return div.innerHTML; }
function admin() {
  const form=document.querySelector('#post-form'); if (form) form.addEventListener('submit', e => { e.preventDefault(); const values=Object.fromEntries(new FormData(form)), posts=NND.get('nnd-posts',[]); posts.unshift({ id:`post-${Date.now()}`, date:new Date().toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'}), ...values }); NND.set('nnd-posts',posts); form.reset(); document.querySelector('#admin-message').textContent='Saved. It is now live in this browser.'; });
  const list=document.querySelector('#subscriber-list'); if (list) { const subscribers=NND.get('nnd-subscribers',[]); list.innerHTML=subscribers.length ? subscribers.map(s=>`<li><strong>${escapeHtml(s.name || 'Reader')}</strong><br>${escapeHtml(s.email)} <small>— ${s.date}</small></li>`).join('') : '<li>No local subscribers yet.</li>'; }
}
document.addEventListener('DOMContentLoaded', () => { nav(); subscribe(); blog(); admin(); });
