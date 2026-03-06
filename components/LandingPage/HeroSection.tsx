import { ArrowRight, Bell, BookOpen, Globe, ListTodo } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'

const HeroSection = () => {
    return (
        <main className="flex-1 flex items-center justify-center pt-22 pb-12 px-6">
            <div className="text-center max-w-4xl animate-fade-in">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                    <BookOpen className="h-8 w-8 text-accent" />
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    Kelola Tugas Kuliah<br />dengan <span className="text-accent">Mudah</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
                    Simpan, atur deadline, dan bagikan tugas kuliahmu. Dapatkan pengingat otomatis agar tidak ada tugas yang terlewat.
                </p>
                <div className="flex justify-center gap-3">
                    <Button size="lg" asChild>
                        <Link href={'/dashboard'}>
                            Mulai Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                    {[
                        { icon: ListTodo, title: 'Manajemen Tugas', desc: 'Buat dan kelola tugas dengan deadline, status, dan file pendukung.' },
                        { icon: Globe, title: 'Berbagi Publik', desc: 'Bagikan tugas dengan teman sekelas dan ambil tugas dari orang lain.' },
                        { icon: Bell, title: 'Notifikasi Cerdas', desc: 'Pengingat otomatis 2 hari, 1 hari, dan 12 jam sebelum deadline.' },
                    ].map((feature) => (
                        <div key={feature.title} className="rounded-xl border bg-card p-5 hover:scale-105 transition-all">
                            <feature.icon className="h-5 w-5 text-accent mb-3" />
                            <h3 className="font-display font-semibold mb-1">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default HeroSection
