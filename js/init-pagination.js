import {petsData} from "./incoming-data.js";
import {shuffle} from "./utils.js";

const CARDS_PER_PAGE = {
  desktop: 8,
  tablet: 6,
  mobile: 3,
};

const TOTAL_SLIDES = 48;

const breakpointTablet = window.matchMedia('(max-width: 1023px)');
const breakpointMobile = window.matchMedia('(max-width: 767px)');

let cardsOnSreen = CARDS_PER_PAGE.desktop;
let currentPage = 0;
let incomingDataLength = 8;
const indexesArray = [];
let slidesArray = [];

const cards = document.querySelector('[data-pagination] .gallery__cards-wrapper');
const page = document.querySelector('[data-pagination] [data-current-page]');
const btnFirst = document.querySelector('[data-pagination] [data-first-page]');
const btnPrev = document.querySelector('[data-pagination] [data-prev-page]');
const btnNext = document.querySelector('[data-pagination] [data-next-page]');
const btnLast = document.querySelector('[data-pagination] [data-last-page]');


const initIncomingData = () => {
  // incomingDataLength = petsData.length;
  for (let i = 0; i < incomingDataLength; i++) {
    indexesArray[i] = i;
  }

  let c = 0;
  for (let i = 0; i < TOTAL_SLIDES / incomingDataLength; i++) {
    if (c === 0) {
      const copy = indexesArray.slice();
      shuffle(copy);
      slidesArray.push(...copy);

      c = c - CARDS_PER_PAGE.tablet + CARDS_PER_PAGE.desktop;

    } else {
      const tempArray = slidesArray.slice(-c);

      const copy = indexesArray.slice();
      shuffle(copy);

      for (let i = 0; i < tempArray.length; i++) {
        copy.splice(copy.indexOf(tempArray[i]), 1);
      }

      // shuffle(copy);
      slidesArray.push(...copy);
      shuffle(tempArray);
      slidesArray.push(...tempArray);

      c = c - CARDS_PER_PAGE.tablet + CARDS_PER_PAGE.desktop;
      if (c === 6) {
        c = 0;
      }
    }
  }
};

const renderGallery = () => {
  cards.innerHTML = '';

  for (let i = 0; i < cardsOnSreen; i++) {
    const elem = document.createElement('div');
    elem.classList.add('card', 'gallery__card');
    elem.dataset.openPopup = 'info';
    elem.innerHTML = `
      <div class="card__img"></div>
      <p class="card__title"></p>
      <button class="btn card__btn" type="button">Learn more</button>
    `;
    cards.append(elem);
  }
};

const renderCard = (elem, index) => {
  const petsDataElem = petsData[slidesArray[index]];

  elem.querySelector('.card__img').innerHTML = `
    <picture>
      <source type="image/webp"
        srcset="${petsDataElem.dir}${petsDataElem.img}.webp, ${petsDataElem.dir}${petsDataElem.img}@2x.webp 2x">
      <img src="${petsDataElem.dir}${petsDataElem.img}.${petsDataElem.ext}"
        srcset="${petsDataElem.dir}${petsDataElem.img}@2x.${petsDataElem.ext} 2x"
        width="270" height="270" alt="The cat Katrine">
    </picture>
  `;

  elem.querySelector('.card__title').innerHTML = petsDataElem.name;
  elem.dataset.petName = petsDataElem.name;
};

const renderCards = () => {
  for (let i = 0; i < cardsOnSreen; i++) {
    renderCard([...cards.children][i], i + currentPage * cardsOnSreen);
  }

  page.innerHTML = `${currentPage + 1}`;
};

const breakpointChecker = () => {
  if (!breakpointTablet.matches) {
    cardsOnSreen = CARDS_PER_PAGE.desktop;
  }

  if (breakpointTablet.matches) {
    cardsOnSreen = CARDS_PER_PAGE.tablet;
  }

  if (breakpointMobile.matches) {
    cardsOnSreen = CARDS_PER_PAGE.mobile;
  }

  currentPage = 0;
  btnNext.disabled = false;
  btnLast.disabled = false;
  btnFirst.disabled = true;
  btnPrev.disabled = true;
  renderGallery();
  renderCards();
};

const onFirstBtnClick = () => {
  if (currentPage > 0) {
    currentPage = 0;
    btnNext.disabled = false;
    btnLast.disabled = false;
    btnFirst.disabled = true;
    btnPrev.disabled = true;
  }

  renderCards();
};

const onPrevBtnClick = () => {
  if (currentPage > 0) {
    currentPage--;
    btnNext.disabled = false;
    btnLast.disabled = false;
  }

  if (currentPage === 0) {
    btnFirst.disabled = true;
    btnPrev.disabled = true;
  }

  renderCards();
};

const onNextBtnClick = () => {
  if (currentPage < (TOTAL_SLIDES / cardsOnSreen - 1)) {
    currentPage++;
    btnFirst.disabled = false;
    btnPrev.disabled = false;
  }

  if (currentPage === (TOTAL_SLIDES / cardsOnSreen - 1)) {
    btnNext.disabled = true;
    btnLast.disabled = true;
  }

  renderCards();
};

const onLastBtnClick = () => {
  if (currentPage < (TOTAL_SLIDES / cardsOnSreen - 1)) {
    currentPage = TOTAL_SLIDES / cardsOnSreen - 1;
    btnFirst.disabled = false;
    btnPrev.disabled = false;
    btnNext.disabled = true;
    btnLast.disabled = true;
  }

  renderCards();
};

const initPagination = () => {
  if (cards) {
    initIncomingData();

    breakpointTablet.addListener(breakpointChecker);
    breakpointMobile.addListener(breakpointChecker);
    breakpointChecker();

    btnFirst.addEventListener('click', onFirstBtnClick);
    btnPrev.addEventListener('click', onPrevBtnClick);
    btnNext.addEventListener('click', onNextBtnClick);
    btnLast.addEventListener('click', onLastBtnClick);
  }
};

export {initPagination};
