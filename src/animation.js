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
