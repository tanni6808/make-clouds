import { useEffect } from "react";
export function useScrollToWorkspace() {
  useEffect(() => {
    const isSmallScreen = window.innerWidth <= 768;
    const stepNavEl = document.getElementById("step-nav");
    if (stepNavEl) {
      if (isSmallScreen)
        stepNavEl.scrollIntoView({ behavior: "smooth", block: "end" });
      else stepNavEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);
}
