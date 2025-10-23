import type { Project } from "./project.data";

type TabItemProps = {
  project: Project;
  index: number;
  activeIndex: number;
  onClick: (index: number) => void;
  className?: string;
};

const TabItem = ({ project, index, activeIndex, onClick, className }: TabItemProps) => {
  return (
    <div
      className={`${className} tab-item cursor-pointer min-h-[100px] rounded-2xl border p-5 flex-1 transition-transform ${
        activeIndex === index
          ? 'bg-white/10 border-cyan-500 scale-105'
          : 'bg-white/5 border-white/10 hover:scale-105'
      }`}
      onClick={() => onClick(index)}
    >
      <h3 className="text-xl sm:text-2xl font-semibold text-cyan-500">{project.title}</h3>
      <p className="mt-2 text-white/75 sm:text-base">{project.subtitle}</p>
    </div>
  );
};

export default TabItem;
