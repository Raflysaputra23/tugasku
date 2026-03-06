"use client"

import {
  LayoutDashboard, ListTodo, Globe, User, Bell, LogOut, Sun, Moon, BookOpen,
} from 'lucide-react';

import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingPage from '../LoadingPage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

const mainItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Tugas Saya', url: '/tugas-private', icon: ListTodo },
  { title: 'Tugas Publik', url: '/tugas-public', icon: Globe },
  { title: 'Notifikasi', url: '/notifikasi', icon: Bell },
];

const accountItems = [
  { title: 'Profil', url: '/profile', icon: User },
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { signOut, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (window !== undefined) {
        setLoading(false);
      }
    })()
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = async () => {
    await signOut();
    setShowModal(true);
  };

  const isActive = (path: string) => pathname === path;
  if (loading) return <LoadingPage />

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-md uppercase tracking-wider mb-5 pt-2">
              {!collapsed && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-accent" />
                  Tugasku
                </div>
              )}
              {collapsed && <BookOpen className="h-4 w-4 text-accent" />}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className={`${isActive(item.url) && 'bg-accent/20 border border-accent text-accent'} hover:!bg-accent/20 hover:border hover:border-accent hover:!text-accent hover:p-4 hover:py-5 py-5`}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>{!collapsed && 'Akun'}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {accountItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className={`${isActive(item.url) && 'bg-accent/20 border border-accent text-accent'} hover:!bg-accent/20 hover:border hover:border-accent hover:!text-accent hover:p-4 hover:py-5 py-5`}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="space-y-1 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className={`${theme === 'dark' ? 'bg-background/50 border border-background' : 'bg-slate-200 border border-slate-500'} cursor-pointer p-4 py-5`} onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setShowModal(true)} className="cursor-pointer bg-destructive/20 border border-destructive p-4 py-5 text-destructive hover:bg-destructive/40">
                <LogOut className="mr-2 h-4 w-4" />
                {!collapsed && <span>Keluar</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Keluar</DialogTitle>
          </DialogHeader>
          <h1 className='text-muted-foreground'>Apakah anda yakin ingin keluar?</h1>
          <div className='flex justify-end'>
            <Button variant={'primary'} className='cursor-pointer' onClick={handleLogout}>Keluar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AppSidebar;