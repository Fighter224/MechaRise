/* Eclipse of the Iron Gods: story site + in-page editor.
 * Content lives in content.js (window.EIG_CONTENT). Edit mode lets you change every
 * text, image, list and link. Save writes content.js back to disk (Chrome/Edge, after
 * "Connect folder") or downloads it. Each save keeps per-entry version history.
 */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const app = $('#app');

  if (!window.EIG_CONTENT) {
    app.innerHTML = '<div class="wrap section"><h2>content.js is missing</h2><p class="muted">site/content.js holds all story content. Restore it from git or a backup.</p></div>';
    return;
  }

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const S = {
    data: clone(window.EIG_CONTENT),
    baseline: JSON.stringify(window.EIG_CONTENT),
    edit: false,
    tab: {},          // selected section tab per entity
    siteDir: null,    // FileSystemDirectoryHandle for /site
    route: [],
  };
  const D = () => S.data;
  const COLS = { versions: 'Version', chapters: 'Chapter', characters: 'Character', mechas: 'Mecha', regions: 'Region' };

  /* ================= storage helpers (all optional) ================= */
  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); return true; } catch { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch {} },
  };
  const idb = {
    async db() {
      if (this._db) return this._db;
      this._db = await new Promise((res, rej) => {
        const r = indexedDB.open('eig-site', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('kv');
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
      });
      return this._db;
    },
    async get(k) { try { const db = await this.db(); return await new Promise((res) => { const q = db.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(null); }); } catch { return null; } },
    async set(k, v) { try { const db = await this.db(); db.transaction('kv', 'readwrite').objectStore('kv').put(v, k); } catch {} },
  };

  /* ================= utils ================= */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const inl = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1<i>$2</i>').replace(/`(.+?)`/g, '<code>$1</code>');
  function paras(s) {
    return String(s ?? '').split(/\n\s*\n/).filter((b) => b.trim()).map((b) => {
      const lines = b.split('\n');
      if (lines.every((l) => /^\s*- /.test(l))) return '<ul>' + lines.map((l) => '<li>' + inl(l.replace(/^\s*- /, '')) + '</li>').join('') + '</ul>';
      if (lines.every((l) => /^\s*\d+\. /.test(l) || /^\s{2,}/.test(l))) {
        const items = []; lines.forEach((l) => /^\s*\d+\. /.test(l) ? items.push(l.replace(/^\s*\d+\. /, '')) : (items[items.length - 1] += '\n' + l.trim()));
        return '<ol>' + items.map((t) => '<li>' + inl(t).replace(/\n&gt; ?/g, '<br>“').replace(/\n/g, '<br>') + '</li>').join('') + '</ol>';
      }
      if (lines.every((l) => /^\s*> ?/.test(l))) return '<blockquote>' + inl(lines.map((l) => l.replace(/^\s*> ?/, '')).join('\n')).replace(/\n/g, '<br>') + '</blockquote>';
      return '<p>' + inl(b).replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }
  const getP = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), S.data);
  function setP(path, v) {
    const ks = path.split('.'); const last = ks.pop();
    const o = ks.reduce((o, k) => o[k], S.data); o[last] = v;
  }
  const byId = (col, id) => D()[col].find((x) => x.id === id);
  const idx = (col, id) => D()[col].findIndex((x) => x.id === id);
  const uid = (p) => p + '-' + Date.now().toString(36);
  const initials = (n) => String(n || '?').replace(/^(The|Captain|Chancellor|Inspector|Elder|Mayor)\s+/, '').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const pad = (n) => String(n).padStart(2, '0');

  let toastT;
  function toast(msg, actions) {
    const t = $('#toast'); t.innerHTML = esc(msg); t.hidden = false;
    (actions || []).forEach(([label, fn]) => { const b = document.createElement('button'); b.className = 'ghost'; b.textContent = label; b.onclick = () => { t.hidden = true; fn(); }; t.appendChild(b); });
    clearTimeout(toastT); if (!actions) toastT = setTimeout(() => (t.hidden = true), 3500);
  }

  /* ================= edit primitives ================= */
  // Text field. opts: block (multi-paragraph), tag, cls, ph (placeholder), hideEmpty
  function F(path, o = {}) {
    const v = getP(path) ?? '';
    const tag = o.tag || (o.block ? 'div' : 'span');
    if (S.edit) {
      return `<${tag} class="ed${o.block ? ' ed-block' : ''} ${o.cls || ''}" data-path="${path}" data-ph="${esc(o.ph || 'Click to write…')}" contenteditable="plaintext-only" spellcheck="true"${o.block ? '' : ' data-single'}>${esc(v)}</${tag}>`;
    }
    if (!v && o.hideEmpty !== false) return o.empty || '';
    return `<${tag} class="${o.cls || ''}">${o.block ? paras(v) : inl(v)}</${tag}>`;
  }
  const A = (act, attrs, label, cls = '') =>
    S.edit ? `<button class="act ${cls}" data-act="${act}" ${Object.entries(attrs).map(([k, v]) => `data-${k}="${esc(v)}"`).join(' ')}>${label}</button>` : '';
  const rowTools = (path, i, n) => S.edit ? `<span class="row-tools">${i > 0 ? A('up', { path, i }, '↑') : ''}${i < n - 1 ? A('down', { path, i }, '↓') : ''}${A('del', { path, i }, '✕', 'danger')}</span>` : '';
  const img = (src, alt, cls = '') => src ? `<img src="${esc(src)}" alt="${esc(alt)}" class="${cls}" loading="lazy">` : '';
  const ph = (name, acc, note = 'ART PENDING') => `<div class="placeholder" style="--acc:${esc(acc || '#888')}">${esc(initials(name))}<small>${note}</small></div>`;

  function entityBar(col, id) {
    if (!S.edit) return '';
    const h = (D().history || {})[col + ':' + id] || [];
    return `<div class="editbar"><b>Editing ${COLS[col]}</b><span class="muted">id: ${esc(id)}</span><span class="grow"></span>
      ${A('history', { col, id }, 'History (' + h.length + ')')}
      ${A('move-entity', { col, id, dir: -1 }, '← Move')}${A('move-entity', { col, id, dir: 1 }, 'Move →')}
      ${A('del-entity', { col, id }, 'Delete', 'danger')}</div>`;
  }

  /* ================= pages ================= */
  function pageHome() {
    const m = D().meta, cur = byId('versions', m.current) || D().versions[0];
    const kael = D().characters[0];
    return `
    <section class="hero">
      <div class="hero-text">
        <div class="kicker">${F('meta.season', { ph: 'Season' })}</div>
        <h1>${esc(m.title).replace(/ of the /i, '<span>of the</span>')}</h1>
        ${S.edit ? `<div class="editbar">Title: ${F('meta.title')}</div>` : ''}
        <p class="tagline">${F('meta.tagline', { ph: 'Tagline' })}</p>
        <div class="cta">
          <a class="primary" href="#/story">Read the story</a>
          ${cur ? `<a class="ghost" href="#/versions/${esc(cur.id)}">Version ${esc(cur.version)} · ${esc(cur.name)}</a>` : ''}
        </div>
        ${S.edit ? `<div class="editbar">Hero image ${A('img', { path: 'meta.heroImage' }, 'Change')}
          · Current version <select class="add-link" data-bind="meta.current">${D().versions.map((v) => `<option value="${esc(v.id)}"${v.id === m.current ? ' selected' : ''}>${esc(v.version)} ${esc(v.name)}</option>`).join('')}</select></div>` : ''}
      </div>
      <div class="hero-art">
        <div class="panel">${img(m.heroImage, kael ? kael.name : '') || ph(m.title, '#c3122b')}</div>
        <div class="slash s1"></div><div class="slash s2"></div>
        <div class="vtext">${esc(m.title)} · ${esc(cur ? 'Ver ' + cur.version : '')}</div>
      </div>
      <div class="scroll-hint">SCROLL ↓</div>
    </section>

    <section class="section"><div class="wrap">
      <div class="kicker">The story so far</div>
      <h2 class="section-title">${esc(m.season)}</h2>
      <div class="summary" style="max-width:75ch">${F('meta.logline', { block: true, ph: 'Season logline' })}</div>
      <div class="grid g3" style="margin-top:32px">
        ${D().arcs.map((a, i) => `<div class="card"><div class="label">${F(`arcs.${i}.thread`)}${rowTools('arcs', i, D().arcs.length)}</div>
          <p style="margin:10px 0 6px" class="muted">${F(`arcs.${i}.start`, { ph: 'Start of season' })}</p>
          <p style="margin:0"><b style="color:var(--red-hi)">→</b> ${F(`arcs.${i}.end`, { ph: 'End of season' })}</p></div>`).join('')}
      </div>
      ${A('add', { path: 'arcs', tpl: 'arc' }, '+ Add story thread')}
    </div></section>

    <section class="section"><div class="wrap">
      <div class="kicker">Versions</div>
      <h2 class="section-title">Season roadmap</h2>
      <div class="grid g4">
        ${D().versions.map((v) => `<a class="card" href="#/versions/${esc(v.id)}" style="border-top:3px solid ${esc(v.accent)}">
          <div class="label">Version ${esc(v.version)}</div><h4>${esc(v.name)}</h4>
          <p class="muted clamp" style="margin:0">${inl(v.tagline)}</p>
          <p style="margin:10px 0 0"><span class="chip${/production/i.test(v.status) ? ' red' : ''}">${esc(v.status || 'Planned')}</span></p></a>`).join('')}
      </div>
    </div></section>

    <section class="section"><div class="wrap">
      <div class="kicker">Cast</div><h2 class="section-title">Characters</h2>
      <div class="grid g4">${D().characters.slice(0, 8).map((c) => portraitCard('characters', c)).join('')}</div>
      <p style="margin-top:20px"><a class="ghost" style="text-decoration:none;display:inline-block" href="#/characters">All characters →</a></p>
    </div></section>`;
  }

  const portraitCard = (col, c) => `<a class="card portrait-card" href="#/${col}/${esc(c.id)}">
      <div class="pic">${img(c.image, c.name) || ph(c.name, c.accent)}</div>
      <div class="cap"><div class="label" style="color:${esc(c.accent)}">${esc(c.designation || c.affiliation || '')}</div><h4>${esc(c.name)}</h4>
      <div class="muted clamp" style="font-size:13px;-webkit-line-clamp:2">${inl(c.role || '')}</div></div></a>`;
  const regionCard = (r) => `<a class="card region-card" href="#/world/${esc(r.id)}">
      <div class="sw" style="background:${r.image ? `url('${esc(r.image)}') center/cover` : `linear-gradient(135deg,${r.palette.join(',')})`}"></div>
      <div class="cap"><div class="label">${esc(r.subtitle || 'Region')}</div><h4>${esc(r.name)}</h4><p class="muted clamp" style="margin:0;font-size:14px;-webkit-line-clamp:3">${inl(r.mood)}</p></div></a>`;
  const chapterCard = (c) => `<a class="card" href="#/story/${esc(c.id)}">
      <div class="label">${esc(c.kicker)}${c.tag ? ' · ' + esc(c.tag) : ''}</div><h4>${esc(c.title)}</h4>
      <p class="muted clamp" style="margin:0;font-size:14px">${inl(c.summary.split('\n')[0])}</p></a>`;

  /* ---------- versions ---------- */
  function pageVersions(id) {
    const vs = D().versions;
    const v = byId('versions', id) || byId('versions', D().meta.current) || vs[0];
    if (!v) return `<div class="wrap section">No versions yet. ${A('new-entity', { col: 'versions' }, '+ New version')}</div>`;
    const i = idx('versions', v.id), P = `versions.${i}`;
    const linked = (col) => v[col].map((x) => byId(col, x)).filter(Boolean);
    const art = v.image || (linked('characters')[0] || {}).image || (linked('mechas')[0] || {}).image;
    const chooser = (col, label) => !S.edit ? '' : `<div class="linkchips"><span class="muted" style="font-size:13px">${label}:</span>
        ${v[col].map((x, k) => `<span class="chip">${esc((byId(col, x) || {}).name || (byId(col, x) || {}).title || x)}<button data-act="unlink" data-path="${P}.${col}" data-i="${k}" title="Remove">✕</button></span>`).join('')}
        <select class="add-link" data-link="${P}.${col}"><option value="">+ add ${label.toLowerCase()}…</option>
        ${D()[col].filter((e) => !v[col].includes(e.id)).map((e) => `<option value="${esc(e.id)}">${esc(e.name || (e.kicker + ': ' + e.title))}</option>`).join('')}</select></div>`;
    const group = (col, title, tag, render, cls) => {
      const items = linked(col);
      if (!items.length && !S.edit) return '';
      return `<div class="block" style="margin-bottom:48px"><div class="new-label"><span class="tag">${tag}</span><h3>${title}</h3></div>
        ${chooser(col, title)}<div class="grid ${cls}">${items.map(render).join('')}</div></div>`;
    };
    return `
    <nav class="ver-strip">
      ${vs.map((x) => `<a href="#/versions/${esc(x.id)}" class="${x.id === v.id ? 'active' : ''}" style="--vacc:${esc(x.accent)}"><b>${esc(x.version)}</b><span>${esc(x.name)}</span></a>`).join('')}
      ${S.edit ? `<a class="add" href="#" data-act="new-entity" data-col="versions">+ NEW VERSION</a>` : ''}
    </nav>
    <section class="banner" style="--vacc:${esc(v.accent)}">
      <div class="banner-text">
        <div class="kicker" style="color:${esc(v.accent)}">Version update</div>
        <div class="vnum">${F(P + '.version', { ph: '1.x' })}</div>
        <h1>${F(P + '.name', { ph: 'Version name' })}</h1>
        <p class="tagline">${F(P + '.tagline', { ph: 'One-line pitch for this version' })}</p>
        <div class="meta"><span class="chip${/production/i.test(v.status) ? ' red' : ''}">${F(P + '.status', { ph: 'Status' }) || 'Planned'}</span>
          ${v.date || S.edit ? `<span class="chip">${F(P + '.date', { ph: 'Target date' })}</span>` : ''}</div>
        ${S.edit ? `<div class="editbar">Accent <input type="color" data-bind="${P}.accent" value="${esc(v.accent)}"> ${A('img', { path: P + '.image' }, 'Key art')} ${v.image ? A('clear', { path: P + '.image' }, 'Use character art') : ''}</div>` : ''}
      </div>
      <div class="banner-art"><div class="frame">${img(art, v.name) || ph(v.name, v.accent, 'KEY ART PENDING')}</div><div class="bar"></div></div>
    </section>
    <div class="wrap" style="padding-top:56px;padding-bottom:40px">
      ${entityBar('versions', v.id)}
      ${group('chapters', 'Story', 'NEW CHAPTER', chapterCard, 'g3')}
      ${group('regions', 'Regions', 'NEW AREA', regionCard, 'g3')}
      ${group('characters', 'Characters', 'NEW CHARACTER', (c) => portraitCard('characters', c), 'g4')}
      ${group('mechas', 'Mechas', 'NEW MECHA', (c) => portraitCard('mechas', c), 'g4')}
      ${v.notes || S.edit ? `<div class="block"><h3>Production notes</h3><div class="prose">${F(P + '.notes', { block: true, ph: 'Notes, scope, dates…' })}</div></div>` : ''}
    </div>`;
  }

  /* ---------- story ---------- */
  function pageStory(id) {
    const chs = D().chapters;
    const c = byId('chapters', id) || chs[0];
    const i = c ? idx('chapters', c.id) : -1, P = `chapters.${i}`;
    const fact = (label, key) => (c[key] || S.edit) ? `<div><div class="label">${label}</div>${F(P + '.' + key, { ph: '—' })}</div>` : '';
    const blk = (title, key, ph) => (c[key] || S.edit) ? `<div class="block"><h3>${title}</h3><div class="prose">${F(P + '.' + key, { block: true, ph })}</div></div>` : '';
    const versionOf = c && D().versions.find((v) => v.chapters.includes(c.id));
    return `
    <div class="wrap story-head">
      <div class="kicker">${esc(D().meta.season)}</div>
      <h1>Story</h1>
      <div class="logline">${inl(D().meta.logline)}</div>
    </div>
    <div class="wrap story-layout">
      <nav class="rail">
        ${chs.map((x) => `<a href="#/story/${esc(x.id)}" class="${c && x.id === c.id ? 'active' : ''}"><b>${esc(x.kicker)}</b><span>${esc(x.title)}</span></a>`).join('')}
        ${A('new-entity', { col: 'chapters' }, '+ New chapter')}
      </nav>
      ${!c ? '<div>No chapters yet.</div>' : `<article>
        ${entityBar('chapters', c.id)}
        <div class="chapter-hero">
          <div class="bignum">${esc(c.kicker.replace(/\D/g, '') || c.kicker[0])}</div>
          <div class="kicker">${F(P + '.kicker', { ph: 'Chapter N' })}${c.tag || S.edit ? ' · ' + F(P + '.tag', { ph: 'tag' }) : ''}</div>
          <h2>${F(P + '.title', { ph: 'Chapter title' })}</h2>
          <div class="facts">${fact('Region', 'region')}${fact('Play time', 'playtime')}${fact('Player gains', 'unlocks')}
            ${versionOf ? `<div><div class="label">Version</div><a href="#/versions/${esc(versionOf.id)}">${esc(versionOf.version)} · ${esc(versionOf.name)}</a></div>` : ''}</div>
        </div>
        ${c.image || S.edit ? `<div class="block">${c.image ? `<div style="max-height:380px;overflow:hidden;clip-path:var(--cut);background:var(--paper)">${img(c.image, c.title)}</div>` : ''}
          ${A('img', { path: P + '.image' }, c.image ? 'Change image' : '+ Chapter image')}${c.image ? A('clear', { path: P + '.image' }, 'Remove image', 'danger') : ''}</div>` : ''}
        ${blk('Setting', 'setting', 'Where and when')}
        <div class="block"><h3>Summary</h3><div class="summary prose">${F(P + '.summary', { block: true, ph: 'What happens in this chapter' })}</div></div>
        ${c.keyLines.length || S.edit ? `<div class="block"><h3>Key lines</h3>
          ${c.keyLines.map((_, k) => `<div class="quote-line">${F(`${P}.keyLines.${k}`, { ph: 'SPEAKER: "line"' })}${rowTools(P + '.keyLines', k, c.keyLines.length)}</div>`).join('')}
          ${A('add', { path: P + '.keyLines', tpl: 'line' }, '+ Add line')}</div>` : ''}
        ${c.beats.length || S.edit ? `<div class="block"><h3>Scenes &amp; beats</h3><div class="grid g2">
          ${c.beats.map((b, k) => `<div class="card beat"><h4>${F(`${P}.beats.${k}.label`, { ph: 'Beat name' })}${rowTools(P + '.beats', k, c.beats.length)}</h4>
            <div class="prose" style="font-size:14.5px">${F(`${P}.beats.${k}.text`, { block: true })}</div></div>`).join('')}
          </div>${A('add', { path: P + '.beats', tpl: 'beat' }, '+ Add beat')}</div>` : ''}
        <div class="grid g2">
          ${['gameplay:Gameplay', 'mechaBeat:Mecha beat', 'boss:Boss', 'emotional:Emotional beat'].map((s) => { const [k, t] = s.split(':'); return (c[k] || S.edit) ? `<div class="card"><div class="label">${t}</div><div class="prose" style="margin-top:8px">${F(P + '.' + k, { block: true, ph: '—' })}</div></div>` : ''; }).join('')}
        </div>
        ${c.hook || S.edit ? `<div class="block" style="margin-top:28px"><h3>End hook</h3><div class="quote-line" style="border-color:var(--ink)">${F(P + '.hook', { block: true, ph: 'What pulls the player into the next chapter' })}</div></div>` : ''}
        <div style="display:flex;justify-content:space-between;margin-top:36px;gap:12px">
          ${i > 0 ? `<a class="ghost" style="text-decoration:none" href="#/story/${esc(chs[i - 1].id)}">← ${esc(chs[i - 1].title)}</a>` : '<span></span>'}
          ${i < chs.length - 1 ? `<a class="primary" style="text-decoration:none" href="#/story/${esc(chs[i + 1].id)}">${esc(chs[i + 1].title)} →</a>` : ''}
        </div>
      </article>`}
    </div>`;
  }

  /* ---------- characters & mechas (showcase) ---------- */
  function pageShowcase(col, id) {
    const list = D()[col];
    const e = byId(col, id) || list[0];
    if (!e) return `<div class="wrap section">Nothing here yet. ${A('new-entity', { col }, '+ New')}</div>`;
    const i = idx(col, e.id), P = `${col}.${i}`, isMecha = col === 'mechas';
    const tabKey = col + ':' + e.id;
    const tabI = Math.min(S.tab[tabKey] || 0, Math.max(0, e.sections.length - 1));
    const sec = e.sections[tabI];
    const stats = isMecha
      ? [['Designation', 'designation'], ['Height', 'height'], ['Role', 'role']]
      : [['Age', 'age'], ['Height', 'height'], ['Affiliation', 'affiliation']];
    const sections = S.edit
      ? `${e.sections.map((s, k) => `<div class="sec-edit"><div class="lbl">${F(`${P}.sections.${k}.label`, { ph: 'Section name' })}${rowTools(P + '.sections', k, e.sections.length)}</div>
           ${F(`${P}.sections.${k}.text`, { block: true })}</div>`).join('')}${A('add', { path: P + '.sections', tpl: 'section' }, '+ Add section')}`
      : `<div class="sc-tabs">${e.sections.map((s, k) => `<button data-tab="${esc(tabKey)}" data-i="${k}" class="${k === tabI ? 'active' : ''}">${esc(s.label)}</button>`).join('')}</div>
         <div class="sc-tabbody prose">${sec ? paras(sec.text) : ''}</div>`;
    const appearances = D().chapters.filter((c) => (c.summary + c.mechaBeat + c.beats.map((b) => b.text).join(' ')).includes(e.short || e.name));
    return `
    <section class="showcase ${isMecha ? 'dark' : ''}" style="--acc:${esc(e.accent || '#c3122b')}">
      <div class="bgname">${esc(e.short || e.name)}</div>
      <div class="slashes"></div>
      <div class="sc-grid">
        <div class="sc-art">${img(e.image, e.name) || ph(e.name, e.accent, isMecha ? 'MODEL PENDING' : 'ART PENDING')}
          ${A('img', { path: P + '.image' }, e.image ? 'Change art' : '+ Add art')}</div>
        <div class="sc-info">
          ${entityBar(col, e.id)}
          <div class="num">${isMecha ? 'Iron God' : 'Character'} · ${pad(i + 1)} / ${pad(list.length)}</div>
          <h1 class="sc-name">${S.edit ? F(P + '.short', { ph: 'Short name' }) : esc(e.short || e.name)}</h1>
          <div class="sc-full">${F(P + '.name', { ph: 'Full name' })}</div>
          ${isMecha ? '' : `<div class="sc-role">${F(P + '.role', { ph: 'Role' })}</div>`}
          <div class="sc-stats">${stats.map(([l, k]) => `<div><div class="label">${l}</div><div class="v">${F(P + '.' + k, { ph: '—' }) || '—'}</div></div>`).join('')}</div>
          ${e.quote || S.edit ? `<div class="sc-quote">“${F(P + '.quote', { ph: 'Signature line' })}”</div>` : ''}
          ${S.edit ? `<div class="editbar">Accent colour <input type="color" data-bind="${P}.accent" value="${esc(e.accent || '#c3122b')}"></div>` : ''}
          ${sections}
          ${(e.gallery || []).length || S.edit ? `<div class="sc-gallery">${(e.gallery || []).map((g, k) => `<div class="thumb">${S.edit ? '' : `<a href="${esc(g)}" target="_blank">`}${img(g, e.name + ' ' + (k + 1))}${S.edit ? `<button class="x" data-act="del" data-path="${P}.gallery" data-i="${k}" title="Remove">✕</button>` : '</a>'}</div>`).join('')}
            ${A('gallery-add', { path: P + '.gallery' }, '+ Image')}</div>` : ''}
          ${appearances.length && !S.edit ? `<div style="margin-top:20px;font-size:13px"><span class="label" style="font:600 10px/1 var(--display);letter-spacing:.22em;text-transform:uppercase;opacity:.6">Appears in</span><br>
            ${appearances.map((c) => `<a href="#/story/${esc(c.id)}" style="margin-right:12px">${esc(c.kicker)}</a>`).join('')}</div>` : ''}
        </div>
      </div>
      <nav class="roster">
        ${list.map((x) => `<a href="#/${col}/${esc(x.id)}" class="${x.id === e.id ? 'active' : ''}" title="${esc(x.name)}">${x.image ? img(x.image, x.name) : esc(initials(x.name))}<span class="nm">${esc(x.short || x.name)}</span></a>`).join('')}
        ${A('new-entity', { col }, '+ New')}
      </nav>
    </section>
    ${isMecha ? `<section class="section" style="--acc:${esc(e.accent)}"><div class="wrap">
      <div class="kicker">Restoration</div><h2 class="section-title">Stages &amp; abilities</h2>
      ${e.abilities.length || S.edit ? `<div style="overflow-x:auto"><table class="abil"><thead><tr><th>Stage</th><th>Chapter</th><th>Restored part</th><th>Ability unlocked</th><th>Notes</th>${S.edit ? '<th></th>' : ''}</tr></thead><tbody>
        ${e.abilities.map((a, k) => `<tr>${['stage', 'chapter', 'part', 'ability', 'notes'].map((f) => `<td>${F(`${P}.abilities.${k}.${f}`, { ph: '—' })}</td>`).join('')}${S.edit ? `<td>${rowTools(P + '.abilities', k, e.abilities.length)}</td>` : ''}</tr>`).join('')}
        </tbody></table></div>${A('add', { path: P + '.abilities', tpl: 'ability' }, '+ Add stage')}` : '<p class="muted">Restoration stages not designed yet.</p>'}
    </div></section>` : ''}`;
  }

  /* ---------- world ---------- */
  function pageWorld(id) {
    const rs = D().regions;
    const r = byId('regions', id) || rs[0];
    if (!r) return `<div class="wrap section">No regions. ${A('new-entity', { col: 'regions' }, '+ New region')}</div>`;
    const i = idx('regions', r.id), P = `regions.${i}`;
    const [c1, c2, c3] = [r.palette[0] || '#444', r.palette[1] || '#666', r.palette[2] || '#222'];
    const versions = D().versions.filter((v) => v.regions.includes(r.id));
    const key = r.name.replace(/^The\s+/i, '').split(/[\s-]/)[0].toLowerCase();
    const chs = key ? D().chapters.filter((c) => (c.region + ' ' + c.setting).toLowerCase().includes(key)) : [];
    return `
    <nav class="region-tabs" style="--c2:${esc(c2)}">
      ${rs.map((x) => `<a href="#/world/${esc(x.id)}" class="${x.id === r.id ? 'active' : ''}">${esc(x.name)}</a>`).join('')}
      ${S.edit ? `<a href="#" data-act="new-entity" data-col="regions" style="color:var(--red-hi)">+ New region</a>` : ''}
    </nav>
    <section class="region-hero" style="--c1:${esc(c1)};--c2:${esc(c2)};--c3:${esc(c3)}">
      <div class="bg">${img(r.image, r.name)}${r.image ? '' : `<svg class="mtn" viewBox="0 0 1200 300" preserveAspectRatio="none"><path d="M0 300 L0 190 L140 120 L260 170 L420 60 L560 150 L700 90 L860 170 L1000 80 L1200 160 L1200 300Z" fill="rgba(0,0,0,.35)"/><path d="M0 300 L0 240 L200 180 L380 230 L600 160 L820 230 L1020 190 L1200 230 L1200 300Z" fill="rgba(0,0,0,.4)"/></svg>`}</div>
      ${A('img', { path: P + '.image' }, r.image ? 'Change image' : '+ Region image')}
      <div class="txt"><div class="wrap">
        <div class="kicker" style="color:#fff">${F(P + '.subtitle', { ph: 'Subtitle' }) || 'Region'}</div>
        <h1>${F(P + '.name', { ph: 'Region name' })}</h1>
        <div class="mood">${F(P + '.mood', { block: true, ph: 'Mood' })}</div>
      </div></div>
    </section>
    <div class="wrap" style="padding:48px 32px 80px;--c2:${esc(c2)}">
      ${entityBar('regions', r.id)}
      <div class="grid g2" style="margin-bottom:40px">
        <div class="card"><div class="label">Palette</div>
          <div class="swatches" style="margin:14px 0">${r.palette.map((p, k) => `<div class="swatch"><div class="c" style="background:${esc(p)}">${S.edit ? `<input type="color" data-bind="${P}.palette.${k}" value="${esc(p)}">` : ''}</div>${esc(p)}${S.edit && r.palette.length > 1 ? `<br>${A('del', { path: P + '.palette', i: k }, '✕', 'danger')}` : ''}</div>`).join('')}
            ${S.edit ? `<div class="swatch">${A('add', { path: P + '.palette', tpl: 'color' }, '+')}</div>` : ''}</div>
          <div class="muted">${F(P + '.colours', { ph: 'Key colours in words' })}</div></div>
        <div class="card"><div class="label">Sound &amp; music</div>
          <p style="margin:14px 0 6px"><b>Signature sound:</b> ${F(P + '.sound', { ph: '—' })}</p>
          <p style="margin:0"><b>Music feel:</b> ${F(P + '.music', { ph: '—' })}</p>
          ${versions.length ? `<p style="margin:14px 0 0"><b>Featured in:</b> ${versions.map((v) => `<a href="#/versions/${esc(v.id)}">v${esc(v.version)}</a>`).join(', ')}</p>` : ''}
          ${chs.length ? `<p style="margin:6px 0 0"><b>Chapters:</b> ${chs.map((c) => `<a href="#/story/${esc(c.id)}">${esc(c.kicker)}</a>`).join(', ')}</p>` : ''}</div>
      </div>
      ${r.notes || S.edit ? `<div class="block"><h3>Overview</h3><div class="prose">${F(P + '.notes', { block: true, ph: 'Size, structure, notes' })}</div></div>` : ''}
      <div class="block"><h3>Points of interest</h3>
        <div class="grid g3">${r.pois.map((p, k) => `<div class="card poi"><h4>${F(`${P}.pois.${k}.name`, { ph: 'Name' })}${rowTools(P + '.pois', k, r.pois.length)}</h4><div class="prose muted" style="font-size:14px">${F(`${P}.pois.${k}.text`, { block: true })}</div></div>`).join('')}</div>
        ${A('add', { path: P + '.pois', tpl: 'poi' }, '+ Add place')}</div>
      ${r.kit || S.edit ? `<div class="block"><h3>Modular kit (blockout list)</h3><div class="prose muted">${F(P + '.kit', { block: true, ph: 'Pieces the environment needs' })}</div></div>` : ''}
    </div>`;
  }

  const pageDoc = () => `<iframe class="doc-frame" src="../docs/editor/index.html" title="Design document editor"></iframe>`;

  /* ================= router ================= */
  function render(keepScroll) {
    const [page = 'home', id] = (location.hash.replace(/^#\/?/, '') || 'home').split('/').map(decodeURIComponent);
    const y = scrollY;
    const html = {
      home: pageHome, versions: () => pageVersions(id), story: () => pageStory(id),
      characters: () => pageShowcase('characters', id), mechas: () => pageShowcase('mechas', id),
      world: () => pageWorld(id), doc: pageDoc,
    }[page] || pageHome;
    app.innerHTML = html();
    $$('.links a').forEach((a) => a.classList.toggle('active', a.dataset.page === page));
    $('#links').classList.remove('open');
    const t = { home: '', versions: 'Versions', story: 'Story', characters: 'Characters', mechas: 'Mechas', world: 'World', doc: 'Design Doc' }[page];
    document.title = (t ? t + ' · ' : '') + D().meta.title;
    if (keepScroll) scrollTo(0, y); else scrollTo(0, 0);
    S.route = [page, id];
  }
  addEventListener('hashchange', () => render(false));

  /* ================= dirty state, save, history ================= */
  function markDirty() {
    const dirty = JSON.stringify(S.data) !== S.baseline;
    document.body.classList.toggle('dirty', dirty);
    $('#saveBtn').disabled = !dirty; $('#discardBtn').disabled = !dirty;
    clearTimeout(markDirty.t);
    markDirty.t = setTimeout(() => { if (dirty) { if (!ls.set('eig-site:draft', JSON.stringify(S.data))) toast('Draft too large for browser storage: save soon.'); } else ls.del('eig-site:draft'); }, 400);
  }

  function snapshotHistory() {
    const base = JSON.parse(S.baseline);
    const hist = S.data.history || (S.data.history = {});
    const at = new Date().toISOString();
    for (const col of Object.keys(COLS)) {
      for (const old of base[col] || []) {
        const cur = byId(col, old.id);
        if (cur && JSON.stringify(cur) === JSON.stringify(old)) continue;
        const key = col + ':' + old.id;
        (hist[key] = hist[key] || []).unshift({ at, data: old, deleted: !cur });
        hist[key] = hist[key].slice(0, 20);
      }
    }
  }

  const serialize = () => '/* Site content. Edited from the website (Edit mode → Save). */\nwindow.EIG_CONTENT = ' + JSON.stringify(S.data, null, 1) + ';\n';

  async function ensurePerm(h) {
    if ((await h.queryPermission({ mode: 'readwrite' })) === 'granted') return true;
    return (await h.requestPermission({ mode: 'readwrite' })) === 'granted';
  }

  async function save() {
    if (JSON.stringify(S.data) === S.baseline) return;
    snapshotHistory();
    const text = serialize();
    if (S.siteDir) {
      try {
        if (!(await ensurePerm(S.siteDir))) throw new Error('permission denied');
        const fh = await S.siteDir.getFileHandle('content.js', { create: true });
        const w = await fh.createWritable(); await w.write(text); await w.close();
        toast('Saved to site/content.js');
      } catch (e) { toast('Save failed: ' + e.message); return; }
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([text], { type: 'text/javascript' }));
      a.download = 'content.js'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1500);
      toast('Downloaded content.js. Replace site/content.js with it (or Connect folder to save directly).');
    }
    S.baseline = JSON.stringify(S.data); ls.del('eig-site:draft'); markDirty(); render(true);
  }

  async function connectFolder() {
    if (!window.showDirectoryPicker) { toast('Your browser cannot write files directly: Save will download content.js. Use Chrome or Edge for direct saving.'); return; }
    try {
      const dir = await showDirectoryPicker({ mode: 'readwrite', id: 'eig-site' });
      let site = null;
      try { await dir.getFileHandle('content.js'); site = dir; } catch {}
      if (!site) { try { site = await dir.getDirectoryHandle('site'); await site.getFileHandle('content.js'); } catch { site = null; } }
      if (!site) { toast('That folder has no content.js. Pick the MechaRise folder or its "site" folder.'); return; }
      S.siteDir = site; await idb.set('siteDir', site); folderLabel(); toast('Folder connected: Save now writes to disk.');
    } catch (e) { if (e.name !== 'AbortError') toast('Could not connect: ' + e.message); }
  }
  const folderLabel = () => { $('#folderBtn').textContent = S.siteDir ? '● Folder connected' : 'Connect folder'; };

  function flat(o, p = '', out = {}) {
    if (o && typeof o === 'object') { for (const k of Object.keys(o)) flat(o[k], p ? p + '.' + k : k, out); }
    else out[p] = String(o ?? '');
    return out;
  }
  function showHistory(col, id) {
    const key = col + ':' + id, list = (D().history || {})[key] || [];
    const cur = byId(col, id);
    $('#modalTitle').textContent = 'History · ' + ((cur && (cur.name || cur.title)) || id);
    $('#modalBody').innerHTML = !list.length ? '<p class="muted">No earlier versions yet. Each Save keeps the previous version of every entry you changed (last 20).</p>' :
      list.map((h, k) => {
        const a = flat(h.data), b = flat(cur || {});
        const diffs = Object.keys({ ...a, ...b }).filter((p) => a[p] !== b[p]).slice(0, 12);
        return `<div class="hist"><div class="hist-head"><b>${new Date(h.at).toLocaleString()}</b>
          <button class="primary" data-restore="${k}">Restore this version</button></div>
          <div class="hist-diff">${diffs.length ? diffs.map((p) => `<div><b>${esc(p)}</b><del>${esc((a[p] || '∅').slice(0, 220))}</del></div>`).join('') : '<span class="muted">Same as current.</span>'}
          ${diffs.length === 12 ? '<div class="muted">…more fields differ</div>' : ''}</div></div>`;
      }).join('');
    $('#modalBody').onclick = (e) => {
      const k = e.target.dataset.restore; if (k == null) return;
      const snap = clone(list[+k].data), j = idx(col, id);
      if (j >= 0) D()[col][j] = snap; else D()[col].push(snap);
      closeModal(); markDirty(); render(true); toast('Restored. Save to keep it.');
    };
    $('#modal').hidden = false;
  }
  const closeModal = () => { $('#modal').hidden = true; };
  $('#modalClose').onclick = closeModal;
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });

  /* ================= images ================= */
  const pickFile = () => new Promise((res) => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = () => res(i.files[0]); i.click(); });
  async function storeImage(file) {
    if (!file) return null;
    if (S.siteDir && (await ensurePerm(S.siteDir).catch(() => false))) {
      const up = await (await S.siteDir.getDirectoryHandle('assets', { create: true })).getDirectoryHandle('uploads', { create: true });
      const name = Date.now().toString(36) + '-' + file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
      const w = await (await up.getFileHandle(name, { create: true })).createWritable(); await w.write(file); await w.close();
      return 'assets/uploads/' + name;
    }
    if (file.size > 1.5e6) toast('Big image stored inside content.js. Connect folder to save images as files instead.');
    return await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(file); });
  }

  /* ================= templates ================= */
  const TPL = {
    arc: () => ({ thread: 'New thread', start: '', end: '' }),
    line: () => '',
    beat: () => ({ label: 'New beat', text: '' }),
    section: () => ({ label: 'New section', text: '' }),
    ability: () => ({ stage: 'R?', chapter: '', part: '', ability: '', notes: '' }),
    poi: () => ({ name: 'New place', text: '' }),
    color: () => '#888888',
  };
  const NEW = {
    versions: () => { const last = D().versions[D().versions.length - 1]; const n = last ? (parseFloat(last.version) + 0.1).toFixed(1) : '1.0';
      return { id: uid('v'), version: n, name: 'New version', tagline: '', status: 'Planned', date: '', image: '', accent: '#c3122b', chapters: [], regions: [], characters: [], mechas: [], notes: '' }; },
    chapters: () => ({ id: uid('ch'), kicker: 'Chapter ' + (D().chapters.filter((c) => /^Chapter/.test(c.kicker)).length + 1), title: 'New chapter', tag: '', region: '', playtime: '', unlocks: '', image: '', setting: '', summary: '', gameplay: '', mechaBeat: '', boss: '', emotional: '', hook: '', keyLines: [], beats: [] }),
    characters: () => ({ id: uid('char'), name: 'New Character', short: 'New', role: '', quote: '', age: '', height: '', affiliation: '', accent: '#8a93a3', image: '', gallery: [], sections: [{ label: 'Profile', text: '' }] }),
    mechas: () => ({ id: uid('mecha'), name: 'New Mecha', short: '', designation: '', role: '', quote: '', height: '', accent: '#7fd6ff', image: '', gallery: [], sections: [{ label: 'Personality', text: '' }], abilities: [] }),
    regions: () => ({ id: uid('region'), name: 'New Region', subtitle: '', mood: '', palette: ['#556677', '#8899aa', '#223344'], colours: '', sound: '', music: '', image: '', pois: [], kit: '', notes: '' }),
  };
  const ROUTE = { versions: 'versions', chapters: 'story', characters: 'characters', mechas: 'mechas', regions: 'world' };

  /* ================= event wiring ================= */
  document.addEventListener('input', (e) => {
    const t = e.target;
    if (t.matches('.ed[data-path]')) { setP(t.dataset.path, t.innerText.replace(/\n$/, '')); markDirty(); }
    else if (t.matches('input[type=color][data-bind]')) { setP(t.dataset.bind, t.value); markDirty(); const sw = t.closest('.c'); if (sw) sw.style.background = t.value; }
  });
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.matches('input[type=color][data-bind]')) render(true);
    if (t.matches('select[data-bind]')) { setP(t.dataset.bind, t.value); markDirty(); render(true); }
    if (t.matches('select[data-link]') && t.value) { getP(t.dataset.link).push(t.value); markDirty(); render(true); }
  });
  document.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t.matches && t.matches('.ed[data-single]') && e.key === 'Enter') { e.preventDefault(); t.blur(); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); if (S.edit) save(); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') { e.preventDefault(); setEdit(!S.edit); }
    if (e.key === 'Escape') closeModal();
  });
  // re-render when leaving a field so view-mode formatting of other parts stays correct
  document.addEventListener('focusout', (e) => { if (e.target.matches && e.target.matches('.ed[data-path]')) { /* keep DOM; values already stored */ } });

  document.addEventListener('click', async (e) => {
    const tab = e.target.closest('[data-tab]');
    if (tab) { S.tab[tab.dataset.tab] = +tab.dataset.i; render(true); return; }
    const b = e.target.closest('[data-act]');
    if (!b) return;
    e.preventDefault();
    const { act, path, col, id } = b.dataset, i = +b.dataset.i;
    const arr = path ? getP(path) : null;
    switch (act) {
      case 'add': arr.push(TPL[b.dataset.tpl]()); break;
      case 'del': if (typeof arr[i] === 'object' && !confirm('Delete this item?')) return; arr.splice(i, 1); break;
      case 'unlink': arr.splice(i, 1); break;
      case 'up': [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; break;
      case 'down': [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; break;
      case 'clear': setP(path, ''); break;
      case 'img': { const src = await storeImage(await pickFile()); if (!src) return; setP(path, src); break; }
      case 'gallery-add': { const src = await storeImage(await pickFile()); if (!src) return; arr.push(src); break; }
      case 'new-entity': { const ent = NEW[col](); D()[col].push(ent); markDirty(); location.hash = `#/${ROUTE[col]}/${ent.id}`; return; }
      case 'del-entity': {
        const ent = byId(col, id);
        if (!confirm(`Delete ${COLS[col].toLowerCase()} "${ent.name || ent.title}"? (It stays in History after Save.)`)) return;
        D()[col].splice(idx(col, id), 1);
        D().versions.forEach((v) => { if (v[col]) v[col] = v[col].filter((x) => x !== id); });
        markDirty(); location.hash = `#/${ROUTE[col]}`; return;
      }
      case 'move-entity': {
        const j = idx(col, id), k = j + +b.dataset.dir, list = D()[col];
        if (k < 0 || k >= list.length) return;
        [list[j], list[k]] = [list[k], list[j]]; break;
      }
      case 'history': showHistory(col, id); return;
      default: return;
    }
    markDirty(); render(true);
  });

  function setEdit(on) {
    S.edit = on; $('#editToggle').checked = on;
    document.body.classList.toggle('editing', on);
    ls.set('eig-site:edit', on ? '1' : '');
    render(true);
  }
  $('#editToggle').addEventListener('change', (e) => setEdit(e.target.checked));
  $('#saveBtn').onclick = save;
  $('#folderBtn').onclick = connectFolder;
  $('#discardBtn').onclick = () => {
    if (!confirm('Discard all unsaved edits?')) return;
    S.data = JSON.parse(S.baseline); ls.del('eig-site:draft'); markDirty(); render(true); toast('Edits discarded');
  };
  $('#menuBtn').onclick = () => $('#links').classList.toggle('open');
  addEventListener('beforeunload', (e) => { if (JSON.stringify(S.data) !== S.baseline) { e.preventDefault(); e.returnValue = ''; } });

  /* ================= boot ================= */
  (async () => {
    const h = await idb.get('siteDir');
    if (h) { S.siteDir = h; folderLabel(); }
  })();
  const draft = ls.get('eig-site:draft');
  if (draft && draft !== S.baseline) {
    toast('You have unsaved edits from last time.', [
      ['Restore', () => { try { S.data = JSON.parse(draft); markDirty(); render(true); } catch {} }],
      ['Discard', () => ls.del('eig-site:draft')],
    ]);
  }
  if (ls.get('eig-site:edit')) { S.edit = true; $('#editToggle').checked = true; document.body.classList.add('editing'); }
  render(false);
})();
