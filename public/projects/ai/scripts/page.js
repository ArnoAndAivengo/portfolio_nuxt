(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Homepage: mark nav ready; NLO flights live in bc-nlo.js */
  (function heroSetup() {
    const nav = document.getElementById('bc-nav') || document.querySelector('.bc-nav');
    if (nav) nav.classList.add('is-ready', 'is-settled');
    const intro = document.getElementById('aside-intro');
    if (intro) intro.classList.add('is-ready');

    if (reduced || !document.body.classList.contains('bc--home')) return;
    if (!document.getElementById('bc-nlo')) return;

    const loadNloBundle = () => {
      if (document.querySelector('script[data-bc-nlo]')) return;
      const s = document.createElement('script');
      s.src = './public/scripts/bc-nlo.js?v=2026081145';
      s.async = true;
      s.dataset.bcNlo = '1';
      document.body.appendChild(s);
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadNloBundle, { timeout: 3500 });
    } else {
      window.setTimeout(loadNloBundle, 2500);
    }
  })();

  /* Soft spotlight follows the cursor (fine pointer only) */
  const spot = document.getElementById('spotlight');
  if (spot && !reduced && window.matchMedia('(pointer: fine)').matches) {
    let raf = 0;
    let running = false;
    let tx = Math.round(innerWidth / 2);
    let ty = Math.round(innerHeight / 3);
    let x = tx;
    let y = ty;

    const paint = () => {
      spot.style.setProperty('--x', `${Math.round(x)}px`);
      spot.style.setProperty('--y', `${Math.round(y)}px`);
    };

    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      paint();
      if (Math.abs(tx - x) < 0.5 && Math.abs(ty - y) < 0.5) {
        x = tx;
        y = ty;
        paint();
        running = false;
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    paint();
    window.addEventListener('pointermove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      spot.classList.add('is-on');
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    }, { passive: true });
    window.addEventListener('pointerleave', () => spot.classList.remove('is-on'));
  }

  /* Reveal sections on scroll */
  const sections = [...document.querySelectorAll('.bc-section')];

  function revealSection(section) {
    section.classList.add('is-visible');
  }

  function startSectionObserver() {
    if (reduced || !('IntersectionObserver' in window)) {
      sections.forEach((s) => {
        if (!s.classList.contains('is-visible')) revealSection(s);
      });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealSection(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    sections.forEach((s) => {
      if (s.classList.contains('is-visible')) return;
      io.observe(s);
    });
  }

  startSectionObserver();

  /* Scroll spy */
  const navLinks = [...document.querySelectorAll('[data-section]')].filter((el) =>
    el.classList.contains('bc-nav__link')
  );

  function setActive(id) {
    navLinks.forEach((link) => {
      const on = link.getAttribute('data-section') === id;
      link.classList.toggle('is-active', on);
      if (on && window.matchMedia('(max-width: 980px)').matches) {
        link.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.getAttribute('data-section'));
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0.2, 0.55] }
    );
    sections.forEach((s) => spy.observe(s));
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('data-section');
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 40;
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
      setActive(id);
    });
  });

  /* Experience label */
  function plural(n, one, few, many) {
    const m10 = n % 10;
    const m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }

  const start = new Date(2018, 11, 1);
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1;
  const years = Math.floor(months / 12);
  const label = years > 0
    ? `${years}+ ${plural(years, 'год', 'года', 'лет')}`
    : 'менее года';
  document.querySelectorAll('[data-total-experience]').forEach((el) => {
    el.textContent = label || '7+ лет';
  });

  /* Contact form (homepage bc-form only — resume uses aobukhov-page.js) */
  const form = document.getElementById('contactForm');
  if (!form || !form.classList.contains('bc-form')) return;

  const status = form.querySelector('.bc-form__status');
  const endpoint = form.dataset.endpoint || '/api/contact.php';

  const getField = (name) => form.querySelector(`[name="${name}"]`);

  const formatPhone = (raw) => {
    const source = (raw || '').trim();
    const startsWithPlus = source.startsWith('+');
    let digits = source.replace(/\D/g, '');
    if (!digits) return startsWithPlus ? '+' : '';
    if (digits[0] === '8') digits = '7' + digits.slice(1);
    if (startsWithPlus && digits[0] !== '7') {
      digits = digits.slice(0, 15);
      let out = '+' + digits.slice(0, Math.min(3, digits.length));
      if (digits.length > 3) out += ' ' + digits.slice(3, Math.min(6, digits.length));
      if (digits.length > 6) out += ' ' + digits.slice(6, Math.min(9, digits.length));
      if (digits.length > 9) out += ' ' + digits.slice(9, Math.min(12, digits.length));
      if (digits.length > 12) out += ' ' + digits.slice(12, 15);
      return out;
    }
    if (digits[0] !== '7') digits = '7' + digits;
    digits = digits.slice(0, 11);
    const d = digits.slice(1);
    let out = '+7';
    if (d.length > 0) out += ' (' + d.slice(0, 3);
    if (d.length >= 3) out += ')';
    if (d.length >= 4) out += ' ' + d.slice(3, 6);
    if (d.length >= 7) out += '-' + d.slice(6, 8);
    if (d.length >= 9) out += '-' + d.slice(8, 10);
    return out;
  };

  const phone = form.querySelector('[data-phone-mask]');
  if (phone) {
    phone.addEventListener('input', (e) => {
      const isDelete = !!(e.inputType && e.inputType.startsWith('delete'));
      let formatted = formatPhone(phone.value);
      if (isDelete) {
        formatted = formatted.replace(/[\s()\-]+$/, '');
        if (formatted === '+7' || formatted === '+') formatted = '';
      }
      phone.value = formatted;
    });
  }

  const setError = (field, message) => {
    field.classList.toggle('is-invalid', !!message);
    const err = field.querySelector('.bc-field__error');
    if (err) err.textContent = message || '';
  };

  const validate = () => {
    let first = null;
    form.querySelectorAll('.bc-field').forEach((field) => {
      const input = field.querySelector('input, textarea');
      if (!input) return;
      const value = (input.value || '').trim();
      let error = '';
      if (input.required && !value) error = 'Обязательное поле';
      else if (input.name === 'name' && value && value.length < 2) error = 'Минимум 2 символа';
      else if (input.name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Некорректный email';
      else if (input.name === 'phone' && value) {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 15) error = 'Укажите телефон с кодом страны';
        else if (/^[78]/.test(digits) && digits.length !== 11) error = 'Российский номер — 11 цифр';
      } else if (input.name === 'message' && value && value.length < 10) error = 'Минимум 10 символов';
      setError(field, error);
      if (error && !first) first = input;
    });
    return first;
  };

  const showStatus = (type, message) => {
    if (!status) return;
    status.textContent = message;
    status.className = 'bc-form__status'
      + (type === 'ok' ? ' is-ok' : '')
      + (type === 'err' ? ' is-err' : '');
  };

  const openMailFallback = (payload) => {
    const subject = encodeURIComponent('Обращение с arnoandaivengo.ru — ' + payload.name);
    const body = encodeURIComponent(
      'Имя: ' + payload.name + '\n'
      + 'Email: ' + payload.email + '\n'
      + 'Телефон: ' + payload.phone + '\n\n'
      + payload.message
    );
    window.location.href = 'mailto:alexobukhovarno@gmail.com?subject=' + subject + '&body=' + body;
    showStatus(
      'ok',
      'API формы на сервере недоступен — открыл почтовый клиент. Или Telegram: @alexObukhovArno'
    );
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showStatus('', '');

    const hp = getField('hp');
    const bot = getField('botcheck');
    if ((hp && hp.value) || (bot && bot.checked)) {
      showStatus('ok', 'Спасибо! Сообщение отправлено.');
      return;
    }

    const invalid = validate();
    if (invalid) {
      invalid.focus();
      showStatus('err', 'Проверьте поля формы.');
      return;
    }

    const nameEl = getField('name');
    const emailEl = getField('email');
    const phoneEl = getField('phone');
    const messageEl = getField('message');

    const payload = {
      name: (nameEl && nameEl.value || '').trim(),
      email: (emailEl && emailEl.value || '').trim(),
      phone: (phoneEl && phoneEl.value || '').trim(),
      message: (messageEl && messageEl.value || '').trim(),
      hp: '',
      botcheck: false
    };

    const url = new URL(endpoint, window.location.origin).toString();

    form.classList.add('is-loading');
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'same-origin'
      });

      let data = null;
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : null;
      } catch (_) {
        data = null;
      }

      if (res.ok && data && data.ok) {
        form.reset();
        showStatus('ok', 'Спасибо! Сообщение отправлено.');
        return;
      }

      if (res.status === 422 && data && data.fields) {
        Object.entries(data.fields).forEach(([name, message]) => {
          const field = getField(name)?.closest('.bc-field');
          if (field) setError(field, String(message));
        });
        showStatus('err', (data && data.error) || 'Проверьте поля формы.');
        return;
      }

      if (res.status === 429) {
        showStatus('err', (data && data.error) || 'Слишком частые запросы. Попробуйте позже.');
        return;
      }

      // На nginx-статике POST к .php даёт 405, PHP не исполняется
      if (res.status === 405 || res.status === 404 || !data) {
        openMailFallback(payload);
        return;
      }

      showStatus(
        'err',
        (data && data.error) || `Не удалось отправить (HTTP ${res.status}). Напишите в Telegram: @alexObukhovArno`
      );
    } catch (err) {
      console.error('contact form failed:', err, 'url:', url);
      openMailFallback(payload);
    } finally {
      form.classList.remove('is-loading');
    }
  });
})();

/* If a drag somehow starts, clear selection so clicks stay responsive */
(function () {
  const clearStuckUi = () => {
    const sel = window.getSelection && window.getSelection();
    if (sel && sel.rangeCount) sel.removeAllRanges();
  };
  document.addEventListener('dragend', clearStuckUi, true);
  document.addEventListener('drop', clearStuckUi, true);
})();

/* Mobile menus: keep current link in view (prefer center) */
(function () {
  const mq = window.matchMedia('(max-width: 980px)');

  function centerInNav(nav, current) {
    if (!nav || !current) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = current.getBoundingClientRect();
    const delta = linkRect.left + linkRect.width / 2 - (navRect.left + navRect.width / 2);
    if (Math.abs(delta) < 2) return;
    nav.scrollTo({ left: nav.scrollLeft + delta, behavior: 'smooth' });
  }

  function centerCurrentLinks() {
    if (!mq.matches) return;

    const siteNav = document.querySelector('.bc-site-links');
    centerInNav(siteNav, siteNav && siteNav.querySelector('a[aria-current="page"]'));

    const sectionNav = document.querySelector('.bc-nav');
    centerInNav(
      sectionNav,
      sectionNav &&
        (sectionNav.querySelector('a[aria-current="page"]') ||
          sectionNav.querySelector('a.is-active'))
    );
  }

  const run = () => requestAnimationFrame(centerCurrentLinks);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
  window.addEventListener('load', run, { once: true });
  mq.addEventListener('change', centerCurrentLinks);
})();
