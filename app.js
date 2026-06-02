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

  // Templates (Free)
  const templates = {
    professional: [
      '{profession} | building {interest} | helping others grow',
      '{profession} specializing in {interest} – turning complexity into clarity',
      'Currently: {profession} with a passion for {interest}. Always learning.'
    ],
    friendly: [
      '{profession} by day, {interest} by night. Coffee addict ☕',
      'Hey! I\'m a {profession} who loves {interest}. Let\'s connect!',
      'Just a {profession} trying to make the world better. Ask me about {interest}!'
    ],
    creative: [
      '{profession} / {interest} / daydreamer. Creating things that matter.',
      'Imagination is my playground – {profession} & {interest} enthusiast.',
      'Crafting stories as a {profession}, finding inspiration in {interest}.'
    ],
    witty: [
      '{profession} (no, I don\'t fix printers). {interest} enthusiast.',
      '{profession}. {interest}. Fluent in sarcasm and coffee.',
      'I put the "pro" in {profession} and the "fun" in {interest}.'
    ]
  };

  // ✅ Templates (Pro Only)
  const proTemplates = {
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
    { prof: 'Маркетолог', int: 'путешествия', plat: 'linkedin', tone: 'professional', bio: 'Маркетолог | страстный путешественник | создаю кампании, которые вдохновляют' },
    { prof: 'Разработчик', int: 'фотография', plat: 'instagram', tone: 'creative', bio: 'Кодер по будням, фотограф по выходным 📸✨' },
    { prof: 'Дизайнер', int: 'шахматы', plat: 'twitter', tone: 'witty', bio: 'Дизайнер, который думает на 3 хода вперёд ♟️' },
    { prof: 'HR-специалист', int: 'йога', plat: 'telegram', tone: 'friendly', bio: 'Помогаю людям найти работу и внутренний баланс 🧘‍♀️' },
    { prof: 'Менеджер', int: 'кулинария', plat: 'tiktok', tone: 'creative', bio: 'Управляю проектами и рецептами — всё должно быть идеально смешано! 👨‍' },
    { prof: 'Аналитик', int: 'чтение', plat: 'linkedin', tone: 'professional', bio: 'Вижу паттерны в данных и книгах. Мой следующий инсайт — твоя идея.' }
  ];

  // Core Logic
  function generateBio() {
    const prof = els.profession.value.trim() || 'Профессионал';
    const int = els.interest.value.trim() || 'развитие';
    const platform = document.querySelector('input[name="platform"]:checked').value;
    const tone = els.tone.value;

    // ✅ ПРОВЕРКА: Если выбран Pro-тон, но нет активации
    const proTones = ['mysterious', 'inspiring', 'humorous'];
    if (proTones.includes(tone) && !isPro()) {
      els.modal.classList.remove('hidden'); // Показываем окно оплаты
      return null; // Прерываем генерацию
    }

    // Выбираем правильный пул шаблонов
    let pool;
    if (proTones.includes(tone)) {
      pool = proTemplates[tone]; // Берем Pro-шаблоны
    } else {
      pool = templates[tone] || templates.friendly; // Берем обычные
    }

    const template = pool[Math.floor(Math.random() * pool.length)];
    let bio = template.replace(/\{profession\}/g, prof).replace(/\{interest\}/g, int);

    // Добавляем эмодзи платформы
    const emojis = platformEmojis[platform];
    if (emojis && emojis.length > 0) {
      bio += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
    }

    return bio;
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

  function saveToHistory(bio) {
    const history = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]');
    history.unshift({ bio, date: new Date().toLocaleString('ru-RU') });
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
        els.profession.scrollIntoView({ behavior: 'smooth' });
      });
      
      els.examplesGrid.appendChild(card);
    });
  }

  // ✅ ОБНОВЛЕННАЯ ФУНКЦИЯ UI
  function updateUI() {
    checkDateReset();
    const remaining = FREE_LIMIT - getCount(STORAGE_TODAY);
    
    if (isPro()) {
      if (els.watermark) els.watermark.style.display = 'none';
      if (els.proStatus) els.proStatus.textContent = 'Pro';
      els.hint.innerHTML = '🚀 <b>Pro активирован</b> (безлимит)';
      
      // ✅ РАЗБЛОКИРУЕМ PRO-ОПЦИИ В СПИСКЕ
      document.querySelectorAll('.pro-option').forEach(opt => {
        opt.disabled = false;
        // Убираем пометку (Pro) для красоты, если хочешь
        // opt.textContent = opt.textContent.replace(' (Pro)', ''); 
      });

    } else {
      if (els.watermark) els.watermark.style.display = 'block';
      if (els.proStatus) els.proStatus.textContent = 'Free';
      els.hint.innerHTML = `Бесплатно: ${Math.max(0, remaining)} генераций. <a href="https://t.me/send?start=IVZFVmyUqKMc" target="_blank">Получить Pro</a>`;
      
      // ✅ БЛОКИРУЕМ PRO-ОПЦИИ
      document.querySelectorAll('.pro-option').forEach(opt => {
        opt.disabled = true;
      });
    }
    updateStats();
  }

  // Event Handlers
  function handleGenerate() {
    const bio = generateBio();
    if (!bio) return; // Если bio null (показали модалку), прерываем

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
    updateUI();
    
    setTimeout(() => els.result.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  // Init
  els.generate.addEventListener('click', handleGenerate);
  els.regenerate.addEventListener('click', handleGenerate);
  
  els.copy.addEventListener('click', () => {
    navigator.clipboard.writeText(els.output.textContent).then(() => {
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

  // ✅ ПРОВЕРКА СЕКРЕТНОГО КЛЮЧА АКТИВАЦИИ
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
