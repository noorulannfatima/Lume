import { HeroHeader } from "@/app/(marketing)/_components/header";
import HeroSection from "@/app/(marketing)/_components/hero-section";

export default function Home() {
  return (
    <div>
      <HeroHeader/>
      <HeroSection/>
    </div>
  );
}


// feature based architcture
// vertical slice architecture that we want to store code next to the features 