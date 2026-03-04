import AnimationSection from "@/components/LandingPage/AnimationSection";
import HeroSection from "@/components/LandingPage/HeroSection";
import NavbarSection from "@/components/LandingPage/NavbarSection";

export default async function Home() {

  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* ANIMATION */}
      <AnimationSection />

      <NavbarSection />
      <HeroSection />
    </div>
  );
}
