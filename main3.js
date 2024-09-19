"use strict";

const username = "smenshov";
const photoIndex = 1;
const countSlides = 30;

const gContainer = document.querySelector(".gallery__container");
const gBtnLeft = document.querySelector(".gallery__button-left");
const gBtnRight = document.querySelector(".gallery__button-right");

const swiperInstanse = new Swiper(".swiper-container", {
  navigation: {
    prevEl: ".gallery__button-left",
    nextEl: ".gallery__button-right",
  },
  spaceBetween: 10,
  speed: 1000,

  grid: {
    rows: 3,
  },
  slidesPerGroup: 2,
  slidesPerView: 2,

  keyboard: {
    pageUpDown: true,
  },

  hashNavigation: {
    watchState: true,
  },

  pagination: {
    el: ".swiper-pagination",
    type: "fraction",
  },
});
