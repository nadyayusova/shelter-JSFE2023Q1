function getBodyScrollTop() {
  return (
    window.pageYOffset ||
    (document.documentElement && document.documentElement.scrollTop) ||
    (document.body && document.body.scrollTop)
  );
}

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

function disableScrolling() {
  document.body.dataset.scroll = document.body.dataset.scroll ? document.body.dataset.scroll : getBodyScrollTop();
  const scrollbarWidth = getScrollbarWidth();
  if (scrollbarWidth) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
  document.body.style.top = `-${document.body.dataset.scroll}px`;
  document.body.classList.add('scroll-lock');
}

function enableScrolling() {
  document.body.classList.remove('scroll-lock');
  window.scrollTo(0, +document.body.dataset.scroll);
  document.body.style.paddingRight = null;
  document.body.style.top = null;
  document.body.removeAttribute('data-scroll');
}

export {disableScrolling, enableScrolling};
