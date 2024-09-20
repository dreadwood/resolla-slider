'use strict'

var sliderPage = window.location.hash;
if (sliderPage.length == 0) { sliderPage = 1; }
sliderPage = Number(sliderPage.replace("#",""))
console.log(sliderPage)

/* Swiper v6.x */
const swiperInstanse = new Swiper('.swiper-container', {
  initialSlide: sliderPage,
	  
  navigation: {
    prevEl: '.gallery__button-left',
    nextEl: '.gallery__button-right'
  },
  slidesPerView: 2,
  slidesPerGroup: 2,
  slidesPerColumn: 3,
  spaceBetween: 10,
  keyboard: {
    pageUpDown: true,
  },

  // set vitrual path((
  //history: {
  //  key: "gallery",
  //  replaceState: true,
  //  root: "gallery",
  //},
  hashNavigation: {
        watchState: true,
  },
  pagination: {
	el: '.swiper-pagination',
	type: 'fraction',
  },

  on: {
    init: async function (swiper) {
      for (let i = 0; i < (countSlides * 6); i++) {
	// (countSlides * 2)
        await loadSlide(swiper, photoIndex + i, username)
      }

      swiper.keyboard.enable()
    },
    
    // slideChange: async function (swiper) {
    //   console.log('slideChange');
    // },

    slideChangeTransitionStart: function (swiper) {
      swiper.keyboard.disable()
    //  console.log('slideChangeTransitionStart', swiper.keyboard.enabled);
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
    //  console.log('slideChangeTransitionEnd', swiper.keyboard.enabled);
    }
  }
})

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
    //slideEl.setAttribute("data-hash", `slide${index}`)
	//var sl = `${index}`
	//sl = Math.floor(sl/6)+1
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

swiperInstanse.slideTo(sliderPage, 500, false);

swiperInstanse.on('realIndexChange', function () {
  console.log('real Index changed');
});
console.log('real and active Index are = ', swiper.realIndex, ' and ', swiper.activeIndex);
