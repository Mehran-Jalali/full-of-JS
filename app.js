let controller;
let slideScene;
let pageScene;

function animateSlides() {
  //initiate the controller here
  controller = new ScrollMagic.Controller();
  //Select smth
  const sliders = document.querySelectorAll(`.slide`);
  const nav = document.querySelector(`.nav-header`);
  //Loop over each slide
  sliders.forEach((slide, index, slides) => {
    // →☺→ Never forget to write (( slide.querySelector )) at beginning NOT document ↓↓↓↓
    const revealImg = slide.querySelector(`.reveal-img`);
    const img = slide.querySelector(`img`);
    const revealText = slide.querySelector(`.reveal-text`);
    //--->gsap is added in index.html (gsap cdn)<---//
    //GSAP ==> first parameter is what you wanna move.
    //Gsap ==> second parameter is time (s).
    //Gsap ==> third parameter is an Object with changable property like (x) moving ver or hor,
    // (scale) to make it larger and (opacity)

    // gsap.to(revealImg, 1, { x: `100%` });
    // gsap.to(img, 1, { scale: 2 });

    // or for more options in GSAP you can make a varialble

    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });
    slideTl.fromTo(revealImg, { x: "0%" }, { x: "+100%" });
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    slideTl.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");
    //------------------------
    //initiate the slideScene here
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideTl)
      //   .addIndicators({
      //     colorStart: "white",
      //     colorTrigger: "white",
      //     name: "slide",
      //   })
      .addTo(controller);
    //----------------
    //New Animation
    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? `end` : slides[index + 1];
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(
      slide,
      { opacity: 1, scale: 1 },
      { opacity: 0.5, scale: 0.1 }
    );
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, `-=0.5`);

    //Create pageScene
    // →☺→ Never forget to write (( new )) at beginning ↓↓↓↓
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      //   .addIndicators({
      //     colorStart: `white`,
      //     colorTrigger: `white`,
      //     name: "page",
      //     indent: 200,
      //   })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}
let mouse = document.querySelector(`.cursor`);
let mouseTxt = mouse.querySelector(`span`);
function cursor(e) {
  mouse.style.top = e.pageY + `px`;
  mouse.style.left = e.pageX + `px`;
}
function activeCursor(e) {
  const item = e.target;
  if (item.id === `logo` || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  const bTl = new gsap.timeline({
    defaults: { duration: 1, ease: "bounce.out", y: -500 },
  });
  if (item.classList.contains("explore")) {
    mouse.classList.add("exp-active");
    bTl.to(".title-swipe", 1.5, { y: "0%" });
    mouseTxt.innerText = `Tap`;
    mouseTxt.style.color = `blue`;
  } else {
    mouse.classList.remove("exp-active");
    bTl.to(".title-swipe", 1, { y: "100%" });
    mouseTxt.innerText = ``;
    mouseTxt.style.color = ``;
  }
}
window.addEventListener(`mousemove`, cursor);
window.addEventListener(`mouseover`, activeCursor);

animateSlides();
