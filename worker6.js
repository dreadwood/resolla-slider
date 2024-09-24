'use strict'

/* Swiper v6.x */
const swiperInstanse = new Swiper('.swiper-container', {
  slidesPerView: 2,
  slidesPerGroup: 2,
  slidesPerColumn: 1,
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
        await loadSlide(swiper, photoIndex + i, username)
      }
      swiper.keyboard.enable()
    },

    slideChangeTransitionStart: function (swiper) {
      swiper.keyboard.disable()
    },

    slideChangeTransitionEnd: async function (swiper) {
      const nextIndex = swiper.slides.length + 1
      if (swiper.isEnd) {
        for (let i = 0; i < countSlides; i++) {
          await loadSlide(swiper, nextIndex + i, username)
        }
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
	slideEl.setAttribute("id", `${index}`)

    const imgEl = document.createElement('img')
    imgEl.src = imgUrl

    slideEl.appendChild(imgEl)
    swiper.appendSlide(slideEl)
    
  } catch (err) {
    console.error('Error fetching image:', err)
  }

  return
}

function slideslide() {
	let sliderhash = Number(window.location.hash.replace("#",""));
	const swiper = document.querySelector('.swiper-container').swiper;
	if (swiper.slides.length < sliderhash) {
		console.log(sliderhash,'>',swiper.slides.length);
		for (let sl=swiper.slides.length+1; sl<=sliderhash; sl++) {
			swiper.appendSlide('<div class="swiper-slide" data-hash="'+sl.toString()+'">Slide '+sl.toString()+'</div>');
			console.log('sl= ',sl);
		}
	}
	console.log(sliderhash,' new len ',swiper.slides.length);
	swiper.slideTo(sliderhash, 50, false);
}
