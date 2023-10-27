import {disableScrolling, enableScrolling} from "./scroll-lock.js";

const header = document.querySelector('.header');
const mainNav = header ? header.querySelector('.main-nav') : null;
const mainNavBtn = header ? header.querySelector('[data-nav-toggle]') : null;
const menu = mainNav ? mainNav.querySelector('.main-nav__wrapper') : null;
const breakpoint = window.matchMedia('(max-width: 767px)');

const openMenu = () => {
  if (!header.classList.contains('is-open')) {
    enableMenu();
    setTimeout(() => {
      mainNavBtn.setAttribute('aria-label', 'Закрыть меню');
      mainNavBtn.setAttribute('aria-pressed', 'true');
      header.classList.add('is-open');

      document.addEventListener('keydown', onDocumentKeydown);
      disableScrolling();
    }, 100);
  }
};

const closeMenu = () => {
  if (header.classList.contains('is-open')) {
    mainNavBtn.setAttribute('aria-label', 'Открыть меню');
    mainNavBtn.setAttribute('aria-pressed', 'false');
    header.classList.remove('is-open');

    document.removeEventListener('keydown', onDocumentKeydown);
    enableScrolling();
    disableMenu();
  }
};

// отключение ссылок в закрытом меню, чтобы не было перехода по tab
const disableMenu = () => {
  setTimeout(() => {
    menu.classList.add('is-hidden');
  }, 400);
};

const enableMenu = () => {
  menu.classList.remove('is-hidden');
};

const onDocumentClick = (evt) => {
  // клик за пределами меню
  if (!evt.target.closest('.main-nav__wrapper')) {
    closeMenu();
  }
  // нажатие на ссылки
  if (breakpoint.matches && evt.target.closest('.main-nav a[href]')) {
    if (header.classList.contains('is-open')) {
      evt.preventDefault();
      closeMenu();
      setTimeout(() => {
        window.location.href = evt.target.href;
      }, 300);
    }
  }
};

const onNavBtnClick = (evt) => {
  if (breakpoint.matches && evt.target.closest('[data-nav-toggle]')) {
    if (header.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }
};

const onDocumentKeydown = function (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeMenu();
  }
};

const breakpointChecker = () => {
  // чтобы при смене брейка меню не моргало
  menu.classList.add('is-hidden');

  if (!breakpoint.matches) {
    closeMenu();
  }
};

const initMainNav = () => {
  if (header && mainNav) {
    document.addEventListener('click', onDocumentClick);
    mainNavBtn.addEventListener('click', onNavBtnClick);

    breakpoint.addListener(breakpointChecker);
    if (breakpoint.matches) {
      disableMenu();
    }
  }
};

export {initMainNav};
