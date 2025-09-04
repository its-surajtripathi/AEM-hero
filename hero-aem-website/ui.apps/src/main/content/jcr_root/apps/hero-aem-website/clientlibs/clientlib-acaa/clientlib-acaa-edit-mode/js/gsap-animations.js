function textAnimation(domElement, y = 100) {
  let textTL = gsap.timeline();
  textTL.from(domElement, {
    stagger: {
      amount: 0.5,
      duration: 1,
      y: y,
    },
  });
  return textTL;
}
