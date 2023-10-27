import {initPopup} from "./init-popup.js";
import {initMainNav} from "./init-main-nav.js";
import {initSlider} from "./init-slider.js";
import {initPagination} from "./init-pagination.js";


window.addEventListener('load', () => {
  initMainNav();
  initPopup();
  initSlider();
  initPagination();
});
