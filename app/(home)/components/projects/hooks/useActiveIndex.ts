import { useState } from "react";

const useActiveIndex = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleTabClick = (index: number) => {
    setActiveIndex(index);
  };

  return { activeIndex, handleTabClick };
};

export default useActiveIndex;
