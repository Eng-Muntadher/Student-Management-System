function initTheme() {
  const toggleAnimation = document.querySelector(".animation");
  const toggleBlueMode = document.querySelector(".blue");

  // State variables
  let isAnimationOn = true;
  let isBlueMode = false;

  // Function for toggling animation
  const setAnimationState = function (enabled) {
    isAnimationOn = enabled;

    if (enabled) {
      // Animation ON
      toggleAnimation.children[0].style.left = "23px";
      toggleAnimation.style.background = "var(--btn-on)";
      toggleAnimation.setAttribute("aria-checked", "true");
      document.body.classList.add("animation-on");
      window.localStorage.animation = "apply";
    } else {
      // Animation OFF
      toggleAnimation.children[0].style.left = "2px";
      toggleAnimation.style.background = "var(--btn-off)";
      toggleAnimation.setAttribute("aria-checked", "false");
      document.body.classList.remove("animation-on");
      window.localStorage.animation = "remove";
    }
  };

  // Function for toggling blue mode
  const setBlueMode = function (enabled) {
    isBlueMode = enabled;

    if (enabled) {
      // Blue mode ON
      toggleBlueMode.children[0].style.left = "23px";
      toggleBlueMode.style.background = "var(--btn-on)";
      toggleBlueMode.setAttribute("aria-checked", "true");
      document.body.classList.add("blue-mode");

      // Apply blue mode colors
      document.documentElement.style.setProperty(
        "--main-gradient",
        "linear-gradient(135deg, #3a506b, #5a8abf)"
      );
      document.documentElement.style.setProperty("--menu-color", "#8bb8ec");
      document.documentElement.style.setProperty(
        "--secondary-gradient",
        "linear-gradient(135deg, #5a8abf, #8bb8ec)"
      );
      document.documentElement.style.setProperty(
        "--secondary-gradient-reverse",
        "linear-gradient(135deg, #8bb8ec, #5a8abf)"
      );
      document.documentElement.style.setProperty("--btn-on", "#3a506b");

      window.localStorage.blue_mode = "active";
    } else {
      // Blue mode OFF (Pink mode)
      toggleBlueMode.children[0].style.left = "2px";
      toggleBlueMode.style.background = "var(--btn-off)";
      toggleBlueMode.setAttribute("aria-checked", "false");
      document.body.classList.remove("blue-mode");

      // Apply pink mode colors
      document.documentElement.style.setProperty(
        "--main-gradient",
        "linear-gradient(135deg, #ff9a9e, #fad0c4)"
      );
      document.documentElement.style.setProperty("--menu-color", "#fad0c4");
      document.documentElement.style.setProperty(
        "--secondary-gradient",
        "linear-gradient(135deg, #ff7eb3, #ff758c)"
      );
      document.documentElement.style.setProperty(
        "--secondary-gradient-reverse",
        "linear-gradient(135deg, #ff758c, #ff7eb3)"
      );
      document.documentElement.style.setProperty("--btn-on", "#ff758c");

      window.localStorage.blue_mode = "not-active";
    }
  };

  // Initialize animation state from localStorage
  if (window.localStorage.animation === "remove") {
    setAnimationState(false);
  } else {
    setAnimationState(true);
  }

  // Initialize blue mode state from localStorage
  if (window.localStorage.blue_mode === "active") {
    setBlueMode(true);
  } else {
    setBlueMode(false);
  }

  // Animation toggle event listener
  toggleAnimation.addEventListener("click", function () {
    setAnimationState(!isAnimationOn);
  });

  // Animation toggle keyboard support (Space and Enter keys)
  toggleAnimation.addEventListener("keydown", function (event) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault(); // Prevent page scroll on Space
      setAnimationState(!isAnimationOn);
    }
  });

  // Blue mode toggle event listener
  toggleBlueMode.addEventListener("click", function () {
    setBlueMode(!isBlueMode);
  });

  // Blue mode toggle keyboard support (Space and Enter keys)
  toggleBlueMode.addEventListener("keydown", function (event) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault(); // Prevent page scroll on Space
      setBlueMode(!isBlueMode);
    }
  });

  // Initialize ARIA attributes
  toggleAnimation.setAttribute(
    "aria-checked",
    isAnimationOn ? "true" : "false"
  );
  toggleBlueMode.setAttribute("aria-checked", isBlueMode ? "true" : "false");
}
