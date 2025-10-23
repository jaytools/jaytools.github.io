const ITEMS_PER_PAGE = 6;
const tools = [
  { name: 'YouTube Thumbnail Downloader', url: 'utility/youtube-thumbnail-downloader.html', tags: ['utility', 'social-media'] },
  { name: 'CGPA to Percentage Calculator', url: 'calculator/cgpa-percentage-inline.html', tags: ['calculator', 'study'] },
  { name: 'Protein Intake Calculator', url: 'health/protein-intake.html', tags: ['health', 'calculator', 'nutrition'] },
  { name: 'IVF Due Date Calculator', url: 'health/ivf-calculator.html', tags: ['health', 'personal'] },
  { name: 'Pregnancy Weight Gain Calculator', url: 'health/pregnancy-weight.html', tags: ['calculator', 'health'] },
  { name: 'Steps to KM Converter', url: 'converter/steps-to-km-inline.html', tags: ['converter', 'health'] },
  { name: 'Typing Speed Test Paragraph', url: 'study/typing-speed.html', tags: ['study', 'utility'] },
  { name: 'Calories Burned Walking', url: 'health/calories-walking.html', tags: ['calculator', 'health'] },
  { name: 'Height Conversion Tool', url: 'converter/height-converter-inline.html', tags: ['converter', 'health'] },
  { name: 'Calorie Deficit Finder', url: 'health/calorie-deficit.html', tags: ['health', 'calculator'] },
  { name: 'Body Frame Size Calculator', url: 'health/body-frame-inline.html', tags: ['calculator', 'health'] },
  { name: 'Exam Marks Percentage Calculator', url: 'calculator/exam-percentage-inline.html', tags: ['calculator', 'study'] },
  { name: 'Debt to Income Ratio Tool', url: 'finance/debt-ratio.html', tags: ['calculator', 'finance'] },
  { name: 'Age Difference Calculator', url: 'personal/age-difference-inline.html', tags: ['calculator', 'personal'] },
  { name: 'DPI Checker', url: 'utility/dpi-checker.html', tags: ['utility', 'design'] },
  { name: 'Study Planner', url: 'study/study-planner.html', tags: ['planner', 'study'] },
  { name: 'Marriage Age Calculator', url: 'personal/marriage-age-inline.html', tags: ['calculator', 'personal'] },
  { name: 'Calories in Food Checker', url: 'health/food-calories.html', tags: ['health', 'calculator'] },
  { name: 'Goal Planner', url: 'planner/goal-planner.html', tags: ['planner', 'utility'] },
  { name: 'Pomodoro Timer', url: 'planner/pomodoro.html', tags: ['planner', 'utility', 'study'] },
  { name: 'Daily Expense Tracker', url: 'finance/expense-tracker.html', tags: ['finance', 'personal'] },
  { name: 'GPA to Percentage Calculator', url: 'calculator/gpa-percentage-inline.html', tags: ['calculator', 'study'] },
  { name: 'Marriage Biodata', url: 'personal/marriage-biodata-inline.html', tags: ['utility', 'personal'] },
  { name: 'Invite Generator', url: 'personal/invite-generator-inline.html', tags: ['utility', 'personal'] },
  { name: 'Memory Game', url: 'game/memory-game.html', tags: ['game', 'brain-training', 'entertainment'] },
  { name: 'Random Team Generator', url: 'utility/team-generator-inline.html', tags: ['utility', 'productivity'] }
];

let currentPage = 1;
let currentTag = 'all';
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

var sidebar = document.querySelector('.sidebar');
var menuToggle = document.querySelector('.menu-toggle');
var menuClose = document.querySelector('.sidebar-close');
var overlay = document.querySelector('.overlay');
var toolsGrid = document.querySelector('.tools-grid');
var searchInput = document.querySelector('.search-input');
var favoritesList = document.querySelector('.favorites-container');
var searchToggle = document.querySelector('.search-toggle');
var mobileSearchContainer = document.querySelector('.mobile-search-container');
var mobileSearchInput = document.querySelector('.mobile-search-input');
var mobileSearchClose = document.querySelector('.mobile-search-close');
var searchResults = document.querySelector('.search-results');
var scrollLeft = document.querySelector('.scroll-left');
var scrollRight = document.querySelector('.scroll-right');
var tagsScroll = document.querySelector('.tags-scroll');

if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
if (menuClose) menuClose.addEventListener('click', closeSidebar);
if (overlay) overlay.addEventListener('click', closeSidebar);
if (searchInput) {
  searchInput.addEventListener('input', handleSearch);
  searchInput.addEventListener('focus', onSearchFocus);
  searchInput.addEventListener('blur', onSearchBlur);
}
if (searchToggle) searchToggle.addEventListener('click', openMobileSearch);
if (mobileSearchClose) mobileSearchClose.addEventListener('click', closeMobileSearch);
if (mobileSearchInput) mobileSearchInput.addEventListener('input', handleMobileSearch);
if (mobileSearchContainer) {
  mobileSearchContainer.addEventListener('click', function(e) {
    if (e.target === mobileSearchContainer) closeMobileSearch();
  });
}
if (scrollLeft) scrollLeft.addEventListener('click', function() {
  tagsScroll.scrollBy({ left: -200, behavior: 'smooth' });
});
if (scrollRight) scrollRight.addEventListener('click', function() {
  tagsScroll.scrollBy({ left: 200, behavior: 'smooth' });
});
if (tagsScroll) tagsScroll.addEventListener('scroll', updateScrollButtons);
window.addEventListener('resize', updateScrollButtons);

document.addEventListener('DOMContentLoaded', function() {
  updateFavorites();
  var filtered = currentTag === 'all' ? tools : tools.filter(function(tool) {
    return tool.tags.includes(currentTag);
  });
  renderTools(filtered);
  var tagButtons = document.querySelectorAll('.tag-btn');
  for (var i = 0; i < tagButtons.length; i++) {
    tagButtons[i].addEventListener('click', function() {
      for (var j = 0; j < tagButtons.length; j++) {
        tagButtons[j].classList.remove('active');
      }
      this.classList.add('active');
      currentTag = this.dataset.tag;
      currentPage = 1;
      var filtered = currentTag === 'all' ? tools : tools.filter(function(tool) {
        return tool.tags.includes(currentTag);
      });
      renderTools(filtered);
    });
  }
  updateScrollButtons();
  verifySearchFunctionality();
});

function toggleSidebar() {
  if (sidebar && overlay) {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
  }
}

function closeSidebar() {
  if (sidebar) sidebar.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function createToolCard(t) {
  var tpl = document.querySelector('#tool-card-template');
  var card = tpl.content.cloneNode(true);
  var title = card.querySelector('.tool-title');
  var link = card.querySelector('.tool-link');
  var fav = card.querySelector('.favorite-btn');
  title.textContent = t.name;
  link.href = t.url;
  if (favorites.includes(t.name)) fav.classList.add('active');
  fav.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(t.name);
  });
  return card;
}

// Shuffle function for randomizing tools array
function shuffleArray(array) {
  var shuffled = array.slice(); // Create a copy
  for (var i = shuffled.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

function renderTools(list) {
  if (!list) list = tools;
  var start = (currentPage - 1) * ITEMS_PER_PAGE;
  var end = start + ITEMS_PER_PAGE;
  
  // Separate favorites and non-favorites
  var favs = list.filter(function(tool) { return favorites.includes(tool.name); });
  var nonFavs = list.filter(function(tool) { return !favorites.includes(tool.name); });
  
  // Randomize non-favorites only on page 1
  if (currentPage === 1 && currentTag === 'all') {
    nonFavs = shuffleArray(nonFavs);
  } else {
    // Sort alphabetically for other pages/tags
    nonFavs.sort(function(a, b) { return a.name.localeCompare(b.name); });
  }
  
  // Sort favorites alphabetically
  favs.sort(function(a, b) { return a.name.localeCompare(b.name); });
  
  // Combine: favorites first, then non-favorites
  var sorted = favs.concat(nonFavs);
  
  toolsGrid.innerHTML = '';
  for (var i = start; i < end && i < sorted.length; i++) {
    toolsGrid.appendChild(createToolCard(sorted[i]));
  }
  renderPagination(list.length);
}

function renderPagination(total) {
  var p = document.querySelector('.pagination');
  if (!p) return;
  var pages = Math.ceil(total / ITEMS_PER_PAGE);
  if (pages <= 1) {
    p.style.display = 'none';
    return;
  }
  var html = '';
  if (currentPage > 1) {
    html += '<button class="pagination-btn" onclick="changePage(' + (currentPage - 1) + ')">Prev</button>';
  }
  for (var i = 1; i <= pages; i++) {
    html += '<button class="pagination-btn' + (i === currentPage ? ' active' : '') + '" onclick="changePage(' + i + ')">' + i + '</button>';
  }
  if (currentPage < pages) {
    html += '<button class="pagination-btn" onclick="changePage(' + (currentPage + 1) + ')">Next</button>';
  }
  p.style.display = 'flex';
  p.innerHTML = html;
}

function changePage(n) {
  currentPage = n;
  var filtered = currentTag === 'all' ? tools : tools.filter(function(tool) {
    return tool.tags.includes(currentTag);
  });
  renderTools(filtered);
}

function toggleFavorite(name) {
  if (favorites.includes(name)) {
    favorites = favorites.filter(function(n) { return n !== name; });
  } else {
    favorites.push(name);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavorites();
  var filtered = currentTag === 'all' ? tools : tools.filter(function(tool) {
    return tool.tags.includes(currentTag);
  });
  renderTools(filtered);
}

function updateFavorites() {
  if (!favoritesList) return;
  var favTools = tools.filter(function(tool) {
    return favorites.includes(tool.name);
  });
  if (favTools.length === 0) {
    favoritesList.innerHTML = '<p class="no-favorites">No favorite tools yet.</p>';
    return;
  }
  var html = '<ul class="favorites-list">';
  for (var i = 0; i < favTools.length; i++) {
    html += '<li><a href="' + favTools[i].url + '">' + favTools[i].name + '</a></li>';
  }
  html += '</ul>';
  favoritesList.innerHTML = html;
}

function handleSearch(e) {
  var query = e.target.value.toLowerCase().trim();
  var matched = tools.filter(function(tool) {
    return tool.name.toLowerCase().includes(query) || tool.tags.join(' ').toLowerCase().includes(query);
  });
  var isToolPage = !document.querySelector('.tools-grid');
  if (isToolPage) renderSearchResults(matched, query);
  else {
    currentPage = 1;
    renderTools(matched);
    renderPagination(matched.length);
  }
}

function onSearchFocus() {
  if (!toolsGrid && searchInput.value.trim()) {
    var query = searchInput.value.trim().toLowerCase();
    var matched = tools.filter(function(tool) {
      return tool.name.toLowerCase().includes(query) || tool.tags.join(' ').toLowerCase().includes(query);
    });
    renderSearchResults(matched, query);
  }
}

function onSearchBlur() {
  setTimeout(function() {
    hideSearchResults(document.querySelector('.search-results'));
  }, 200);
}

function renderSearchResults(matched, query) {
  var isDesktop = window.innerWidth >= 768;
  var isToolPage = !document.querySelector('.tools-grid');
  var resultsContainer = isDesktop && isToolPage ? document.querySelector('.desktop-search-results') : searchResults;
  if (!resultsContainer) {
    if (isToolPage && isDesktop) {
      resultsContainer = document.createElement('div');
      resultsContainer.className = 'search-results desktop-search-results';
      var wrapper = document.querySelector('.search-wrapper');
      if (wrapper) wrapper.appendChild(resultsContainer);
    } else return;
  }
  if (matched.length === 0) {
    resultsContainer.innerHTML = '<div class="no-results"><h3>No results found</h3><p>Try different keywords</p></div>';
  } else {
    var html = '<div class="search-results-header"><h3>Found ' + matched.length + ' tool' + (matched.length !== 1 ? 's' : '') + '</h3></div><ul class="search-results-list">';
    for (var i = 0; i < matched.length; i++) {
      html += '<li class="search-result-item"><a href="' + matched[i].url + '" class="search-result-link"><h4 class="search-result-title">' + highlightSearchTerm(matched[i].name, query) + '</h4><p class="search-result-tags">' + matched[i].tags.map(function(tag) {
        return '<span class="search-result-tag">' + tag + '</span>';
      }).join('') + '</p></a></li>';
    }
    html += '</ul>';
    resultsContainer.innerHTML = html;
  }
  resultsContainer.classList.add('active');
  resultsContainer.classList.add('show');
}

function highlightSearchTerm(text, term) {
  var regex = new RegExp('(' + term + ')', 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function openMobileSearch() {
  if (mobileSearchContainer) {
    mobileSearchContainer.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (mobileSearchInput) mobileSearchInput.focus();
  }
}

function closeMobileSearch() {
  if (mobileSearchContainer) mobileSearchContainer.classList.remove('active');
  hideSearchResults(searchResults);
  document.body.style.overflow = '';
  if (mobileSearchInput) mobileSearchInput.value = '';
}

function handleMobileSearch(e) {
  var query = e.target.value.toLowerCase().trim();
  var matched = tools.filter(function(tool) {
    return tool.name.toLowerCase().includes(query) || tool.tags.join(' ').toLowerCase().includes(query);
  });
  renderSearchResults(matched, query);
}

function hideSearchResults(el) {
  if (el) el.classList.remove('active', 'show');
}

function verifySearchFunctionality() {
  if (!toolsGrid) {
    var sw = document.querySelector('.search-wrapper');
    if (sw && !document.querySelector('.desktop-search-results')) {
      var div = document.createElement('div');
      div.className = 'search-results desktop-search-results';
      sw.appendChild(div);
    }
  }
}

function updateScrollButtons() {
  if (!scrollLeft || !scrollRight || !tagsScroll) return;
  var pos = tagsScroll.scrollLeft;
  scrollLeft.style.opacity = pos > 0 ? 1 : 0;
  scrollRight.style.opacity = pos < tagsScroll.scrollWidth - tagsScroll.clientWidth ? 1 : 0;
}