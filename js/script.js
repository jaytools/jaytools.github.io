// Global error handler
window.onerror = function (msg, url, line) {
  console.error(`JavaScript Error: ${msg} at line ${line}`);
  return false;
};

document.addEventListener('DOMContentLoaded', function () {
  try {
    initializeWebsite();
  } catch (error) {
    console.error('Error initializing website:', error);
  }
});

// Global variables
let currentPage = 1;
const itemsPerPage = 6;
let allToolItems = [];
let filteredTools = [];

function initializeWebsite() {
  initMobileNavigation();
  initScrollToTop();

  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.display = 'flex';
    preloader.style.opacity = '1';
  }

  const toolsContainer = document.getElementById('toolsContainer');
  if (toolsContainer) {
    allToolItems = Array.from(document.querySelectorAll('.tool-item'));
    filteredTools = [...allToolItems];
    displayTools();
    updatePaginationControls();
  }

  const searchInput = document.getElementById('toolSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const searchTerm = this.value.toLowerCase();
      filterTools(searchTerm);
    });
  }

  // Hide preloader
  window.addEventListener('load', function () {
    if (preloader) {
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }, 1000);
    }
  });

  // Fallback: hide preloader after 5s
  setTimeout(() => {
    if (preloader && preloader.style.opacity !== '0') {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  }, 5000);

  // Contact form
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
      }

      contactForm.reset();
      contactForm.innerHTML = '<div style="color:#4f8cff;font-size:1.2rem;padding:24px 0;">Thank you for contacting us! We will get back to you soon.</div>';
    });
  }

  // Live search for .tool-card type (optional if you're using .tool-item)
  const liveSearchInput = document.querySelector('.header-search input[type="search"]');
  const toolCards = document.querySelectorAll('.tool-card');
  if (liveSearchInput && toolCards.length) {
    liveSearchInput.addEventListener('input', function () {
      const val = liveSearchInput.value.toLowerCase();
      toolCards.forEach(card => {
        const title = card.querySelector('.tool-title').textContent.toLowerCase();
        const desc = card.querySelector('.tool-desc').textContent.toLowerCase();
        card.style.display = (title.includes(val) || desc.includes(val)) ? '' : 'none';
      });
    });
  }

  // .tools-page-btn (for .tool-card based pagination)
  const pageBtns = document.querySelectorAll('.tools-page-btn');
  if (pageBtns.length && toolCards.length) {
    const totalPages = Math.ceil(toolCards.length / itemsPerPage);
    function showToolsPage(page) {
      toolCards.forEach((card, idx) => {
        const show = idx >= (page - 1) * itemsPerPage && idx < page * itemsPerPage;
        card.style.display = show ? '' : 'none';
      });

      pageBtns.forEach(btn => btn.classList.remove('active'));
      pageBtns.forEach(btn => {
        if (btn.dataset.page == page) btn.classList.add('active');
      });
    }

    function handlePageBtn(e) {
      let page = e.target.dataset.page;
      if (page === 'prev') page = Math.max(1, currentPage - 1);
      else if (page === 'next') page = Math.min(totalPages, currentPage + 1);
      else page = parseInt(page);

      if (page !== currentPage) {
        currentPage = page;
        showToolsPage(currentPage);
      }
    }

    pageBtns.forEach(btn => btn.addEventListener('click', handlePageBtn));
    showToolsPage(currentPage);
  }
}

function filterTools(searchTerm) {
  const noResults = document.getElementById('noResults');
  filteredTools = allToolItems.filter(item => {
    const toolData = item.dataset.tool.toLowerCase();
    return toolData.includes(searchTerm);
  });

  if (noResults) {
    noResults.style.display = filteredTools.length > 0 ? 'none' : 'block';
  }

  currentPage = 1;
  displayTools();
  updatePaginationControls();
}

function displayTools() {
  const toolsContainer = document.getElementById('toolsContainer');
  if (!toolsContainer) return;

  toolsContainer.innerHTML = '';

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const toolsToDisplay = filteredTools.slice(startIndex, endIndex);

  let currentRow;
  toolsToDisplay.forEach((item, index) => {
    if (index % 3 === 0) {
      currentRow = document.createElement('div');
      currentRow.classList.add('row');
      toolsContainer.appendChild(currentRow);
    }
    currentRow.appendChild(item);
  });
}

function updatePaginationControls() {
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const paginationControls = document.getElementById('pagination-controls');
  if (!paginationControls) return;

  paginationControls.innerHTML = '';

  const prevButton = document.createElement('a');
  prevButton.href = '#';
  prevButton.classList.add('prev');
  prevButton.innerHTML = '&lt;&lt; Prev';
  if (currentPage === 1) prevButton.classList.add('disabled');
  prevButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      displayTools();
      updatePaginationControls();
    }
  });
  paginationControls.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.classList.add('page');
    if (i === currentPage) pageLink.classList.add('active');
    pageLink.textContent = i;
    pageLink.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = i;
      displayTools();
      updatePaginationControls();
    });
    paginationControls.appendChild(pageLink);
  }

  const nextButton = document.createElement('a');
  nextButton.href = '#';
  nextButton.classList.add('next');
  nextButton.innerHTML = 'Next &gt;&gt;';
  if (currentPage === totalPages) nextButton.classList.add('disabled');
  nextButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      displayTools();
      updatePaginationControls();
    }
  });
  paginationControls.appendChild(nextButton);
}

// Mobile Navigation
function initMobileNavigation() {
  const menuIcon = document.getElementById('menuIcon');
  const navbar = document.getElementById('navbar');
  const searchToggle = document.getElementById('searchToggle');
  const mobileSearchModal = document.getElementById('mobileSearchModal');
  const closeMobileSearch = document.getElementById('closeMobileSearch');

  if (menuIcon && navbar) {
    menuIcon.addEventListener('click', () => {
      navbar.classList.toggle('active');
      menuIcon.innerHTML = navbar.classList.contains('active')
        ? '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f8cff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
        : '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f8cff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>';
    });
  }

  if (searchToggle && mobileSearchModal) {
    searchToggle.addEventListener('click', () => {
      mobileSearchModal.style.display = 'flex';
    });
  }

  if (closeMobileSearch && mobileSearchModal) {
    closeMobileSearch.addEventListener('click', () => {
      mobileSearchModal.style.display = 'none';
    });
  }
}

// Scroll to Top
function initScrollToTop() {
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  if (!scrollToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}