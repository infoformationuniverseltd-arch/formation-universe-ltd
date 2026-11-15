/**
 * Formation Universe LTD — Core Interaction Logic
 * Handles navigation, mobile drawer, interactive accordions, tabs,
 * services filtering, contact form processing, and pre-filled WhatsApp routing.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAccordions();
  initTabs();
  initServicesFilter();
  initContactForm();
  initWhatsAppButtons();
  initCookieBanner();
  initHeroHeadlineRotator();
  initPricingEstimator();
});

// 1. Navigation & Mobile Drawer
function initNavigation() {
  const header = document.querySelector('header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');

  // Sticky header background transition
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('glass-nav', 'shadow-lg');
      } else {
        header.classList.remove('glass-nav', 'shadow-lg');
      }
    }, { passive: true });
  }

  // Mobile drawer controls
  function openMobileMenu() {
    if (mobileMenu && mobileOverlay) {
      mobileMenu.classList.add('open');
      mobileOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (mobileClose) mobileClose.focus();
    }
  }

  function closeMobileMenu() {
    if (mobileMenu && mobileOverlay) {
      mobileMenu.classList.remove('open');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
      if (mobileToggle) mobileToggle.focus();
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openMobileMenu);
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // Mobile dropdown toggle
  const mobileDropdowns = document.querySelectorAll('.mobile-dropdown-btn');
  mobileDropdowns.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.mobile-dropdown-icon');
      if (content) {
        content.classList.toggle('hidden');
        if (icon) icon.classList.toggle('rotate-180');
      }
    });
  });
}

// 2. Accordions for FAQs
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.fu-accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');
      
      // Close all sibling accordions in same group if desired
      const parentContainer = item.parentElement;
      if (parentContainer) {
        parentContainer.querySelectorAll('.fu-accordion-item').forEach(sibling => {
          if (sibling !== item) {
            sibling.classList.remove('active');
            const siblingBtn = sibling.querySelector('.fu-accordion-header');
            if (siblingBtn) siblingBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }

      // Toggle current
      if (isOpen) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// 3. Tab Systems (Pricing, Service categories)
function initTabs() {
  const tabContainers = document.querySelectorAll('[data-tab-container]');

  tabContainers.forEach(container => {
    const tabButtons = container.querySelectorAll('.fu-tab-button');
    const tabPanes = container.querySelectorAll('.fu-tab-pane');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-target-tab');

        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        button.classList.add('active');
        const activePane = container.querySelector(`[data-tab-pane="${targetTab}"]`);
        if (activePane) {
          activePane.classList.add('active');
        }
      });
    });
  });
}

// 4. Live Services Filter & Search
function initServicesFilter() {
  const searchInput = document.getElementById('services-search-input');
  const filterBtns = document.querySelectorAll('.service-filter-btn');
  const serviceCards = document.querySelectorAll('.service-catalog-card');
  const countDisplay = document.getElementById('services-count-display');

  if (!serviceCards.length) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    serviceCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const title = (card.querySelector('.service-card-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.service-card-desc')?.textContent || '').toLowerCase();
      const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();

      const matchesCategory = currentCategory === 'all' || category.includes(currentCategory);
      const matchesSearch = !searchQuery || 
        title.includes(searchQuery) || 
        desc.includes(searchQuery) || 
        keywords.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countDisplay) {
      countDisplay.textContent = `Showing ${visibleCount} of ${serviceCards.length} services`;
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

// 5. Contact Form with validation & WhatsApp routing
function initContactForm() {
  const form = document.getElementById('fu-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="full_name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const phone = form.querySelector('[name="phone"]')?.value.trim() || 'Not specified';
    const service = form.querySelector('[name="service"]')?.value || 'General Consultation';
    const message = form.querySelector('[name="message"]')?.value.trim();
    const consent = form.querySelector('[name="consent"]')?.checked;

    if (!name || !email || !message) {
      showToast('Please fill in all required fields (Name, Email, Message).', 'error');
      return;
    }

    if (!consent) {
      showToast('Please agree to our privacy policy to proceed.', 'error');
      return;
    }

    // Format WhatsApp message text
    const waText = encodeURIComponent(
      `Hello Formation Universe Team,\n\n` +
      `New Website Enquiry:\n` +
      `• Name: ${name}\n` +
      `• Email: ${email}\n` +
      `• Phone/WhatsApp: ${phone}\n` +
      `• Service: ${service}\n` +
      `• Details: ${message}\n\n` +
      `Please get in touch with me.`
    );

    const waUrl = `https://wa.me/923104241773?text=${waText}`;

    showToast('Enquiry received! Redirecting you to WhatsApp for immediate assistance...', 'success');

    // Reset form
    form.reset();

    // Redirect to WhatsApp after 1.2 seconds
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 1200);
  });
}

// 6. Pre-filled WhatsApp Buttons
function initWhatsAppButtons() {
  const waButtons = document.querySelectorAll('[data-service-wa]');
  
  waButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service-wa') || 'Formation Consultation';
      const customMsg = encodeURIComponent(
        `Hello Formation Universe LTD Team,\n\nI am interested in your service: "${serviceName}". Could you please provide consultation, current requirements, and quotation?\n\nThank you!`
      );
      const url = `https://wa.me/923104241773?text=${customMsg}`;
      btn.setAttribute('href', url);
      btn.setAttribute('target', '_blank');
    });
  });
}

// 7. Cookie Banner
function initCookieBanner() {
  const banner = document.getElementById('fu-cookie-banner');
  if (!banner) return;

  const accepted = localStorage.getItem('fu_cookie_consent');
  if (!accepted) {
    banner.classList.remove('hidden');
  }

  const acceptBtn = document.getElementById('fu-cookie-accept');
  const declineBtn = document.getElementById('fu-cookie-decline');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('fu_cookie_consent', 'accepted');
      banner.classList.add('hidden');
    });
  }
  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('fu_cookie_consent', 'declined');
      banner.classList.add('hidden');
    });
  }
}

// 8. Toast utility
function showToast(message, type = 'info') {
  let toast = document.querySelector('.fu-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'fu-toast';
    document.body.appendChild(toast);
  }

  const iconSvg = type === 'error' 
    ? `<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    : `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

  toast.innerHTML = `${iconSvg} <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
window.showToast = showToast;

// 9. Hero Rotating Headline
function initHeroHeadlineRotator() {
  const el = document.getElementById('hero-rotating-phrase');
  if (!el) return;

  const phrases = [
    'UK Limited Company',
    'USA LLC',
    'Business Bank Account',
    'Global Enterprise'
  ];
  let index = 0;

  setInterval(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    el.style.transition = 'opacity 0.28s ease, transform 0.28s ease';

    setTimeout(() => {
      index = (index + 1) % phrases.length;
      el.textContent = phrases[index];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 280);
  }, 3200);
}

// 10. Quick Start Pricing Estimator (Formation Planet Format)
function initPricingEstimator() {
  const calcContainer = document.getElementById('quick-estimator-card');
  if (!calcContainer) return;

  const ukBtn = document.getElementById('calc-tab-uk');
  const usaBtn = document.getElementById('calc-tab-usa');
  const jurisdictionDisplay = document.getElementById('calc-jurisdiction-name');
  const pkgButtons = calcContainer.querySelectorAll('.calculator-pkg-btn');
  const priceDisplay = document.getElementById('calc-estimated-price');
  const continueLink = document.getElementById('calc-continue-cta');

  let currentRegion = 'uk';
  let currentPkg = 'starter';

  const prices = {
    uk: {
      starter: 140,
      silver: 170,
      gold: 180,
      platinum: 200,
      jurisdiction: 'United Kingdom (Companies House Direct Incorporation)'
    },
    usa: {
      starter: 150,
      silver: 190,
      gold: 240,
      platinum: 290,
      jurisdiction: 'United States (Wyoming, Delaware, New Mexico, Florida)'
    }
  };

  function updateEstimator() {
    const data = prices[currentRegion];
    if (jurisdictionDisplay) {
      jurisdictionDisplay.textContent = data.jurisdiction;
    }

    // Update package buttons
    pkgButtons.forEach(btn => {
      const pkg = btn.getAttribute('data-calc-pkg');
      const priceSub = btn.querySelector('.calc-pkg-price');
      if (priceSub && data[pkg]) {
        priceSub.textContent = `£${data[pkg]}`;
      }
      if (pkg === currentPkg) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const currentTotal = data[currentPkg] || 140;
    if (priceDisplay) {
      priceDisplay.textContent = `£${currentTotal}`;
    }

    if (continueLink) {
      const pkgCapitalized = currentPkg.charAt(0).toUpperCase() + currentPkg.slice(1);
      const regionLabel = currentRegion === 'uk' ? 'UK LTD' : 'USA LLC';
      const msg = encodeURIComponent(
        `Hello Formation Universe,\n\nI would like to proceed with the "${regionLabel} - ${pkgCapitalized} Package" estimated at £${currentTotal}. Please guide me on required documents and onboarding.\n\nThank you!`
      );
      continueLink.setAttribute('href', `https://wa.me/923104241773?text=${msg}`);
      continueLink.setAttribute('target', '_blank');
    }
  }

  if (ukBtn) {
    ukBtn.addEventListener('click', () => {
      currentRegion = 'uk';
      ukBtn.classList.add('bg-emerald-600', 'text-white', 'shadow-sm');
      ukBtn.classList.remove('text-slate-700', 'hover:text-slate-900', 'bg-transparent');
      if (usaBtn) {
        usaBtn.classList.remove('bg-emerald-600', 'text-white', 'shadow-sm');
        usaBtn.classList.add('text-slate-700', 'hover:text-slate-900', 'bg-transparent');
      }
      updateEstimator();
    });
  }

  if (usaBtn) {
    usaBtn.addEventListener('click', () => {
      currentRegion = 'usa';
      usaBtn.classList.add('bg-emerald-600', 'text-white', 'shadow-sm');
      usaBtn.classList.remove('text-slate-700', 'hover:text-slate-900', 'bg-transparent');
      if (ukBtn) {
        ukBtn.classList.remove('bg-emerald-600', 'text-white', 'shadow-sm');
        ukBtn.classList.add('text-slate-700', 'hover:text-slate-900', 'bg-transparent');
      }
      updateEstimator();
    });
  }

  pkgButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentPkg = btn.getAttribute('data-calc-pkg') || 'starter';
      updateEstimator();
    });
  });

  updateEstimator();
}
