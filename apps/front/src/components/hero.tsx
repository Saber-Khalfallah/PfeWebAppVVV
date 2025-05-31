import Image from "next/image";
import { FaSearch, FaPlay } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="/hero-bg.png" // Your uploaded image should be placed in /public/
        alt="Hero Background"
        layout="fill"
        objectFit="cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#007BFF]/80"></div>

      {/* Content */}
      <div className="relative flex flex-col items-start justify-center h-full max-w-5xl px-6 md:px-12 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Find Trusted Local Professionals
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Connect with verified experts for all your home service needs
        </p>
        <div className="flex gap-4 flex-wrap">
          <button className="bg-[#F2994A] hover:bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition cursor-pointer">
            <FaSearch className="text-white" />{" "}
            {/* Simple hollow search icon */}
            Find a Pro
          </button>
          <button className="border-2 border-[#F2C94C] text-[#F2C94C] font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-yellow-50/10 transition cursor-pointer">
            <FaPlay className="text-[#F2C94C]" />{" "}
            {/* Play icon matching button border */}
            Learn How It Works
          </button>
        </div>
      </div>
    </section>
  );
};
export default Hero;
