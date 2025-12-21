function initTheme() {
  // Burger Side Btn (toggle Background Animations)
  let toggle_animation = document.querySelector(".animation"); // Toggle animation Btn
  let blue_mode = document.querySelector(".blue"); // Toggle blue mode Btn

  // Toggle Logic
  let animation = 0;
  let blue = 0;

  // Function for toggling animation based on a passed boolean value
  const animation_on_off = function (boolean_value) {
    if (boolean_value === false) {
      // if boolean value = false => animation is removed and animation var = 1
      toggle_animation.children[0].style.left = "2px"; // animation btn is turned to off (left)
      toggle_animation.style.background = "var(--btn-off)";
      document.body.classList.remove("animation-on");
      animation = 1;
    } else {
      // if boolean value = true => animation is turned on and animation var = 0
      toggle_animation.children[0].style.left = "41px"; // animation btn is turned to on (right)
      toggle_animation.style.background = "var(--btn-on)";
      document.body.classList.add("animation-on");
      animation = 0;
    }
  };

  // Check for animation from local storage from passed sessions
  if (window.localStorage.animation === "remove") {
    animation_on_off(false);
  } else {
    animation_on_off(true);
  }

  // Logic for toggling animations in one session based on "animation" var
  toggle_animation.onclick = function () {
    if (animation === 0) {
      animation_on_off(false);
      // set animation = 'remove' so that next session is also set to that
      window.localStorage.animation = "remove";
    } else {
      animation_on_off(true);
      window.localStorage.animation = "apply";
    }
  };

  // Function for toggling blue mode based on a passed boolean value
  const toggle_blue_mode = function (boolean_value) {
    if (boolean_value === true) {
      // if boolean value = true => blue mode is activated and blue var = 1
      blue_mode.children[0].style.left = "41px"; // animation btn is turned to off (left)
      blue_mode.style.background = "var(--btn-on)";
      document.body.classList.add("blue-mode");

      // this section changes css variables based on blue mode colors
      document.documentElement.style.setProperty(
        "--main-gradient",
        " linear-gradient(135deg, #3a506b, #5a8abf)"
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

      // for future sessions
      window.localStorage.blue_mode = "active";
      blue = 1;
    } else {
      // if boolean value = false => blue mode is deactivated and blue var = 0
      blue_mode.children[0].style.left = "2px";
      blue_mode.style.background = "var(--btn-off)";
      document.body.classList.remove("blue-mode");

      // this section changes css variables based on pink mode colors
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

      // for future sessions
      window.localStorage.blue_mode = "not-active";
      blue = 0;
    }
  };

  // Check for blue_mode from local storage from passed sessions
  if (window.localStorage.blue_mode === "active") {
    toggle_blue_mode(true);
  } else {
    toggle_blue_mode(false);
  }

  // Logic for toggling blue mode in one session based on "blue" var
  blue_mode.onclick = function () {
    if (blue === 0) {
      toggle_blue_mode(true);
    } else {
      toggle_blue_mode(false);
    }
  };
}
