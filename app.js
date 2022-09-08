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
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "slide",
      })
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
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .addIndicators({
        colorStart: `white`,
        colorTrigger: `white`,
        name: "page",
        indent: 200,
      })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}

// let controller;
// let slideScene;

animateSlides();
