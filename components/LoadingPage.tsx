"use client"

import { BookOpen } from "lucide-react";
import AnimationSection from "./LandingPage/AnimationSection";

const LoadingPage = () => {
  // const [progress, setProgress] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 100) {
  //         clearInterval(interval);
  //         return 100;
  //       }
  //       return prev + 1;
  //     });
  //   }, 40);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background dark">
      {/* Floating background icons */}
      <AnimationSection />

      {/* Gradient orb */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />

      {/* Logo with pulse */}
      <div className="relative mb-8 animate-loading-pulse animate-[fade-in_0.6s_ease-in-out]">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/15 backdrop-blur-sm shadow-[0_0_40px_-10px_hsl(var(--accent)/0.3)]">
          <BookOpen size={40} className="text-accent" />
        </div>
        {/* Spinning ring */}
        <div className="absolute -inset-3 animate-logo-spin rounded-full border-2 border-transparent border-t-accent/40" />
      </div>

      {/* Brand */}
      <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-foreground animate-[fade-in_0.7s_ease-in-out]">
        Tugasku
      </h1>
      <p className="mb-8 text-sm text-muted-foreground animate-[fade-in_0.8s_ease-in-out]">Mempersiapkan semuanya untukmu...</p>

      {/* Loading dots */}
      <div className="flex gap-1.5 animate-[fade-in_0.9s_ease-in-out]">
        <span className="h-2 w-2 animate-dots rounded-full bg-primary/60" style={{ animationDelay: "0s" }} />
        <span className="h-2 w-2 animate-dots rounded-full bg-primary/60" style={{ animationDelay: "0.2s" }} />
        <span className="h-2 w-2 animate-dots rounded-full bg-primary/60" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  );
};

export default LoadingPage;
