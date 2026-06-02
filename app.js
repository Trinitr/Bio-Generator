(function () {
  'use strict';

  const STORAGE_TODAY = 'bioGenTodayCount';
  const STORAGE_TOTAL = 'bioGenTotalCount';
  const STORAGE_DATE = 'bioGenDate';
  const STORAGE_PRO = 'bioGenPro';
  const STORAGE_HISTORY = 'bioGenHistory';
  const FREE_LIMIT = 3;

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

  // Templates
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

  const platformEmojis = {
    linkedin: '',
    instagram: ['📸', '✨', '💫'],
    twitter: '',
    telegram: '',
    tiktok: ['🎵', '🔥', '💃']
  };

  const hashtagMap = {
    маркетолог: ['#маркетинг', '#SMM', '#контент', '#бренд'],
    разработчик: ['#coding', '#dev', '#IT', '#программирование'],
    дизайнер: ['#design', '#UX', '#UI', '#творчество'],
    менеджер: ['#менеджмент', '#лидерство', '#projects', '#agile']
  };

  // Core Logic
  function generateBio() {
    const prof = els.profession.value.trim() || 'Профессионал';
    const int = els.interest.value.trim() || 'развитие';
    const platform = document.querySelector('input[name="platform"]:checked').value;
    const tone = els.tone.value;

    const pool = templates[tone] || templates.friendly;
    const template = pool[Math.floor(Math.random() * pool.length)];
    let bio = template.replace(/\{profession\}/g, prof).replace(/\{interest\}/g, int);

    // Add emoji for specific platforms
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
    return tags.slice(0, 8).join(' ');
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

  function updateUI() {
    checkDateReset();
    const remaining = FREE_LIMIT - getCount(STORAGE_TODAY);
    
    if (isPro()) {
      els.watermark.style.display = 'none';
      els.hint.innerHTML = '🚀 <b>Pro активирован</b> (безлимит)';
    } else {
      els.watermark.style.display = 'block';
      els.hint.innerHTML = `Бесплатно: ${Math.max(0, remaining)} генераций. <a href="https://t.me/send?start=IVZFVmyUqKMc" target="_blank">Получить Pro</a>`;
    }
    updateStats();
  }

  // Event Handlers
  function handleGenerate() {
    if (!els.profession.value.trim()) {
      alert('Введите профессию');
      return;
    }

    checkDateReset();
    if (!isPro() && getCount(STORAGE_TODAY) >= FREE_LIMIT) {
      els.modal.classList.remove('hidden');
      return;
    }

    const bio = generateBio();
    els.output.textContent = bio;
    els.result.classList.remove('hidden');
    els.hashtagOutput.classList.add('hidden');
    
    // Update counters
    localStorage.setItem(STORAGE_TODAY, getCount(STORAGE_TODAY) + 1);
    localStorage.setItem(STORAGE_TOTAL, getCount(STORAGE_TOTAL) + 1);
    saveToHistory(bio);
    updateUI();
    
    // Scroll to result
    els.result.scrollIntoView({ behavior: 'smooth' });
  }

  // Init
  els.generate.addEventListener('click', handleGenerate);
  els.regenerate.addEventListener('click', handleGenerate);
  
  els.copy.addEventListener('click', () => {
    navigator.clipboard.writeText(els.output.textContent);
    alert('Скопировано!');
  });

  els.downloadImg.addEventListener('click', async () => {
    if (typeof html2canvas !== 'undefined') {
      const canvas = await html2canvas(els.result, { backgroundColor: null });
      const link = document.createElement('a');
      link.download = 'bio.png';
      link.href = canvas.toDataURL();
      link.click();
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

  // Platform selection visual
  els.platformRadios.forEach(r => {
    r.addEventListener('change', () => {
      document.querySelectorAll('.platform-card').forEach(c => c.classList.remove('selected'));
      r.parentElement.classList.add('selected');
    });
  });

  // Check URL for Pro activation
  if (new URLSearchParams(window.location.search).get('pro') === 'activated') {
    localStorage.setItem(STORAGE_PRO, 'true');
    window.history.replaceState({}, '', window.location.pathname);
    alert('Pro активирован!');
  }

  // Initial render
  updateUI();
  renderHistory();
})();
