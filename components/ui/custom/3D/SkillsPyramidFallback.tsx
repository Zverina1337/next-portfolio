/**
 * Fallback версия Skills пирамиды для древних браузеров без Canvas 2D
 * Использует CSS Grid для пирамидальной раскладки (< 0.1% пользователей)
 */

import type { Skill } from "@/components/types/skills";

interface SkillsPyramidFallbackProps {
  skills: Skill[];
}

export default function SkillsPyramidFallback({ skills }: SkillsPyramidFallbackProps) {
  const pyramidSkills = skills.slice(0, 17);

  // Разбиваем на ряды пирамиды
  const row1 = pyramidSkills.slice(0, 8); // 8 кубов
  const row2 = pyramidSkills.slice(8, 13); // 5 кубов
  const row3 = pyramidSkills.slice(13, 16); // 3 куба
  const row4 = pyramidSkills.slice(16, 17); // 1 куб

  const SkillCard = ({ skill }: { skill: Skill }) => {
    const isImagePath = skill.icon.startsWith("/") || skill.icon.startsWith("http");

    return (
      <div className="group relative overflow-hidden rounded-lg border-2 border-cyan-500/30 bg-black p-3 transition-all duration-300 hover:scale-105 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 sm:p-4">
        {/* Градиентный glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Контент */}
        <div className="relative flex flex-col items-center gap-2">
          {/* Иконка */}
          {isImagePath ? (
            <img src={skill.icon} alt={skill.name} className="h-12 w-12 object-contain sm:h-16 sm:w-16" />
          ) : (
            <span className="text-4xl sm:text-5xl">{skill.icon}</span>
          )}

          {/* Название */}
          <span className="text-center text-xs font-bold text-cyan-400 sm:text-sm">{skill.name}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black py-12">
      <div className="mx-auto max-w-6xl space-y-4 px-4 sm:space-y-6">
        {/* Ряд 1: 8 кубов */}
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8 sm:gap-4">
          {row1.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>

        {/* Ряд 2: 5 кубов */}
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4">
          {row2.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>

        {/* Ряд 3: 3 куба */}
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-3 sm:gap-4">
          {row3.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>

        {/* Ряд 4: 1 куб */}
        <div className="mx-auto flex max-w-[150px] justify-center">
          {row4.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      </div>

      {/* Градиент сверху */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-transparent via-slate-950/40 to-transparent" />
    </div>
  );
}
