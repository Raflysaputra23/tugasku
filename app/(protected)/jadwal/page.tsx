"use client"

import { useState } from 'react';
import { Plus, Trash2, Calendar, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/dashboard/EmptyState';
import { useJadwal } from '@/hooks/useJadwal';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import FormJadwal from '@/components/jadwal/FormJadwal';
import FormJadwalMasuk from '@/components/jadwal/FormJadwalMasuk';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const DAY_COLORS = [
  'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  'bg-orange-500/10 text-orange-600 dark:text-orange-400',
];

const Schedules = () => {
  const { loading: authLoading } = useAuth();
  const { schedules, loading, deleteSchedule, deleteEntry, refetch } = useJadwal();
  const [createOpen, setCreateOpen] = useState(false);

  // Entry form state
  const [entryScheduleId, setEntryScheduleId] = useState<string | null>(null);
  const [entryOpen, setEntryOpen] = useState(false);

  const openAddEntry = (scheduleId: string) => {
    setEntryScheduleId(scheduleId);
    setEntryOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Jadwal Kuliah</h1>
          <p className="text-sm text-muted-foreground">Kelola jadwal mata kuliah per semester</p>
        </div>
        <FormJadwal createOpen={createOpen} setCreateOpen={setCreateOpen} refetch={refetch} />
      </div>

      {(loading || authLoading) ?
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
        : schedules.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Belum ada jadwal"
            description="Buat jadwal semester untuk mengatur mata kuliahmu!"
            actionLabel="Buat Jadwal"
            onAction={() => setCreateOpen(true)}
          />
        ) : (
          <AnimatePresence>
            {schedules.map((schedule) => {
              const entriesByDay = DAYS.map((_, i) =>
                (schedule?.entries || []).filter(e => Number(e.hari) === i)
              );
              const hasEntries = (schedule?.entries || []).length > 0;

              return (
                <motion.div
                  key={schedule.id_jadwal}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <CardTitle className="font-display text-lg flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-accent" />
                        {schedule.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="primaryOutliner" className='cursor-pointer' onClick={() => openAddEntry(schedule.id_jadwal)}>
                          <Plus className="mr-1 h-3 w-3" /> Tambah
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/50 cursor-pointer hover:text-destructive bg-destructive/10 border border-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Jadwal?</AlertDialogTitle>
                              <AlertDialogDescription>Jadwal dan semua mata kuliah di dalamnya akan dihapus.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteSchedule(schedule.id_jadwal)}>Hapus</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {!hasEntries ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                          Belum ada mata kuliah. Klik &quot;Tambah Matkul&quot; untuk menambahkan.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {DAYS.map((day, i) => {
                            const dayEntries = entriesByDay[i];
                            if (dayEntries.length === 0) return null;
                            return (
                              <div key={i}>
                                <Badge variant="outline" className={`mb-2 ${DAY_COLORS[i]}`}>
                                  {day}
                                </Badge>
                                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                  {dayEntries.map(entry => (
                                    <div
                                      key={entry.id_jadwal_masuk}
                                      className={`flex items-start justify-between rounded-lg border bg-primary-foreground shadow-[1px_1px_5px_rgba(0,0,0,0.2)] p-3 group hover:shadow-sm transition-shadow`}
                                    >
                                      <div className="min-w-0 flex-1">
                                        <p className="font-bold text-md truncate">{entry.mata_kuliah}</p>
                                        <div className="flex items-center gap-1 text-xs text-foreground mt-1">
                                          <Clock className="h-3 w-3" />
                                          <span>{entry.start_time} – {entry.end_time}</span>
                                        </div>
                                        <div className='flex items-center gap-2 mt-2'>
                                          {entry.ruangan && (
                                            <p className="text-xs bg-accent/10 px-2 py-1 rounded-md border border-accent text-accent">{entry.ruangan}</p>
                                          )}
                                          {entry.dosen && (
                                            <p className="text-xs bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500 text-blue-500">{entry.dosen}</p>
                                          )}
                                        </div>
                                      </div>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 opacity-100 lg:opacity-0 group-hover:opacity-100 bg-destructive/10 border border-destructive hover:bg-destructive/50 hover:text-destructive cursor-pointer transition-opacity text-destructive"
                                        onClick={() => deleteEntry(entry.id_jadwal_masuk)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

      {/* Add Entry Dialog */}
      <FormJadwalMasuk entryOpen={entryOpen} setEntryOpen={setEntryOpen} idJadwal={entryScheduleId} refetch={refetch} />
    </div>
  );
};

export default Schedules;
