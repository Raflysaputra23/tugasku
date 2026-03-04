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