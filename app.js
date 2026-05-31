(function () {
  'use strict';

  const STORAGE_TODAY = 'bioGenTodayCount';
  const STORAGE_TOTAL = 'bioGenTotalCount';
  const STORAGE_DATE = 'bioGenDate';
  const STORAGE_PRO = 'bioGenPro';
  const STORAGE_HISTORY = 'bioGenHistory';
  const STORAGE_API_KEY='***';
  const FREE_LIMIT = 3;

  const professionInput = document.getElementById('profession');
  const interestInput = document.getElementById('interest');
  const platformRadios = document.querySelectorAll('input[name="platform"]');
  const toneSelect = document.getElementById('tone');
  const lengthSelect = document.getElementById('length');
  const generateBtn = document.getElementById('generate');
  const resultDiv = document.getElementById('result');
  const bioOutput = document.getElementById('bio-output');
  const copyBtn = document.getElementById('copy');
  const regenerateBtn = document.getElementById('regenerate');
  const anotherBtn = regenerateBtn; // alias
  const downloadImgBtn = document.getElementById('download-img');
  const emailBtn = document.getElementById('email-btn');
  const generateHashtagsBtn = document.getElementById('generate-hashtags');
  const hashtagOutput = document.getElementById('hashtag-output');
  const upgradeLink = document.getElementById('hint-text');
  const upgradeModal = document.getElementById('upgrade-modal');
  const buyProBtn = document.getElementById('buy-pro');
  const closeModal = document.querySelector('.close');
  const watermark = document.getElementById('watermark');
  const statsToday = document.getElementById('today-count');
  const statsTotal = document.getElementById('total-count');
  const examplesGrid = document.getElementById('examples-grid');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history');
  const spinner = document.getElementById('spinner');
  const apiKeyModal = document.getElementById('apikey-modal');
  const apiKeyInput = document.getElementById('api-key-input');
  const saveApiKeyBtn = document.getElementById('save-api-key');
  const apiKeyClose = document.querySelector('.apikey-close');

  const isPro = () => localStorage.getItem(STORAGE_PRO) === 'true';
  const todayStr = () => new Date().toISOString().slice(0, 10);
  const openModal = (modal) => { modal.style.display = 'flex'; };
  const closeModalFn = (modal) => { modal.style.display = 'none'; };

  function getTodayCount() {
    const date = localStorage.getItem(STORAGE_DATE);
    if (date !== todayStr()) {
      localStorage.setItem(STORAGE_DATE, todayStr());
      localStorage.setItem(STORAGE_TODAY, '0');
      return 0;
    }
    return parseInt(localStorage.getItem(STORAGE_TODAY) || '0', 10);
  }

  function getTotalCount() {
    return parseInt(localStorage.getItem(STORAGE_TOTAL) || '0', 10);
  }

  function incrementToday() {
    localStorage.setItem(STORAGE_TODAY, getTodayCount() + 1);
    updateStats();
  }

  function incrementTotal() {
    localStorage.setItem(STORAGE_TOTAL, getTotalCount() + 1);
    updateStats();
  }

  function updateStats() {
    statsToday.textContent = getTodayCount();
    statsTotal.textContent = getTotalCount();
  }

  function addToHistory(bioObj) {
    const history = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]');
    history.unshift(bioObj);
    if (history.length > 20) history.pop();
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history));
    renderHistory();
  }

  // Templates
  const templates = {
    professional: [
      '{profession} | building {interest} | helping others grow | consistently delivering results | driven by curiosity | investing in ideas that matter',
      '{profession} specializing in {interest} – turning complexity into clarity. Open to collaborations and interesting projects.',
      'Currently: {profession} with a passion for {interest}. Past: solving problems at scale. Always learning, always shipping.',
    ],
    friendly: [
      '{profession} by day, {interest} by night. I love meeting people who make things happen | coffee addict | bookworm | world explorer 🌍',
      'Hey there! I'm a {profession} who loves {interest}. Let's connect and make something awesome together!',
      'Just a {profession} trying to make the world a little bit better. Ask me about {interest}!',
    ],
    creative: [
      '{profession} / {interest} / daydreamer. I create things that make you stop, think, and smile.',
      'Imagination is my playground – {profession} & {interest} enthusiast. Exploring the intersection of art and technology.',
      'Crafting stories as a {profession} and finding inspiration in {interest}. Every day is a blank canvas.',
    ],
    witty: [
      '{profession} (no, I don\'t fix printers). {interest} enthusiast and professional overthinker. My keyboard has seen things.',
      '{profession}. {interest}. I\'d tell you a AI joke, but the response time is too slow.',
      'Fluent in {profession}, comfortable with {interest}, and bilingual in sarcasm. Productivity is my cardio.',
    ],
  };

  const proTemplates = {
    mysterious: [
      '{profession} | {interest} | I know what you did last summer. Just kidding… or am I? 👀',
      'Don\'t let the {profession} fool you – I\'m really here for the {interest} and the coffee.',
      'Sometimes {profession}. Always {interest}. Never ordinary.',
    ],
    inspiring: [
      '{profession} on a mission to make {interest} accessible to everyone. Join me and let\'s create lasting impact.',
      'I believe {interest} can change the world. As a {profession}, I\'m building that future, one step at a time.',
      'Do what you love, love what you do. {profession} | {interest} | changing lives through dedication and passion.',
    ],
    humorous: [
      'Why did the {profession} cross the road? To get to the {interest} on the other side!',
      '{profession} by trade, {interest} by passion. My resume is weird but my skills are real.',
      'I put the "pro" in {profession} and the "fun" in {interest}.',
    ],
  };

  const platformAdjustments = {
    linkedin: { toneBias: 'professional', addEmoji: false },
    instagram: { toneBias: 'creative', addEmoji: true, emojis: ['📸', '✨', '💫'] },
    twitter: { toneBias: 'witty', maxLength: 80, addEmoji: false },
    telegram: { toneBias: 'friendly', addEmoji: false },
    tiktok: { toneBias: 'creative', addEmoji: true, emojis: ['🎵', '', '💃'] },
  };

  const examples = [
    { profession: 'Маркетолог', interest: 'путешествия', platform: 'linkedin', tone: 'professional', length: 'medium', bio: 'Маркетолог | страстный путешественник | создаю кампании, которые вдохновляют на приключения' },
    { profession: 'Разработчик', interest: 'фотография', platform: 'instagram', tone: 'creative', length: 'short', bio: 'Кодер по будням, фотограф по выходным 📸✨' },
    { profession: 'Дизайнер', interest: 'шахматы', platform: 'twitter', tone: 'witty', length: 'short', bio: 'Дизайнер, который думает на 3 хода вперёд ♟️' },
    { profession: 'HR-специалист', interest: 'йога', platform: 'telegram', tone: 'friendly', length: 'medium', bio: 'Помогаю людям найти работу и внутренний баланс 🧘‍♀️' },
    { profession: 'Менеджер проектов', interest: 'кулинария', platform: 'tiktok', tone: 'creative', length: 'medium', bio: 'Управляю проектами и рецептами — всё должно быть идеально смешано! 👨‍' },
    { profession: 'Учитель', interest: 'чтение', platform: 'linkedin', tone: 'professional', length: 'long', bio: 'Учитель с 10-летним опытом, верящий, что каждая книга открывает новый мир. Стремлюсь вдохновить учеников на любовь к знаниям на всю жизнь.' },
    { profession: 'Психолог', interest: 'стихосложение', platform: 'instagram', tone: 'creative', length: 'short', bio: 'Слушаю твоё сердце и рифмую твои мысли 💬' },
    { profession: 'Аналитик данных', interest: 'шахматы', platform: 'twitter', tone: 'witty', length: 'short', bio: 'Вижу паттерны в данных и на доске. Мой следующий ход — твой инсайт.' },
  ];

  const hashtagMap = {
    маркетолог: ['#маркетинг', '#SMM', '#контент', '#бренд', '#реклама', '#target', '#аналитика', '#стратегия'],
    разработчик: ['#разработка', '#coding', '#программирование', '#IT', '#dev', '#frontend', '#backend', '#fullstack'],
    дизайнер: ['#дизайн', '#UX', '#UI', '#графика', '#творчество', '#Adobe', '#Figma', '#логотип'],
    учитель: ['#образование', '#преподавание', '#школа', '#студент', '#знания', '#педагог', '#обучение', '#класс'],
    психолог: ['#психология', '#терапия', '#ментальное_здоровье', '#консультирование', '#самопознание', '#эмоции', '#стресс', '#мотивация'],
    аналитик: ['#анализ', '#данные', '#статистика', '#отчеты', '#BI', '#SQL', '#Python', '#аналитик'],
    менеджер: ['#менеджмент', '#лидерство', '#проекты', '#команда', '#agile', '#scrum', '#KPI', '#организация'],
    hr: ['#HR', '#рекрутинг', '#подбор_персонала', '#кадры', '#онбординг', '#бренд_работодателя', '#адаптация', '#трудовое_право'],
  };

  function generateHashtags(prof, interest) {
    const tags = new Set();
    const proc = prof.toLowerCase().trim();
    const intc = interest.toLowerCase().trim();
    if (hashtagMap[proc]) hashtagMap[proc].forEach(t => tags.add(t));
    if (intc) {
      intc.split(/\s+/).forEach(w => {
        if (w.length > 2) tags.add('#' + w);
      });
    }
    if (tags.size === 0) {
      tags.add('#профессионал'); tags.add('#карьера'); tags.add('#вдохновение');
    }
    return Array.from(tags).slice(0, 12).join(' ');
  }

  function generateFromTemplate() {
    const prof = professionInput.value.trim() || 'Профессионал';
    const int = interestInput.value.trim() || 'развитие';
    const platform = document.querySelector('input[name="platform"]:checked').value;
    const tone = toneSelect.value;
    const adj = platformAdjustments[platform] || {};

    let pool = templates[tone] || templates.friendly;
    if (!pool) pool = templates.friendly;

    const template = pool[Math.floor(Math.random() * pool.length)];
    let bio = template.replace(/\{profession\}/g, prof).replace(/\{interest\}/g, int);

    if (adj.addEmoji) {
      const emojis = adj.emojis || ['✨'];
      if (!emojis.some(e => bio.includes(e))) {
        bio += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
      }
    }
    if (adj.maxLength && bio.length > adj.maxLength) {
      bio = bio.slice(0, adj.maxLength - 1) + '…';
    }
    return bio;
  }

  async function generateWithChatGPT() {
    const prof = professionInput.value.trim() || 'Профессионал';
    const int = interestInput.value.trim() || 'развитие';
    const platform = document.querySelector('input[name="platform"]:checked').value;
    const tone = toneSelect.value;
    const length = lengthSelect.value;
    const apiKey = localStorage.getItem(STORAGE_API_KEY) || '';

    if (!apiKey) { openModal(apiKeyModal); return null; }

    const prompt = `Создай креативное био для ${platform}.
Профессия: ${prof}
Хобби: ${int}
Тон: ${tone}
Длина: ${length}
Язык: русский и английский (два варианта)`;

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 150,
        }),
      });
      if (!res.ok) throw new Error('API error: ' + res.status);
      const data = await res.json();
      const content = data.choices[0].message.content.trim();
      return content.split('\n')[0];
    } catch (err) {
      console.error('ChatGPT error:', err);
      alert('Не удалось связаться с OpenAI. Проверьте API ключ и соединение.');
      return null;
    }
  }

  function updateUI() {
    if (isPro()) {
      watermark.textContent = '';
      upgradeLink.innerHTML = 'Бесплатно: 3 генерации в день. <a id="upgrade-link" href="#">Pro активирован ✅</a>';
      document.querySelectorAll('.pro-option').forEach(o => o.disabled = false);
    } else {
      watermark.textContent = 'Создано с Bio Generator Free';
      upgradeLink.innerHTML = 'Бесплатно: 3 генерации в день. <a id="upgrade-link" href="#">Получить Pro</a>';
      document.querySelectorAll('.pro-option').forEach(o => {
        o.disabled = true;
        if (o.selected) toneSelect.value = 'friendly';
      });
    }
    platformRadios.forEach(r => r.parentElement.classList.toggle('selected', r.checked));
    updateStats();
  }

  function showResult(bio) {
    resultDiv.classList.remove('hidden');
    bioOutput.textContent = bio;
    hashtagOutput.classList.add('hidden');
    hashtagOutput.textContent = '';

    const remaining = FREE_LIMIT - getTodayCount();
    if (isPro()) {
      upgradeLink.innerHTML = 'Бесплатно: 3 генерации в день. <a id="upgrade-link" href="#">Pro активирован ✅</a>';
    } else {
      upgradeLink.innerHTML = `Бесплатно: ${remaining > 0 ? remaining : 0} генераций сегодня. <a id="upgrade-link" href="#">Получить Pro</a>`;
    }
  }

  async function handleGenerate() {
    if (!professionInput.value.trim()) {
      alert('Пожалуйста, введите профессию');
      professionInput.focus();
      return;
    }
    if (!isPro() && getTodayCount() >= FREE_LIMIT) {
      alert('Вы исчерпали бесплатные генерации на сегодня. Перейдите на Pro для безлимита!');
      openModal(upgradeModal);
      return;
    }

    resultDiv.classList.add('hidden');
    openModal(spinner);

    let bio = null;
    if (isPro()) {
      bio = await generateWithChatGPT();
    }
    if (!bio) {
      bio = generateFromTemplate();
      if (!bio) {
        closeModalFn(spinner);
        return;
      }
    }

    closeModalFn(spinner);
    incrementToday();
    incrementTotal();
    addToHistory({
      bio,
      platform: document.querySelector('input[name="platform"]:checked').value,
      tone: toneSelect.value,
      profession: professionInput.value.trim(),
      interest: interestInput.value.trim(),
      timestamp: new Date().toISOString(),
    });
    showResult(bio);
  }

  async function copyBio() {
    try {
      await navigator.clipboard.writeText(bioOutput.textContent);
      alert('Био скопировано в буфер обмена!');
    } catch {
      alert('Не удалось скопировать. Выделите текст вручную.');
    }
  }

  async function downloadImage() {
    const el = document.querySelector('.result-card');
    if (!el) return;
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false });
      const link = document.createElement('a');
      link.download = 'bio-generator.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('Не удалось создать изображение. Проверьте загрузку html2canvas.');
    }
  }

  function emailBio() {
    alert('Функция отправки на email будет доступна в следующих версиях. Пока скопируйте био вручную.');
  }

  function handleGenerateHashtags() {
    const prof = professionInput.value.trim() || 'Профессионал';
    const int = interestInput.value.trim() || 'развитие';
    const tags = generateHashtags(prof, int);
    hashtagOutput.textContent = tags;
    hashtagOutput.classList.remove('hidden');
  }

  function renderExamples() {
    examplesGrid.innerHTML = '';
    examples.forEach((ex) => {
      const div = document.createElement('div');
      div.className = 'example-card';
      div.innerHTML = '<p>' + ex.bio + '</p>';
      div.addEventListener('click', () => {
        professionInput.value = ex.profession;
        interestInput.value = ex.interest;
        const radio = document.querySelector('input[name="platform"][value="' + ex.platform + '"]');
        if (radio) radio.checked = true;
        toneSelect.value = ex.tone;
        lengthSelect.value = ex.length;
        platformRadios.forEach(r => r.parentElement.classList.toggle('selected', r.checked));
        updateUI();
      });
      examplesGrid.appendChild(div);
    });
  }

  function renderHistory() {
    const history = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]');
    historyList.innerHTML = '';
    if (!history.length) {
      historyList.innerHTML = '<p class="empty-history">История пуста.</p>';
      return;
    }
    history.slice(0, 10).forEach((item) => {
      const div = document.createElement('div');
      div.className = 'history-item';
      const date = new Date(item.timestamp).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
      div.innerHTML = '<span class="bio-text">' + item.bio + '</span><span class="date">' + date + '</span>';
      historyList.appendChild(div);
    });
  }

  function clearHistory() {
    if (confirm('Очистить всю историю генераций?')) {
      localStorage.removeItem(STORAGE_HISTORY);
      renderHistory();
    }
  }

  function saveApiKey() {
    const key = apiKeyInput.value.trim();
    if (!key) { alert('Введите API ключ'); return; }
    localStorage.setItem(STORAGE_API_KEY, key);
    closeModalFn(apiKeyModal);
    alert('API ключ сохранён!');
  }

  function checkUrlForPro() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('pro') === 'activated') {
      localStorage.setItem(STORAGE_PRO, 'true');
      window.history.replaceState({}, document.title, window.location.pathname);
      updateUI();
      alert('Pro активирован! Спасибо за покупку.');
    }
  }

  // Event listeners
  generateBtn.addEventListener('click', handleGenerate);
  copyBtn.addEventListener('click', copyBio);
  regenerateBtn.addEventListener('click', handleGenerate);
  downloadImgBtn.addEventListener('click', downloadImage);
  emailBtn.addEventListener('click', emailBio);
  generateHashtagsBtn.addEventListener('click', handleGenerateHashtags);
  upgradeLink.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'upgrade-link') { e.preventDefault(); openModal(upgradeModal); }
  });
  closeModal.addEventListener('click', () => closeModalFn(upgradeModal));
  
  // ИСПРАВЛЕНО: Убран перехват клика на buyProBtn
  // Теперь ссылка работает напрямую из HTML
  // buyProBtn.addEventListener('click', () => { window.open('https://bazium.ru/item/ваш_товар_id', '_blank'); });
  
  window.addEventListener('click', (e) => {
    if (e.target === upgradeModal) closeModalFn(upgradeModal);
    if (e.target === apiKeyModal) closeModalFn(apiKeyModal);
  });
  saveApiKeyBtn.addEventListener('click', saveApiKey);
  apiKeyClose.addEventListener('click', () => closeModalFn(apiKeyModal));
  clearHistoryBtn.addEventListener('click', clearHistory);
  platformRadios.forEach(r => r.addEventListener('change', () => {
    platformRadios.forEach(x => x.parentElement.classList.toggle('selected', x.checked));
  }));

  checkUrlForPro();
  renderExamples();
  renderHistory();
  updateUI();
})();
