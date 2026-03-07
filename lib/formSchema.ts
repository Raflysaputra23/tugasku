import z from "zod";

export const formLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Panjang password minimal 6 digit!")
});

export const formRegisterSchema = z.object({
    namaLengkap: z.string().min(2, "Panjang nama lengkap minimal 2 digit!"),
    email: z.string().email(),
    password: z.string().min(6, "Panjang password minimal 6 digit!"),
    confirmPassword: z.string().min(6, "Panjang password minimal 6 digit!")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"]
})

export const formJadwalSchema = z.object({
    judul: z.string().min(2, "Panjang judul minimal 2 digit!"),
})

export const formJadwalMasukSchema = z.object({
    id_jadwal: z.string().min(1, "ID Jadwal harus diisi!"),
    mata_kuliah: z.string().min(1, "Panjang mata kuliah minimal 1 digit!"),
    hari: z.string().min(1, "Panjang hari minimal 1 digit!"),
    ruangan: z.optional(z.string().min(2, "Panjang ruangan minimal 2 digit!")),
    dosen: z.optional(z.string().min(2, "Panjang dosen minimal 2 digit!")),
    start_time: z.string().min(1, "Start time harus diisi!"),
    end_time: z.string().min(1, "End time harus diisi!")
})

export const formTugasSchema = z.object({
    subject: z.string().min(2, "Panjang subject minimal 2 digit!"),
    title: z.string().min(2, "Panjang title minimal 2 digit!"),
    description: z.string().min(4, "Panjang description minimal 4 digit!"),
    class_name: z.string().min(1, "Kelas harus diisi!"),
    deadline: z.string().min(1, "Date harus diisi!"),
});