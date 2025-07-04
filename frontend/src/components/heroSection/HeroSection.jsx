import hero from "../../assets/hero-image.jpg";

function HeroSection() {
  return (
    <div className="relative w-full h-52 sm:h-80 md:h-96 lg:h-[450px] overflow-hidden">
      <img
        src={hero}
        alt="Hero Image"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-orange-500/20"></div>

      <div className="relative z-10 flex items-center justify-center h-full px-4 text-center">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold drop-shadow-md leading-tight max-w-3xl font-sans tracking-wide ">
          Azzipizza <span className="text-primary-500">Mica Pizza e Fichi</span>
        </h1>
      </div>
    </div>
  );
}

export default HeroSection;
