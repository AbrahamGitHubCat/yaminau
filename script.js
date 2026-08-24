/**
 * החוקה של יאמין - JavaScript (כולל סינון מורחב וחיפוש מתקדם)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Tab Navigation
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      // Update button states
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panels
      tabPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      // Scroll smoothly to tabs area on mobile
      if (window.innerWidth < 600) {
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // 2. Rules Tab Live Search
  const rulesSearchInput = document.getElementById('rules-search');
  const ruleCards = document.querySelectorAll('.rule-card');

  if (rulesSearchInput) {
    rulesSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      ruleCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 3. Forbidden Tab - Live Search & Category Filtering
  const forbiddenSearchInput = document.getElementById('forbidden-search');
  const categoryCards = document.querySelectorAll('.forbidden-category-card');
  const allForbiddenItems = document.querySelectorAll('.forbidden-item');
  const filterChips = document.querySelectorAll('.chip-btn');
  const forbiddenCounter = document.getElementById('forbidden-counter');

  let currentCategory = 'all';

  function updateForbiddenView() {
    const query = forbiddenSearchInput ? forbiddenSearchInput.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    categoryCards.forEach(catCard => {
      const catType = catCard.getAttribute('data-category');
      const matchesCategory = (currentCategory === 'all' || currentCategory === catType);

      if (!matchesCategory) {
        catCard.style.display = 'none';
        return;
      }

      // Check items inside this category
      const items = catCard.querySelectorAll('.forbidden-item');
      let catVisibleItems = 0;

      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (query === '' || text.includes(query)) {
          item.style.display = 'flex';
          catVisibleItems++;
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });

      // Show/Hide category card based on whether any item inside matches
      if (catVisibleItems > 0) {
        catCard.style.display = 'block';
      } else {
        catCard.style.display = 'none';
      }
    });

    if (forbiddenCounter) {
      if (query !== '' || currentCategory !== 'all') {
        forbiddenCounter.textContent = `נמצאו ${visibleCount} סעיפים מתאימים`;
      } else {
        forbiddenCounter.textContent = `מציג את כל ${allForbiddenItems.length} הסעיפים`;
      }
    }
  }

  if (forbiddenSearchInput) {
    forbiddenSearchInput.addEventListener('input', updateForbiddenView);
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.getAttribute('data-filter');
      updateForbiddenView();
    });
  });

  // Initial count setup
  if (forbiddenCounter) {
    forbiddenCounter.textContent = `מציג את כל ${allForbiddenItems.length} הסעיפים`;
  }

  // 4. Toast Notifications
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // 5. Copy Discord Invite Link
  const copyDiscordBtn = document.getElementById('copy-discord-btn');
  const discordInviteUrl = 'https://discord.gg/4zMQ7YxR6C';

  if (copyDiscordBtn) {
    copyDiscordBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(discordInviteUrl);
        showToast('קישור לשרת הדיסקורד הועתק ללוח! 💬');
      } catch (err) {
        const tempInput = document.createElement('input');
        tempInput.value = discordInviteUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('קישור לשרת הדיסקורד הועתק ללוח! 💬');
      }
    });
  }

  // 6. Share Website
  const shareSiteBtn = document.getElementById('share-site-btn');
  if (shareSiteBtn) {
    shareSiteBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'החוקה של יאמין',
            text: 'כנסו לעמוד הרשמי של יאמין - קישורים, שידורים חיים וחוקת הרפובליקה!',
            url: window.location.href,
          });
        } catch (e) {
          // User cancelled
        }
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast('קישור לאתר הועתק ללוח! 🔗');
        } catch (err) {
          showToast('הקישור זמין בשורת הכתובת 🔗');
        }
      }
    });
  }

  // 7. Accept Rules Checkbox & LocalStorage
  const acceptCheck = document.getElementById('accept-rules-check');
  const acceptedMsg = document.getElementById('accepted-msg');

  if (acceptCheck && acceptedMsg) {
    if (localStorage.getItem('yamin_rules_accepted') === 'true') {
      acceptCheck.checked = true;
      acceptedMsg.style.display = 'block';
    }

    acceptCheck.addEventListener('change', () => {
      if (acceptCheck.checked) {
        localStorage.setItem('yamin_rules_accepted', 'true');
        acceptedMsg.style.display = 'block';
        showToast('החוקה אושרה בהצלחה! 👑');
        createConfetti();
      } else {
        localStorage.removeItem('yamin_rules_accepted');
        acceptedMsg.style.display = 'none';
      }
    });
  }

  // 8. Gold Sparkles celebration effect on accept
  function createConfetti() {
    for (let i = 0; i < 25; i++) {
      const sparkle = document.createElement('div');
      sparkle.style.position = 'fixed';
      sparkle.style.zIndex = '999';
      sparkle.style.width = Math.random() * 8 + 4 + 'px';
      sparkle.style.height = sparkle.style.width;
      sparkle.style.background = 'radial-gradient(circle, #fbeea4, #d4af37)';
      sparkle.style.borderRadius = '50%';
      sparkle.style.left = 50 + (Math.random() * 40 - 20) + '%';
      sparkle.style.top = 60 + (Math.random() * 30 - 15) + '%';
      sparkle.style.boxShadow = '0 0 10px #d4af37';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.opacity = '1';
      sparkle.style.transition = 'all 1s cubic-bezier(0.25, 1, 0.5, 1)';

      document.body.appendChild(sparkle);

      setTimeout(() => {
        const destX = (Math.random() - 0.5) * 350;
        const destY = (Math.random() - 0.8) * 300;
        sparkle.style.transform = `translate(${destX}px, ${destY}px) scale(0)`;
        sparkle.style.opacity = '0';
      }, 20);

      setTimeout(() => {
        sparkle.remove();
      }, 1100);
    }
  }
});
