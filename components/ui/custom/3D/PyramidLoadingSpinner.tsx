/**
 * Loading спиннер для Skills пирамиды
 * Используется во время загрузки 3D/2D версии или device detection
 */

export default function PyramidLoadingSpinner() {
  return (
    <div className="flex h-[600px] sm:h-[750px] lg:h-[900px] w-full items-center justify-center">
      <div className="relative h-32 w-32">
        {/* Анимированное кольцо */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-800/30" />
        <div
          className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-cyan-500"
          style={{
            animationDuration: "1s",
          }}
        />

        {/* Glow эффект */}
        <div
          className="absolute inset-0 animate-pulse rounded-full bg-cyan-500/10 blur-xl"
          style={{
            animationDuration: "2s",
          }}
        />
      </div>
    </div>
  );
}
