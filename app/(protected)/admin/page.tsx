'use client'

import { useState } from 'react';
import { Shield, Trash2, Search, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import EmptyState from '@/components/dashboard/EmptyState';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

const Admin = () => {
    const { user } = useAuth();
    const { isAdmin, checkingRole, users, loading, deleteUser } = useAdmin();
    const [search, setSearch] = useState('');
    const router = useRouter();

    if (checkingRole) {
        return (
            <div className="flex justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!loading && !isAdmin) {
        return router.push('/dashboard');
    }

    const filteredUsers = users.filter(u =>
        u.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.jurusan || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-display font-bold flex items-center gap-2">
                    <Shield className="h-6 w-6 text-accent" /> Admin Panel
                </h1>
                <p className="text-sm text-muted-foreground">Kelola pengguna yang terdaftar</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-accent/10 p-2.5">
                                <Users className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold font-display">{loading ?
                                    <div className="flex justify-start h-8 py-1">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                                    </div>
                                    : users.length}</div>
                                <p className="text-xs text-muted-foreground">Total Pengguna</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500/10 p-2.5">
                                <Shield className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold font-display">{loading ?
                                    <div className="flex justify-start h-8 py-1">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                                    </div>
                                    : users.filter(u => u.role === 'admin').length}</div>
                                <p className="text-xs text-muted-foreground">Admin</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-display">Daftar Pengguna</CardTitle>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari pengguna..."
                            className="pl-9"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <EmptyState icon={Users} title="Tidak ada pengguna" description="Belum ada pengguna yang terdaftar." />
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Jurusan</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Terdaftar</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map(u => (
                                        <TableRow key={u.id_user}>
                                            <TableCell className="font-medium">{u.nama_lengkap || '-'}</TableCell>
                                            <TableCell className="text-muted-foreground">{u.email}</TableCell>
                                            <TableCell>{u.jurusan || '-'}</TableCell>
                                            <TableCell>
                                                <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                                                    {u.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {format(new Date(u.created_at), 'd MMM yyyy', { locale: id })}
                                            </TableCell>
                                            <TableCell>
                                                {u.id_user !== user?.id && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Pengguna &quot;{u.nama_lengkap || u.email}&quot; akan dihapus. Aksi ini tidak dapat dibatalkan.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => deleteUser(u.id_user)}>Hapus</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Admin;
