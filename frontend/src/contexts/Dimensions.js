import { useEffect, useState } from "react";

export const useViewport = () => {
    const [width, setWidth] = useState(window.innerWidth);
  
    useEffect(() => {
      const handleWindowResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleWindowResize);
      return () => window.removeEventListener("resize", handleWindowResize);
    }, []);
  
    // Return the width so we can use it in our components
    return { width };
  }

/**
 * Tracks the width of a component.
 * @param {*} ref The component to track.
 * @returns The width of the component.
 */
export const useComponentWidth = (ref) => {
    const [width, setWidth] = useState(0)

    useEffect(() => {
        const handleResize = () => {
            if (!ref.current) return;
            setWidth(ref.current.offsetWidth);
        }
        if (ref.current) handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [ref]);

    return { width };
}