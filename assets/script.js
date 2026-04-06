const counterEl = document.querySelector('.counter');
const featuredContainer = document.querySelector('#featured-projects');
const archiveContainer = document.querySelector('#archive-projects');
const searchInput = document.querySelector('#repo-search');
const toggleArchiveButton = document.querySelector('#toggle-archive');

let visitCount = Number(localStorage.getItem('visitCount') || 0);
visitCount += 1;
localStorage.setItem('visitCount', String(visitCount));
if (counterEl) {
  counterEl.textContent = String(visitCount).padStart(5, '0');
}

const cursorTrail = Array.from({ length: 8 }, () => {
  const dot = document.createElement('div');
  dot.className = 'cursor-trail';
  document.body.appendChild(dot);
  return dot;
});

let trailIndex = 0;
document.addEventListener('mousemove', (event) => {
  const dot = cursorTrail[trailIndex % cursorTrail.length];
  dot.style.left = `${event.pageX}px`;
  dot.style.top = `${event.pageY}px`;
  trailIndex += 1;
});

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

function repoCard(repo, compact = false) {
  const description = repo.description || 'No description available.';
  const homepageLink = repo.homepage
    ? `<a class="repo-link secondary" href="${escapeHtml(repo.homepage)}" target="_blank" rel="noreferrer">LIVE</a>`
    : '';

  return `
    <article class="repo-card${compact ? ' compact-card' : ''}">
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

function renderRepoList(container, repos, compact = false) {
  if (!container) return;

  if (!repos.length) {
    container.innerHTML = '<div class="empty-card">No repositories matched your search.</div>';
    return;
  }

  container.innerHTML = repos.map((repo) => repoCard(repo, compact)).join('');
}

function pickFeaturedRepos(repos) {
  const blacklist = new Set(['wanazhar.github.io']);

  return repos
    .filter((repo) => !repo.fork && !blacklist.has(repo.name.toLowerCase()))
    .sort((a, b) => {
      const scoreA = (a.stargazers_count * 3) + new Date(a.updated_at).getTime();
      const scoreB = (b.stargazers_count * 3) + new Date(b.updated_at).getTime();
      return scoreB - scoreA;
    })
    .slice(0, 6);
}

function sortArchiveRepos(repos) {
  return [...repos].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

fetch('https://api.github.com/users/wanazhar/repos?per_page=100&sort=updated')
  .then((response) => {
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    return response.json();
  })
  .then((repos) => {
    const visibleRepos = repos.filter((repo) => !repo.fork);
    const featuredRepos = pickFeaturedRepos(visibleRepos);
    const archiveRepos = sortArchiveRepos(visibleRepos);

    renderRepoList(featuredContainer, featuredRepos, false);
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
          toggleArchiveButton.textContent = 'HIDE ARCHIVE';
        } else {
          archiveContainer.setAttribute('hidden', 'hidden');
          toggleArchiveButton.textContent = 'SHOW ARCHIVE';
        }
      });
    }
  })
  .catch((error) => {
    const message = `<div class="error-card">Unable to load repositories right now: ${escapeHtml(error.message)}.</div>`;
    if (featuredContainer) featuredContainer.innerHTML = message;
    if (archiveContainer) archiveContainer.innerHTML = message;
  });
