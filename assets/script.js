// Retro Interactive Elements
let visitCount = localStorage.getItem('visitCount') || 0;
document.querySelector('.counter').textContent = String(++visitCount).padStart(5, '0');
localStorage.setItem('visitCount', visitCount);

// Cursor Trail
const cursorTrail = Array(10).fill().map(() => {
  const div = document.createElement('div');
  div.className = 'cursor-trail';
  document.body.appendChild(div);
  return div;
});

document.addEventListener('mousemove', (e) => {
  cursorTrail.forEach((trail, i) => {
    setTimeout(() => {
      trail.style.left = `${e.pageX + i*2}px`;
      trail.style.top = `${e.pageY + i*2}px`;
    }, i * 50);
  });
});

// Dynamic Repo Loading
fetch('https://api.github.com/users/wanazhar/repos')
  .then(response => response.json())
  .then(repos => {
    const grid = document.createElement('div');
    grid.className = 'repo-grid';
    
    repos.forEach(repo => {
      grid.innerHTML += `
        <div class="repo-card">
          <h3>${repo.name}</h3>
          <p>${repo.description || 'No description'}</p>
          <a href="${repo.html_url}">🚀 Visit Repo</a>
          <div class="stars">⭐ ${repo.stargazers_count}</div>
        </div>
      `;
    });
    
    document.querySelector('#projects').appendChild(grid);
  });
