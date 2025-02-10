import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Note } from "@/types/note";

export async function getNotes() {
  const supabase = createServerComponentClient({ cookies });
  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return notes;
}

export async function createNote(note: Omit<Note, "created_at">) {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase.from("notes").insert(note).select().single();

  if (error) throw error;
  return data;
}

export async function updateNote(id: string, updates: Partial<Note>) {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from("notes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNote(id: string) {
  const supabase = createServerComponentClient({ cookies });
  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) throw error;
} 