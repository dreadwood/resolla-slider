'use strict'

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
			afterInit: function () {
				const swiper = document.querySelector('.swiper-container').swiper;
				var swai = Math.ceil(swiper.activeIndex/swiper.params.slidesPerGroup)+1;
				if (swai < 1) {
					swai = 1;
					document.location.hash = swai;
				}
				slideslide();
				console.log('afterInit', swai);
			},
			
			slideChange: function () {
				const swiper = document.querySelector('.swiper-container').swiper;
				swai = Math.ceil(swiper.activeIndex/swiper.params.slidesPerGroup)+1;
				document.location.hash = swai;
				
				console.log('slideChange swai',swai,'=',swiper.activeIndex,'/',swiper.params.slidesPerGroup);
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

function slideslide() {
	let sliderhash = Number(window.location.hash.replace("#",""));
	const swiper = document.querySelector('.swiper-container').swiper;
	//console.log(sliderhash,'<>',swiper.slides.length/(swiper.params.slidesPerView*swiper.params.slidesPerColumn));
	const slidenum = swiper.params.slidesPerView * swiper.params.slidesPerColumn;
	if (sliderhash > swiper.slides.length/slidenum) {
		console.log(sliderhash,'>',swiper.slides.length/slidenum);
		const swlen = swiper.slides.length;
		const swlennew = swlen + (sliderhash - swlen/slidenum) * slidenum;
		console.log('swlen ',swlen,' swlennew ',swlennew);
		for (let sl=swlen+1; sl<=swlennew; sl++) {
			swiper.appendSlide('<div class="swiper-slide" data-hash="'+sl.toString()+'">Slide '+sl.toString()+'</div>');
			console.log('sl=',sl);
		}
	swiper.slideTo((sliderhash-1) * slidenum, 50, false);
	} 
	console.log('sliderhash ',sliderhash,', new len ',swiper.slides.length, ', swiper.activeIndex', swiper.activeIndex);
}
