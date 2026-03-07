"use server";

import { AuthError } from "@supabase/supabase-js";
import {
  formJadwalMasukSchema,
  formJadwalSchema,
  formLoginSchema,
  formRegisterSchema,
  formTugasSchema,
} from "./formSchema";
import { createClient } from "./supabase/server";

export const formLoginValidation = async (
  prev: unknown,
  formdata: FormData,
) => {
  const supabase = await createClient();

  const data = Object.fromEntries(formdata.entries());
  const validasi = formLoginSchema.safeParse(data);

  if (!validasi.success) {
    return {
      error: validasi.error.flatten().fieldErrors,
      message: "Data tidak valid!",
      success: false,
    };
  }

  const { email, password } = validasi.data;

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    return {
      error: null,
      message: "Login berhasil!",
      success: true,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error,
        message: error.message,
        success: false,
      };
    } else {
      return {
        error,
        message: "Ada kesalahan sistem!",
        success: false,
      };
    }
  }
};

export const formRegisterValidation = async (
  prev: unknown,
  formdata: FormData,
) => {
  const supabase = await createClient();

  const data = Object.fromEntries(formdata.entries());
  const validasi = formRegisterSchema.safeParse(data);

  if (!validasi.success) {
    return {
      error: validasi.error.flatten().fieldErrors,
      message: "Data tidak valid!",
      success: false,
    };
  }

  const { namaLengkap, email, password } = validasi.data;

  try {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: namaLengkap },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/dashboard`,
      },
    });
    if (error) throw error;

    const { error: error2 } = await supabase.from("profiles").insert({
      id_user: data?.user?.id,
      nama_lengkap: namaLengkap,
      email,
      role: "user",
    });

    if (error2) throw error2;

    return {
      error: null,
      message: "Register berhasil!",
      success: true,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error,
        message: error.message,
        success: false,
      };
    } else {
      console.log(error);
      return {
        error,
        message: "Ada kesalahan sistem!",
        success: false,
      };
    }
  }
};

export const formJadwalValidation = async (
  prev: unknown,
  formdata: FormData,
) => {
  const supabase = await createClient();
  const { data: dataUser } = await supabase.auth.getClaims();
  const user = dataUser?.claims;

  const data = Object.fromEntries(formdata.entries());
  const validasi = formJadwalSchema.safeParse(data);

  if (!validasi.success) {
    return {
      error: validasi.error.flatten().fieldErrors,
      message: "Data tidak valid!",
      success: false,
    };
  }

  const { judul } = validasi.data;
  try {
    const { error } = await supabase.from("jadwal").insert({
      id_user: user?.id,
      title: judul,
    });

    if (error) throw error;
    return {
      message: "Jadwal berhasil dibuat!",
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Jadwal gagal dibuat!",
      success: false,
    };
  }
};

export const formJadwalMasukValidation = async (
  prev: unknown,
  formdata: FormData,
) => {
  const supabase = await createClient();
  const { data: dataUser } = await supabase.auth.getClaims();
  const user = dataUser?.claims;

  const data = Object.fromEntries(formdata.entries());
  const validasi = formJadwalMasukSchema.safeParse(data);

  if (!validasi.success) {
    return {
      error: validasi.error.flatten().fieldErrors,
      message: "Data tidak valid!",
      success: false,
    };
  }
  const { id_jadwal, mata_kuliah, hari, ruangan, dosen, start_time, end_time } =
    validasi.data;

  try {
    const { error } = await supabase.from("jadwal_masuk").insert({
      id_jadwal,
      id_user: user?.id,
      mata_kuliah,
      hari,
      start_time,
      end_time,
      ruangan,
      dosen,
    });
    if (error) throw error;

    return {
      message: "Jadwal berhasil ditambahkan!",
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Jadwal gagal ditambahkan!",
      success: true,
    };
  }
};

export const formTugasValidation = async (
  prev: unknown,
  formdata: FormData,
) => {
  const supabase = await createClient();
  const { data: dataUser } = await supabase.auth.getClaims();
  const user = dataUser?.claims;

  const data = Object.fromEntries(formdata.entries());
  const validasi = formTugasSchema.safeParse(data);

  if (!validasi.success) {
    return {
      error: validasi.error.flatten().fieldErrors,
      message: "Data tidak valid!",
      success: false,
    };
  }

  const { subject, title, class_name, description, deadline } = validasi.data;

  const tasks = {
    subject,
    title,
    class_name,
    description,
    date: deadline.split("T")[0],
    time: deadline.split("T")[1],
    visibility: data.visibility || "private",
    file_url: data.file_url || "",
    file_name: data.file_name || "",
  };

  try {
    if (data?.id_task) {
      const { error } = await supabase
        .from("tasks")
        .update(tasks)
        .eq("id_task", data.id_task);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("tasks").insert({
        id_task: crypto.randomUUID(),
        id_user: user?.id,
        status: "pending",
        ...tasks,
      });
      if (error) throw error;
    }

    return {
      message: "Tugas berhasil ditambahkan",
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Tugas gagal ditambahkan!",
      success: false,
    };
  }
};
