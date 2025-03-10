import hero from "../../assets/hero-image.jpg";

function HeroSection() {
  return (
    <div className="hero-container w-full sm:h-[200px] md:h-[300px] lg:h-[400px]">
      <img src={hero} className="w-full h-full object-cover" alt="Hero Image" />
    </div>
  );
}

export default HeroSection;
