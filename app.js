// app.js – Bio Generator
(function () {
  const STORAGE_KEY = 'bioGenToday';
  const DATE_KEY = 'bioGenDate';
  const PRO_KEY = 'bioGenPro';
  const FREE_LIMIT = 3;

  const professionInput = document.getElementById('profession');
  const interestInput = document.getElementById('interest');
  const toneSelect = document.getElementById('tone');
  const generateBtn = document.getElementById('generate');
  const resultDiv = document.getElementById('result');
  const bioOutput = document.getElementById('bio-output');
  const copyBtn = document.getElementById('copy');
  const anotherBtn = document.getElementById('another');
  const upgradeLink = document.getElementById('upgrade-link');
  const upgradeModal = document.getElementById('upgrade-modal');
  const buyBtn = document.getElementById('buy-pro');
  const closeModal = document.querySelector('.close');
  const watermark = document.getElementById('watermark');

  // Helper: check if Pro
  function isPro() {
    return localStorage.getItem(PRO_KEY) === 'true';
  }

  // Helper: get today string
  function todayStr() {
    return new Date().toISOString().slice(0,10);
  }

  // Helper: get free used
  function getUsedToday() {
    const date = localStorage.getItem(DATE_KEY);
    if (date !== todayStr()) {
      localStorage.setItem(DATE_KEY, todayStr());
      localStorage.setItem(STORAGE_KEY, '0');
      return 0;
    }
    return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  }

  function incrementUsed() {
    const used = getUsedToday();
    localStorage.setItem(STORAGE_KEY, used + 1);
  }

  function canGenerate() {
    if (isPro()) return true;
    return getUsedToday() < FREE_LIMIT;
  }

  // Template engine
  const templates = {
    professional: [
      '{profession} | building {interest} | helping others grow | consistently delivering results | driven by curiosity | investing in ideas that matter',
      '{profession} specializing in {interest} – turning complexity into clarity. Open to collaborations and interesting projects.',
      'Currently: {profession} with a passion for {interest}. Past: solving problems at scale. Always learning, always shipping.',
    ],
    friendly: [
      '{profession} by day, {interest} by night. I love meeting people who make things happen | coffee addict | bookworm | world explorer 🌍',
      'Hey there! I’m a {profession} who loves {interest}. Let’s connect and make something awesome together!',
      'Just a {profession} trying to make the world a little bit better. Ask me about {interest}!',
    ],
    creative: [
      '{profession} / {interest} / daydreamer. I create things that make you stop, think, and smile.',
      'Imagination is my playground – {profession} & {interest} enthusiast. Exploring the intersection of art and technology.',
      'Crafting stories as a {profession} and finding inspiration in {interest}. Every day is a blank canvas.',
    ],
    witty: [
      '{profession} (no, I don’t fix printers). {interest} enthusiast and professional overthinker. My keyboard has seen things.',
      '{profession}. {interest}. I’d tell you a AI joke, but the response time is too slow.',
      'Fluent in {profession}, comfortable with {interest}, and bilingual in sarcasm. Productivity is my cardio.',
    ],
  };

  // Additional templates for Pro (more creative, unique)
  const proTemplates = {
    mysterious: [
      '{profession} | {interest} | I know what you did last summer. Just kidding… or am I? 👀',
      'Don’t let the {profession} fool you – I’m really here for the {interest} and the coffee.',
      'Sometimes {profession}. Always {interest}. Never ordinary.',
    ],
    inspiring: [
      '{profession} on a mission to make {interest} accessible to everyone. Join me and let’s create lasting impact.',
      'I believe {interest} can change the world. As a {profession}, I’m building that future, one step at a time.',
      'Do what you love, love what you do. {profession} | {interest} | changing lives through dedication and passion.',
    ],
    concise: [
      '{profession} ~ {interest}',
      '{profession} | {interest} | just enough.',
      '{profession} | {interest} | less is more.',
    ],
  };

  // Generate random bio
  function generateBio() {
    const prof = professionInput.value.trim() || 'Professional';
    const int = interestInput.value.trim() || 'growth';
    const tone = toneSelect.value;

    let pool;
    if (tone === 'pro_professional' || tone === 'pro_inspiring' || tone === 'pro_concise') {
      if (!isPro()) return '⭐ Upgrade to Pro to unlock this tone!';
      const key = tone.replace('pro_', '');
      pool = proTemplates[key] || templates.professional;
    } else {
      pool = templates[tone] || templates.friendly;
    }

    const template = pool[Math.floor(Math.random() * pool.length)];
    let bio = template
      .replace(/\{profession\}/g, prof)
      .replace(/\{interest\}/g, int);
    return bio;
  }

  function updateUI() {
    if (isPro()) {
      watermark.textContent = '';
      upgradeLink.textContent = 'Pro активирован';
      upgradeLink.style.pointerEvents = 'none';
      upgradeLink.style.color = '#48bb78';
    } else {
      watermark.textContent = 'Bio Generator Free';
      upgradeLink.textContent = 'Получить Pro';
      upgradeLink.style.pointerEvents = 'auto';
      upgradeLink.style.color = '#4299e1';
    }
  }

  function showResult(bio) {
    resultDiv.classList.remove('hidden');
    bioOutput.textContent = bio;
    if (!isPro()) {
      const used = getUsedToday();
      upgradeLink.parentElement.textContent = `Осталось генераций сегодня: ${FREE_LIMIT - used}. `;
      upgradeLink.parentElement.appendChild(upgradeLink);
    }
  }

  function handleGenerate() {
    if (!canGenerate()) {
      alert('Вы исчерпали лимит бесплатных генераций на сегодня. Перейдите на Pro для безлимита!');
      upgradeModal.style.display = 'flex';
      return;
    }
    const bio = generateBio();
    if (bio.startsWith('⭐')) {
      upgradeModal.style.display = 'flex';
      return;
    }
    incrementUsed();
    showResult(bio);
  }

  generateBtn.addEventListener('click', handleGenerate);

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(bioOutput.textContent).then(() => {
      alert('Bio скопировано!');
    });
  });

  anotherBtn.addEventListener('click', handleGenerate);

  upgradeLink.addEventListener('click', (e) => {
    e.preventDefault();
    upgradeModal.style.display = 'flex';
  });

  closeModal.addEventListener('click', () => {
    upgradeModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === upgradeModal) {
      upgradeModal.style.display = 'none';
    }
  });

  buyBtn.addEventListener('click', () => {
    // Replace YOUR_GUMROAD_PRODUCT_LINK with actual product link
    window.open('https://gumroad.com/l/bio-generator-pro', '_blank');
    // After purchase, user returns and enters their token manually? For simplicity, we set isPro after a redirect.
    // In a real implementation, after Gumroad purchase, redirect back with ?pro=true query param.
    // For now, we simulate: set a helpful note to refresh after purchase.
    alert('После оплаты вы будете перенаправлены сюда. Нажмите "Проверить" на странице благодарности, чтобы активировать Pro.');
  });

  // Check URL params for pro activation (after Gumroad redirect)
  function checkUrlForPro() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('pro') === 'true') {
      localStorage.setItem(PRO_KEY, 'true');
      updateUI();
      alert('Pro активирован! Спасибо за покупку.');
      window.history.replaceState({}, document.title, '/');
    }
  }

  checkUrlForPro();
  updateUI();

  // Set initial state
  if (!isPro()) {
    const remaining = FREE_LIMIT - getUsedToday();
    if (remaining > 0) {
      generateBtn.textContent = `Сгенерировать (осталось ${remaining})`;
    }
  }
})();
