/**
 * Refresh the AI rankings snapshot (Arena boards + OpenRouter usage).
 *
 *   npm run ai:snapshot
 *   node scripts/ai-snapshot.mjs
 *   node scripts/ai-snapshot.mjs --seed
 *
 * Cron (daily, 07:00), then upload public/projects/ai/:
 *   0 7 * * * cd /path/to/portfolio_nuxt && node scripts/ai-snapshot.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const AI_ROOT = join(ROOT, 'public/projects/ai')
const JSON_PATH = join(AI_ROOT, 'data/snapshot.json')
const JS_PATH = join(AI_ROOT, 'scripts/snapshot.js')
const HTML_PATH = join(AI_ROOT, 'index.html')
const AGENTS_PATH = join(AI_ROOT, 'scripts/agents.js')
const CATALOG_PATH = join(AI_ROOT, 'scripts/catalog.js')
const SEED_LIMIT = 12
const TIMEOUT_MS = 15000
const USAGE_API = 'https://whatstrending.ai/api/models'
const WULONG = 'https://api.wulong.dev/arena-ai-leaderboards/v1/leaderboard?name='
const GH = 'https://raw.githubusercontent.com/oolong-tea-2026/arena-ai-leaderboards/main/data/'
const JSDELIVR = 'https://cdn.jsdelivr.net/gh/oolong-tea-2026/arena-ai-leaderboards@main/data/'
const MONTHS_RU = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]
const BOARDS = [
  'agent',
  'code',
  'text',
  'search',
  'vision',
  'document',
  'text-to-image',
  'image-edit',
  'text-to-video',
  'image-to-video',
  'video-edit',
]

function isoDay(offset = 0) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + offset)
  return d.toISOString().slice(0, 10)
}

function ruDay(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return `${day} ${MONTHS_RU[month - 1]} ${year}`
}

function loadPrev() {
  if (!existsSync(JSON_PATH)) return { fetched: '', usage: [], arena: {} }
  try {
    return JSON.parse(readFileSync(JSON_PATH, 'utf8'))
  }
  catch {
    return { fetched: '', usage: [], arena: {} }
  }
}

async function fetchJson(url) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: ctrl.signal })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    return await res.json()
  }
  finally {
    clearTimeout(timer)
  }
}

async function raceJson(urls) {
  return Promise.any(urls.map((url) => fetchJson(url)))
}

function boardOk(json) {
  return json && Array.isArray(json.models) && json.models.length > 0
}

async function fetchUsage() {
  const json = await fetchJson(USAGE_API)
  const rows = Array.isArray(json && json.data) ? json.data : []
  if (!rows.length) throw new Error('empty usage')
  return rows
}

async function fetchBoard(name, dates) {
  const file = encodeURIComponent(name) + '.json'
  const urls = [WULONG + encodeURIComponent(name)]
  dates.forEach((date) => {
    urls.push(JSDELIVR + date + '/' + file)
    urls.push(GH + date + '/' + file)
  })
  const json = await raceJson(urls)
  if (!boardOk(json)) throw new Error('empty board')
  return json
}

function bumpHtml(stamp, fetched) {
  if (!existsSync(HTML_PATH)) return
  const html = readFileSync(HTML_PATH, 'utf8')
  let next = html.replace(
    /\.\/scripts\/snapshot\.js(?:\?v=[^"']*)?/,
    './scripts/snapshot.js?v=' + stamp,
  )
  next = next.replace(
    /Страница обновлена \d{1,2} [а-яё]+ \d{4}/u,
    'Страница обновлена ' + ruDay(fetched),
  )
  if (next !== html) writeFileSync(HTML_PATH, next)
}

function bumpAgentsDate(fetched) {
  if (!existsSync(AGENTS_PATH)) return
  const src = readFileSync(AGENTS_PATH, 'utf8')
  const next = src.replace(
    /const SNAPSHOT_DATE = '\d{4}-\d{2}-\d{2}';/,
    "const SNAPSHOT_DATE = '" + fetched + "';",
  )
  if (next !== src) writeFileSync(AGENTS_PATH, next)
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function loadCatalog() {
  if (!existsSync(CATALOG_PATH)) return { findProfile: () => null, vendorIcon: () => '' }
  const sandbox = { window: {} }
  vm.createContext(sandbox)
  vm.runInContext(readFileSync(CATALOG_PATH, 'utf8'), sandbox)
  return {
    findProfile: sandbox.window.AI_findProfile || (() => null),
    vendorIcon: sandbox.window.AI_vendorIcon || (() => ''),
  }
}

function seedCard(row, profile, iconSrc) {
  const name = (profile && profile.name) || row.name || ''
  const vendor = (profile && profile.vendor) || row.provider || ''
  const open = /open/i.test(row.category || '')
  const summary = profile && profile.summary ? `<p class="ai-summary">${escapeHtml(profile.summary)}</p>` : ''
  const metrics = [
    row.pricing ? `<li><b>${escapeHtml(row.pricing)}</b><span>in/out</span></li>` : '',
    row.context ? `<li><b>${escapeHtml(row.context)}</b><span>контекст</span></li>` : '',
    row.scoreDisplay ? `<li><b>${escapeHtml(row.scoreDisplay)}</b><span>токены</span></li>` : '',
  ].join('')
  const href = profile && profile.website
    ? `<nav class="ai-links"><a href="${escapeHtml(profile.website)}" rel="noopener noreferrer">Сайт</a></nav>`
    : (row.or ? `<nav class="ai-links"><a href="https://openrouter.ai/${escapeHtml(row.or)}" rel="noopener noreferrer">OpenRouter</a></nav>` : '')
  const letter = String(vendor || '?').trim().charAt(0).toUpperCase() || '?'
  const badge = iconSrc
    ? `<img class="ai-vendor" src="${escapeHtml(iconSrc)}" alt="" width="60" height="60">`
    : `<span class="ai-vendor ai-vendor--letter" aria-hidden="true">${escapeHtml(letter)}</span>`
  return `<article class="ai-card">
          <header class="ai-card__head">
            ${badge}
            <div class="ai-card__titles">
              <div class="ai-card__title-row">
                <h3>${escapeHtml(name)}</h3>
                ${href}
              </div>
              <p>
                <span>${escapeHtml(vendor || '—')}</span>
                <span class="ai-lic ${open ? 'is-open' : 'is-closed'}">${open ? 'open' : 'closed'}</span>
                ${profile && profile.kind ? `<span>${escapeHtml(profile.kind)}</span>` : ''}
              </p>
            </div>
          </header>
          ${metrics ? `<ul class="ai-metrics">${metrics}</ul>` : ''}
          ${summary}
        </article>`
}

function renderSeed(snapshot) {
  const { findProfile, vendorIcon } = loadCatalog()
  const rows = Array.isArray(snapshot.usage) ? snapshot.usage.slice(0, SEED_LIMIT) : []
  return rows.map((row) => {
    const profile = findProfile(row.name, row.or)
    const vendor = (profile && profile.vendor) || row.provider || ''
    return seedCard(row, profile, vendorIcon(vendor, row.or))
  }).join('\n        ')
}

function injectSeed(snapshot) {
  if (!existsSync(HTML_PATH)) return
  const html = readFileSync(HTML_PATH, 'utf8')
  const seed = renderSeed(snapshot)
  if (!/<!-- ai-seed -->[\s\S]*?<!-- \/ai-seed -->/.test(html)) {
    console.warn('ai-seed markers missing in', HTML_PATH)
    return
  }
  const next = html.replace(
    /<!-- ai-seed -->[\s\S]*?<!-- \/ai-seed -->/,
    '<!-- ai-seed -->\n        ' + seed + '\n        <!-- /ai-seed -->',
  )
  if (next !== html) writeFileSync(HTML_PATH, next)
}

async function main() {
  const prev = loadPrev()
  const fetched = isoDay(0)
  const dates = [...new Set([fetched, isoDay(-1), prev.fetched].filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)))]
  const snapshot = {
    fetched,
    usage: Array.isArray(prev.usage) ? prev.usage : [],
    arena: Object.assign({}, prev.arena || {}),
  }

  let ok = 0
  let failed = 0

  try {
    snapshot.usage = await fetchUsage()
    ok += 1
    console.log('usage', snapshot.usage.length)
  }
  catch (err) {
    failed += 1
    console.warn('usage failed, keeping previous:', err.message)
  }

  for (const name of BOARDS) {
    try {
      snapshot.arena[name] = await fetchBoard(name, dates)
      ok += 1
      console.log(name, snapshot.arena[name].models.length)
    }
    catch (err) {
      failed += 1
      console.warn(name + ' failed, keeping previous:', err.message)
    }
  }

  if (!ok) {
    console.error('nothing updated')
    process.exit(1)
  }

  const json = JSON.stringify(snapshot)
  writeFileSync(JSON_PATH, json)
  writeFileSync(JS_PATH, '(function (g) {\n  g.AI_SNAPSHOT = ' + json + ';\n})(window);\n')
  bumpHtml(fetched.replace(/-/g, ''), fetched)
  bumpAgentsDate(fetched)
  injectSeed(snapshot)
  console.log('wrote', JSON_PATH, 'ok=' + ok, 'failed=' + failed, 'fetched=' + fetched)
}

if (process.argv.includes('--seed')) {
  injectSeed(loadPrev())
  console.log('seeded', HTML_PATH)
}
else {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
