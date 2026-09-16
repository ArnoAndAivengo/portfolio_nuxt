(function () {
  const SNAPSHOT_DATE = '2026-09-16';
  const SNAPSHOT_URL = './data/snapshot.json?v=' + SNAPSHOT_DATE;
  const USAGE_API = 'https://whatstrending.ai/api/models';
  const GH_DATA = 'https://raw.githubusercontent.com/oolong-tea-2026/arena-ai-leaderboards/main/data/';
  const JSDELIVR = 'https://cdn.jsdelivr.net/gh/oolong-tea-2026/arena-ai-leaderboards@main/data/';
  const WULONG = 'https://api.wulong.dev/arena-ai-leaderboards/v1/leaderboard?name=';
  const ARENA_PAGE = 'https://arena.ai/leaderboard/';
  const LIVE_MS = 7000;
  const COMPARE_MAX = 3;
  const LIST_LIMIT = 12;
  const MODE_TAIL = /-(?:high|xhigh|x-high|max|medium|low|thinking|reasoning|batch|search|grounding|web-search|non-reasoning|720p|1080p|480p|2k|32k|200k|1m)$/;
  const LICENSES = ['all', 'open', 'proprietary'];
  const SORTS = ['rank', 'price', 'context', 'open'];

  const SPHERES = window.AI_SPHERES || [];
  const SCENES = window.AI_SCENES || [];
  const CATALOG = window.AI_CATALOG || [];
  const findProfile = window.AI_findProfile || (() => null);
  const vendorIcon = window.AI_vendorIcon || (() => '');
  const normalize = window.AI_normalize || ((v) => String(v || '').toLowerCase());

  const DIM_LABELS = {
    'Net Improvement': 'Польза',
    'Confirmed Success': 'Закрыто',
    'Praise vs Complaint': 'Хвалят',
    Steerability: 'Курс',
    'Bash Recovery': 'Восстановление',
    'Tool Hallucination': 'Галлюц. tools'
  };

  const state = {
    sphere: 'trending',
    query: '',
    license: 'all',
    sort: 'rank',
    usage: [],
    arena: { models: [] },
    error: '',
    note: '',
    loading: true,
    refreshing: false,
    cards: [],
    compare: [],
    expanded: false
  };

  const els = {
    chips: document.getElementById('ai-chips'),
    scenes: document.getElementById('ai-scenes'),
    hint: document.getElementById('ai-hint'),
    status: document.getElementById('ai-status'),
    grid: document.getElementById('ai-grid'),
    search: document.getElementById('ai-search'),
    license: document.getElementById('ai-license'),
    sort: document.getElementById('ai-sort'),
    empty: document.getElementById('ai-empty'),
    compare: document.getElementById('ai-compare'),
    more: document.getElementById('ai-more')
  };

  const cache = { snapshot: null, usage: null, arena: {}, arenaLive: {}, date: '', usageLive: false };
  let token = 0;
  let liveCtrl = null;

  function compact(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '';
    const abs = Math.abs(n);
    if (abs >= 1e12) return trimNum(n / 1e12) + 'T';
    if (abs >= 1e9) return trimNum(n / 1e9) + 'B';
    if (abs >= 1e6) return trimNum(n / 1e6) + 'M';
    if (abs >= 1e3) return trimNum(n / 1e3) + 'K';
    return String(Math.round(n));
  }

  function trimNum(n) {
    return n.toFixed(n >= 10 ? 0 : 1).replace(/\.0$/, '');
  }

  function formatInt(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '';
    return n.toLocaleString('ru-RU');
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function sphereById(id) {
    return SPHERES.find((item) => item.id === id) || SPHERES[0];
  }

  function sceneBySphere(id) {
    return SCENES.find((item) => item.sphere === id) || null;
  }

  function hashId() {
    return (location.hash || '').replace(/^#/, '');
  }

  function readUrl() {
    const params = new URLSearchParams(location.search);
    const hash = hashId();
    let sphere = 'trending';
    if (hash === 'top') sphere = state.sphere || 'trending';
    else if (SPHERES.some((item) => item.id === hash)) sphere = hash;
    const license = params.get('license');
    const sort = params.get('sort');
    return {
      sphere,
      query: params.get('q') || '',
      license: LICENSES.indexOf(license) >= 0 ? license : 'all',
      sort: SORTS.indexOf(sort) >= 0 ? sort : 'rank'
    };
  }

  function writeUrl() {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const q = state.query.trim();
    if (q) params.set('q', q);
    else params.delete('q');
    if (state.license && state.license !== 'all') params.set('license', state.license);
    else params.delete('license');
    if (state.sort && state.sort !== 'rank') params.set('sort', state.sort);
    else params.delete('sort');
    if (hashId() !== 'top') {
      url.hash = state.sphere === 'trending' ? '' : state.sphere;
    }
    const next = url.pathname + url.search + url.hash;
    const cur = location.pathname + location.search + location.hash;
    if (next !== cur) history.replaceState(null, '', next);
  }

  function applyFilterUi(root, value) {
    if (!root) return value;
    const list = root.querySelector('.ai-filter__list');
    const valueEl = root.querySelector('.ai-filter__value');
    const options = [...(list ? list.querySelectorAll('[data-value]') : [])];
    const opt = options.find((item) => item.getAttribute('data-value') === value) || options[0];
    if (!opt) return value;
    const next = opt.getAttribute('data-value');
    root.setAttribute('data-value', next);
    if (valueEl) valueEl.textContent = opt.getAttribute('data-label') || opt.textContent.trim();
    options.forEach((item) => {
      item.setAttribute('aria-selected', item === opt ? 'true' : 'false');
    });
    return next;
  }

  function applyUrlState(next) {
    state.query = next.query;
    if (els.search && els.search.value !== next.query) els.search.value = next.query;
    if (next.license !== state.license) state.license = applyFilterUi(els.license, next.license);
    else state.license = next.license;
    if (next.sort !== state.sort) state.sort = applyFilterUi(els.sort, next.sort);
    else state.sort = next.sort;
  }

  function familyKey(name) {
    return normalize(name)
      .replace(/-(max|high|xhigh|medium|low|batch|preview|lite|free|pro|flash|mini|turbo)$/g, '')
      .replace(/-(max|high|xhigh|medium|low)$/g, '');
  }

  function matchUsage(name) {
    const key = familyKey(name);
    if (!key) return null;
    let best = null;
    let bestLen = 0;
    for (const row of state.usage) {
      const blob = familyKey([row.name, row.or].filter(Boolean).join(' '));
      if (!blob) continue;
      if (blob.includes(key) || key.includes(blob)) {
        const len = Math.min(key.length, blob.length);
        if (len > bestLen) {
          best = row;
          bestLen = len;
        }
      }
    }
    return bestLen >= 8 || (best && bestLen >= key.length - 2) ? best : bestLen >= 6 ? best : null;
  }

  function fetchJson(url, signal) {
    return fetch(url, { headers: { Accept: 'application/json' }, signal }).then((res) => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  function raceJson(urls, parent, ms) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    const onParent = () => ctrl.abort();
    if (parent) parent.addEventListener('abort', onParent);
    const pending = urls.map((url) => fetchJson(url, ctrl.signal));
    return Promise.any(pending).finally(() => {
      clearTimeout(timer);
      if (parent) parent.removeEventListener('abort', onParent);
      ctrl.abort();
    });
  }

  function ingestSnapshot(json) {
    if (!json || typeof json !== 'object') return null;
    cache.snapshot = json;
    cache.date = /^\d{4}-\d{2}-\d{2}$/.test(json.fetched || '') ? json.fetched : SNAPSHOT_DATE;
    if (!cache.usage && Array.isArray(json.usage)) cache.usage = json.usage;
    Object.keys(json.arena || {}).forEach((name) => {
      if (!cache.arena[name]) cache.arena[name] = json.arena[name];
    });
    return json;
  }

  function loadSnapshot() {
    if (cache.snapshot) return Promise.resolve(cache.snapshot);
    if (window.AI_SNAPSHOT) {
      return Promise.resolve(ingestSnapshot(window.AI_SNAPSHOT));
    }
    return fetchJson(SNAPSHOT_URL).then(ingestSnapshot);
  }

  function hydrate(sphere) {
    state.usage = cache.usage || [];
    state.arena = (sphere.arena && cache.arena[sphere.arena]) || { models: [] };
  }

  async function refreshLive(sphere, my, signal) {
    if (location.protocol === 'file:') return;
    const tasks = [];
    if (!cache.usageLive) {
      tasks.push(
        raceJson([USAGE_API], signal, LIVE_MS)
          .then((json) => {
            const rows = Array.isArray(json && json.data) ? json.data : [];
            if (rows.length) {
              cache.usage = rows;
              cache.usageLive = true;
            }
          })
          .catch(() => {})
      );
    }
    if (sphere.arena && !cache.arenaLive[sphere.arena]) {
      const date = /^\d{4}-\d{2}-\d{2}$/.test(cache.date) ? cache.date : SNAPSHOT_DATE;
      const file = encodeURIComponent(sphere.arena) + '.json';
      tasks.push(
        raceJson([
          WULONG + encodeURIComponent(sphere.arena),
          JSDELIVR + date + '/' + file,
          GH_DATA + date + '/' + file
        ], signal, LIVE_MS)
          .then((json) => {
            if (json && Array.isArray(json.models) && json.models.length) {
              cache.arena[sphere.arena] = json;
              cache.arenaLive[sphere.arena] = true;
            }
          })
          .catch(() => {})
      );
    }
    if (!tasks.length) return;
    state.refreshing = true;
    render();
    await Promise.all(tasks);
    if (my !== token || signal.aborted) return;
    hydrate(sphere);
    state.refreshing = false;
    state.note = '';
    render();
  }

  function catalogCards(sphereId) {
    const list = sphereId === 'trending'
      ? CATALOG
      : CATALOG.filter((item) => (item.spheres || []).includes(sphereId));
    return list.map((profile, index) => ({
      rank: index + 1,
      name: profile.name,
      vendor: profile.vendor,
      license: 'proprietary',
      profile,
      usage: matchUsage(profile.name),
      arena: null,
      source: 'catalog'
    }));
  }

  function usageCards() {
    if (!state.usage.length) return catalogCards('trending');
    return state.usage.map((row) => {
      const profile = findProfile(row.name, row.or);
      return {
        rank: row.rank,
        name: (profile && profile.name) || row.name,
        vendor: (profile && profile.vendor) || row.provider || '',
        license: /open/i.test(row.category || '') ? 'open' : 'proprietary',
        profile,
        usage: row,
        arena: null,
        source: 'usage'
      };
    });
  }

  function arenaCards(payload) {
    const models = (payload && payload.models) || [];
    if (!models.length) return catalogCards(state.sphere);
    return models.map((row) => {
      const profile = findProfile(row.model, row.vendor);
      return {
        rank: row.rank,
        name: (profile && profile.name) || prettyName(row.model),
        vendor: (profile && profile.vendor) || row.vendor || '',
        license: row.license === 'open' ? 'open' : 'proprietary',
        profile,
        usage: matchUsage(row.model),
        arena: row,
        source: 'arena'
      };
    });
  }

  function prettyName(value) {
    return String(value || '')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (ch) => ch.toUpperCase());
  }

  function rawName(card) {
    const a = card.arena || {};
    const u = card.usage || {};
    return a.model || u.name || card.name || '';
  }

  function stripModes(norm) {
    let s = String(norm || '');
    s = s.replace(/-\d{4}-\d{2}-\d{2}$/, '');
    s = s.replace(/-\d{8}$/, '');
    let prev;
    do {
      prev = s;
      s = s.replace(MODE_TAIL, '');
    } while (s !== prev);
    return s;
  }

  function familyKey(card) {
    const raw = rawName(card);
    const extra = card.usage && card.usage.or;
    return stripModes(normalize(raw || extra || card.name || '')) || normalize(card.name || '');
  }

  function variantLabel(raw) {
    const text = String(raw || '');
    const full = normalize(text);
    const base = stripModes(full);
    if (full !== base) {
      return prettyMode(full.slice(base.length).replace(/^-+/, '').replace(/-/g, ' '));
    }
    const parens = text.match(/\(([^)]+)\)/);
    return parens ? prettyMode(parens[1]) : '';
  }

  function prettyMode(label) {
    return String(label || '')
      .trim()
      .split(/[\s-]+/)
      .filter(Boolean)
      .map((part) => {
        const low = part.toLowerCase();
        const map = {
          high: 'High',
          max: 'Max',
          xhigh: 'xHigh',
          thinking: 'Thinking',
          reasoning: 'Reasoning',
          batch: 'batch',
          search: 'search',
          grounding: 'grounding',
          medium: 'Medium',
          low: 'Low',
          web: 'web',
          non: 'non',
          '32k': '32K',
          '200k': '200K',
          '1m': '1M',
          '720p': '720p',
          '1080p': '1080p',
          '480p': '480p',
          '2k': '2K'
        };
        if (map[low]) return map[low];
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(' ');
  }

  function variantPhrase(n) {
    const n10 = n % 10;
    const n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return 'ещё ' + n + ' вариант';
    if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return 'ещё ' + n + ' варианта';
    return 'ещё ' + n + ' вариантов';
  }

  function groupCards(cards) {
    const buckets = new Map();
    cards.forEach((card) => {
      const key = familyKey(card);
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(card);
    });
    const grouped = [];
    buckets.forEach((list, key) => {
      list.sort((a, b) => rankOf(a) - rankOf(b) || String(rawName(a)).localeCompare(String(rawName(b))));
      const head = list[0];
      const rest = list.slice(1);
      const seen = {};
      const labels = [];
      rest.forEach((card) => {
        const label = variantLabel(rawName(card)) || prettyName(rawName(card));
        if (!label || seen[label]) return;
        seen[label] = true;
        labels.push(label);
      });
      grouped.push({
        ...head,
        family: key,
        variants: labels,
        variantNames: rest.map(rawName)
      });
    });
    grouped.sort((a, b) => rankOf(a) - rankOf(b));
    return grouped;
  }

  function cardKey(card) {
    return card.family || familyKey(card);
  }

  function cardTitle(card) {
    const a = card.arena || {};
    const u = card.usage || {};
    return card.name || a.model || u.name || '';
  }

  function eloText(card) {
    const a = card.arena || {};
    return a.score != null ? `${a.score}${a.ci != null ? '±' + a.ci : ''}` : '';
  }

  function netText(card) {
    const scores = card.arena && card.arena.scores;
    const net = Array.isArray(scores) ? scores.find((item) => item.name === 'Net Improvement') : null;
    if (!net || net.score == null || net.score === '') return '';
    return (Number(net.score) > 0 ? '+' : '') + net.score;
  }

  function pricingText(card) {
    const p = card.profile || {};
    const u = card.usage || {};
    return u.pricing || p.pricing || '';
  }

  function contextText(card) {
    const p = card.profile || {};
    const u = card.usage || {};
    return u.context || p.context || '';
  }

  function tokensText(card) {
    const u = card.usage || {};
    return u.scoreDisplay || (u.tokens != null ? compact(u.tokens) : '');
  }

  function modelId(card) {
    const u = card.usage || {};
    const a = card.arena || {};
    const p = card.profile || {};
    return String(u.or || a.model || p.id || '').trim();
  }

  function copyButton(id, compact) {
    if (!id) return '';
    return `<button type="button" class="ai-copy${compact ? ' ai-copy--compact' : ''}" data-copy="${escapeHtml(id)}" title="Копировать id для OpenRouter / Cursor"><span class="ai-copy__id">${escapeHtml(id)}</span><span class="ai-copy__mark">копировать</span></button>`;
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function flashCopied(btn) {
    btn.classList.add('is-copied');
    const mark = btn.querySelector('.ai-copy__mark');
    if (mark) mark.textContent = 'скопировано';
    clearTimeout(btn._copyTimer);
    btn._copyTimer = setTimeout(() => {
      btn.classList.remove('is-copied');
      if (mark) mark.textContent = 'копировать';
    }, 1400);
  }

  function copyId(btn) {
    const text = btn.getAttribute('data-copy');
    if (!text) return;
    const ok = () => flashCopied(btn);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(ok).catch(() => {
        if (fallbackCopy(text)) ok();
      });
      return;
    }
    if (fallbackCopy(text)) ok();
  }

  function vendorMark(cardOrItem, cls) {
    const vendor = cardOrItem.vendor || '';
    const extra = (cardOrItem.usage && cardOrItem.usage.or) || cardOrItem.or || cardOrItem.iconKey || '';
    const src = cardOrItem.icon || vendorIcon(vendor, extra);
    const klass = 'ai-vendor' + (cls ? ' ' + cls : '');
    if (src) {
      return `<img class="${klass}" src="${escapeHtml(src)}" alt="" width="60" height="60" loading="lazy" decoding="async">`;
    }
    const letter = String(vendor || '?').trim().charAt(0).toUpperCase() || '?';
    return `<span class="${klass} ai-vendor--letter" aria-hidden="true">${escapeHtml(letter)}</span>`;
  }

  function compareSnapshot(card) {
    const p = card.profile || {};
    return {
      key: cardKey(card),
      name: cardTitle(card),
      vendor: card.vendor || '',
      license: card.license,
      elo: eloText(card),
      net: netText(card),
      votes: card.arena && card.arena.votes != null ? formatInt(card.arena.votes) : '',
      pricing: pricingText(card),
      context: contextText(card),
      tokens: tokensText(card),
      strengths: p.strengths || [],
      bestFor: p.bestFor || [],
      weaknesses: p.weaknesses || [],
      id: modelId(card),
      icon: vendorIcon(card.vendor, (card.usage && card.usage.or) || ''),
      or: (card.usage && card.usage.or) || '',
      sphere: state.sphere,
      sphereLabel: (sphereById(state.sphere) && sphereById(state.sphere).short) || ''
    };
  }

  function syncCompare(cards) {
    const fresh = new Map(cards.map((card) => [cardKey(card), card]));
    state.compare = state.compare.map((item) => {
      if (item.sphere && item.sphere !== state.sphere) return item;
      const card = fresh.get(item.key);
      return card ? compareSnapshot(card) : item;
    });
  }

  function isCompared(key) {
    return state.compare.some((item) => item.key === key);
  }

  function toggleCompare(key) {
    const idx = state.compare.findIndex((item) => item.key === key);
    if (idx >= 0) {
      state.compare.splice(idx, 1);
      render();
      return;
    }
    if (state.compare.length >= COMPARE_MAX) return;
    const card = state.cards.find((item) => cardKey(item) === key);
    if (!card) return;
    state.compare.push(compareSnapshot(card));
    render();
  }

  function parseMetric(text) {
    const s = String(text || '').replace(/\s/g, '').replace(',', '.');
    const m = s.match(/([+-]?\d+(?:\.\d+)?)([kmbткм])?/i);
    if (!m) return NaN;
    const n = Number(m[1]);
    const u = (m[2] || '').toLowerCase();
    const mul = { k: 1e3, к: 1e3, m: 1e6, м: 1e6, b: 1e9, т: 1e12 }[u] || 1;
    return n * mul;
  }

  function bestIndex(values, prefer) {
    const nums = values.map(parseMetric);
    const valid = nums.filter(Number.isFinite);
    if (valid.length < 2) return -1;
    const target = prefer === 'min' ? Math.min.apply(null, valid) : Math.max.apply(null, valid);
    if (valid.every((n) => n === target)) return -1;
    return nums.findIndex((n) => n === target);
  }

  function dash(value) {
    return value ? escapeHtml(value) : '—';
  }

  function listCell(items) {
    return items && items.length ? escapeHtml(items.join(' · ')) : '—';
  }

  function compareFields(items) {
    const license = items.map((item) => (
      `<span class="ai-lic ${item.license === 'open' ? 'is-open' : 'is-closed'}">${item.license === 'open' ? 'open' : 'closed'}</span>`
    ));
    return [
      { label: 'Id', cells: items.map((item) => copyButton(item.id, true) || '—') },
      { label: 'Elo', cells: items.map((item) => dash(item.elo)), prefer: 'max' },
      { label: 'Польза', cells: items.map((item) => dash(item.net)), prefer: 'max' },
      { label: 'Голоса', cells: items.map((item) => dash(item.votes)), prefer: 'max' },
      { label: 'Цена', cells: items.map((item) => dash(item.pricing)), prefer: 'min' },
      { label: 'Контекст', cells: items.map((item) => dash(item.context)), prefer: 'max' },
      { label: 'Токены', cells: items.map((item) => dash(item.tokens)), prefer: 'max' },
      { label: 'Лицензия', cells: license },
      { label: 'Сильные', cells: items.map((item) => listCell(item.strengths)), text: true },
      { label: 'Лучше', cells: items.map((item) => listCell(item.bestFor)), text: true },
      { label: 'Слабее', cells: items.map((item) => listCell(item.weaknesses)), text: true }
    ].filter((row) => !row.cells.every((cell) => !cell || cell === '—'));
  }

  function compareRow(label, cells, prefer) {
    const best = prefer ? bestIndex(cells, prefer) : -1;
    return `<tr><th scope="row">${escapeHtml(label)}</th>${cells.map((cell, i) => (
      `<td${i === best ? ' class="is-best"' : ''}>${cell && cell !== '—' ? cell : '—'}</td>`
    )).join('')}</tr>`;
  }

  function renderCompareTable(items) {
    const fields = compareFields(items);
    const names = items.map((item) => {
      const sub = [item.vendor, item.sphereLabel].filter(Boolean).join(' · ');
      return `<th scope="col">${vendorMark(item, 'ai-vendor--sm')}${escapeHtml(item.name)}${sub ? `<small>${escapeHtml(sub)}</small>` : ''}</th>`;
    }).join('');
    const rows = fields.map((row) => compareRow(row.label, row.cells, row.prefer)).join('');
    return `<div class="ai-compare__scroll"><table class="ai-compare__table"><thead><tr><th scope="col">Поле</th>${names}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function renderCompareStack(items) {
    const fields = compareFields(items);
    const names = `<ul class="ai-compare__names">${items.map((item) => (
      `<li>${vendorMark(item, 'ai-vendor--sm')}<span class="ai-compare__who">${escapeHtml(item.name)}</span></li>`
    )).join('')}</ul>`;
    const blocks = fields.map((row) => {
      const best = row.prefer ? bestIndex(row.cells, row.prefer) : -1;
      const lis = items.map((item, i) => {
        const val = row.cells[i] && row.cells[i] !== '—' ? row.cells[i] : '—';
        return `<li${i === best ? ' class="is-best"' : ''}><span class="ai-compare__who">${escapeHtml(item.name)}</span><span class="ai-compare__val">${val}</span></li>`;
      }).join('');
      return `<section class="ai-compare__block${row.text ? ' is-text' : ''}"><h4>${escapeHtml(row.label)}</h4><ul>${lis}</ul></section>`;
    }).join('');
    return `<div class="ai-compare__stack">${names}${blocks}</div>`;
  }

  function renderCompare() {
    const el = els.compare;
    if (!el) return;
    const items = state.compare;
    if (!items.length) {
      el.hidden = true;
      el.innerHTML = '';
      return;
    }
    el.hidden = false;
    const n = items.length;
    const chips = items.map((item) => (
      `<li><span>${escapeHtml(item.name)}</span><button type="button" class="ai-compare__x" data-compare-remove="${escapeHtml(item.key)}" aria-label="Убрать ${escapeHtml(item.name)}">×</button></li>`
    )).join('');
    const body = n < 2
      ? '<p class="ai-compare__hint">Выберите ещё одну карточку — в сравнении до трёх моделей.</p>'
      : renderCompareTable(items) + renderCompareStack(items);
    el.innerHTML = `<div class="ai-compare__bar"><p class="ai-compare__title">Сравнение · ${n} из ${COMPARE_MAX}</p><ul class="ai-compare__picks">${chips}</ul><button type="button" class="ai-compare__clear" data-compare-clear>Очистить</button></div>${body}`;
  }

  function filterCards(cards) {
    const q = state.query.trim().toLowerCase();
    return cards.filter((card) => {
      if (state.license !== 'all' && card.license !== state.license) return false;
      if (!q) return true;
      const profile = card.profile;
      const blob = [
        card.name,
        card.vendor,
        card.arena && card.arena.model,
        card.usage && card.usage.name,
        (card.variantNames || []).join(' '),
        (card.variants || []).join(' '),
        profile && profile.summary,
        profile && (profile.bestFor || []).join(' '),
        profile && (profile.strengths || []).join(' ')
      ].filter(Boolean).join(' ').toLowerCase();
      return blob.includes(q);
    });
  }

  function rankOf(card) {
    const n = Number(card.rank);
    return Number.isFinite(n) ? n : 9999;
  }

  function metricOf(card, getter, missing) {
    const n = parseMetric(getter(card));
    return Number.isFinite(n) ? n : missing;
  }

  function sortCards(cards) {
    const mode = state.sort || 'rank';
    const keyed = cards.map((card, index) => ({ card, index }));
    keyed.sort((a, b) => {
      let cmp = 0;
      if (mode === 'price') {
        cmp = metricOf(a.card, pricingText, Infinity) - metricOf(b.card, pricingText, Infinity);
      } else if (mode === 'context') {
        cmp = metricOf(b.card, contextText, -Infinity) - metricOf(a.card, contextText, -Infinity);
      } else if (mode === 'open') {
        const ao = a.card.license === 'open' ? 0 : 1;
        const bo = b.card.license === 'open' ? 0 : 1;
        cmp = ao - bo;
        if (!cmp) cmp = rankOf(a.card) - rankOf(b.card);
      } else {
        cmp = rankOf(a.card) - rankOf(b.card);
      }
      return cmp || a.index - b.index;
    });
    return keyed.map((item) => item.card);
  }

  function pill(label, value) {
    if (value == null || value === '') return '';
    return `<li><b>${escapeHtml(value)}</b><span>${escapeHtml(label)}</span></li>`;
  }

  function chipList(items) {
    if (!items || !items.length) return '';
    return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  }

  function dimPills(scores) {
    if (!Array.isArray(scores) || !scores.length) return '';
    return `<ul class="ai-metrics ai-metrics--dims">${scores.map((item) => {
      const label = DIM_LABELS[item.name] || item.name;
      const score = Number(item.score);
      const text = Number.isFinite(score)
        ? (item.name === 'Tool Hallucination' ? score.toFixed(2) : (score > 0 ? '+' : '') + score)
        : '—';
      return pill(label, text);
    }).join('')}</ul>`;
  }

  function changeBadge(change) {
    if (change == null || change === '' || change === '0' || change === 0) return '';
    const n = Number(String(change).replace('+', ''));
    const up = String(change).startsWith('+') || n > 0;
    const down = String(change).startsWith('-') || n < 0;
    const cls = up ? 'is-up' : down ? 'is-down' : '';
    return `<span class="ai-delta ${cls}">${escapeHtml(String(change))}</span>`;
  }

  function variantNote(card) {
    const extras = card.variants || [];
    const raw = rawName(card);
    const title = cardTitle(card);
    if (extras.length) {
      const slot = variantLabel(raw);
      const lead = slot ? escapeHtml(slot) + ' · ' : '';
      return `<p class="ai-variant">${lead}${escapeHtml(variantPhrase(extras.length))} · ${escapeHtml(extras.join(' · '))}</p>`;
    }
    if (raw && prettyName(raw).toLowerCase() !== String(title).toLowerCase()) {
      return `<p class="ai-variant">${escapeHtml(raw)}</p>`;
    }
    return '';
  }

  function renderCard(card) {
    const p = card.profile || {};
    const a = card.arena || {};
    const u = card.usage || {};
    const title = cardTitle(card);
    const key = cardKey(card);
    const on = isCompared(key);
    const full = state.compare.length >= COMPARE_MAX && !on;
    const elo = eloText(card);
    const net = netText(card);
    const links = [];
    if (p.website) links.push({ href: p.website, label: 'Сайт' });
    if (p.docs) links.push({ href: p.docs, label: 'Docs' });
    const moreLinks = [];
    const sphere = sphereById(state.sphere);
    if (sphere.arena) moreLinks.push({ href: ARENA_PAGE + sphere.arena, label: 'Arena' });
    if (u.or) moreLinks.push({ href: 'https://openrouter.ai/' + u.or, label: 'OpenRouter' });

    const metrics = [
      pill('Elo', elo),
      net ? pill('Net', net) : '',
      pill('голоса', a.votes != null ? formatInt(a.votes) : ''),
      pill('сессии', a.sessions != null ? formatInt(a.sessions) : ''),
      pill('токены', tokensText(card)),
      pill('запросы', u.requests != null ? compact(u.requests) : ''),
      pill('in/out', pricingText(card)),
      pill('контекст', contextText(card))
    ].join('');

    const extra = [
      p.weaknesses && p.weaknesses.length
        ? `<p class="ai-line"><span>Слабее</span> ${escapeHtml(p.weaknesses.join(' · '))}</p>`
        : '',
      dimPills(a.scores),
      p.modalities && p.modalities.length
        ? `<ul class="bc-tags ai-tags">${chipList(p.modalities)}</ul>`
        : ''
    ].join('');

    const allLinks = links.concat(moreLinks);
    const linkHtml = allLinks.length
      ? `<nav class="ai-links">${allLinks.map((link) => `<a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`).join('')}</nav>`
      : '';

    return `<article class="ai-card${on ? ' is-picked' : ''}">
      <header class="ai-card__head">
        ${vendorMark(card)}
        <div class="ai-card__titles">
          <div class="ai-card__title-row">
            <h3>${escapeHtml(title)}</h3>
            ${linkHtml}
          </div>
          <p>
            <span>${escapeHtml(card.vendor || '—')}</span>
            <span class="ai-lic ${card.license === 'open' ? 'is-open' : 'is-closed'}">${card.license === 'open' ? 'open' : 'closed'}</span>
            ${p.kind ? `<span>${escapeHtml(p.kind)}</span>` : ''}
          </p>
          ${copyButton(modelId(card))}
        </div>
        <div class="ai-card__actions">
          ${changeBadge(u.change)}
          <button type="button" class="ai-compare-btn${on ? ' is-on' : ''}" data-compare="${escapeHtml(key)}" aria-pressed="${on ? 'true' : 'false'}"${full ? ' disabled title="Максимум три модели"' : ''}>${on ? 'В сравнении' : 'Сравнить'}</button>
        </div>
      </header>
      ${variantNote(card)}
      ${metrics ? `<ul class="ai-metrics">${metrics}</ul>` : ''}
      ${p.summary ? `<p class="ai-summary">${escapeHtml(p.summary)}</p>` : ''}
      ${p.strengths && p.strengths.length ? `<p class="ai-line"><span>Сильные</span> ${escapeHtml(p.strengths.join(' · '))}</p>` : ''}
      ${p.bestFor && p.bestFor.length ? `<p class="ai-line"><span>Лучше</span> ${escapeHtml(p.bestFor.join(' · '))}</p>` : ''}
      ${extra}
    </article>`;
  }

  function setStatus(text, isError) {
    if (!els.status) return;
    els.status.textContent = text;
    els.status.classList.toggle('is-error', Boolean(isError));
  }

  function render() {
    const sphere = sphereById(state.sphere);
    const scene = sceneBySphere(state.sphere);
    if (els.hint) els.hint.textContent = (scene && scene.hint) || sphere.hint || '';
    if (els.scenes) {
      els.scenes.querySelectorAll('[data-sphere]').forEach((btn) => {
        const on = btn.getAttribute('data-sphere') === state.sphere;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    if (els.chips) {
      els.chips.querySelectorAll('[data-sphere]').forEach((btn) => {
        const on = btn.getAttribute('data-sphere') === state.sphere;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    const sourceCards = groupCards(state.sphere === 'trending' ? usageCards() : arenaCards(state.arena));
    const cards = sortCards(filterCards(sourceCards));
    state.cards = cards;
    if (cards.length <= LIST_LIMIT) state.expanded = false;
    const shown = state.expanded ? cards : cards.slice(0, LIST_LIMIT);
    const rest = cards.length - shown.length;
    syncCompare(cards);
    renderCompare();
    if (els.empty) els.empty.hidden = cards.length > 0 || state.loading;
    if (els.grid) {
      if (state.loading && !cards.length) {
        els.grid.innerHTML = '<div class="ai-skel" aria-hidden="true"></div><div class="ai-skel"></div><div class="ai-skel"></div>';
      } else {
        els.grid.innerHTML = shown.map(renderCard).join('');
      }
    }
    if (els.more) {
      const showMore = !state.loading && cards.length > LIST_LIMIT;
      els.more.hidden = !showMore;
      if (showMore) {
        els.more.textContent = state.expanded
          ? 'Свернуть к топ-12'
          : 'Показать ещё ' + rest;
      }
    }

    if (state.loading) {
      setStatus('Открываю снимок рейтинга…');
      return;
    }
    const live = state.sphere === 'trending' ? cache.usageLive : (sphere.arena && cache.arenaLive && cache.arenaLive[sphere.arena]);
    const src = state.sphere === 'trending'
      ? (live ? 'OpenRouter, топ по токенам' : 'снимок OpenRouter')
      : (live ? `Arena AI «${sphere.arena}»` : `снимок Arena «${sphere.arena || ''}»`);
    const tail = (state.refreshing ? ' · обновляю…' : '') + (cache.date ? ' · ' + cache.date : '') + (state.error ? ' · ' + state.error : '');
    const count = rest > 0 ? shown.length + ' из ' + cards.length : String(cards.length);
    setStatus(`${count} моделей · ${src}${tail}`, false);
  }

  async function applySphere(id) {
    const sphere = sphereById(id);
    const my = ++token;
    if (liveCtrl) liveCtrl.abort();
    liveCtrl = new AbortController();

    state.sphere = sphere.id;
    state.error = '';
    state.note = '';
    state.expanded = false;
    writeUrl();

    if (!cache.snapshot) {
      state.loading = true;
      render();
      try {
        await loadSnapshot();
      } catch (err) {
        state.error = 'Снимок не открылся, показываю каталог.';
      }
      if (my !== token) return;
    }

    hydrate(sphere);
    state.loading = false;
    render();
    refreshLive(sphere, my, liveCtrl.signal);
  }

  function closeFilter(root) {
    if (!root) return;
    root.classList.remove('is-open');
    const list = root.querySelector('.ai-filter__list');
    const btn = root.querySelector('.ai-filter__btn');
    if (list) list.hidden = true;
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function bindFilter(root, onChange) {
    if (!root) return;
    const btn = root.querySelector('.ai-filter__btn');
    const list = root.querySelector('.ai-filter__list');

    const open = () => {
      document.querySelectorAll('.ai-filter.is-open').forEach((el) => {
        if (el !== root) closeFilter(el);
      });
      root.classList.add('is-open');
      if (list) list.hidden = false;
      if (btn) btn.setAttribute('aria-expanded', 'true');
    };

    const setValue = (value) => {
      const next = applyFilterUi(root, value);
      closeFilter(root);
      onChange(next);
    };

    if (btn) {
      btn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (root.classList.contains('is-open')) closeFilter(root);
        else open();
      });
    }
    if (list) {
      list.addEventListener('click', (event) => {
        const opt = event.target.closest('button[data-value]');
        if (!opt || !list.contains(opt)) return;
        event.stopPropagation();
        setValue(opt.getAttribute('data-value'));
      });
    }
    document.addEventListener('click', (event) => {
      if (!root.contains(event.target)) closeFilter(root);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeFilter(root);
    });
  }

  function bind() {
    if (els.scenes) {
      els.scenes.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-sphere]');
        if (!btn) return;
        applySphere(btn.getAttribute('data-sphere'));
      });
    }
    if (els.chips) {
      els.chips.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-sphere]');
        if (!btn) return;
        applySphere(btn.getAttribute('data-sphere'));
      });
    }
    if (els.search) {
      els.search.addEventListener('input', () => {
        state.query = els.search.value;
        writeUrl();
        render();
      });
    }
    bindFilter(els.license, (value) => {
      state.license = value;
      writeUrl();
      render();
    });
    bindFilter(els.sort, (value) => {
      state.sort = value;
      writeUrl();
      render();
    });
    if (els.more) {
      els.more.addEventListener('click', () => {
        const closing = state.expanded;
        state.expanded = !state.expanded;
        render();
        if (closing && els.grid) {
          els.grid.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      });
    }
    if (els.compare) {
      els.compare.addEventListener('click', (event) => {
        const copyBtn = event.target.closest('[data-copy]');
        if (copyBtn && els.compare.contains(copyBtn)) {
          event.preventDefault();
          copyId(copyBtn);
          return;
        }
        if (event.target.closest('[data-compare-clear]')) {
          state.compare = [];
          render();
          return;
        }
        const rm = event.target.closest('[data-compare-remove]');
        if (rm) toggleCompare(rm.getAttribute('data-compare-remove'));
      });
    }
    if (els.grid) {
      els.grid.addEventListener('click', (event) => {
        const copyBtn = event.target.closest('[data-copy]');
        if (copyBtn && els.grid.contains(copyBtn)) {
          event.preventDefault();
          copyId(copyBtn);
          return;
        }
        const btn = event.target.closest('[data-compare]');
        if (!btn || !els.grid.contains(btn) || btn.disabled) return;
        toggleCompare(btn.getAttribute('data-compare'));
      });
    }
    window.addEventListener('hashchange', () => {
      if (hashId() === 'top') return;
      const next = readUrl();
      applyUrlState(next);
      if (next.sphere !== state.sphere) applySphere(next.sphere);
      else render();
    });
    window.addEventListener('popstate', () => {
      if (hashId() === 'top') return;
      const next = readUrl();
      applyUrlState(next);
      if (next.sphere !== state.sphere) applySphere(next.sphere);
      else render();
    });
  }

  function init() {
    if (!els.grid) return;
    bind();
    const next = readUrl();
    applyUrlState(next);
    applySphere(next.sphere);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
