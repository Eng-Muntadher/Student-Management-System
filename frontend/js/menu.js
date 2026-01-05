function initMenu() {
  const burgerBtn = document.querySelector(".menu");
  const menuItems = document.querySelector(".menu-items");
  let isOpen = false;

  // Handle menu toggle
  function toggleMenu() {
    isOpen = !isOpen;

    if (isOpen) {
      // Open menu
      menuItems.style.transform = "translateX(0)";
      burgerBtn.style.left = "340px";
      burgerBtn.setAttribute("aria-expanded", "true");
      menuItems.setAttribute("aria-hidden", "false");

      // Trap focus within menu when open
      trapFocus(menuItems);
    } else {
      // Close menu
      menuItems.style.transform = "translateX(-338px)";
      burgerBtn.style.left = "10px";
      burgerBtn.setAttribute("aria-expanded", "false");
      menuItems.setAttribute("aria-hidden", "true");

      // Return focus to burger button
      burgerBtn.focus();
    }
  }

  // Click handler
  burgerBtn.addEventListener("click", toggleMenu);

  // Keyboard handler - close menu on Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen) {
      toggleMenu();
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      isOpen &&
      !menuItems.contains(event.target) &&
      !burgerBtn.contains(event.target)
    ) {
      toggleMenu();
    }
  });

  // Trap focus within menu when open
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus first element when menu opens
    firstFocusable.focus();

    // Handle Tab key to trap focus
    element.addEventListener("keydown", function (event) {
      if (event.key !== "Tab") return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  }

  // Initialize ARIA attributes
  burgerBtn.setAttribute("aria-expanded", "false");
  menuItems.setAttribute("aria-hidden", "true");
}
