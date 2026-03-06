"use client"

import { motion } from "framer-motion";
import { BookOpen, Calendar, CheckCircle2, FileText, Sparkles, Star } from "lucide-react";
import { memo } from "react";

const FloatingIcon = memo(({ children, className, delay = 0, duration = 6, x = 0, y = 20 }: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    x?: number;
    y?: number;
}) => (
    <motion.div
        className={`absolute pointer-events-none ${className}`}
        animate={{
            y: [0, -y, 0],
            x: [0, x, 0],
            rotate: [0, 8, -8, 0],
        }}
        transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
        }}
    >
        {children}
    </motion.div>
));

FloatingIcon.displayName = "FloatingIcon";

const GlowOrb = memo(({ className, delay = 0 }: { className?: string; delay?: number }) => (
    <motion.div
        className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
        animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
        }}
    />
));

GlowOrb.displayName = "GlowOrb";

const AnimationSection = () => {
    return (
        <>
            {/* Floating glow orbs */}
            <GlowOrb className="w-72 h-72 bg-accent/20 -top-20 -left-20" delay={0} />
            <GlowOrb className="w-96 h-96 bg-accent/10 top-1/3 -right-32" delay={3} />
            <GlowOrb className="w-64 h-64 bg-primary/10 bottom-20 left-1/4" delay={5} />

            {/* Floating decorative icons */}
            <FloatingIcon className="top-24 left-[8%] opacity-[0.08]" delay={0} y={25} x={10} duration={7}>
                <FileText className="h-12 w-12 text-accent" />
            </FloatingIcon>
            <FloatingIcon className="top-40 right-[10%] opacity-[0.08]" delay={1.5} y={20} x={-8} duration={8}>
                <Calendar className="h-10 w-10 text-accent" />
            </FloatingIcon>
            <FloatingIcon className="top-[60%] left-[5%] opacity-[0.06]" delay={2} y={30} x={12} duration={9}>
                <CheckCircle2 className="h-14 w-14 text-success" />
            </FloatingIcon>
            <FloatingIcon className="top-[30%] right-[6%] opacity-[0.06]" delay={3} y={18} x={-6} duration={6.5}>
                <Star className="h-8 w-8 text-accent" />
            </FloatingIcon>
            <FloatingIcon className="bottom-32 right-[15%] opacity-[0.07]" delay={0.8} y={22} x={8} duration={7.5}>
                <BookOpen className="h-10 w-10 text-primary" />
            </FloatingIcon>
            <FloatingIcon className="top-[50%] left-[12%] opacity-[0.05]" delay={4} y={15} x={-10} duration={10}>
                <Sparkles className="h-9 w-9 text-accent" />
            </FloatingIcon>

            {/* Floating dots grid */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-accent/20 pointer-events-none"
                    style={{
                        top: `${15 + (i * 15)}%`,
                        left: `${10 + (i % 3) * 35}%`,
                    }}
                    animate={{
                        y: [0, -12, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.7,
                    }}
                />
            ))}
        </>
    )
}


export default AnimationSection;