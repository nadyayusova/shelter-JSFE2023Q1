import {petsData} from "./incoming-data.js";
import {shuffle} from "./utils.js";

const PREV = 'prev';
const NEXT = 'next';

let incomingDataLength = 0;
const indexesArray = [];
let slidesArray = [];

const slider = document.querySelector('[data-slider]');
const slides = slider ? slider.querySelector('.slider__slides') : null;
const slide0 = slider ? slides.children[0] : null;
const btnPrev = slider ? slider.querySelector('.slider__btn--prev') : null;
const btnNext = slider ? slider.querySelector('.slider__btn--next') : null;

let slidesOnSreen = 3;
let slidesWindowWidth = 990;
let slideWidth = 270;
let slideRM = 90;
let direction;


const getSlidesCount = () => {
  slideWidth = slide0.getBoundingClientRect().width;
  slideRM = +getComputedStyle(slide0).marginRight.slice(0, -2);
  const totalWidth = slideWidth + slideRM;
  slidesWindowWidth = slider.querySelector('.slider__slides').getBoundingClientRect().width;
  slidesOnSreen = Math.round((slidesWindowWidth - slideWidth) / totalWidth) + 1;
};

const setSliderParameters = () => {
  slider.dataset.slidesOnScreen = slidesOnSreen;
};

const updateSlidesArray = (arr) => {
  slidesArray = [];
  const upper = slidesOnSreen * 3;
  for (let i = 0; i < upper; i++) {
    slidesArray.push(arr[i] ? arr[i] : arr[0]);
  }
  slidesArray = arr.slice();
  if (arr.length > slidesOnSreen * 3) {
    slidesArray.splice(slidesOnSreen * 3, arr.length - slidesOnSreen * 3);
  }
  if (arr.length < slidesOnSreen * 3) {
    slidesArray.push(arr[0]);
  }
};

const initIncomingData = () => {
  incomingDataLength = petsData.length;

  for (let i = 0; i < incomingDataLength; i++) {
    indexesArray[i] = i;
  }

  const tempArray = indexesArray.slice();
  shuffle(tempArray);
  updateSlidesArray(tempArray);
};

const initSliderPosition = () => {
  slides.style.transition = 'none';
  slides.style.transform = `translateX(-${(slideWidth + slideRM) * slidesOnSreen}px)`;
  setTimeout(() => {
    slides.style.transition = null;
  }, 100);
};

const renderCard = (elem, index, picture = 'all') => {
  const petsDataElem = petsData[slidesArray[index]];

  if (picture === 'all') {
    elem.querySelector('.card__img').innerHTML = `
      <picture>
        <source type="image/webp"
          srcset="${petsDataElem.dir}${petsDataElem.img}.webp, ${petsDataElem.dir}${petsDataElem.img}@2x.webp 2x">
        <img src="${petsDataElem.dir}${petsDataElem.img}.${petsDataElem.ext}"
          srcset="${petsDataElem.dir}${petsDataElem.img}@2x.${petsDataElem.ext} 2x"
          width="270" height="270" alt="The cat Katrine">
      </picture>
      <div class="card__back">
        <picture>
          <source type="image/webp"
            srcset="${petsDataElem.dir}${petsDataElem.img}.webp, ${petsDataElem.dir}${petsDataElem.img}@2x.webp 2x">
          <img src="${petsDataElem.dir}${petsDataElem.img}.${petsDataElem.ext}"
            srcset="${petsDataElem.dir}${petsDataElem.img}@2x.${petsDataElem.ext} 2x"
            width="270" height="270" alt="The cat Katrine">
        </picture>
      </div>
    `;

    elem.querySelector('.card__title').innerHTML = petsDataElem.name;
    elem.dataset.petName = petsDataElem.name;
  }
  if (picture === 'backpic') {
    elem.querySelector('.card__back').innerHTML = `
      <picture>
        <source type="image/webp"
          srcset="${petsDataElem.dir}${petsDataElem.img}.webp, ${petsDataElem.dir}${petsDataElem.img}@2x.webp 2x">
        <img src="${petsDataElem.dir}${petsDataElem.img}.${petsDataElem.ext}"
          srcset="${petsDataElem.dir}${petsDataElem.img}@2x.${petsDataElem.ext} 2x"
          width="270" height="270" alt="The cat Katrine">
      </picture>
    `;
  }
  if (picture === 'frontpic') {
    elem.querySelector('.card__img').children[0].innerHTML = `
      <source type="image/webp"
        srcset="${petsDataElem.dir}${petsDataElem.img}.webp, ${petsDataElem.dir}${petsDataElem.img}@2x.webp 2x">
      <img src="${petsDataElem.dir}${petsDataElem.img}.${petsDataElem.ext}"
        srcset="${petsDataElem.dir}${petsDataElem.img}@2x.${petsDataElem.ext} 2x"
        width="270" height="270" alt="The cat Katrine">
    `;

    elem.querySelector('.card__title').innerHTML = petsDataElem.name;
    elem.dataset.petName = petsDataElem.name;
  }
};

const renderSlides = (scope) => {
  for (let i = 0; i < slidesArray.length; i++) {
    renderCard([...slides.children][i], i, scope);
  }
};

const generateData = (array) => {
  const tempArray = indexesArray.slice();

  // убрать из временного массива все, из чего нельзя выбирать
  for (let i = 0; i < array.length; i++) {
    tempArray.splice(tempArray.indexOf(array[i]), 1);
  }

  shuffle(tempArray);

  if (tempArray.length > slidesOnSreen) {
    tempArray.splice(slidesOnSreen, tempArray.length);
  }

  return tempArray;
};

const moveRight = () => {
  console.log('PREV, сдвиг вправо');

  console.log('слайды до сдвига ', slidesArray);

  slidesArray.splice(0 + slidesOnSreen * 2, slidesOnSreen);
  console.log('что сохраняем ', slidesArray);

  const tempArray = slidesArray.slice(0, slidesOnSreen);
  console.log('не участвует в генерации ', tempArray);

  const freeNumbers = generateData(tempArray);
  for (let i = 0; i < slidesOnSreen; i++) {
    slidesArray.unshift(freeNumbers[i]);
  }
  console.log('новые слайды ', slidesArray);
};

const moveLeft = () => {
  console.log('NEXT, сдвиг влево');
  console.log('слайды до сдвига ', slidesArray);

  slidesArray.splice(0, slidesOnSreen);
  console.log('что сохраняем ', slidesArray);

  const tempArray = slidesArray.slice(slidesOnSreen, slidesOnSreen * 2);
  console.log('не участвует в генерации ', tempArray);

  const freeNumbers = generateData(tempArray);
  for (let i = 0; i < slidesOnSreen; i++) {
    slidesArray.push(freeNumbers[i]);
  }
  console.log('новые слайды ', slidesArray);
};

const moveSlides = {
  [PREV]: moveRight,
  [NEXT]: moveLeft,
};

const onNavBtnClick = (evt) => {
  // to right
  let transform = null;
  direction = PREV;
  // to left
  if (evt.target.classList.contains(`slider__btn--${NEXT}`)) {
    transform = `translateX(-${(slideWidth + slideRM) * 2 * slidesOnSreen}px)`;
    direction = NEXT;
  }
  slides.style.transform = transform;
  btnPrev.removeEventListener('click', onNavBtnClick);
  btnNext.removeEventListener('click', onNavBtnClick);

  moveSlides[direction]();
  renderSlides('backpic');

  slides.addEventListener('transitionend', onTransitionEnd);
}

const onTransitionEnd = (evt) => {
  if (evt.target.classList.contains('slider__slides')) {
    slides.style.transition = 'none';

    renderSlides('frontpic');

    slides.style.transform = `translateX(-${(slideWidth + slideRM) * slidesOnSreen}px)`;
    slides.removeEventListener('transitionend', onTransitionEnd);

    setTimeout(() => {
      slides.style.transition = null;
      btnPrev.addEventListener('click', onNavBtnClick);
      btnNext.addEventListener('click', onNavBtnClick);
    }, 100);
  }
};

const onEndWindowResize = () => {
  renderSlides('all');
};

const onWindowResize = () => {
  getSlidesCount();
  setSliderParameters();
  initSliderPosition();
  updateSlidesArray(indexesArray);
};

let endResize;

const initSlider = () => {
  if (slider) {
    getSlidesCount();
    setSliderParameters();
    initSliderPosition();
    initIncomingData();
    renderSlides('all');

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('resize', () => {
      clearTimeout(endResize);
      endResize = setTimeout(onEndWindowResize, 500);
    });
    btnPrev.addEventListener('click', onNavBtnClick);
    btnNext.addEventListener('click', onNavBtnClick);
  }
};

export {initSlider};
