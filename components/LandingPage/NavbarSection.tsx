"use client"

import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import LoadingPage from '../LoadingPage';

const Navbar = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState<boolean>(false);
    
    useEffect(() => {
       const handleScrolled = () => {
             setScrolled(window.scrollY > 20)
       }
       
       document.addEventListener("scroll", handleScrolled);
       return () => document.removeEventListener("scroll", handleScrolled);
    }, []);

    useEffect(() => {
        (async() => {
            if(window !== undefined) {
                setLoading(false);
            }
        })()
    }, [])


    if(loading) return <LoadingPage />

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center justify-between px-6 py-4 mb-6 ${scrolled && 'border-b backdrop-blur-2xl'}`}>
            <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                <span className="font-display font-bold text-lg">Tugasku</span>
            </div>
            <div className="flex gap-2">
                {user ? (
                    <Button asChild>
                        <Link href="/dashboard">Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                ) : (
                    <>
                        <Button variant="ghost" asChild><Link href="/login">Masuk</Link></Button>
                        <Button variant={"primaryOutliner"} asChild><Link href="/register">Daftar</Link></Button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar;
