(function () {
  'use strict';

  const STORAGE_TODAY = 'bioGenTodayCount';
  const STORAGE_TOTAL = 'bioGenTotalCount';
  const STORAGE_DATE = 'bioGenDate';
  const STORAGE_PRO = 'bioGenPro';
  const STORAGE_HISTORY = 'bioGenHistory';
  const FREE_LIMIT = 3;
  
  // 🔑 ЗАМЕНИ ЭТОТ КЛЮЧ ПОСЛЕ КАЖДОЙ ПРОДАЖИ!
  const ACTIVATION_KEY = 'b1o_g3n_pr0_s3cr3t_k3y_2026_x9z';

  // DOM Elements
  const els = {
    language: document.getElementById('language'),
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
  const hasCyrillic = (str) => /[а-яА-ЯёЁ]/.test(str);
  
  function getCount(key) {
    return parseInt(localStorage.getItem(key) || '0', 10);
  }

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

  // ✅ РУССКИЕ ШАБЛОНЫ
  const templatesRu = {
    professional: [
      '{profession} | развиваюсь в {interest} | помогаю другим расти',
      '{profession}, специализирующийся на {interest} – превращаю сложное в понятное',
      'Сейчас: {profession} с страстью к {interest}. Всегда учусь, всегда создаю.'
    ],
    friendly: [
      '{profession} днём, {interest} ночью. Люблю кофе и интересные проекты ☕',
      'Привет! Я {profession}, который обожает {interest}. Давай знакомиться!',
      'Просто {profession}, который хочет сделать мир лучше. Спроси меня о {interest}!'
    ],
    creative: [
      '{profession} / {interest} / мечтатель. Создаю вещи, которые заставляют задуматься.',
      'Воображение — моя площадка. {profession} и энтузиаст {interest}.',
      'Пишу истории как {profession}, ищу вдохновение в {interest}.'
    ],
    witty: [
      '{profession} (нет, я не чиню принтеры). Фанат {interest} и профессиональный перфекционист.',
      '{profession}. {interest}. Свободно владею сарказмом и кофе.',
      'Я ставлю "про" в {profession} и "фан" в {interest}.'
    ]
  };

  // ✅ АНГЛИЙСКИЕ ШАБЛОНЫ (С универсальными вариантами)
  const templatesEn = {
    professional: [
      '{profession} | building {interest} | helping others grow',
      '{profession} specializing in {interest} – turning complexity into clarity',
      'Driven professional | Passionate about growth and innovation 🚀', // Универсальный
      'Turning ideas into reality | Always learning, always shipping'     // Универсальный
    ],
    friendly: [
      '{profession} by day, {interest} by night. Coffee addict ☕',
      'Hey! I\'m a {profession} who loves {interest}. Let\'s connect!',
      'Just a human trying to make the world better ✨ | Good vibes only', // Универсальный
      'Smiles, coffee, and good times | Always up for a chat'             // Универсальный
    ],
    creative: [
      '{profession} / {interest} / daydreamer. Creating things that matter.',
      'Imagination is my playground – {profession} & {interest} enthusiast.',
      'Dreamer. Creator. Doer. | Finding beauty in the everyday 🎨',       // Универсальный
      'Art meets life | Exploring the intersection of creativity and tech' // Универсальный
    ],
    witty: [
      '{profession} (no, I don\'t fix printers). {interest} enthusiast.',
      '{profession}. {interest}. Fluent in sarcasm and coffee.',
      'I put the "pro" in procrastination (just kidding) 😂',             // Универсальный
      'Professional overthinker | Powered by caffeine and deadlines'      // Универсальный
    ]
  };

  // ✅ PRO РУССКИЕ
  const proTemplatesRu = {
    mysterious: [
      '{profession} | {interest} | Я знаю, что ты сделал прошлым летом… или нет? 👀',
      'Не дай {profession} обмануть тебя – я здесь ради {interest}.',
      'Иногда {profession}. Всегда {interest}. Никогда не обычный.'
    ],
    inspiring: [
      '{profession} с миссией сделать {interest} доступным для всех.',
      'Я верю, что {interest} может изменить мир. Как {profession}, я строю это будущее.',
      'Делай то, что любишь. {profession} | {interest} | меняю жизни через dedication.'
    ],
    humorous: [
      'Почему {profession} перешёл дорогу? Чтобы добраться до {interest}!',
      '{profession} по профессии, {interest} по страсти. Моё резюме странное, но навыки реальные.',
      'Я ставлю "про" в {profession} и "фан" в {interest}.'
    ]
  };

  // ✅ PRO АНГЛИЙСКИЕ
  const proTemplatesEn = {
    mysterious: [
      '{profession} | {interest} | I know what you did last summer. Just kidding… or am I? 👀',
      'Don\'t let the {profession} fool you – I\'m really here for the {interest}.',
      'Sometimes {profession}. Always {interest}. Never ordinary.'
    ],
    inspiring: [
      '{profession} on a mission to make {interest} accessible to everyone.',
      'I believe {interest} can change the world. As a {profession}, I\'m building that future.',
      'Do what you love. {profession} | {interest} | changing lives through dedication.'
    ],
    humorous: [
      'Why did the {profession} cross the road? To get to the {interest}!',
      '{profession} by trade, {interest} by passion. My resume is weird but my skills are real.',
      'I put the "pro" in {profession} and the "fun" in {interest}.'
    ]
  };

  const platformEmojis = {
    linkedin: '',
    instagram: ['📸', '✨', '💫'],
    twitter: '',
    telegram: '',
    tiktok: ['🎵', '🔥', '']
  };

  const hashtagMap = {
    маркетолог: ['#маркетинг', '#SMM', '#контент', '#бренд'],
    разработчик: ['#coding', '#dev', '#IT', '#программирование'],
    дизайнер: ['#design', '#UX', '#UI', '#творчество'],
    менеджер: ['#менеджмент', '#лидерство', '#projects', '#agile']
  };

  // Examples data
  const examplesData = [
    { prof: 'Маркетолог', int: 'путешествия', plat: 'linkedin', tone: 'professional', lang: 'ru', bio: 'Маркетолог | страстный путешественник | создаю кампании, которые вдохновляют' },
    { prof: 'Разработчик', int: 'фотография', plat: 'instagram', tone: 'creative', lang: 'ru', bio: 'Кодер по будням, фотограф по выходным 📸✨' },
    { prof: 'Developer', int: 'photography', plat: 'twitter', tone: 'witty', lang: 'en', bio: 'Coder by day, photographer by night 📸✨' },
    { prof: 'HR Specialist', int: 'yoga', plat: 'telegram', tone: 'friendly', lang: 'en', bio: 'Helping people find jobs and inner balance 🧘‍♀️' },
    { prof: 'Менеджер', int: 'кулинария', plat: 'tiktok', tone: 'creative', lang: 'ru', bio: 'Управляю проектами и рецептами — всё должно быть идеально смешано! 👨‍' },
    { prof: 'Analyst', int: 'reading', plat: 'linkedin', tone: 'professional', lang: 'en', bio: 'I see patterns in data and books. My next insight is your idea.' }
  ];

  // Core Logic
  function createBioFromTemplate(template, prof, int, platform) {
    let bio = template.replace(/\{profession\}/g, prof).replace(/\{interest\}/g, int);
    const emojis = platformEmojis[platform];
    if (emojis && emojis.length > 0) {
      bio += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
    }
    return bio;
  }

  function generateBio() {
    const profInput = els.profession.value.trim();
    const intInput = els.interest.value.trim();
    const platform = document.querySelector('input[name="platform"]:checked').value;
    const tone = els.tone.value;
    const lang = els.language.value;

    // Проверка Pro-тонов
    const proTones = ['mysterious', 'inspiring', 'humorous'];
    if (proTones.includes(tone) && !isPro()) {
      els.modal.classList.remove('hidden');
      return null;
    }

    // Определяем пулы шаблонов
    const poolRu = proTones.includes(tone) ? proTemplatesRu[tone] : templatesRu[tone];
    const poolEn = proTones.includes(tone) ? proTemplatesEn[tone] : templatesEn[tone];

    // Логика подстановки значений (защита от "кривого" английского)
    const isCyrillicProf = hasCyrillic(profInput);
    const isCyrillicInt = hasCyrillic(intInput);

    // Значения для RU
    const valRuProf = profInput || 'Профессионал';
    const valRuInt = intInput || 'развитие';

    // Значения для EN (если ввели кириллицу, берем дефолтные английские слова)
    const valEnProf = (!isCyrillicProf && profInput) ? profInput : 'Professional';
    const valEnInt = (!isCyrillicInt && intInput) ? intInput : 'growth';

    let bios = [];

    // Генерация для RU
    if (lang === 'ru' || lang === 'both') {
      const t = poolRu[Math.floor(Math.random() * poolRu.length)];
      bios.push({ lang: 'ru', text: createBioFromTemplate(t, valRuProf, valRuInt, platform) });
    }
    
    // Генерация для EN
    if (lang === 'en' || lang === 'both') {
      const t = poolEn[Math.floor(Math.random() * poolEn.length)];
      bios.push({ lang: 'en', text: createBioFromTemplate(t, valEnProf, valEnInt, platform) });
    }

    return bios;
  }

  function generateHashtags() {
    const prof = els.profession.value.trim().toLowerCase();
    const int = els.interest.value.trim().toLowerCase();
    let tags = hashtagMap[prof] || ['#профессионал', '#карьера'];
    
    if (int) {
      int.split(' ').forEach(w => { if(w.length>2) tags.push('#'+w); });
    }
    return [...new Set(tags)].slice(0, 8).join(' ');
  }

  function saveToHistory(bioText) {
    const history = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]');
    history.unshift({ bio: bioText, date: new Date().toLocaleString('ru-RU') });
    if (history.length > 10) history.pop();
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history));
    renderHistory();
  }

  function renderHistory() {
    const history = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]');
    els.historyList.innerHTML = history.length 
      ? history.map(h => `<div class="history-item"><span>${h.bio}</span><small>${h.date}</small></div>`).join('')
      : '<p style="color:var(--text-light)">История пуста</p>';
  }

  function renderExamples() {
    if (!els.examplesGrid) return;
    els.examplesGrid.innerHTML = '';
    
    examplesData.forEach(ex => {
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
        els.language.value = ex.lang;
        
        els.profession.scrollIntoView({ behavior: 'smooth' });
      });
      
      els.examplesGrid.appendChild(card);
    });
  }

  function updateUI() {
    checkDateReset();
    const remaining = FREE_LIMIT - getCount(STORAGE_TODAY);
    
    if (isPro()) {
      if (els.watermark) els.watermark.style.display = 'none';
      if (els.proStatus) els.proStatus.textContent = 'Pro';
      els.hint.innerHTML = '🚀 <b>Pro активирован</b> (безлимит)';
      
      document.querySelectorAll('.pro-option').forEach(opt => {
        opt.disabled = false;
      });

    } else {
      if (els.watermark) els.watermark.style.display = 'block';
      if (els.proStatus) els.proStatus.textContent = 'Free';
      els.hint.innerHTML = `Бесплатно: ${Math.max(0, remaining)} генераций. <a href="https://t.me/send?start=IVZFVmyUqKMc" target="_blank">Получить Pro</a>`;
      
      document.querySelectorAll('.pro-option').forEach(opt => {
        opt.disabled = true;
      });
    }
    updateStats();
  }

  // Event Handlers
  function handleGenerate() {
    const bios = generateBio();
    if (!bios) return; 

    checkDateReset();
    if (!isPro() && getCount(STORAGE_TODAY) >= FREE_LIMIT) {
      els.modal.classList.remove('hidden');
      return;
    }

    // Форматируем вывод
    let displayText = '';
    let copyText = '';
    
    if (bios.length === 1) {
      displayText = bios[0].text;
      copyText = bios[0].text;
    } else {
      // Если 2 языка, показываем с флагами
      displayText = bios.map(b => {
        const flag = b.lang === 'ru' ? '🇷🇺' : '🇬';
        return `${flag} ${b.text}`;
      }).join('\n\n');
      
      copyText = bios.map(b => b.text).join('\n\n');
    }

    els.output.textContent = displayText;
    els.result.classList.remove('hidden');
    els.hashtagOutput.classList.add('hidden');
    
    localStorage.setItem(STORAGE_TODAY, getCount(STORAGE_TODAY) + 1);
    localStorage.setItem(STORAGE_TOTAL, getCount(STORAGE_TOTAL) + 1);
    saveToHistory(copyText);
    updateUI();
    
    setTimeout(() => els.result.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  // Init
  els.generate.addEventListener('click', handleGenerate);
  els.regenerate.addEventListener('click', handleGenerate);
  
  els.copy.addEventListener('click', () => {
    const rawText = els.output.textContent.replace(/🇷🇺 |🇬🇧 /g, '');
    navigator.clipboard.writeText(rawText).then(() => {
      alert('Скопировано!');
    });
  });

  els.downloadImg.addEventListener('click', async () => {
    if (typeof html2canvas !== 'undefined') {
      try {
        const canvas = await html2canvas(els.result, { backgroundColor: null });
        const link = document.createElement('a');
        link.download = 'bio.png';
        link.href = canvas.toDataURL();
        link.click();
      } catch(e) { console.error(e); }
    }
  });

  els.hashtagsBtn.addEventListener('click', () => {
    els.hashtagOutput.textContent = generateHashtags();
    els.hashtagOutput.classList.remove('hidden');
  });

  els.closeModal.addEventListener('click', () => els.modal.classList.add('hidden'));
  window.addEventListener('click', (e) => { if(e.target === els.modal) els.modal.classList.add('hidden'); });

  els.clearHistory.addEventListener('click', () => {
    if(confirm('Очистить историю?')) {
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

  // Проверка ключа активации
  const params = new URLSearchParams(window.location.search);
  const key = params.get('key'); 

  if (key === ACTIVATION_KEY) {
    if (!localStorage.getItem('pro_activated_once')) {
      localStorage.setItem(STORAGE_PRO, 'true');
      localStorage.setItem('pro_activated_once', 'true');
      window.history.replaceState({}, '', window.location.pathname);
      alert('🎉 Pro успешно активирован! Спасибо за покупку.');
      updateUI();
    } else {
      alert('✅ Pro уже активирован на этом устройстве.');
      updateUI();
    }
  }

  // Initial render
  updateUI();
  renderHistory();
  renderExamples();
})();
