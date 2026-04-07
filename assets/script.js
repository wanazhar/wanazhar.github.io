const featuredContainer = document.querySelector('#featured-projects');
const archiveContainer = document.querySelector('#archive-projects');
const searchInput = document.querySelector('#repo-search');
const toggleArchiveButton = document.querySelector('#toggle-archive');

const featuredProjects = [
  {
    name: 'AI Seeker',
    url: 'https://aiseeker.vercel.app',
    label: 'AI resume optimizer',
    description: 'An AI-powered resume workshop focused on ATS-friendly rewrites, sharper positioning, and privacy-conscious usage with your own API key.',
    accent: 'lime'
  },
  {
    name: 'Festivities',
    url: 'https://festivities.vercel.app',
    label: 'Muslim lifestyle companion',
    description: 'A Malaysian Muslim companion for prayer times, Quran reading, halal discovery, mosque lookup, Qibla direction, and daily utility tools.',
    accent: 'cyan'
  },
  {
    name: 'IDONTLIKEPDF',
    url: 'https://idontlikepdf.vercel.app',
    label: 'Private PDF toolkit',
    description: 'A polished browser-first PDF workstation for merging, splitting, compressing, converting, and editing documents without shipping files to a server.',
    accent: 'pink'
  },
  {
    name: 'CADBMS',
    url: 'https://cadbms.vercel.app',
    label: 'Corporate action ops',
    description: 'A focused dashboard for corporate action workflows: search, calendar review, data ingestion, and operational tracking in one place.',
    accent: 'yellow'
  },
  {
    name: 'PythonAnywhere Lab',
    url: 'https://wanazhar.pythonanywhere.com',
    label: 'Legacy web experiment',
    description: 'The older live playground and lightweight deployment lane — a scrappier snapshot of the document-tool era before the newer polished builds.',
    accent: 'red'
  }
];

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

function featuredProjectCard(project) {
  return `
    <article class="repo-card live-card accent-${escapeHtml(project.accent || 'cyan')}">
      <span class="card-kicker">LIVE APP</span>
      <h3>${escapeHtml(project.name)}</h3>
      <p class="project-label">${escapeHtml(project.label)}</p>
      <p>${escapeHtml(project.description)}</p>
      <div class="repo-actions">
        <a class="repo-link secondary" href="${escapeHtml(project.url)}" target="_blank" rel="noreferrer">OPEN SITE</a>
      </div>
    </article>
  `;
}

function repoCard(repo, compact = false) {
  const description = repo.description || 'No description available.';
  const homepageLink = repo.homepage
    ? `<a class="repo-link secondary" href="${escapeHtml(repo.homepage)}" target="_blank" rel="noreferrer">LIVE</a>`
    : '';

  return `
    <article class="repo-card${compact ? ' compact-card' : ''}">
      <span class="card-kicker">REPO</span>
      <h3>${escapeHtml(repo.name)}</h3>
      <p>${escapeHtml(description)}</p>
      <div class="repo-meta">
        <span class="repo-tag lang">${escapeHtml(repo.language || 'misc')}</span>
        <span class="repo-tag stars">★ ${repo.stargazers_count}</span>
        <span class="repo-tag updated">updated ${escapeHtml(formatDate(repo.updated_at))}</span>
      </div>
      <div class="repo-actions">
        <a class="repo-link" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noreferrer">SOURCE</a>
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
    container.innerHTML = '<div class="empty-card">No repositories matched your search.</div>';
    return;
  }

  container.innerHTML = repos.map((repo) => repoCard(repo, compact)).join('');
}

function sortArchiveRepos(repos) {
  return [...repos].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

renderFeaturedProjects();

fetch('https://api.github.com/users/wanazhar/repos?per_page=100&sort=updated')
  .then((response) => {
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    return response.json();
  })
  .then((repos) => {
    const publicRepos = repos.filter((repo) => !repo.private);
    const archiveRepos = sortArchiveRepos(publicRepos);

    renderRepoList(archiveContainer, archiveRepos, true);

    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        const query = event.target.value.trim().toLowerCase();
        const filtered = archiveRepos.filter((repo) => {
          const haystack = [repo.name, repo.description, repo.language]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          return haystack.includes(query);
        });
        renderRepoList(archiveContainer, filtered, true);
      });
    }

    if (toggleArchiveButton && archiveContainer) {
      toggleArchiveButton.addEventListener('click', () => {
        const isHidden = archiveContainer.hasAttribute('hidden');
        if (isHidden) {
          archiveContainer.removeAttribute('hidden');
          toggleArchiveButton.textContent = 'HIDE REPOS';
        } else {
          archiveContainer.setAttribute('hidden', 'hidden');
          toggleArchiveButton.textContent = 'SHOW REPOS';
        }
      });
    }
  })
  .catch((error) => {
    if (archiveContainer) {
      archiveContainer.innerHTML = `<div class="error-card">Unable to load repositories right now: ${escapeHtml(error.message)}.</div>`;
    }
  });
