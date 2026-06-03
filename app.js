(function () {
  'use strict';

  const STORAGE_TODAY = 'bioGenTodayCount';
  const STORAGE_TOTAL = 'bioGenTotalCount';
  const STORAGE_DATE = 'bioGenDate';
  const STORAGE_PRO = 'bioGenPro';
  const STORAGE_HISTORY = 'bioGenHistory';
  const STORAGE_LANG = 'bioGenLang'; // Сохраняем выбранный язык
  const FREE_LIMIT = 3;
  
  const ACTIVATION_KEY = 'b1o_g3n_pr0_s3cr3t_k3y_2026_x9z';

  // ✅ СЛОВАРЬ ПЕРЕВОДОВ
  const i18n = {
    ru: {
      subtitle: 'Профессиональные описания для LinkedIn, Instagram, Twitter, Telegram и TikTok',
      today: 'Сегодня', total: 'Всего',
      profLabel: 'Профессия или роль:', profPlaceholder: 'Например: маркетолог, разработчик',
      hobbyLabel: 'Хобби (опционально):', hobbyPlaceholder: 'Например: путешествия, фотография',
      platformLabel: 'Платформа:', toneLabel: 'Тон:',
      genBtn: 'Сгенерировать bio', readyTitle: 'Готово!',
      copyBtn: 'Копировать', downloadBtn: 'Скачать', hashtagBtn: 'Хэштеги',
      freeHint: 'Бесплатно: 3 генерации в день.', getProLink: 'Получить Pro',
      examplesTitle: 'Примеры', examplesHint: 'Нажмите, чтобы подставить в форму',
      historyTitle: 'История', clearHistoryBtn: 'Очистить',
      modalTitle: 'Bio Generator Pro', priceText: 'Всего <strong>9$</strong>',
      payBtn: 'Оплатить через Crypto Bot', payHint: 'USDT, TON, BTC • Мгновенно • Анонимно',
      feat1: 'Безлимитные генерации', feat2: 'Все тоны и платформы', feat3: 'Без водяного знака',
      tones: [
        { val: 'professional', text: '💼 Профессиональный' },
        { val: 'friendly', text: '😊 Дружелюбный' },
        { val: 'creative', text: '🎨 Творческий' },
        { val: 'witty', text: '😂 Остроумный' },
        { val: 'mysterious', text: '🔮 Таинственный (Pro)', pro: true },
        { val: 'inspiring', text: '🌟 Вдохновляющий (Pro)', pro: true },
        { val: 'humorous', text: '🎭 Юмористический (Pro)', pro: true }
      ],
      defaultProf: 'Профессионал', defaultInt: 'развитие',
      copied: 'Скопировано!', confirmClear: 'Очистить историю?', histEmpty: 'История пуста',
      alertProNeeded: 'Этот тон доступен только в Pro версии!',
      alertLimit: 'Вы исчерпали бесплатные генерации на сегодня.',
      alertActivated: '🎉 Pro успешно активирован! Спасибо за покупку.',
      alertAlreadyActive: '✅ Pro уже активирован на этом устройстве.'
    },
    en: {
      subtitle: 'Professional bios for LinkedIn, Instagram, Twitter, Telegram & TikTok',
      today: 'Today', total: 'Total',
      profLabel: 'Profession or Role:', profPlaceholder: 'e.g. Marketer, Developer',
      hobbyLabel: 'Hobby (optional):', hobbyPlaceholder: 'e.g. Travel, Photography',
      platformLabel: 'Platform:', toneLabel: 'Tone:',
      genBtn: 'Generate Bio', readyTitle: 'Ready!',
      copyBtn: 'Copy', downloadBtn: 'Download', hashtagBtn: 'Hashtags',
      freeHint: 'Free: 3 generations per day.', getProLink: 'Get Pro',
      examplesTitle: 'Examples', examplesHint: 'Click to fill the form',
      historyTitle: 'History', clearHistoryBtn: 'Clear',
      modalTitle: 'Bio Generator Pro', priceText: 'Only <strong>$9</strong>',
      payBtn: 'Pay via Crypto Bot', payHint: 'USDT, TON, BTC • Instant • Anonymous',
      feat1: 'Unlimited generations', feat2: 'All tones & platforms', feat3: 'No watermark',
      tones: [
        { val: 'professional', text: '💼 Professional' },
        { val: 'friendly', text: '😊 Friendly' },
        { val: 'creative', text: '🎨 Creative' },
        { val: 'witty', text: '😂 Witty' },
        { val: 'mysterious', text: '🔮 Mysterious (Pro)', pro: true },
        { val: 'inspiring', text: '🌟 Inspiring (Pro)', pro: true },
        { val: 'humorous', text: '🎭 Humorous (Pro)', pro: true }
      ],
      defaultProf: 'Professional', defaultInt: 'growth',
      copied: 'Copied!', confirmClear: 'Clear history?', histEmpty: 'History is empty',
      alertProNeeded: 'This tone is available only in Pro version!',
      alertLimit: 'You have reached your daily free limit.',
      alertActivated: '🎉 Pro successfully activated! Thank you.',
      alertAlreadyActive: '✅ Pro is already activated on this device.'
    }
  };

  let currentLang = localStorage.getItem(STORAGE_LANG) || 'ru';

  // DOM Elements
  const els = {
    profession: document.getElementById('profession'),
    interest: document.getElementById('interest'),
    tone: document.getElementById('tone'),
    generate: document.getElementById('generate'),
    result: document.getElementById('result'),
    output: document.getElementById('bio-output'),
    copy: document.getElementById('copy'),
    regenerate: document.getElementById('regenerate'),
    downloadImg: document.getElementById('download-img'),
    hashtagsBtn: document.getElementById('generate-hashtags'),
    hashtagOutput: document.getElementById('hashtag-output'),
    hint: document.getElementById('hint-text'),
    modal: document.getElementById('upgrade-modal'),
    closeModal: document.querySelector('.close'),
    watermark: document.getElementById('watermark'),
    proStatus: document.getElementById('pro-status'),
    todayCount: document.getElementById('today-count'),
    totalCount: document.getElementById('total-count'),
    examplesGrid: document.getElementById('examples-grid'),
    historyList: document.getElementById('history-list'),
    clearHistory: document.getElementById('clear-history'),
    platformRadios: document.querySelectorAll('input[name="platform"]')
  };

  // Helpers
  const isPro = () => localStorage.getItem(STORAGE_PRO) === 'true';
  const getTodayStr = () => new Date().toISOString().slice(0, 10);
  const t = (key) => i18n[currentLang][key]; // Функция перевода
  
  function getCount(key) { return parseInt(localStorage.getItem(key) || '0', 10); }

  function checkDateReset() {
    if (localStorage.getItem(STORAGE_DATE) !== getTodayStr()) {
      localStorage.setItem(STORAGE_DATE, getTodayStr());
      localStorage.setItem(STORAGE_TODAY, '0');
    }
  }

  function updateStats() {
    checkDateReset();
    els.todayCount.textContent = getCount(STORAGE_TODAY);
    els.totalCount.textContent = getCount(STORAGE_TOTAL);
  }

  // ✅ ШАБЛОНЫ (Строго разделены по языкам)
  const templatesRu = {
    professional: ['{profession} | развиваюсь в {interest} | помогаю другим расти', '{profession}, специализирующийся на {interest}'],
    friendly: ['{profession} днём, {interest} ночью. Люблю кофе ☕', 'Привет! Я {profession}, обожаю {interest}. Давай знакомиться!'],
    creative: ['{profession} / {interest} / мечтатель. Создаю вещи, которые вдохновляют.', 'Воображение — моя площадка. {profession} и энтузиаст {interest}.'],
    witty: ['{profession} (нет, я не чиню принтеры). Фанат {interest}.', '{profession}. {interest}. Свободно владею сарказмом.']
  };
  const templatesEn = {
    professional: ['{profession} | building {interest} | helping others grow', '{profession} specializing in {interest} – turning complexity into clarity'],
    friendly: ['{profession} by day, {interest} by night. Coffee addict ☕', 'Hey! I\'m a {profession} who loves {interest}. Let\'s connect!'],
    creative: ['{profession} / {interest} / daydreamer. Creating things that matter.', 'Imagination is my playground – {profession} & {interest} enthusiast.'],
    witty: ['{profession} (no, I don\'t fix printers). {interest} enthusiast.', '{profession}. {interest}. Fluent in sarcasm and coffee.']
  };
  const proTemplatesRu = {
    mysterious: ['{profession} | {interest} | Я знаю твои секреты… или нет? 👀', 'Не дай {profession} обмануть тебя – я здесь ради {interest}.'],
    inspiring: ['{profession} с миссией сделать {interest} доступным для всех.', 'Я верю, что {interest} меняет мир. Как {profession}, я строю будущее.'],
    humorous: ['Почему {profession} перешёл дорогу? Ради {interest}!', '{profession} по профессии, {interest} по страсти.']
  };
  const proTemplatesEn = {
    mysterious: ['{profession} | {interest} | I know your secrets… or do I? 👀', 'Don\'t let the {profession} fool you – I\'m here for the {interest}.'],
    inspiring: ['{profession} on a mission to make {interest} accessible.', 'I believe {interest} changes the world. As a {profession}, I build the future.'],
    humorous: ['Why did the {profession} cross the road? For {interest}!', '{profession} by trade, {interest} by passion.']
  };

  const platformEmojis = { linkedin: '', instagram: ['📸', '✨'], twitter: '', telegram: '', tiktok: ['🎵', '🔥'] };
  const hashtagMap = {
    маркетолог: ['#маркетинг', '#SMM'], разработчик: ['#coding', '#dev'],
    дизайнер: ['#design', '#UX'], менеджер: ['#management', '#leadership']
  };

   // Examples data (расширенный список)
  const examplesData = [
    // 🇷 Русские примеры
    { prof: 'Маркетолог', int: 'путешествия', plat: 'linkedin', tone: 'professional', lang: 'ru', bio: 'Маркетолог | страстный путешественник | создаю кампании, которые вдохновляют' },
    { prof: 'Разработчик', int: 'фотография', plat: 'instagram', tone: 'creative', lang: 'ru', bio: 'Кодер по будням, фотограф по выходным 📸✨' },
    { prof: 'Дизайнер', int: 'шахматы', plat: 'twitter', tone: 'witty', lang: 'ru', bio: 'Дизайнер, который думает на 3 хода вперёд ♟️' },
    { prof: 'HR-специалист', int: 'йога', plat: 'telegram', tone: 'friendly', lang: 'ru', bio: 'Помогаю людям найти работу и внутренний баланс 🧘‍♀️' },
    { prof: 'Менеджер', int: 'кулинария', plat: 'tiktok', tone: 'creative', lang: 'ru', bio: 'Управляю проектами и рецептами — всё должно быть идеально смешано! 👨‍🍳' },
    { prof: 'Аналитик', int: 'чтение', plat: 'linkedin', tone: 'professional', lang: 'ru', bio: 'Вижу паттерны в данных и книгах. Мой следующий инсайт — твоя идея.' },
    { prof: 'Копирайтер', int: 'кино', plat: 'instagram', tone: 'creative', lang: 'ru', bio: 'Пишу тексты, которые продают. Люблю хорошее кино и крепкий кофе ☕🎬' },
    { prof: 'Предприниматель', int: 'спорт', plat: 'linkedin', tone: 'inspiring', lang: 'ru', bio: 'Строю бизнес с нуля. Спорт учит дисциплине, которая нужна в каждом проекте 💪' },
    
    // 🇬 English examples
    { prof: 'Developer', int: 'photography', plat: 'twitter', tone: 'witty', lang: 'en', bio: 'Coder by day, photographer by night 📸✨' },
    { prof: 'HR Specialist', int: 'yoga', plat: 'telegram', tone: 'friendly', lang: 'en', bio: 'Helping people find jobs and inner balance 🧘‍♀️' },
    { prof: 'Designer', int: 'chess', plat: 'twitter', tone: 'witty', lang: 'en', bio: 'Designer who thinks 3 moves ahead ♟️' },
    { prof: 'Marketer', int: 'travel', plat: 'linkedin', tone: 'professional', lang: 'en', bio: 'Marketer | Passionate traveler | Creating campaigns that inspire' },
    { prof: 'Manager', int: 'cooking', plat: 'tiktok', tone: 'creative', lang: 'en', bio: 'Managing projects and recipes — everything must be perfectly mixed! 👨‍🍳' },
    { prof: 'Analyst', int: 'reading', plat: 'linkedin', tone: 'professional', lang: 'en', bio: 'I see patterns in data and books. My next insight is your idea.' },
    { prof: 'Copywriter', int: 'movies', plat: 'instagram', tone: 'creative', lang: 'en', bio: 'Writing words that sell. Love good movies and strong coffee ☕🎬' },
    { prof: 'Entrepreneur', int: 'fitness', plat: 'linkedin', tone: 'inspiring', lang: 'en', bio: 'Building business from scratch. Fitness teaches the discipline needed in every project 💪' }
  ];

  // Core Logic
  function generateBio() {
    const prof = els.profession.value.trim() || t('defaultProf');
    const int = els.interest.value.trim() || t('defaultInt');
    const platform = document.querySelector('input[name="platform"]:checked').value;
    const tone = els.tone.value;

    const proTones = ['mysterious', 'inspiring', 'humorous'];
    if (proTones.includes(tone) && !isPro()) {
      els.modal.classList.remove('hidden');
      return null;
    }

    // Выбираем пул ТОЛЬКО текущего языка
    let pool;
    if (currentLang === 'ru') {
      pool = proTones.includes(tone) ? proTemplatesRu[tone] : templatesRu[tone];
    } else {
      pool = proTones.includes(tone) ? proTemplatesEn[tone] : templatesEn[tone];
    }

    const template = pool[Math.floor(Math.random() * pool.length)];
    let bio = template.replace(/\{profession\}/g, prof).replace(/\{interest\}/g, int);

    const emojis = platformEmojis[platform];
    if (emojis && emojis.length > 0) bio += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
    
    return bio;
  }

  function generateHashtags() {
    const prof = els.profession.value.trim().toLowerCase();
    const int = els.interest.value.trim().toLowerCase();
    let tags = hashtagMap[prof] || (currentLang === 'ru' ? ['#профессионал', '#карьера'] : ['#professional', '#career']);
    if (int) int.split(' ').forEach(w => { if(w.length>2) tags.push('#'+w); });
    return [...new Set(tags)].slice(0, 8).join(' ');
  }

  function saveToHistory(bioText) {
    const history = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]');
    history.unshift({ bio: bioText, date: new Date().toLocaleString(currentLang === 'ru' ? 'ru-RU' : 'en-US') });
    if (history.length > 10) history.pop();
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history));
    renderHistory();
  }

  function renderHistory() {
    const history = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]');
    els.historyList.innerHTML = history.length 
      ? history.map(h => `<div class="history-item"><span>${h.bio}</span><small>${h.date}</small></div>`).join('')
      : `<p style="color:var(--text-light)">${t('histEmpty')}</p>`;
  }

  function renderExamples() {
    if (!els.examplesGrid) return;
    els.examplesGrid.innerHTML = '';
    // Показываем примеры только текущего языка
    const filtered = examplesData.filter(ex => ex.lang === currentLang);
    
    filtered.forEach(ex => {
      const card = document.createElement('div');
      card.className = 'example-card';
      card.textContent = ex.bio;
      card.addEventListener('click', () => {
        els.profession.value = ex.prof;
        els.interest.value = ex.int;
        const radio = document.querySelector(`input[name="platform"][value="${ex.plat}"]`);
        if (radio) {
          radio.checked = true;
          document.querySelectorAll('.platform-card').forEach(c => c.classList.remove('selected'));
          radio.parentElement.classList.add('selected');
        }
        els.tone.value = ex.tone;
        els.profession.scrollIntoView({ behavior: 'smooth' });
      });
      els.examplesGrid.appendChild(card);
    });
  }

  // ✅ ФУНКЦИЯ ОБНОВЛЕНИЯ ИНТЕРФЕЙСА
  function updateInterface() {
    // Обновляем все текстовые элементы
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[currentLang][key]) el.innerHTML = i18n[currentLang][key];
    });
    // Обновляем плейсхолдеры
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (i18n[currentLang][key]) el.placeholder = i18n[currentLang][key];
    });

    // Перерисовываем выпадающий список тонов
    els.tone.innerHTML = '';
    i18n[currentLang].tones.forEach(tone => {
      const opt = document.createElement('option');
      opt.value = tone.val;
      opt.textContent = tone.text;
      if (tone.pro && !isPro()) opt.disabled = true;
      els.tone.appendChild(opt);
    });

    // Обновляем кнопки переключателя
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    // Обновляем статус Pro/Free
    if (isPro()) {
      if (els.watermark) els.watermark.style.display = 'none';
      if (els.proStatus) els.proStatus.textContent = 'Pro';
      els.hint.innerHTML = `🚀 <b>Pro ${currentLang === 'ru' ? 'активирован' : 'activated'}</b>`;
      // Разблокируем Pro тоны
      Array.from(els.tone.options).forEach(opt => {
        if (opt.textContent.includes('(Pro)')) opt.disabled = false;
      });
    } else {
      if (els.watermark) els.watermark.style.display = 'block';
      if (els.proStatus) els.proStatus.textContent = 'Free';
      const remaining = FREE_LIMIT - getCount(STORAGE_TODAY);
      els.hint.innerHTML = `${t('freeHint')} <a href="https://t.me/send?start=IVZFVmyUqKMc" target="_blank">${t('getProLink')}</a>`;
      // Блокируем Pro тоны
      Array.from(els.tone.options).forEach(opt => {
        if (opt.textContent.includes('(Pro)')) opt.disabled = true;
      });
    }
    
    updateStats();
    renderExamples(); // Перерисовываем примеры под новый язык
    renderHistory();  // Перерисовываем историю (даты)
  }

  // Event Handlers
  function handleGenerate() {
    const bio = generateBio();
    if (!bio) return; 

    checkDateReset();
    if (!isPro() && getCount(STORAGE_TODAY) >= FREE_LIMIT) {
      els.modal.classList.remove('hidden');
      return;
    }

    els.output.textContent = bio;
    els.result.classList.remove('hidden');
    els.hashtagOutput.classList.add('hidden');
    
    localStorage.setItem(STORAGE_TODAY, getCount(STORAGE_TODAY) + 1);
    localStorage.setItem(STORAGE_TOTAL, getCount(STORAGE_TOTAL) + 1);
    saveToHistory(bio);
    updateInterface();
    
    setTimeout(() => els.result.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  // Init Listeners
  els.generate.addEventListener('click', handleGenerate);
  els.regenerate.addEventListener('click', handleGenerate);
  
  els.copy.addEventListener('click', () => {
    navigator.clipboard.writeText(els.output.textContent).then(() => alert(t('copied')));
  });

  els.downloadImg.addEventListener('click', async () => {
    if (typeof html2canvas !== 'undefined') {
      try {
        const canvas = await html2canvas(els.result, { backgroundColor: null });
        const link = document.createElement('a');
        link.download = 'bio.png';
        link.href = canvas.toDataURL();
        link.click();
      } catch(e) {}
    }
  });

  els.hashtagsBtn.addEventListener('click', () => {
    els.hashtagOutput.textContent = generateHashtags();
    els.hashtagOutput.classList.remove('hidden');
  });

  els.closeModal.addEventListener('click', () => els.modal.classList.add('hidden'));
  window.addEventListener('click', (e) => { if(e.target === els.modal) els.modal.classList.add('hidden'); });

  els.clearHistory.addEventListener('click', () => {
    if(confirm(t('confirmClear'))) {
      localStorage.removeItem(STORAGE_HISTORY);
      renderHistory();
    }
  });

  els.platformRadios.forEach(r => {
    r.addEventListener('change', () => {
      document.querySelectorAll('.platform-card').forEach(c => c.classList.remove('selected'));
      r.parentElement.classList.add('selected');
    });
  });

  // ✅ ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ЯЗЫКА
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentLang = e.target.dataset.lang;
      localStorage.setItem(STORAGE_LANG, currentLang);
      updateInterface();
    });
  });

  // Проверка ключа активации
  const params = new URLSearchParams(window.location.search);
  const key = params.get('key'); 
  if (key === ACTIVATION_KEY) {
    if (!localStorage.getItem('pro_activated_once')) {
      localStorage.setItem(STORAGE_PRO, 'true');
      localStorage.setItem('pro_activated_once', 'true');
      window.history.replaceState({}, '', window.location.pathname);
      alert(t('alertActivated'));
      updateInterface();
    } else {
      alert(t('alertAlreadyActive'));
      updateInterface();
    }
  }

  // Initial render
  updateInterface();
})();
