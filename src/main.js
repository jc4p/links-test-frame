import './style.css'
import * as frame from '@farcaster/frame-sdk'
import articles from './articles.json'

let currentUser = null;

async function initializeFrame() {
  try {
    const context = await frame.sdk.context;
    
    if (context && context.user) {
      currentUser = context.user.user || context.user;
      console.log('Frame context loaded:', currentUser);
    }
    
    await frame.sdk.actions.ready();
    
    // Enable web navigation for back button support
    const capabilities = await frame.sdk.getCapabilities();
    if (capabilities.includes('back')) {
      await frame.sdk.back.enableWebNavigation();
    }
    
  } catch (error) {
    console.log('Running outside frame context');
  }
}

function createArticleCard(article) {
  const card = document.createElement('article');
  card.className = 'article-card';
  
  const hasImage = article.image && article.image.trim() !== '';
  if (!hasImage) {
    card.classList.add('no-image');
  }
  
  const imageHtml = hasImage
    ? `<img src="${article.image}" alt="${article.title}" class="article-image" loading="lazy" onerror="this.onerror=null; this.remove(); this.parentElement.classList.add('no-image')">`
    : '';
  
  card.innerHTML = `
    ${imageHtml}
    <div class="article-content">
      <h2 class="article-title">${article.title}</h2>
      <p class="article-description">${article.description}</p>
      <div class="article-meta">
        <span class="article-source">${article.siteName}</span>
        <span class="article-link-icon">→</span>
      </div>
    </div>
  `;
  
  card.addEventListener('click', async () => {
    try {
      window.open(article.url);
      // Use frame SDK to open URL if available
      // if (frame.sdk && frame.sdk.actions && frame.sdk.actions.openUrl) {
      //   await frame.sdk.actions.openUrl({ url: article.url });
      // } else {
      //   // Fallback for non-frame environments
      //   window.open(article.url, '_blank');
      // }
    } catch (error) {
      console.error('Error opening URL:', error);
      window.open(article.url, '_blank');
    }
  });
  
  return card;
}

function renderApp() {
  const app = document.querySelector('#app');
  
  app.innerHTML = `
    <header class="app-header">
      <h1 class="app-title">Latest News</h1>
      <p class="app-subtitle">Stay informed with today's top stories</p>
    </header>
    <main class="articles-container"></main>
  `;
  
  const container = app.querySelector('.articles-container');
  
  articles.forEach(article => {
    container.appendChild(createArticleCard(article));
  });
}

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  await initializeFrame();
  renderApp();
});