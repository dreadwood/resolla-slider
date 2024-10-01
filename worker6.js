'use strict'

var datahash = 0; // slider fix

/* Swiper v6.x */
const swiperInstanse = new Swiper('.swiper-container', {
  slidesPerView: 3,
  slidesPerGroup: 3,
  slidesPerColumn: 3,
  spaceBetween: 10,
  navigation: {
    prevEl: '.gallery__button-left',
    nextEl: '.gallery__button-right'
  },
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

  on: {
    init: async function (swiper) {
      for (let i = 0; i < (countSlides * 3); i++) {
        //datahash = Math.floor(i/2) + 1;
        datahash = Math.floor(i/swiper.params.slidesPerView) + 1;
        await loadSlide(swiper, photoIndex + i, username, datahash);
      }
      //console.log('datahash 1',datahash);
      swiper.keyboard.enable()
    },

    slideChangeTransitionStart: function (swiper) {
      swiper.keyboard.disable()
    },

    slideChangeTransitionEnd: async function (swiper) {
      const nextIndex = swiper.slides.length + 1;
      if (swiper.isEnd) {
        for (let i = 0; i < 2*countSlides; i++) {
          //await loadSlide(swiper, nextIndex + i, username, datahash+Math.floor(i/2) + 1);
          await loadSlide(swiper, nextIndex + i, username, datahash+Math.floor(i/swiper.params.slidesPerView) + 1);
        }
        //console.log('datahash 2',datahash);
        //datahash = datahash + Math.floor((2*countSlides-1)/2) + 1;
        datahash = datahash + Math.floor((2*countSlides-1)/swiper.params.slidesPerView) + 1;
        //console.log('datahash 3',datahash);
      }
	    swiper.updateSlides()

      if (!swiper.isBeginning) {
        gBtnLeft?.removeAttribute('disabled', 'disabled')
      }

      if (!swiper.isEnd) {
        gBtnRight?.removeAttribute('disabled', 'disabled')
      }

      swiper.keyboard.enable()
    },
  }, // on
}) // swiper

gBtnLeft?.addEventListener('click', () => {
  gBtnLeft?.setAttribute('disabled', 'disabled')
})
gBtnRight?.addEventListener('click', () => {
  gBtnRight?.setAttribute('disabled', 'disabled')
})

async function loadSlide(swiper, index, username, datahash) {
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

    slideEl.setAttribute("data-hash", `${datahash}`)

    const imgEl = document.createElement('img')
    imgEl.src = imgUrl

    slideEl.appendChild(imgEl)
    swiper.appendSlide(slideEl)
    
  } catch (err) {
    console.error('Error fetching image:', err)
  }

  return
}
