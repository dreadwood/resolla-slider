'use strict'

var datahash = 0; // slider fix

/* Swiper v6.x */
const swiperInstanse = new Swiper('.swiper-container', {
  slidesPerView: 2,
  slidesPerGroup: 2,
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

    slideChange: function(swiper) {
	document.querySelector(".swiper-pagination-total").innerHTML = 40
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
	    document.querySelector(".swiper-pagination-total").innerHTML = 40
	//    console.log('swiper.slides.length',swiper.slides.length);
	//	console.log(swiper.slides);

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

countSlides = swiperInstanse.params.slidesPerView * swiperInstanse.params.slidesPerColumn;
console.log(countSlides);

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

    let stH = parseInt(window.getComputedStyle(document.querySelector(".gallery__container")).getPropertyValue('height'))
    if (stH) stH = (stH - document.querySelector(".swiper-container").style.paddingBottom - swiper.params.slidesPerColumn * 10) / swiper.params.slidesPerColumn
    else stH = 600
    slideEl.style.height = stH+"px"
    console.log(slideEl.style.height)

    const imgEl = document.createElement('img')
    imgEl.src = imgUrl

    imgEl.style.height = stH+"px"
    console.log(imgEl.style.height)

    slideEl.appendChild(imgEl)
    swiper.appendSlide(slideEl)
    
  } catch (err) {
    console.error('Error fetching image:', err)
  }

  return
}
