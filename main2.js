'use strict'

const username = 'smenshov'
const photoIndex = 1
const countSlides = 30

const gContainer = document.querySelector('.gallery__container')
const gBtnLeft = document.querySelector('.gallery__button-left')
const gBtnRight = document.querySelector('.gallery__button-right')

const swiperInstanse = new Swiper('.swiper-container', {
  navigation: {
    prevEl: '.gallery__button-left',
    nextEl: '.gallery__button-right'
  },
  slidesPerView: 2,
  grid: {
    rows: 2,
  },
  slidesPerGroup: 2,
  
  spaceBetween: 10,
  keyboard: {
    pageUpDown: true,
  },

  hashNavigation: {
        watchState: true,
  },
  pagination: {
	el: '.swiper-pagination',
	type: 'fraction',
  },

//observer: true,

  on: {
    init: async function (swiper) {
	//for (let i = 0; i < (countSlides * 2); i++) {
      for (let i = 0; i < countSlides; i++) {
        await loadSlide(swiper, photoIndex + i, username)
      }

      swiper.keyboard.enable()
    },
    
    // slideChange: async function (swiper) {
    //   console.log('slideChange');
    // },

    slideChangeTransitionStart: function (swiper) {
      swiper.keyboard.disable()
      console.log('slideChangeTransitionStart', swiper.keyboard.enabled);
    },

    slideChangeTransitionEnd: async function (swiper) {
      const nextIndex = swiper.slides.length + 1
      if (swiper.isEnd) {
        for (let i = 0; i < countSlides; i++) {
          await loadSlide(swiper, nextIndex + i, username)
        }
      }

      if (!swiper.isBeginning) {
        gBtnLeft?.removeAttribute('disabled', 'disabled')
      }

      if (!swiper.isEnd) {
        gBtnRight?.removeAttribute('disabled', 'disabled')
      }

      swiper.keyboard.enable()
      console.log('slideChangeTransitionEnd', swiper.keyboard.enabled);
    }
  }
})

//swiperInstanse.slideTo(window.location.hash.replace("#",""), 500, false);

gBtnLeft?.addEventListener('click', () => {
  gBtnLeft?.setAttribute('disabled', 'disabled')
})
gBtnRight?.addEventListener('click', () => {
  gBtnRight?.setAttribute('disabled', 'disabled')
})

async function loadSlide(swiper, index, username) {
  const imgUrl = `https://resolla.com/faces/${username}/${index}.jpg`

  try {
    const res = await fetch(imgUrl)

    if (!res.ok) {
      console.warn(`Image ${imgUrl} not found.`)
      return
    }

    const slideEl = document.createElement('div')
    slideEl.classList.add('swiper-slide')
    slideEl.id = `slide-${username}-${index}`

    //slideEl.setAttribute("data-history", `slide${index}`)
    slideEl.setAttribute("data-hash", `${index}`)

    const imgEl = document.createElement('img')
    imgEl.src = imgUrl

    slideEl.appendChild(imgEl)
    swiper.appendSlide(slideEl)
    
  } catch (err) {
    console.error('Error fetching image:', err)
  }

  return
}
