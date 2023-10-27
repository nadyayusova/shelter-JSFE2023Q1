import {disableScrolling, enableScrolling} from "./scroll-lock.js";
import {petsData} from "./incoming-data.js";

const POPUP_TIMEOUT = 400;

function onDocumentClick(evt) {
  const target = evt.target;

  if (!target.closest('[data-open-popup]')) {
    return;
  }

  evt.preventDefault();

  const popupName = target.closest('[data-open-popup]').dataset.openPopup;
  if (!popupName) {
    return;
  }
  const petName = target.closest('[data-open-popup]').dataset.petName;

  openPopup(popupName, petName);
}

function onDocumentKeydown(evt) {
  const isEscKey = evt.key === 'Escape' || evt.key === 'Esc';

  if (isEscKey) {
    evt.preventDefault();
    closePopup(document.querySelector('.popup.is-active').dataset.popup);
  }
}

function onPopupClick(evt) {
  const target = evt.target;

  if (!target.closest('[data-close-popup]')) {
    return;
  }

  closePopup(target.closest('[data-popup]').dataset.popup);
}

function addListeners(popup) {
  popup.addEventListener('click', onPopupClick);
  document.addEventListener('keydown', onDocumentKeydown);
}

function removeListeners(popup) {
  popup.removeEventListener('click', onPopupClick);
  document.removeEventListener('keydown', onDocumentKeydown);
}

function filterByName(arr, name) {
  return arr.filter((item) => {
      return (item.name === name);
  });
};

function renderPopup(popup, petName) {
  const petData = filterByName(petsData, petName)[0];

  popup.querySelector('.popup__img').innerHTML = `
    <picture>
      <source type="image/webp"
        srcset="${petData.dir}${petData.img}.webp, ${petData.dir}${petData.img}@2x.webp 2x">
      <img src="${petData.dir}${petData.img}.${petData.ext}"
        srcset="${petData.dir}${petData.img}@2x.${petData.ext} 2x"
        width="270" height="270" alt="The cat Katrine">
    </picture>
  `;

  popup.querySelector('.popup__title').innerHTML = petData.name;
  popup.querySelector('.popup__breed').innerHTML = petData.type + ' - ' + petData.breed;
  popup.querySelector('.popup__text').innerHTML = petData.description;
  popup.querySelector('.popup__feature-item:nth-child(1) .popup__feature-name').innerHTML = 'Age';
  popup.querySelector('.popup__feature-item:nth-child(1) .popup__feature-text').innerHTML = petData.age;
  popup.querySelector('.popup__feature-item:nth-child(2) .popup__feature-name').innerHTML = 'Inoculations';
  popup.querySelector('.popup__feature-item:nth-child(2) .popup__feature-text').innerHTML = petData.inoculations.join(', ');
  popup.querySelector('.popup__feature-item:nth-child(3) .popup__feature-name').innerHTML = 'Diseases';
  popup.querySelector('.popup__feature-item:nth-child(3) .popup__feature-text').innerHTML = petData.diseases.join(', ');
  popup.querySelector('.popup__feature-item:nth-child(4) .popup__feature-name').innerHTML = 'Parasites';
  popup.querySelector('.popup__feature-item:nth-child(4) .popup__feature-text').innerHTML = petData.parasites.join(', ');
}

function openPopup(popupName, petName) {
  const popup = document.querySelector(`[data-popup="${popupName}"]`);

  if (!popup || popup.classList.contains('is-active')) {
    return;
  }

  document.removeEventListener('click', onDocumentClick);

  renderPopup(popup, petName);

  const openedPopup = document.querySelector('.popup.is-active');
  if (openedPopup) {
    closePopup(openedPopup.dataset.modal);
  }

  popup.classList.add('is-active');

  if (!openedPopup) {
    disableScrolling();
  }

  setTimeout(() => {
    addListeners(popup);
    document.addEventListener('click', onDocumentClick);
  }, POPUP_TIMEOUT);
}

function closePopup(popupName) {
  const popup = document.querySelector(`[data-popup="${popupName}"]`);
  document.removeEventListener('click', onDocumentClick);

  if (!popup || !popup.classList.contains('is-active')) {
    return;
  }

  popup.classList.remove('is-active');
  removeListeners(popup);

  if (document.body.classList.contains('scroll-lock')) {
    setTimeout(() => {
      enableScrolling();
    }, POPUP_TIMEOUT);
  }

  setTimeout(() => {
    document.addEventListener('click', onDocumentClick);
  }, POPUP_TIMEOUT);
}

const initPopup = () => {
  const popups = document.querySelectorAll('.popup');

  if (popups.length) {
    popups.forEach((popup) => {
      setTimeout(() => {
        popup.classList.remove('popup--preload');
      }, 100);
    });

    document.addEventListener('click', onDocumentClick);
  }
};

export {initPopup};
