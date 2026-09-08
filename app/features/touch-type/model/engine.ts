const STORAGE = 'ao-typing-v1';
const CONSENT_COOKIE = 'ao-typing-consent';
const CONSENT_MAX_AGE = 60 * 60 * 24 * 365;
const LESSON_LEN = 110;
const INFINITE_LEN = 180;
const DRILL_LEN = 80;
const INTRO_LEN = 44;
const REVIEW_MS = 1000 * 60 * 60 * 24 * 3;
const HOME_ROW_UNLOCK = 4;

const UNLOCK = [
  ['f', 'j'],
  ['d', 'k'],
  ['s', 'l'],
  ['a', ';'],
  ['g', 'h'],
  ['e', 'i'],
  ['r', 'u'],
  ['t', 'y'],
  ['w', 'o'],
  ['q', 'p'],
  ['c', ','],
  ['v', 'm'],
  ['x', '.'],
  ['z', '/'],
  ['b', 'n']
];

const FINGER: Record<string, string> = {
  '`': 'lp', '1': 'lp', '2': 'lr', '3': 'lm', '4': 'li', '5': 'li',
  '6': 'ri', '7': 'ri', '8': 'rm', '9': 'rr', '0': 'rp', '-': 'rp', '=': 'rp',
  'q': 'lp', 'w': 'lr', 'e': 'lm', 'r': 'li', 't': 'li',
  'y': 'ri', 'u': 'ri', 'i': 'rm', 'o': 'rr', 'p': 'rp', '[': 'rp', ']': 'rp', '\\': 'rp',
  'a': 'lp', 's': 'lr', 'd': 'lm', 'f': 'li', 'g': 'li',
  'h': 'ri', 'j': 'ri', 'k': 'rm', 'l': 'rr', ';': 'rp', '\'': 'rp',
  'z': 'lp', 'x': 'lr', 'c': 'lm', 'v': 'li', 'b': 'li',
  'n': 'ri', 'm': 'ri', ',': 'rm', '.': 'rr', '/': 'rp',
  ' ': 'th'
};

const FINGER_LABEL: Record<string, string> = {
  lp: 'Левый мизинец',
  lr: 'Левый безымянный',
  lm: 'Левый средний',
  li: 'Левый указательный',
  th: 'Большой палец',
  ri: 'Правый указательный',
  rm: 'Правый средний',
  rr: 'Правый безымянный',
  rp: 'Правый мизинец'
};

const KB_ROWS = [
  { cls: 'kt-kb__row--nums', left: null, keys: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='], right: { id: 'backspace', label: '⌫', cls: 'kt-key--wide kt-key--mod' } },
  { left: { id: 'tab', label: 'Tab', cls: 'kt-key--mod' }, keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'], right: { id: 'backslash', label: '\\', cls: 'kt-key--mod' } },
  { left: { id: 'caps', label: 'Caps', cls: 'kt-key--mod' }, keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''], right: { id: 'enter', label: 'Enter', cls: 'kt-key--wide kt-key--mod' } },
  { left: { id: 'shift-l', label: 'Shift', cls: 'kt-key--shift kt-key--mod' }, keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'], right: { id: 'shift-r', label: 'Shift', cls: 'kt-key--shift kt-key--mod' } }
];

const WORDS = (
  'a an as at be by do go he if in is it me my no of on or so to up us we ' +
  'all and any are but can did for get got had has her him his how its let ' +
  'may new not now old our out own say see she the too two was way who why ' +
  'yes yet you act add age ago aid aim air ask bad bag bar bed big bit box ' +
  'boy bus car cat cup cut day dog dry ear eat egg end eye far fat few fit ' +
  'fly fun gas guy hat hit hot ice job key kid law lay led leg lie lot low ' +
  'man map mix net nor odd off oil one pay per put ran red rid run sad sat ' +
  'sea set sit six sky sun tax tea ten top try use van war win won yes ' +
  'able also area away back ball bank base beat been best bill blue body book ' +
  'born both call came card care case city cold come cost dark data dead deal ' +
  'deep does done door down draw drop each easy else even ever face fact fail ' +
  'fall fast feel feet fell felt fill find fire firm fish five flat flow food ' +
  'foot form four free from full game gave give glad goes gold gone good gray ' +
  'grew grow half hall hand hard have head hear held help here high hold home ' +
  'hope hour idea into just keep kind knew know land last late lead left less ' +
  'life like line list live long look lost love made mail main make many mark ' +
  'mean meet mind miss more most move much must name near need news next nine ' +
  'none note once only onto open over page paid park part pass past plan play ' +
  'plus poor port post pull push race rain read real rest road rock role room ' +
  'rule safe said same save seat seem self sell send sent ship shop shot show ' +
  'side sign site size slow snow some soon sort star stay step stop such sure ' +
  'take talk tall team tell than that them then they this thus tied till time ' +
  'told took town tree true turn type unit upon used user very view wait walk ' +
  'wall want week well went were west what when whom wide wife wild will wind ' +
  'wine wish with wood word work yard year your zero zone ' +
  'about after again along among asked began being below black bring build ' +
  'carry cause child class clear close could daily early earth eight every ' +
  'field final first force found front given great green group happy heart ' +
  'heavy human large later learn leave light local money month never night ' +
  'north often order other paper party piece place plant point power press ' +
  'quick quite right river round shall short since small sound south space ' +
  'speak speed start state still stone story study table thank their there ' +
  'these thing think those three today total track trade under until value ' +
  'water white whole woman world would write young ' +
  'alas flask salad flasks salads falls salsa lass lads dads adds asks'
).trim().split(/\s+/);

const PHRASES = [
  'ask dad',
  'all fall',
  'a sad lad',
  'dad had a flask',
  'add all',
  'ask all lads',
  'a lass falls',
  'had a salad',
  'all lads fall',
  'dad as a lad',
  'flasks fall',
  'ask a dad',
  'a sad salad',
  'all fall as sad',
  'she is here',
  'he said yes',
  'the red flag',
  'a great day',
  'just hold on',
  'see the light',
  'they still wait',
  'write your name',
  'the world is wide'
];

const ASIDE_TIPS = [
  'Расслабьте руки. Напряжение замедляет ваши рефлексы.',
  'Не смотрите на клавиатуру. Смотрите на строку — пальцы найдут клавиши сами.',
  'Сначала точность. Скорость придёт, когда движения станут привычкой.',
  'Держите запястья прямыми. Изгиб вверх или вниз быстро утомляет.',
  'После каждой клавиши возвращайте пальцы на ASDF и JKL;.',
  'Печатайте легко. Клавишам не нужна сила, только касание.',
  'Не гонитесь за WPM. Ритм важнее рывков через ошибки.',
  'Плечи опущены, локти около прямого угла. Не тянитесь к клавиатуре.',
  'Пробел нажимайте большими пальцами. Мизинцы берегите для края ряда.',
  'Короткая пауза лучше усталости. Уставшие пальцы делают больше опечаток.'
];

export function mountTouchType(
  root: HTMLElement,
  options?: { onConsentReady?: () => void },
): { unmount: () => void, applyConsent: (choice: string) => void } {
  const els: any = {};
  const state = {
    view: 'hub',
    mode: 'lesson',
    text: '',
    index: 0,
    hits: 0,
    misses: 0,
    startedAt: 0,
    lastAt: 0,
    focusKey: '',
    unlocked: 1,
    keys: {} as Record<string, { hits: number; misses: number; totalMs: number; lastAt: number }>,
    lessons: 0,
    bestWpm: 0,
    newKeys: [] as string[],
    layoutWarn: false,
    missed: new Set<number>(),
    gateNext: null as null | (() => void),
    gateArmed: false,
    runMissExpected: {} as Record<string, number>,
    runMissTyped: {} as Record<string, Record<string, number>>,
    pausedAt: 0,
    pausedMs: 0
  };

  let asideTipsTimer = 0;
  let fromKey = false;

  function $(id: string) {
    return root.querySelector('#' + id);
  }

  function getConsent() {
    const match = document.cookie.match(/(?:^|; )ao-typing-consent=([^;]*)/);
    const value = match ? decodeURIComponent(match[1]) : '';
    return value === 'accepted' || value === 'declined' ? value : '';
  }

  function setConsentCookie(value: string) {
    document.cookie = CONSENT_COOKIE + '=' + encodeURIComponent(value)
      + '; Max-Age=' + CONSENT_MAX_AGE
      + '; Path=/'
      + '; SameSite=Lax';
  }

  function consentLabel(choice: string) {
    if (choice === 'accepted') return 'принято';
    if (choice === 'declined') return 'отклонено';
    return 'не сделан';
  }

  function updateConsentLabel(choice: string) {
    if (els.consentLabel) els.consentLabel.textContent = consentLabel(choice);
  }

  function revealTrainer() {
    root.classList.remove('kt-needs-consent');
    root.classList.add('kt-has-consent');
    options?.onConsentReady?.();
    renderHub();
    setView('hub');
  }

  function applyConsent(choice: string) {
    const wasGated = !getConsent() || root.classList.contains('kt-needs-consent');
    setConsentCookie(choice);
    updateConsentLabel(choice);
    if (choice === 'accepted') {
      const fresh = state.lessons === 0
        && state.unlocked === 1
        && state.bestWpm === 0
        && Object.keys(state.keys).length === 0;
      if (fresh) load();
      save();
    } else {
      try {
        localStorage.removeItem(STORAGE);
      } catch (_) { /* ignore */ }
    }
    revealTrainer();
    if (wasGated) {
      const hub = root.querySelector('#hub');
      if (hub) hub.scrollIntoView({ block: 'start' });
    }
  }

  function load() {
    if (getConsent() !== 'accepted') return;
    try {
      const raw = localStorage.getItem(STORAGE);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data && typeof data === 'object') {
        state.unlocked = clampUnlock(data.unlocked);
        state.keys = data.keys && typeof data.keys === 'object' ? data.keys : {};
        state.lessons = Number(data.lessons) || 0;
        state.bestWpm = Number(data.bestWpm) || 0;
      }
    } catch (_) { /* ignore */ }
  }

  function save() {
    if (getConsent() !== 'accepted') return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify({
        unlocked: state.unlocked,
        keys: state.keys,
        lessons: state.lessons,
        bestWpm: state.bestWpm
      }));
    } catch (_) { /* ignore */ }
  }

  function clampUnlock(n: unknown) {
    const v = Number(n) || 1;
    return Math.min(UNLOCK.length, Math.max(1, v));
  }

  function activeLetters() {
    const out: string[] = [];
    for (let i = 0; i < state.unlocked; i += 1) {
      UNLOCK[i].forEach((ch) => out.push(ch));
    }
    return out;
  }

  function isLetterKey(ch: string) {
    return Object.prototype.hasOwnProperty.call(FINGER, ch) && ch !== ' ';
  }

  function keyRecord(ch: string) {
    if (!state.keys[ch]) {
      state.keys[ch] = { hits: 0, misses: 0, totalMs: 0, lastAt: 0 };
    }
    return state.keys[ch];
  }

  function keyStatus(ch: string) {
    if (!activeLetters().includes(ch)) return 'locked';
    const rec = state.keys[ch];
    if (!rec || rec.hits + rec.misses < 8) return 'learning';
    const acc = rec.hits / Math.max(1, rec.hits + rec.misses);
    const avg = rec.hits ? rec.totalMs / rec.hits : 999;
    if (acc < 0.86) return 'weak';
    if (rec.lastAt && Date.now() - rec.lastAt > REVIEW_MS) return 'review';
    if (acc >= 0.96 && avg < 420) return 'mastered';
    return 'learning';
  }

  function weights(letters: string[], focus: string) {
    const newest = UNLOCK[state.unlocked - 1] || [];
    const map: Record<string, number> = {};
    letters.forEach((ch) => {
      let w = 1;
      if (newest.includes(ch)) w += 2.4;
      if (focus && ch === focus) w += 6;
      const rec = state.keys[ch];
      if (rec) {
        const acc = rec.hits / Math.max(1, rec.hits + rec.misses);
        if (acc < 0.92) w += 2;
        if (rec.hits && rec.totalMs / rec.hits > 480) w += 1.2;
        if (keyStatus(ch) === 'review') w += 2.2;
      }
      map[ch] = w;
    });
    return map;
  }

  function pick(letters: string[], map: Record<string, number>) {
    const total = letters.reduce((sum, ch) => sum + (map[ch] || 1), 0);
    let r = Math.random() * total;
    for (let i = 0; i < letters.length; i += 1) {
      r -= map[letters[i]] || 1;
      if (r <= 0) return letters[i];
    }
    return letters[letters.length - 1];
  }

  function randomWord(letters: string[], map: Record<string, number>) {
    const len = 2 + Math.floor(Math.random() * 3);
    let out = '';
    for (let i = 0; i < len; i += 1) out += pick(letters, map);
    return out;
  }

  function homeRowReady() {
    return state.unlocked >= HOME_ROW_UNLOCK;
  }

  function usableWords(letters: string[]) {
    const set = new Set(letters);
    return WORDS.filter((word) => {
      for (let i = 0; i < word.length; i += 1) {
        if (!set.has(word[i])) return false;
      }
      return word.length > 0;
    });
  }

  function usablePhrases(letters: string[]) {
    const set = new Set(letters);
    return PHRASES.filter((phrase) => {
      for (let i = 0; i < phrase.length; i += 1) {
        const ch = phrase[i];
        if (ch === ' ') continue;
        if (!set.has(ch)) return false;
      }
      return phrase.length > 2;
    });
  }

  function pickRealWord(real: string[], newest: string[]) {
    if (!real.length) return '';
    if (newest && newest.length) {
      const hit = real.filter((word) => newest.some((ch) => word.indexOf(ch) !== -1));
      if (hit.length && Math.random() < 0.55) {
        return hit[Math.floor(Math.random() * hit.length)];
      }
    }
    return real[Math.floor(Math.random() * real.length)];
  }

  function generateText(letters: string[], targetLen: number, focus: string) {
    const pool = letters.filter((ch) => ch !== ' ');
    const map = weights(pool, focus);
    const real = usableWords(pool);
    const phrases = homeRowReady() ? usablePhrases(pool) : [];
    const newest = UNLOCK[Math.max(0, state.unlocked - 1)] || [];
    const live = homeRowReady();
    const realChance = live ? 0.88 : (real.length > 6 ? 0.4 : 0.18);
    const words: string[] = [];
    let n = 0;
    while (n < targetLen) {
      let word;
      if (phrases.length && Math.random() < 0.38) {
        word = phrases[Math.floor(Math.random() * phrases.length)];
      } else if (live && real.length >= 10 && Math.random() < 0.28) {
        const count = 2 + (Math.random() < 0.4 ? 1 : 0);
        const chunk = [];
        for (let i = 0; i < count; i += 1) chunk.push(pickRealWord(real, newest));
        word = chunk.join(' ');
      } else if (real.length && Math.random() < realChance) {
        word = pickRealWord(real, newest);
      } else {
        word = randomWord(pool, map);
      }
      if (focus && word.indexOf(' ') === -1 && Math.random() < 0.35) {
        word = (focus + word).slice(0, Math.max(2, word.length));
      }
      word = maybePunct(word, pool);
      words.push(word);
      n += word.length + 1;
    }
    return words.join(' ');
  }

  function maybePunct(word: string, letters: string[]) {
    if (letters.includes(',') && Math.random() < 0.12) return word + ',';
    if (letters.includes('.') && Math.random() < 0.1) return word + '.';
    if (letters.includes(';') && Math.random() < 0.08) return word + ';';
    return word;
  }

  function currentPair() {
    return UNLOCK[Math.max(0, state.unlocked - 1)] || UNLOCK[0];
  }

  function generateIntroText(pair: string[]) {
    const a = pair[0];
    const b = pair[1];
    const parts = [a, b, a, b, a + a, b + b, a + b, b + a, a + b + a, b + a + b];
    while (parts.join(' ').length < INTRO_LEN) {
      const len = 2 + Math.floor(Math.random() * 2);
      let word = '';
      for (let i = 0; i < len; i += 1) word += Math.random() < 0.5 ? a : b;
      parts.push(word);
    }
    return parts.join(' ');
  }

  function activeMs() {
    if (!state.startedAt) return 0;
    let ms = Date.now() - state.startedAt - (state.pausedMs || 0);
    if (state.pausedAt) ms -= Date.now() - state.pausedAt;
    return Math.max(0, ms);
  }

  function wpm() {
    const min = activeMs() / 60000;
    if (min <= 0) return 0;
    return Math.max(0, Math.round((state.hits / 5) / min));
  }

  function accuracy() {
    const total = state.hits + state.misses;
    if (!total) return 100;
    return Math.round((state.hits / total) * 100);
  }

  function masteredCount() {
    return activeLetters().filter((ch) => keyStatus(ch) === 'mastered').length;
  }

  function weakLetters() {
    return activeLetters().filter((ch) => keyStatus(ch) === 'weak');
  }

  function reviewLetters() {
    return activeLetters().filter((ch) => keyStatus(ch) === 'review');
  }

  function upcomingPair() {
    if (state.unlocked >= UNLOCK.length) return [];
    return UNLOCK[state.unlocked].slice();
  }

  function fingerKind(ch: string) {
    const id = FINGER[ch] || '';
    if (id === 'th') return 'большой';
    if (id.charAt(1) === 'p') return 'мизинец';
    if (id.charAt(1) === 'r') return 'безымянный';
    if (id.charAt(1) === 'm') return 'средний';
    if (id.charAt(1) === 'i') return 'указательный';
    return '';
  }

  function pairHandHint(pair: string[]) {
    const a = fingerKind(pair[0]);
    const b = fingerKind(pair[1]);
    const plural: Record<string, string> = {
      указательный: 'указательных',
      средний: 'средних',
      безымянный: 'безымянных',
      мизинец: 'мизинцев',
      большой: 'больших'
    };
    if (a && a === b) return 'оба ' + (plural[a] || a);
    const left = FINGER_LABEL[FINGER[pair[0]]] || '';
    const right = FINGER_LABEL[FINGER[pair[1]]] || '';
    if (left && right) return left + ' и ' + right;
    return '';
  }

  function totalKeys() {
    return UNLOCK.reduce((n, pair) => n + pair.length, 0);
  }

  function setView(name: string) {
    state.view = name;
    document.body.classList.toggle('is-kt-run', name === 'run');
    root.querySelectorAll('[data-kt-view]').forEach((el) => {
      el.classList.toggle('is-on', el.getAttribute('data-kt-view') === name);
    });
  }

  function keyLabel(ch: string) {
    if (ch === ' ') return 'Пробел';
    return ch === ';' ? ';' : ch.toUpperCase();
  }

  function renderKeyboard(kbRoot: HTMLElement, opts: { highlight?: string; clickable?: boolean; status?: boolean }) {
    const highlight = opts.highlight || '';
    const clickable = !!opts.clickable;
    const showStatus = !!opts.status;
    const upcoming = showStatus ? upcomingPair() : [];
    kbRoot.innerHTML = '';

    KB_ROWS.forEach((row) => {
      const line = document.createElement('div');
      line.className = 'kt-kb__row' + (row.cls ? ' ' + row.cls : '');
      if (row.left) line.appendChild(modKey(row.left));
      row.keys.forEach((ch) => line.appendChild(letterKey(ch, highlight, clickable, showStatus, upcoming)));
      if (row.right) line.appendChild(modKey(row.right));
      kbRoot.appendChild(line);
    });

    const spaceRow = document.createElement('div');
    spaceRow.className = 'kt-kb__row';
    const space = document.createElement(clickable ? 'button' : 'div');
    if (clickable && space instanceof HTMLButtonElement) {
      space.type = 'button';
      space.addEventListener('click', () => startRun('drill', ' '));
    }
    space.className = 'kt-key kt-key--space' + (highlight === ' ' ? ' is-next' : '');
    space.dataset.key = ' ';
    space.textContent = '';
    space.title = FINGER_LABEL.th + ' · пробел';
    spaceRow.appendChild(space);
    kbRoot.appendChild(spaceRow);
  }

  function modKey(spec: { id: string; label: string; cls: string }) {
    const el = document.createElement('div');
    el.className = 'kt-key ' + spec.cls;
    el.textContent = spec.label;
    el.dataset.key = spec.id;
    return el;
  }

  function letterKey(ch: string, highlight: string, clickable: boolean, showStatus: boolean, upcoming: string[]) {
    const unlocked = activeLetters().includes(ch);
    const canClick = clickable && unlocked && isLetterKey(ch);
    const el = document.createElement(canClick ? 'button' : 'div');
    if (canClick && el instanceof HTMLButtonElement) el.type = 'button';
    el.className = 'kt-key';
    el.dataset.key = ch;
    el.textContent = ch === '\'' ? '\'' : ch;
    if (ch === 'f' || ch === 'j') el.classList.add('is-bump');
    const status = showStatus ? keyStatus(ch) : '';
    if (status) el.classList.add('is-' + status);
    if (upcoming && upcoming.includes(ch)) el.classList.add('is-upcoming');
    if (highlight === ch) el.classList.add('is-next');
    if (canClick) {
      el.classList.add('is-clickable');
      el.title = (FINGER_LABEL[FINGER[ch]] || '') + ' · ' + keyLabel(ch);
      el.addEventListener('click', () => startRun('drill', ch));
    } else if (clickable && !unlocked) {
      el.setAttribute('aria-disabled', 'true');
      el.title = upcoming && upcoming.includes(ch)
        ? 'Следующая пара · ' + keyLabel(ch)
        : 'Клавиша ещё не открыта';
    }
    return el;
  }

  function renderHub() {
    const letters = activeLetters();
    const total = totalKeys();
    const mastered = masteredCount();
    const pct = Math.round((mastered / total) * 100);
    els.progressText.textContent = mastered + ' / ' + total;
    els.progressPct.textContent = pct + '%';
    els.lessonsCount.textContent = String(state.lessons);
    els.bestWpm.textContent = String(state.bestWpm);
    els.startBtn.textContent = state.lessons ? 'Следующий урок' : 'Начать первый урок';
    els.lessonKeys.textContent = letters.map(keyLabel).join(' ');
    if (els.textMode) {
      els.textMode.textContent = homeRowReady()
        ? ' · в уроке короткие английские слова'
        : ' · пока разминка букв';
    }
    const weak = weakLetters();
    if (els.weakBtn) {
      els.weakBtn.disabled = weak.length === 0;
      els.weakBtn.title = weak.length
        ? 'Разбор слабых: ' + weak.map(keyLabel).join(' ')
        : 'Пока нет слабых клавиш — они появятся, если точность ниже 86%';
    }
    const review = reviewLetters();
    if (els.reviewBtn) {
      els.reviewBtn.disabled = review.length === 0;
      els.reviewBtn.title = review.length
        ? 'Повторить: ' + review.map(keyLabel).join(' ')
        : 'Повторение появится, если клавишу не печатали больше 3 дней';
    }
    if (els.nextHint) {
      const upcoming = upcomingPair();
      if (!upcoming.length) {
        els.nextHint.textContent = 'Все клавиши открыты. Дальше — смешанные уроки, слабые места и повторение.';
      } else {
        const hands = pairHandHint(upcoming);
        els.nextHint.textContent = 'Дальше: ' + upcoming.map(keyLabel).join(' ')
          + (hands ? ' · ' + hands : '')
          + '. Откроется при точности от 92%.';
      }
    }
    if (els.reviewHint) {
      if (review.length) {
        els.reviewHint.hidden = false;
        els.reviewHint.textContent = 'Пора повторить: ' + review.map(keyLabel).join(' ')
          + '. Эти клавиши не печатали больше 3 дней.';
      } else {
        els.reviewHint.hidden = true;
        els.reviewHint.textContent = '';
      }
    }
    renderKeyboard(els.hubKb, { clickable: true, status: true });
  }

  function renderRun() {
    const next = state.text[state.index] || '';
    els.glyph.textContent = next === ' ' ? 'space' : keyLabel(next);
    els.glyph.classList.toggle('is-space', next === ' ');
    els.glyph.classList.remove('is-error');
    els.finger.textContent = next ? (FINGER_LABEL[FINGER[next]] || '') : '';
    els.statWpm.textContent = String(wpm());
    els.statAcc.textContent = accuracy() + '%';
    els.statHits.textContent = String(state.hits);
    els.statMiss.textContent = String(state.misses);
    const ratio = state.text.length ? state.index / state.text.length : 0;
    els.bar.style.width = Math.round(ratio * 100) + '%';

    const chars = [];
    for (let i = 0; i < state.text.length; i += 1) {
      const ch = state.text[i];
      const cls = ['kt-ch'];
      if (ch === ' ') cls.push('is-space');
      if (i < state.index) cls.push('is-done');
      if (i === state.index) cls.push('is-now');
      if (state.missed.has(i)) cls.push('is-miss');
      chars.push('<span class="' + cls.join(' ') + '">' + (ch === ' ' ? '&nbsp;' : escapeHtml(ch)) + '</span>');
    }
    els.chars.innerHTML = chars.join('');
    centerCaret();
    renderKeyboard(els.runKb, { highlight: next });
    els.modeLabel.textContent = modeTitle();
  }

  function centerCaret() {
    if (!els.chars) return;
    const now = els.chars.querySelector('.kt-ch.is-now') || els.chars.querySelector('.kt-ch:last-child');
    const wrap = els.text || els.chars.parentElement;
    if (!now || !wrap) {
      els.chars.style.transform = '';
      return;
    }
    const style = window.getComputedStyle(wrap);
    const padL = parseFloat(style.paddingLeft) || 0;
    const padR = parseFloat(style.paddingRight) || 0;
    const inner = wrap.clientWidth - padL - padR;
    const charMid = now.offsetLeft + now.offsetWidth / 2;
    els.chars.style.transform = 'translateX(' + Math.round(inner / 2 - charMid) + 'px)';
  }

  function escapeHtml(ch: string) {
    const map: Record<string, string> = {
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    };
    return ch.replace(/[&<>"']/g, (s) => map[s]);
  }

  function modeTitle() {
    if (state.mode === 'infinite') return 'Свободная практика';
    if (state.mode === 'weak') {
      return 'Слабые · ' + weakLetters().map(keyLabel).join(' ');
    }
    if (state.mode === 'review') {
      return 'Повторить · ' + reviewLetters().map(keyLabel).join(' ');
    }
    if (state.mode === 'drill') return 'Клавиша ' + keyLabel(state.focusKey || '');
    if (state.mode === 'intro') {
      return 'Новые клавиши · ' + currentPair().map(keyLabel).join(' ');
    }
    return 'Урок';
  }

  function goHub() {
    clearPause();
    hideCaps();
    closeGate();
    setView('hub');
    renderHub();
  }

  function startRun(mode: string, focus?: string) {
    closeGate();
    state.mode = mode;
    state.focusKey = focus || '';
    if (mode === 'intro') {
      state.text = generateIntroText(currentPair());
    } else if (mode === 'weak' || mode === 'review') {
      const pool = mode === 'weak' ? weakLetters() : reviewLetters();
      if (!pool.length) {
        goHub();
        return;
      }
      state.text = generateText(pool, DRILL_LEN, '');
    } else {
      const letters = activeLetters();
      const pool = letters.slice();
      if (focus && focus !== ' ' && !pool.includes(focus)) pool.push(focus);
      const len = mode === 'infinite' ? INFINITE_LEN : mode === 'drill' ? DRILL_LEN : LESSON_LEN;
      state.text = generateText(pool, len, focus && focus !== ' ' ? focus : '');
    }
    state.index = 0;
    state.hits = 0;
    state.misses = 0;
    state.startedAt = 0;
    state.lastAt = 0;
    state.newKeys = [];
    state.layoutWarn = false;
    state.missed = new Set();
    state.runMissExpected = {};
    state.runMissTyped = {};
    clearPause();
    hideCaps();
    els.layout.classList.remove('is-on');
    setView('run');
    renderRun();
    els.capture.focus();
    els.run.classList.add('is-focus');
    els.run.scrollIntoView({ block: 'nearest' });
  }

  function hideCaps() {
    if (els.caps) els.caps.classList.remove('is-on');
  }

  function syncCaps(e: KeyboardEvent) {
    if (!els.caps || !e.getModifierState) return;
    const on = state.view === 'run' && e.getModifierState('CapsLock');
    els.caps.classList.toggle('is-on', on);
  }

  function isPaused() {
    return !!state.pausedAt;
  }

  function clearPause() {
    state.pausedAt = 0;
    state.pausedMs = 0;
  }

  function pauseRun() {
    if (state.view !== 'run') return;
    if (!state.startedAt || state.pausedAt) return;
    if (els.modal && els.modal.open) return;
    state.pausedAt = Date.now();
  }

  function resumeRun() {
    if (!state.pausedAt) return;
    state.pausedMs += Date.now() - state.pausedAt;
    state.pausedAt = 0;
    state.lastAt = Date.now();
  }

  function closeGate() {
    state.gateNext = null;
    state.gateArmed = false;
    if (els.modal && els.modal.open) els.modal.close();
  }

  function continueGate() {
    if (!state.gateArmed) return;
    const next = state.gateNext;
    state.gateArmed = false;
    state.gateNext = null;
    if (els.modal && els.modal.open) els.modal.close();
    if (next) next();
  }

  function modalStat(label: string, value: string) {
    return '<div class="kt-stat"><span class="kt-stat__label">' + label
      + '</span><span class="kt-stat__value">' + value + '</span></div>';
  }

  function openGate(opts: {
    kicker?: string;
    title?: string;
    lead?: string;
    nextLabel?: string;
    wpm?: number;
    acc?: number;
    misses?: number;
    allowWeak?: boolean;
    unlock?: string[];
    next?: () => void;
  }) {
    const modal = els.modal as HTMLDialogElement | null;
    if (!modal || typeof modal.showModal !== 'function') {
      if (opts.next) opts.next();
      return;
    }
    state.gateNext = opts.next || null;
    state.gateArmed = false;
    els.modalKicker.textContent = opts.kicker || 'Урок';
    els.modalTitle.textContent = opts.title || 'Готово';
    els.modalLead.textContent = opts.lead || '';
    els.modalNext.textContent = opts.nextLabel || 'Продолжить';
    els.modalStats.innerHTML = [
      modalStat('WPM', String(opts.wpm || 0)),
      modalStat('Точность', (opts.acc || 0) + '%'),
      modalStat('Ошибки', String(opts.misses || 0))
    ].join('');
    const errors = sessionErrorSummary();
    if (els.modalErrors) {
      if (errors) {
        els.modalErrors.hidden = false;
        els.modalErrors.innerHTML = errors;
      } else {
        els.modalErrors.hidden = true;
        els.modalErrors.textContent = '';
      }
    }
    const weak = weakLetters();
    if (els.modalWeak) {
      if (weak.length && opts.allowWeak) {
        els.modalWeak.hidden = false;
        els.modalWeak.textContent = 'Слабые · ' + weak.map(keyLabel).join(' ');
      } else {
        els.modalWeak.hidden = true;
      }
    }
    if (opts.unlock && opts.unlock.length) {
      els.modalUnlock.hidden = false;
      els.modalUnlock.innerHTML = 'Открыты клавиши <strong>'
        + opts.unlock.map(keyLabel).join(' ') + '</strong>';
    } else {
      els.modalUnlock.hidden = true;
      els.modalUnlock.textContent = '';
    }
    if (!modal.open) modal.showModal();
    els.capture.blur();
    els.modalTitle.focus();
    window.setTimeout(() => {
      state.gateArmed = true;
    }, 450);
  }

  function sessionErrorSummary() {
    const keys = Object.keys(state.runMissExpected || {});
    if (!keys.length) return '';
    const top = keys
      .sort((a, b) => state.runMissExpected[b] - state.runMissExpected[a])
      .slice(0, 3)
      .map((ch) => {
        const n = state.runMissExpected[ch];
        const typedMap = state.runMissTyped[ch] || {};
        const typed = Object.keys(typedMap).sort((a, b) => typedMap[b] - typedMap[a])[0];
        const label = escapeHtml(keyLabel(ch));
        const count = '<span>(' + n + ')</span>';
        if (typed && typed !== ch) {
          return '<strong>' + label + '</strong> → ' + escapeHtml(keyLabel(typed)) + ' ' + count;
        }
        return '<strong>' + label + '</strong> ' + count;
      });
    return 'Чаще всего: ' + top.join(', ');
  }

  function unlockHint(acc: number) {
    if (state.unlocked >= UNLOCK.length) {
      return 'Все клавиши уже открыты. Можно повторить урок или уйти в свободную практику.';
    }
    if (acc < 92) {
      return 'Следующая пара откроется при точности от 92%. Сейчас ' + acc + '%.';
    }
    return 'Ещё немного точности на текущих новых клавишах — и откроется следующая пара.';
  }

  function finishRun(stopped?: boolean) {
    clearPause();
    hideCaps();
    const speed = wpm();
    const acc = accuracy();
    if (speed > state.bestWpm && state.mode !== 'intro') state.bestWpm = speed;

    if (stopped) {
      save();
      goHub();
      return;
    }

    if (state.mode === 'intro') {
      save();
      openGate({
        kicker: 'Разминка',
        title: 'Клавиши на месте',
        lead: 'Дальше смешанный урок со всеми открытыми клавишами: '
          + activeLetters().map(keyLabel).join(' ') + '.',
        nextLabel: 'Начать урок',
        wpm: speed,
        acc: acc,
        misses: state.misses,
        allowWeak: true,
        next: () => startRun('lesson')
      });
      return;
    }

    if (state.mode === 'lesson') {
      state.lessons += 1;
      const unlocked = maybeUnlock(acc);
      save();
      if (unlocked.length) {
        openGate({
          kicker: 'Прогресс',
          title: 'Новые клавиши',
          lead: 'Короткая разминка только на новых буквах, затем снова смешанный урок.',
          nextLabel: 'Разминка ' + unlocked.map(keyLabel).join(' '),
          unlock: unlocked,
          wpm: speed,
          acc: acc,
          misses: state.misses,
          allowWeak: true,
          next: () => startRun('intro')
        });
        return;
      }
      openGate({
        kicker: 'Урок',
        title: 'Урок закончен',
        lead: unlockHint(acc),
        nextLabel: 'Ещё урок',
        wpm: speed,
        acc: acc,
        misses: state.misses,
        allowWeak: true,
        next: () => startRun('intro')
      });
      return;
    }

    save();
    const againMode = state.mode;
    const againFocus = state.focusKey;
    openGate({
      kicker: modeTitle(),
      title: 'Готово',
      lead: againMode === 'infinite'
        ? 'Можно сразу повторить свободную практику или вернуться к схеме.'
        : againMode === 'weak'
          ? 'Слабые клавиши ещё раз или назад к схеме.'
          : againMode === 'review'
            ? 'Повторение ещё раз или назад к схеме.'
            : 'Ещё раз разобрать эту клавишу или вернуться к схеме.',
      nextLabel: 'Ещё раз',
      wpm: speed,
      acc: acc,
      misses: state.misses,
      allowWeak: againMode !== 'weak',
      next: () => startRun(againMode, againFocus)
    });
  }

  function maybeUnlock(acc: number) {
    if (acc < 92 || state.unlocked >= UNLOCK.length) return [];
    const newest = UNLOCK[state.unlocked - 1];
    const ready = newest.every((ch) => {
      const rec = state.keys[ch];
      if (!rec || rec.hits < 8) return false;
      return rec.hits / (rec.hits + rec.misses) >= 0.88;
    });
    if (!ready) return [];
    state.unlocked += 1;
    return UNLOCK[state.unlocked - 1].slice();
  }

  function handleChar(raw: string) {
    if (state.view !== 'run') return;
    if (els.modal && els.modal.open) return;
    if (isPaused()) resumeRun();
    if (/[а-яёА-ЯЁ]/.test(raw)) {
      state.layoutWarn = true;
      els.layout.classList.add('is-on');
      return;
    }
    if (state.layoutWarn) {
      state.layoutWarn = false;
      els.layout.classList.remove('is-on');
    }
    const ch = /[A-Z]/.test(raw) ? raw.toLowerCase() : raw;
    const expected = state.text[state.index];
    if (!expected) return;
    if (!state.startedAt) state.startedAt = Date.now();
    const now = Date.now();
    const dt = state.lastAt ? Math.min(1200, now - state.lastAt) : 0;

    if (ch === expected) {
      state.hits += 1;
      state.index += 1;
      state.lastAt = now;
      const rec = keyRecord(expected);
      rec.hits += 1;
      rec.totalMs += dt || 300;
      rec.lastAt = now;
      els.glyph.classList.remove('is-error');
      if (state.index >= state.text.length) {
        renderRun();
        finishRun();
        return;
      }
      renderRun();
      return;
    }

    state.misses += 1;
    state.missed.add(state.index);
    state.runMissExpected[expected] = (state.runMissExpected[expected] || 0) + 1;
    if (!state.runMissTyped[expected]) state.runMissTyped[expected] = {};
    state.runMissTyped[expected][ch] = (state.runMissTyped[expected][ch] || 0) + 1;
    const rec = keyRecord(expected);
    rec.misses += 1;
    rec.lastAt = now;
    els.glyph.classList.add('is-error');
    const nowEl = els.chars.querySelector('.kt-ch.is-now');
    if (nowEl) nowEl.classList.add('is-error');
    const wrong = [...els.runKb.querySelectorAll('[data-key]')].find((el: HTMLElement) => el.dataset.key === ch);
    if (wrong) {
      wrong.classList.add('is-wrong');
      window.setTimeout(() => wrong.classList.remove('is-wrong'), 180);
    }
    els.statMiss.textContent = String(state.misses);
    els.statAcc.textContent = accuracy() + '%';
  }

  function onVisibilityChange() {
    if (document.hidden) pauseRun();
  }

  function onResize() {
    if (state.view === 'run') centerCaret();
  }

  function onKeydown(e: KeyboardEvent) {
    if (els.modal && els.modal.open) {
      if (e.key === 'Enter') {
        e.preventDefault();
        continueGate();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        goHub();
      } else if (e.key.length === 1) {
        e.preventDefault();
      }
      return;
    }
    if (state.view !== 'run') return;
    syncCaps(e);
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      finishRun(true);
      return;
    }
    if (e.key === 'CapsLock') return;
    if (e.key.length !== 1) return;
    e.preventDefault();
    fromKey = true;
    handleChar(e.key);
    window.setTimeout(() => { fromKey = false; }, 0);
  }

  function onKeyup(e: KeyboardEvent) {
    if (state.view === 'run') syncCaps(e);
  }

  function bind() {
    els.startBtn.addEventListener('click', () => startRun('intro'));
    els.infiniteBtn.addEventListener('click', () => startRun('infinite'));
    if (els.weakBtn) els.weakBtn.addEventListener('click', () => startRun('weak'));
    if (els.reviewBtn) els.reviewBtn.addEventListener('click', () => startRun('review'));
    els.stopBtn.addEventListener('click', () => finishRun(true));
    if (els.modalNext) els.modalNext.addEventListener('click', continueGate);
    if (els.modalHub) els.modalHub.addEventListener('click', goHub);
    if (els.modalWeak) els.modalWeak.addEventListener('click', () => startRun('weak'));
    if (els.modal) {
      els.modal.addEventListener('cancel', (e: Event) => {
        e.preventDefault();
        goHub();
      });
    }
    els.resetBtn.addEventListener('click', () => {
      if (!window.confirm('Сбросить прогресс тренажёра?')) return;
      state.unlocked = 1;
      state.keys = {};
      state.lessons = 0;
      state.bestWpm = 0;
      save();
      renderHub();
    });

    const onAccept = () => applyConsent('accepted');
    const onDecline = () => applyConsent('declined');
    if (els.welcomeAccept) els.welcomeAccept.addEventListener('click', onAccept);
    if (els.welcomeDecline) els.welcomeDecline.addEventListener('click', onDecline);
    if (els.privacyAccept) els.privacyAccept.addEventListener('click', onAccept);
    if (els.privacyDecline) els.privacyDecline.addEventListener('click', onDecline);

    els.run.addEventListener('click', () => {
      if (els.modal && els.modal.open) return;
      els.capture.focus();
    });
    els.capture.addEventListener('focus', () => els.run.classList.add('is-focus'));
    els.capture.addEventListener('blur', () => els.run.classList.remove('is-focus'));
    els.capture.addEventListener('input', () => {
      const v = els.capture.value;
      els.capture.value = '';
      if (fromKey) return;
      if (v) handleChar(v.slice(-1));
    });

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', pauseRun);
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('keyup', onKeyup);
  }

  function cacheEls() {
    els.startBtn = $('kt-start');
    els.infiniteBtn = $('kt-infinite');
    els.weakBtn = $('kt-weak');
    els.reviewBtn = $('kt-review');
    els.resetBtn = $('kt-reset');
    els.stopBtn = $('kt-stop');
    els.hubKb = $('kt-hub-kb');
    els.runKb = $('kt-run-kb');
    els.progressText = $('kt-progress-keys');
    els.progressPct = $('kt-progress-pct');
    els.lessonsCount = $('kt-lessons');
    els.bestWpm = $('kt-best-wpm');
    els.lessonKeys = $('kt-lesson-keys');
    els.textMode = $('kt-text-mode');
    els.nextHint = $('kt-next-hint');
    els.reviewHint = $('kt-review-hint');
    els.glyph = $('kt-glyph');
    els.finger = $('kt-finger');
    els.chars = $('kt-chars');
    els.text = $('kt-text');
    els.capture = $('kt-capture');
    els.run = $('kt-run');
    els.bar = $('kt-bar');
    els.statWpm = $('kt-wpm');
    els.statAcc = $('kt-acc');
    els.statHits = $('kt-hits');
    els.statMiss = $('kt-miss');
    els.modeLabel = $('kt-mode-label');
    els.layout = $('kt-layout');
    els.caps = $('kt-caps');
    els.welcomeAccept = $('kt-welcome-accept');
    els.welcomeDecline = $('kt-welcome-decline');
    els.privacyAccept = $('kt-privacy-accept');
    els.privacyDecline = $('kt-privacy-decline');
    els.consentLabel = $('kt-consent-label');
    els.asideTip = document.getElementById('kt-aside-tip');
    els.asideTipText = document.getElementById('kt-aside-tip-text');
    els.modal = $('kt-modal');
    els.modalKicker = $('kt-modal-kicker');
    els.modalTitle = $('kt-modal-title');
    els.modalLead = $('kt-modal-lead');
    els.modalStats = $('kt-modal-stats');
    els.modalUnlock = $('kt-modal-unlock');
    els.modalErrors = $('kt-modal-errors');
    els.modalNext = $('kt-modal-next');
    els.modalWeak = $('kt-modal-weak');
    els.modalHub = $('kt-modal-hub');
  }

  function startAsideTips() {
    if (!els.asideTip || !els.asideTipText || ASIDE_TIPS.length < 2) return;
    if (window.matchMedia('(max-width: 980px)').matches) return;

    let i = 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const swap = () => {
      i = (i + 1) % ASIDE_TIPS.length;
      els.asideTipText.textContent = ASIDE_TIPS[i];
    };

    asideTipsTimer = window.setInterval(() => {
      if (reduce) {
        swap();
        return;
      }
      els.asideTip.classList.add('is-swap');
      window.setTimeout(() => {
        swap();
        els.asideTip.classList.remove('is-swap');
      }, 280);
    }, 8000);
  }

  function cleanup() {
    if (asideTipsTimer) window.clearInterval(asideTipsTimer);
    asideTipsTimer = 0;
    document.body.classList.remove('is-kt-run');
    document.removeEventListener('visibilitychange', onVisibilityChange);
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('keyup', onKeyup);
    window.removeEventListener('pagehide', pauseRun);
    window.removeEventListener('resize', onResize);
  }

  cacheEls();
  if (!els.startBtn) {
    return { unmount: () => {}, applyConsent: () => {} };
  }
  startAsideTips();
  const consent = getConsent();
  updateConsentLabel(consent);
  bind();
  if (!consent) return { unmount: cleanup, applyConsent };
  if (consent === 'accepted') load();
  revealTrainer();
  return { unmount: cleanup, applyConsent };
}
