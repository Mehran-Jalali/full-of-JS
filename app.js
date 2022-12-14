let controller;
let slideScene;
let pageScene;
let detailScene;

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
const mouse = document.querySelector(`.cursor`);
const mouseTxt = mouse.querySelector(`span`);
const burger = document.querySelector(".burger");
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
let nav = document.querySelector(`.nav-header`);
function navToggle(e) {
  if (!e.target.classList.contains(`active`)) {
    e.target.classList.add(`active`);
    nav.classList.add(`active`);

    gsap.to(".line2", { opacity: 0 });
    gsap.to(".line1", 0.5, {
      rotate: "45deg",
      y: 5,
      background: "black",
    });
    gsap.to(".line3", 0.5, {
      rotate: "+135deg",
      y: -11,
      background: "black",
    });
    gsap.to("#logo", 0.5, { color: "black" });
    gsap.to(".nav-bar", 1, {
      clipPath: `circle(1500px at 100% -10%)`,
      zIndex: 100,
    });
    document.body.style.overflowY = "hidden";
  } else {
    e.target.classList.remove(`active`);
    nav.classList.remove(`active`);

    gsap.to(".line2", { opacity: 1 });
    gsap.to(".line1", 0.5, {
      rotate: "0deg",
      y: 0,
      background: "white",
    });
    gsap.to(".line3", 0.5, {
      rotate: "0deg",
      y: 0,
      background: "white",
    });
    gsap.to("#logo", 0.5, { color: "white" });
    gsap.to(".nav-bar", 1, {
      clipPath: `circle(50px at 100% -10%)`,
      zIndex: -1,
    });
    document.body.style.overflowY = "scroll";
  }
}
//
//---------Barba Page Transition------------
//1) Initialize barba
//2) Add data-barba="wrapper" to your html's body for contents, you don't wanna change.
//3) Add data-barba="container" for contents that you wanna change and name them with   data-barba-namespace="anyThing"
const logo = document.querySelector("#logo");
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSlides();
        logo.href = "./index.html";
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logo.href = "../index.html";
        detailAnimation();
      },
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        // create an animation before leaving the current page
        const tl = new gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          ".swipe",
          1,
          { y: "100%" },
          { y: "0%", onComplete: done, ease: Bounce.easeOut },
          "-=0.2"
        );
      },
      enter({ current, next }) {
        let done = this.async();
        //Before we enter ==>Scroll to the top
        window.scrollTo(0, 0);

        // create an animation before leaving the current page
        const tl = new gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(
          ".swipe",
          1,
          { y: "0%" },
          {
            y: "-100%",
            stagger: 0.2,
            onComplete: done,
            ease: Bounce.easeOut,
          },
          "-=0.2"
        );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
      },
    },
  ],
});

function detailAnimation() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".detail-slide");
  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({
      defaults: {
        duration: 1,
      },
    });
    let nextSlide = slides.length - 1 === index ? `end` : slides[index + 1];
    const nextImg = nextSlide.querySelector("img");
    slideTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    slideTl.fromTo(
      nextSlide,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1 },
      "-=1"
    );
    slideTl.fromTo(nextImg, { x: "30%" }, { x: "0%" });
    // Create Scene
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setTween(slideTl)
      .setPin(slide, { pushFollowers: false })
      //   .addIndicators({
      //     colorStart: "white",
      //     colorTrigger: "white",
      //     name: "detailScene",
      //   })
      .addTo(controller);
  });
}
//Event-Listeners:

burger.addEventListener(`click`, navToggle);
window.addEventListener(`mousemove`, cursor);
window.addEventListener(`mouseover`, activeCursor);
