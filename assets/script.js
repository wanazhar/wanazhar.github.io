const LANG_KEY = 'play-wanazhar-lang';
const SUPPORTED_LANGS = ['ja', 'en'];

const STRINGS = {
  ja: {
    title: 'PLAY☆WANAZHAR｜ゲームとアプリの総合商店',
    metaDescription: 'wanazhar の個人商店。ブラウザゲーム・Webアプリ・実験ツールを全品0円で公開中。送料無料・24時間営業。',
    archiveToggleHide: '在庫を隠す',
    archiveToggleShow: '在庫を表示',
    archiveEmpty: '在庫が見つかりませんでした。別のキーワードをお試しください。',
    archiveError: (message) => `ただいま在庫を取得できません：${message}`,
    searchResult: (query, count) => `「${query}」の検索結果：${count}件`,
    searchAll: (count) => `全店 ${count}件の商品を表示中`,
    cartAdded: (name) => `「${name}」をカートに追加しました。お支払い合計：¥0`,
    repoKicker: 'GITHUB 商品',
    repoUpdated: (date) => `更新 ${date}`,
    repoPriceNote: '（税込・在庫あり）',
    repoSources: 'ソースを見る',
    repoLive: '公開サイト',
    repoNoDescription: '説明文は登録されていません。',
    partnerKicker: '提携ショップ',
    partnerPriceNote: '（税込・提携店価格）',
    partnerShopLink: '店舗へ ▶',
    reviews: (count) => `（${count}件のレビュー）`,
    addToCart: 'カートに入れる',
    fortunes: [
      { rank: '大吉！', text: '最高です！今日は掘削機に乗ると良いことがあります。' },
      { rank: '中吉！', text: 'なかなかの良い日。ジェットパックで空を飛びましょう。' },
      { rank: '小吉！', text: 'ふつうの幸せ。お茶を飲んでボクセルの街でも眺めて。' },
      { rank: '末吉！', text: 'あとで良くなります。ツインタワーを見上げて深呼吸。' },
      { rank: '凶！', text: 'でも全品0円なので、実質プラスです。' }
    ],
    mascotLines: [
      'いらっしゃいませ〜♪ 今日も全品0円だよ！',
      'おみくじ引いてみて？ 今日の運勢が出るよ〜',
      'カートに入れてもお会計は0円！ ふしぎ！',
      'クアラルンプール、1000万ブロックあるんだよ……',
      '23:59までタイムセール中！ 急いで〜！',
      'ミミは0円で働いてるよ。えらい？'
    ]
  },
  en: {
    title: 'PLAY☆WANAZHAR | Games & Apps General Store',
    metaDescription: "wanazhar's personal shop. Browser games, web apps, and experiments — everything ¥0 with free shipping, open 24/7.",
    archiveToggleHide: 'Hide inventory',
    archiveToggleShow: 'Show inventory',
    archiveEmpty: 'No inventory matched. Try a different keyword.',
    archiveError: (message) => `Inventory is unavailable right now: ${message}`,
    searchResult: (query, count) => `Search results for "${query}": ${count}`,
    searchAll: (count) => `Showing ${count} products storewide`,
    cartAdded: (name) => `Added "${name}" to your cart. Total: ¥0`,
    repoKicker: 'GITHUB ITEM',
    repoUpdated: (date) => `updated ${date}`,
    repoPriceNote: '(tax incl., in stock)',
    repoSources: 'View source',
    repoLive: 'Live site',
    repoNoDescription: 'No description on file.',
    partnerKicker: 'PARTNER SHOP',
    partnerPriceNote: '(tax incl., partner price)',
    partnerShopLink: 'Visit shop ▶',
    reviews: (count) => `(${count} reviews)`,
    addToCart: 'Add to cart',
    fortunes: [
      { rank: 'Great fortune!', text: 'Amazing! Driving the excavator today will bring you luck.' },
      { rank: 'Good fortune!', text: 'A solid day. Take the jetpack for a spin in the sky.' },
      { rank: 'Small fortune!', text: 'Ordinary happiness. Sip some tea and gaze at the voxel city.' },
      { rank: 'Late fortune!', text: 'It gets better later. Look up at the Twin Towers and breathe.' },
      { rank: 'Bad fortune!', text: 'But everything is ¥0, so technically you are still ahead.' }
    ],
    mascotLines: [
      'Welcome~♪ Everything is ¥0 again today!',
      'Try the omikuji? It tells your fortune~',
      'Add it to your cart — the total stays ¥0! Amazing!',
      'Kuala Lumpur has 10 million blocks, you know...',
      'Time sale until 23:59! Hurry~!',
      'Mimi works for ¥0. Impressive, right?'
    ]
  }
};

const featuredProjects = [
  {
    name: 'AI Seeker',
    url: 'https://aiseeker.vercel.app',
    accent: 'lime',
    stars: 5,
    score: '4.6',
    reviews: 203,
    label: { ja: 'AI履歴書アプリ', en: 'AI resume optimizer' },
    description: {
      ja: '自分のAPIキーで使うATS対策の履歴書リライトツール。文章の強みを磨きながら、プライバシーにも配慮した作りです。',
      en: 'An AI-powered resume workshop focused on ATS-friendly rewrites, sharper positioning, and privacy-conscious usage with your own API key.'
    }
  },
  {
    name: 'Festivities',
    url: 'https://festivities.vercel.app',
    accent: 'cyan',
    stars: 5,
    score: '4.8',
    reviews: 312,
    label: { ja: 'ムスリム生活コンパニオン', en: 'Muslim lifestyle companion' },
    description: {
      ja: '礼拝時間、クルアーン閲覧、ハラール情報、モスク検索、キブラ方位、日々の便利ツールをまとめたマレーシア発の生活アプリ。',
      en: 'A Malaysian Muslim companion for prayer times, Quran reading, halal discovery, mosque lookup, Qibla direction, and daily utility tools.'
    }
  },
  {
    name: 'IDONTLIKEPDF',
    url: 'https://idontlikepdf.vercel.app',
    accent: 'pink',
    stars: 5,
    score: '4.9',
    reviews: 388,
    label: { ja: 'プライベートPDFツール', en: 'Private PDF toolkit' },
    description: {
      ja: '結合・分割・圧縮・変換・編集まで、ファイルをサーバーに送らずブラウザだけで完結するPDFワークステーション。',
      en: 'A polished browser-first PDF workstation for merging, splitting, compressing, converting, and editing documents without shipping files to a server.'
    }
  },
  {
    name: 'CADBMS',
    url: 'https://cadbms.vercel.app',
    accent: 'yellow',
    stars: 4,
    score: '4.4',
    reviews: 77,
    label: { ja: 'コーポレートアクション管理', en: 'Corporate action ops' },
    description: {
      ja: '検索・カレンダー確認・データ取り込み・運用トラッキングを1画面にまとめた、実務向けダッシュボード。',
      en: 'A focused dashboard for corporate action workflows: search, calendar review, data ingestion, and operational tracking in one place.'
    }
  },
  {
    name: 'PythonAnywhere Lab',
    url: 'https://wanazhar.pythonanywhere.com',
    accent: 'red',
    stars: 4,
    score: '4.1',
    reviews: 54,
    label: { ja: 'レガシー実験場', en: 'Legacy web experiment' },
    description: {
      ja: '昔の公開プレイグラウンド。ドキュメントツール時代の、素朴でスクラッピーなスナップショットです。',
      en: 'The older live playground and lightweight deployment lane — a scrappier snapshot of the document-tool era before the newer polished builds.'
    }
  }
];

const featuredContainer = document.querySelector('#featured-projects');
const archiveContainer = document.querySelector('#archive-projects');
const searchInput = document.querySelector('#repo-search');
const toggleArchiveButton = document.querySelector('#toggle-archive');
const shopSearchInput = document.querySelector('#shop-search');
const shopSearchButton = document.querySelector('#shop-search-button');
const searchStatus = document.querySelector('#search-status');
const searchEmpty = document.querySelector('#search-empty');
const cartCountEl = document.querySelector('#cart-count');
const cartToast = document.querySelector('#cart-toast');
const visitorCountEl = document.querySelector('#visitor-count');
const metaDescription = document.querySelector('#meta-description');

let currentLang = 'ja';
let cartCount = 0;
let archiveRepos = [];
let archiveLoaded = false;
let archiveQuery = '';
let archiveHidden = false;
let omikujiCount = 0;
let lastFortuneIndex = null;
let mascotLineIndex = 0;

function t() {
  return STRINGS[currentLang];
}

const isDesktop = window.matchMedia('(min-width: 761px)').matches;

if (isDesktop) {
  const cursorTrail = Array.from({ length: 8 }, () => {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    document.body.appendChild(dot);
    return dot;
  });

  const kitty = document.createElement('div');
  kitty.className = 'cursor-kitty';
  kitty.innerHTML = '<span class="ear-left"></span><span class="ear-right"></span><i class="eye-left"></i><i class="eye-right"></i>';
  document.body.appendChild(kitty);

  let trailIndex = 0;
  document.addEventListener('mousemove', (event) => {
    const dot = cursorTrail[trailIndex % cursorTrail.length];
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
    kitty.style.left = `${event.clientX}px`;
    kitty.style.top = `${event.clientY}px`;
    trailIndex += 1;
  });
}

function escapeHtml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'unknown'
    : date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

function starRow(count = 5) {
  const stars = Math.max(0, Math.min(5, count));
  return `${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}`;
}

function featuredProjectCard(project) {
  const strings = t();
  const label = project.label[currentLang] || project.label.ja;
  const description = project.description[currentLang] || project.description.ja;

  return `
    <article class="product-card partner-card accent-${escapeHtml(project.accent || 'cyan')} searchable-card">
      <span class="card-kicker">${escapeHtml(strings.partnerKicker)}</span>
      <h3 class="product-title"><a href="${escapeHtml(project.url)}" target="_blank" rel="noreferrer">${escapeHtml(project.name)}</a></h3>
      <p class="project-label">${escapeHtml(label)}</p>
      <p class="product-catch">${escapeHtml(description)}</p>
      <div class="rating"><span class="stars">${starRow(project.stars)}</span> <b>${escapeHtml(project.score || '4.5')}</b> <span class="review-count">${escapeHtml(strings.reviews(project.reviews || 0))}</span></div>
      <p class="price-line"><span class="price">¥0</span> <span class="price-note">${escapeHtml(strings.partnerPriceNote)}</span></p>
      <div class="product-actions">
        <button class="pixel-button small cart-add" type="button" data-cart-item-ja="${escapeHtml(project.name)}" data-cart-item-en="${escapeHtml(project.name)}">${escapeHtml(strings.addToCart)}</button>
        <a class="repo-link secondary" href="${escapeHtml(project.url)}" target="_blank" rel="noreferrer">${escapeHtml(strings.partnerShopLink)}</a>
      </div>
    </article>
  `;
}

function repoCard(repo, compact = false) {
  const strings = t();
  const description = repo.description || strings.repoNoDescription;
  const homepageLink = repo.homepage
    ? `<a class="repo-link secondary" href="${escapeHtml(repo.homepage)}" target="_blank" rel="noreferrer">${escapeHtml(strings.repoLive)}</a>`
    : '';

  return `
    <article class="repo-card${compact ? ' compact-card' : ''}">
      <span class="card-kicker">${escapeHtml(strings.repoKicker)}</span>
      <h3><a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noreferrer">${escapeHtml(repo.name)}</a></h3>
      <p>${escapeHtml(description)}</p>
      <div class="repo-meta">
        <span class="repo-tag lang">${escapeHtml(repo.language || 'misc')}</span>
        <span class="repo-tag stars">★ ${escapeHtml(String(repo.stargazers_count))}</span>
        <span class="repo-tag updated">${escapeHtml(strings.repoUpdated(formatDate(repo.updated_at)))}</span>
      </div>
      <p class="price-line"><span class="price">¥0</span> <span class="price-note">${escapeHtml(strings.repoPriceNote)}</span></p>
      <div class="repo-actions">
        <a class="repo-link" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noreferrer">${escapeHtml(strings.repoSources)}</a>
        ${homepageLink}
      </div>
    </article>
  `;
}

function renderFeaturedProjects() {
  if (!featuredContainer) return;
  featuredContainer.innerHTML = featuredProjects.map((project) => featuredProjectCard(project)).join('');
}

function renderRepoList(container, repos, compact = false) {
  if (!container) return;

  if (!repos.length) {
    container.innerHTML = `<div class="empty-card">${escapeHtml(t().archiveEmpty)}</div>`;
    return;
  }

  container.innerHTML = repos.map((repo) => repoCard(repo, compact)).join('');
}

function sortArchiveRepos(repos) {
  return [...repos].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

function renderArchive() {
  if (!archiveContainer || !archiveLoaded) return;
  const query = archiveQuery.trim().toLowerCase();
  const filtered = query
    ? archiveRepos.filter((repo) => {
        const haystack = [repo.name, repo.description, repo.language]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      })
    : archiveRepos;
  renderRepoList(archiveContainer, filtered, true);
}

function updateArchiveToggleLabel() {
  if (!toggleArchiveButton) return;
  const strings = t();
  toggleArchiveButton.textContent = archiveHidden ? strings.archiveToggleShow : strings.archiveToggleHide;
}

function applyStaticTranslations() {
  document.querySelectorAll('[data-ja]').forEach((element) => {
    const value = element.dataset[currentLang];
    element.textContent = value === undefined ? element.dataset.ja : value;
  });
  document.querySelectorAll('[data-ja-placeholder]').forEach((element) => {
    const value = element.dataset[`${currentLang}Placeholder`];
    element.placeholder = value === undefined ? element.dataset.jaPlaceholder : value;
  });
}

function applyShopSearch() {
  const query = (shopSearchInput?.value || '').trim().toLowerCase();
  const cards = document.querySelectorAll('.searchable-card');
  let visible = 0;

  cards.forEach((card) => {
    const haystack = card.textContent.toLowerCase();
    const match = !query || haystack.includes(query);
    card.hidden = !match;
    if (match) visible += 1;
  });

  if (searchStatus) {
    const strings = t();
    searchStatus.textContent = query ? strings.searchResult(query, visible) : strings.searchAll(visible);
  }
  if (searchEmpty) {
    searchEmpty.hidden = visible !== 0;
  }
}

function bindCart() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.cart-add');
    if (!button) return;
    cartCount += 1;
    if (cartCountEl) cartCountEl.textContent = String(cartCount);
    const nameKey = currentLang === 'en' ? 'cartItemEn' : 'cartItemJa';
    const name = button.dataset[nameKey] || button.dataset.cartItemJa || '';
    showToast(t().cartAdded(name));
  });
}

function showToast(message) {
  if (!cartToast) return;
  cartToast.textContent = message;
  cartToast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => cartToast.classList.remove('show'), 2600);
}

function startVisitorCounter() {
  if (!visitorCountEl) return;
  let count = 1337 + Math.floor(Math.random() * 900);
  const render = () => {
    visitorCountEl.textContent = String(count).padStart(8, '0');
  };
  render();
  setInterval(() => {
    count += 1 + Math.floor(Math.random() * 3);
    render();
  }, 1200);
}

function startCountdown() {
  const el = document.querySelector('#countdown');
  if (!el) return;
  const render = () => {
    const now = new Date();
    const target = new Date(now);
    target.setHours(23, 59, 59, 999);
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
    const diff = Math.max(0, Math.floor((target - now) / 1000));
    const h = String(Math.floor(diff / 3600)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  };
  render();
  setInterval(render, 1000);
}

function renderFortune() {
  const resultEl = document.querySelector('#omikuji-result');
  if (!resultEl || lastFortuneIndex === null) return;
  const fortune = t().fortunes[lastFortuneIndex];
  resultEl.textContent = `${fortune.rank} ${fortune.text}`;
}

function drawOmikuji() {
  const resultEl = document.querySelector('#omikuji-result');
  const countEl = document.querySelector('#omikuji-count');
  if (!resultEl) return;
  lastFortuneIndex = Math.floor(Math.random() * t().fortunes.length);
  renderFortune();
  resultEl.classList.remove('pop');
  void resultEl.offsetWidth;
  resultEl.classList.add('pop');
  omikujiCount += 1;
  if (countEl) countEl.textContent = String(omikujiCount);
}

function renderMascotLine() {
  const el = document.querySelector('#mascot-message');
  if (!el) return;
  const lines = t().mascotLines;
  el.textContent = lines[mascotLineIndex % lines.length];
}

function bindMascot() {
  const mascot = document.querySelector('#mascot-float');
  const sayButton = document.querySelector('#mascot-say');
  const closeButton = document.querySelector('#mascot-close');
  const omikujiButton = document.querySelector('#omikuji-button');

  if (sayButton) {
    sayButton.addEventListener('click', () => {
      mascotLineIndex += 1;
      renderMascotLine();
    });
  }
  if (closeButton && mascot) {
    closeButton.addEventListener('click', () => mascot.classList.add('hidden'));
  }
  if (omikujiButton) {
    omikujiButton.addEventListener('click', drawOmikuji);
  }
}

function setLanguage(lang, { persist = true, stripUrlParam = false } = {}) {
  currentLang = SUPPORTED_LANGS.includes(lang) ? lang : 'ja';
  if (persist) {
    try { localStorage.setItem(LANG_KEY, currentLang); } catch {}
  }
  if (stripUrlParam) {
    const url = new URL(window.location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.delete('lang');
      window.history.replaceState({}, '', url);
    }
  }

  document.documentElement.lang = currentLang;
  document.title = t().title;
  if (metaDescription) metaDescription.setAttribute('content', t().metaDescription);

  document.querySelectorAll('.lang-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === currentLang);
  });

  applyStaticTranslations();
  renderFeaturedProjects();
  renderArchive();
  updateArchiveToggleLabel();
  applyShopSearch();
  renderFortune();
  renderMascotLine();
}

function initArchive(repos) {
  archiveRepos = sortArchiveRepos(repos.filter((repo) => !repo.private));
  archiveLoaded = true;
  renderArchive();
}

document.querySelectorAll('.lang-btn').forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.lang, { stripUrlParam: true }));
});

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    archiveQuery = event.target.value;
    renderArchive();
  });
}

if (toggleArchiveButton && archiveContainer) {
  toggleArchiveButton.addEventListener('click', () => {
    archiveHidden = !archiveHidden;
    if (archiveHidden) {
      archiveContainer.setAttribute('hidden', 'hidden');
    } else {
      archiveContainer.removeAttribute('hidden');
    }
    updateArchiveToggleLabel();
  });
}

if (shopSearchInput) {
  shopSearchInput.addEventListener('input', applyShopSearch);
}
if (shopSearchButton) {
  shopSearchButton.addEventListener('click', applyShopSearch);
}

const urlLang = new URLSearchParams(window.location.search).get('lang');
let storedLang = null;
try { storedLang = localStorage.getItem(LANG_KEY); } catch {}
setLanguage(urlLang || storedLang || 'ja', { persist: Boolean(urlLang) });

bindCart();
startVisitorCounter();
startCountdown();
bindMascot();

const REPOS_CACHE_KEY = 'wanazhar-repos-cache-v1';
const REPOS_CACHE_TTL = 10 * 60 * 1000;

function loadCachedRepos() {
  try {
    const raw = sessionStorage.getItem(REPOS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.timestamp || Date.now() - parsed.timestamp > REPOS_CACHE_TTL) return null;
    return parsed.repos;
  } catch { return null; }
}

function saveCachedRepos(repos) {
  try { sessionStorage.setItem(REPOS_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), repos })); } catch {}
}

const cached = loadCachedRepos();
if (cached) {
  initArchive(cached);
} else {
  fetch('https://api.github.com/users/wanazhar/repos?per_page=100&sort=updated', {
    headers: { Accept: 'application/vnd.github.v3+json' }
  })
    .then((response) => {
      if (response.status === 403) throw new Error('GitHub API rate limited — try again shortly');
      if (response.status === 404) throw new Error('GitHub user not found');
      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
      return response.json();
    })
    .then((repos) => {
      saveCachedRepos(repos);
      initArchive(repos);
    })
    .catch((error) => {
      if (archiveContainer) {
        archiveContainer.innerHTML = `<div class="error-card">${escapeHtml(t().archiveError(error.message))}</div>`;
      }
    });
}
