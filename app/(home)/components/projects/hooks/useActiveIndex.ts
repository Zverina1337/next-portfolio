import { useState, useCallback } from "react";

const useActiveIndex = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return { activeIndex, handleTabClick };
};

export default useActiveIndex;
