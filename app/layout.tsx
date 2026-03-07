import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  weight: ["300", "400", "500"],
  variable: "--font-poppins",
});

const inter = Inter({
  weight: ["300", "600"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Tugasku | Aplikasi Manajemen dan Pengingat Tugas",
    template: "%s | Tugasku"
  },
  description:
    "Tugasku adalah aplikasi manajemen tugas yang membantu Anda mencatat, mengatur, dan mengingat deadline tugas dengan mudah. Kelola tugas kuliah, pekerjaan, dan aktivitas harian Anda dalam satu tempat.",

  authors: [
    {
      name: "Rafly",
      url: "https://rafly-portofolio.vercel.app/",
    },
  ],

  keywords: [
    "Tugasku",
    "aplikasi tugas",
    "task manager",
    "pengingat tugas",
    "manajemen tugas",
    "deadline tugas",
    "task reminder",
    "aplikasi produktivitas",
    "manajemen deadline",
    "Next.js task manager",
    "aplikasi tugas mahasiswa",
    "task management app"
  ],

  openGraph: {
    title: "Tugasku: Aplikasi Manajemen dan Pengingat Tugas",
    description:
      "Kelola semua tugas Anda dengan lebih teratur menggunakan Tugasku. Tambahkan tugas, atur deadline, dan pantau daftar tugas Anda dengan mudah dalam satu aplikasi.",
    url: process.env.NEXT_PUBLIC_URL_DOMAIN,
    siteName: "Tugasku",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL_DOMAIN}/tugasku_logo.png`,
        width: 1200,
        height: 630,
        alt: "Tugasku Task Manager App Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${poppins.variable} ${inter.variable} overflow-x-hidden overflow-y-auto antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
