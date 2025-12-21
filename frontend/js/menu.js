function initMenu() {
  let burgerBtn = document.querySelector(".menu");
  const menu_items = document.querySelector(".menu-items");
  let show = true;

  burgerBtn.onclick = function () {
    if (show) {
      menu_items.style.transform = "translateX(0)";
      burgerBtn.style.left = "340px";
      show = false;
    } else {
      menu_items.style.transform = "translateX(-338px)";
      burgerBtn.style.left = "10px";
      show = true;
    }
  };
}
