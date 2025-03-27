import {
  animate,
  inView,
} from "https://cdn.jsdelivr.net/npm/motion@12.6.0/+esm";
import { delay } from "motion";

inView("section h2", (element) => {
  animate(
    element,
    { opacity: 1, x: [-100, 0] },
    {
      delay: 0.1,
      duration: 0.9,
      easing: [0.17, 0.55, 0.55, 1],
    }
  );

  return () => animate(element, { opacity: 0, x: -100 });
});

console.log("hi");
