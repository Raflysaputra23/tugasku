"use client"

import React, { useActionState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { CalendarDays, Plus } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import ButtonForm from '../auth/ButtonForm'
import { formJadwalValidation } from '@/lib/formValidation'
import { toastError, toastSuccess } from '@/lib/toast'

const FormJadwal = ({ createOpen, setCreateOpen, refetch }: { createOpen: boolean, setCreateOpen: React.Dispatch<React.SetStateAction<boolean>>; refetch: () => void }) => {
    const [state, formAction] = useActionState(formJadwalValidation, null);

    useEffect(() => {
        if (state) {
            if (state.success) {
                toastSuccess(state.message);
                refetch();
                setCreateOpen(false);
            } else toastError(state.message);
        }
    }, [state]);

    return (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
                <Button variant={'primary'}><Plus className="mr-1 h-4 w-4" /> Buat Jadwal</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-display">Buat Jadwal Baru</DialogTitle>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2 py-3 relative">
                        <Label>Nama Jadwal</Label>
                        <Input
                            name="judul"
                            placeholder="Contoh: Jadwal Semester 1"
                            className='pr-9'
                        />
                        <CalendarDays className='w-5 h-5 absolute right-2 bottom-5' />
                        <p className='absolute bottom-0.5 left-0.5 text-xs text-destructive'>{state && state.error?.judul}</p>
                    </div>
                    <ButtonForm>Buat Jadwal</ButtonForm>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default FormJadwal
