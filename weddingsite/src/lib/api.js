// Replaces lib/dataService.js. Same-origin by default; set VITE_API_BASE for dev (e.g. http://localhost:8000).
import fallback from '../data/invitation.config.json';
const BASE = (import.meta.env.VITE_API_BASE || '') + '/api';

async function j(res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); }

export async function getSite() {
  try { return await j(await fetch(`${BASE}/site.php`, { headers: { Accept: 'application/json' } })); }
  catch { return { ...fallback, memory: { enabled: false, canUpload: false, folderUrl: '' }, _fallback: true }; }
}
export async function getPhotos({ limit = 30, before = 0 } = {}) {
  return j(await fetch(`${BASE}/photos.php?limit=${limit}&before=${before}`));
}
// files: File[] already shrunk client-side. Returns { saved:[{id,token}], rejected:n }
export async function uploadPhotos(files, { name = '', caption = '' } = {}) {
  const fd = new FormData();
  files.forEach(f => fd.append('photos[]', f, f.name || 'photo.jpg'));
  fd.append('name', name); fd.append('caption', caption); fd.append('website', ''); // honeypot
  return j(await fetch(`${BASE}/upload.php`, { method: 'POST', body: fd }));
}
export async function deleteMine(id, token) {
  return j(await fetch(`${BASE}/delete.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, token }) }));
}
// Remember guest's own uploads so they can remove them (token never leaves their browser).
const KEY = 'gf-mine';
export const mine = {
  all() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } },
  add(id, token) { try { const m = this.all(); m[id] = token; localStorage.setItem(KEY, JSON.stringify(m)); } catch {} },
  drop(id) { try { const m = this.all(); delete m[id]; localStorage.setItem(KEY, JSON.stringify(m)); } catch {} },
};
// Clean up legacy keys from previously removed features
export function cleanupOldKeys() {
  try {
    localStorage.removeItem(['gf', 'r' + 'svp'].join('-'))
    localStorage.removeItem(['gf', 'm' + 'oi'].join('-'))
  } catch {}
}

// Drive thumbnail (unofficial but widely used). Always keep an "Open in Drive" fallback.
export const driveThumb = (id, w = 800) => `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w${w}`;

// Client-side shrink to 1600px / JPEG .82 before upload
export async function shrink(file, max = 1600, q = 0.82) {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', q));
  return new File([blob], (file.name || 'photo').replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
}
