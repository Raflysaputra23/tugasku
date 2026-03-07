"use client"

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Schedule, ScheduleEntry } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { toastError, toastSuccess } from '@/lib/toast';

export function useJadwal() {
    const supabase = createClient();
    const { user } = useAuth();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSchedules = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('jadwal')
            .select('*')
            .eq('id_user', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            toastError('Gagal memuat jadwal');
            setLoading(false);
            return;
        }

        // Fetch entries for each schedule
        const schedulesWithEntries: Schedule[] = [];
        for (const s of (data || [])) {
            const { data: entries } = await supabase
                .from('jadwal_masuk')
                .select('*')
                .eq('id_jadwal', s.id_jadwal)
                .order('hari', { ascending: true })
                .order('start_time', { ascending: true });

            schedulesWithEntries.push({
                ...s,
                entries: (entries || []) as unknown as ScheduleEntry[],
            } as Schedule);
        }

        setSchedules(schedulesWithEntries);
        setLoading(false);
    }, [user]);

    useEffect(() => { 
        (async() => {
            fetchSchedules(); 
        })()
    }, [fetchSchedules]);


    const deleteSchedule = async (id: string) => {
        const { error } = await supabase.from('jadwal').delete().eq('id_jadwal', id);
        if (error) { toastError('Gagal menghapus jadwal'); return; }
        toastSuccess('Jadwal berhasil dihapus!');
        fetchSchedules();
    };

    const deleteEntry = async (id: string) => {
        const { error } = await supabase.from('jadwal_masuk').delete().eq('id_jadwal_masuk', id);
        if (error) { toastError('Gagal menghapus mata kuliah'); return; }
        toastSuccess('Mata kuliah berhasil dihapus!');
        fetchSchedules();
    };

    return { schedules, loading, deleteSchedule, deleteEntry, refetch: fetchSchedules };
}
