import { animate, inView, stagger,motionValue,frame } from "motion";

inView("section h2", (element) => {
  animate(
    element,
    { opacity: 1, x: [-100, 0] },
    {
      type: "spring",
      duration: 0.9,
      easing: [0.17, 0.55, 0.55, 1],
    }
  );

  return () => animate(element, { opacity: 1, x: 0 });
});

inView(".skills", (element) => {
  animate(
    ".skills li",
    { opacity: [0, 1], x: [-100, 0] },
    {
      type: "spring",
      delay: stagger(0.05),
      duration: 0.2,
      // easing: [0.17, 0.55, 0.55, 1],
    }
  );

  return () => animate(element, { opacity: 1, x: -0 });
});

inView("#wrapper", (element) => {
  animate(
    "#wrapper .project",
    { opacity: 1, scale: [0, 1] },
    {
      type: "spring",
      delay: stagger(0.5),
      duration: 0.9,
      // easing: [0.17, 0.55, 0.55, 1],
    }
  );

  return () => animate(element, { opacity: 1, scale: 1 });
});

inView(".timeline-wrapper", (element) => {
  animate(
    ".timeline-wrapper .box",
    { opacity: 1, scale: [0, 1] },
    {
      type: "spring",
      delay: stagger(0.1),
      duration: 0.9,
      // easing: [0.17, 0.55, 0.55, 1],
    }
  );

  return () => animate(element, { opacity: 1, scale: 1 });
});


const ball = document.querySelector(".ball")

const { top, left, width, height } = ball.getBoundingClientRect()
const initialX = left + width / 2
const initialY = top + height / 2

const pointerX = motionValue(0)
const pointerY = motionValue(0)

function springToPointer() {
  animate(
    ball,
    {
      x: pointerX.get() - initialX,
      y: pointerY.get() - initialY,
    },
    { type: "spring", stiffness: 100, damping: 10 }
  )
}

function scheduleSpringToPointer() {
  /**
   * By using `frame.postRender`, we achieve two things:
   * 1. The animation will be triggered at the end of the animation loop, giving
   *    any existing spring animations a chance to run for a frame and render.
   * 2. Debounce the animation to prevent a new one being triggered every pointer
   *    move, which could be more regular than the animation loop.
   */
  frame.postRender(springToPointer)
}

pointerX.on("change", scheduleSpringToPointer)
pointerY.on("change", scheduleSpringToPointer)

document.addEventListener("pointermove", (e) => {
  pointerX.set(e.clientX)
  pointerY.set(e.clientY)
})
