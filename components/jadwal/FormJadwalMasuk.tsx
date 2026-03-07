"use client"

import { useActionState, useEffect } from "react";
import ButtonForm from "../auth/ButtonForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { formJadwalMasukValidation } from "@/lib/formValidation";
import { toastError, toastSuccess } from "@/lib/toast";

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

const FormJadwalMasuk = ({ entryOpen, setEntryOpen, idJadwal, refetch }: { entryOpen: boolean; setEntryOpen: React.Dispatch<React.SetStateAction<boolean>>; idJadwal: string | null; refetch: () => void }) => {
    const [state, formAction] = useActionState(formJadwalMasukValidation, null);
    
    useEffect(() => {
        if(state) {
            if(state.success) {
              toastSuccess(state.message)
              refetch();
              setEntryOpen(false);  
            } else toastError(state.message);
        }
    }, [state]);

    return (
        <Dialog open={entryOpen} onOpenChange={setEntryOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-display">Tambah Mata Kuliah</DialogTitle>
                </DialogHeader>
                <form action={formAction}>
                    <input type="hidden" name="id_jadwal" value={idJadwal as string} />
                    <div className="space-y-2 py-3 relative">
                        <Label>Nama Mata Kuliah</Label>
                        <Input name='mata_kuliah' placeholder="Contoh: Pemrograman Web" />
                        <p className='absolute bottom-0.5 left-0.5 text-xs text-destructive'>{state && state.error?.mata_kuliah}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 py-3 relative">
                            <Label>Hari</Label>
                            <Select name='hari' >
                                <SelectTrigger className="w-full"><SelectValue defaultValue={'Senin'} /></SelectTrigger>
                                <SelectContent>
                                    {DAYS.map((d, i) => (
                                        <SelectItem key={i} value={String(i)}>{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className='absolute bottom-0.5 left-0.5 text-xs text-destructive'>{state && state.error?.hari}</p>
                        </div>
                        <div className="space-y-2 py-3 relative">
                            <Label>Ruangan</Label>
                            <Input name='ruangan' placeholder="Contoh: Lab 3" />
                            <p className='absolute bottom-0.5 left-0.5 text-xs text-destructive'>{state && state.error?.ruangan}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 py-3 relative">
                            <Label>Jam Mulai</Label>
                            <Input type="time" name='start_time' />
                            <p className='absolute bottom-0.5 left-0.5 text-xs text-destructive'>{state && state.error?.start_time}</p>
                        </div>
                        <div className="space-y-2 py-3 relative">
                            <Label>Jam Selesai</Label>
                            <Input type="time" name='end_time' />
                            <p className='absolute bottom-0.5 left-0.5 text-xs text-destructive'>{state && state.error?.end_time}</p>
                        </div>
                    </div>
                    <div className="space-y-2 py-3 relative">
                        <Label>Dosen (opsional)</Label>
                        <Input name='dosen' placeholder="Nama dosen" />
                        <p className='absolute bottom-0.5 left-0.5 text-xs text-destructive'>{state && state.error?.dosen}</p>
                    </div>
                    <ButtonForm>Tambahkan</ButtonForm>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default FormJadwalMasuk;
