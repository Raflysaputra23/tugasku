import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { toastError, toastSuccess } from '@/lib/toast';

interface AdminUser {
    id_user: string;
    nama_lengkap: string;
    email: string;
    kelas?: string;
    jurusan?: string;
    created_at: string;
    bio?: string;
    role?: string;
}

export function useAdmin() {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkingRole, setCheckingRole] = useState(true);

    // Check if current user is admin
    useEffect(() => {
        const checkAdmin = async () => {
            if (!user) { setCheckingRole(false); return; }
            const supabase = createClient();
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id_user', user.id)
                .eq('role', 'admin');

            if (error) { setCheckingRole(false); return; }
            setIsAdmin(data && data.length > 0);
            setCheckingRole(false);
        };
        checkAdmin();
    }, [user]);

    const fetchUsers = useCallback(async () => {
        if (!isAdmin) return;
        setLoading(true);
        const supabase = createClient();
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toastError('Gagal memuat data pengguna');
            setLoading(false);
            return;
        }

        // Fetch roles
        const { data: roles } = await supabase.from('profiles').select('*');
        const roleMap = new Map<string, string>();
        (roles || []).forEach((r) => roleMap.set(r.id_user, r.role));

        setUsers((profiles || []).map((p) => ({
            ...p,
            role: roleMap.get(p.id_user) || 'user',
        })));
        setLoading(false);
    }, [isAdmin]);

    useEffect(() => { (async() => fetchUsers())() }, [fetchUsers]);

    const deleteUser = async (userId: string) => {
        // Delete profile (cascade will handle roles)
        const supabase = createClient();
        const { error } = await supabase.from('profiles').delete().eq('id_user', userId);
        if (error) { toastError('Gagal menghapus pengguna'); return; }
        toastSuccess('Pengguna berhasil dihapus');
        fetchUsers();
    };

    return { isAdmin, checkingRole, users, loading, fetchUsers, deleteUser };
}
