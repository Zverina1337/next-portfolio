type ProjectVideoProps = {
  videoSrc?: string;
  subtitle: string;
};

const ProjectVideo = ({ videoSrc, subtitle }: ProjectVideoProps) => {
  return (
    <div className="relative w-full mx-auto rounded-2xl overflow-hidden border border-white/10 aspect-video z-10">
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        className="w-full h-full object-cover rounded-2xl bg-black"
      />
      <div className="absolute bottom-4 left-4 text-white/80 text-sm sm:text-base z-10">
        {subtitle}
      </div>
    </div>
  );
};

export default ProjectVideo;
