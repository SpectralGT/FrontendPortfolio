import { animate, inView, stagger } from "motion";

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

  return () => animate(element, { opacity: 0, x: -100 });
});

inView(".skills li", (element) => {
  animate(
    ".skills li",
    { opacity: [0, 1], x: [-100, 0] },
    {
      delay: stagger(0.05),
      duration: 0.1,
      // easing: [0.17, 0.55, 0.55, 1],
    }
  );

  return () => animate(element, { opacity: 0, x: -100 });
});
