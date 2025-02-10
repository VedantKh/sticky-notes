import { Note } from "@/types/note";

export async function fetchNotes(): Promise<Note[]> {
  const response = await fetch("/api/notes");
  if (!response.ok) throw new Error("Failed to fetch notes");
  return response.json();
}

export async function createNote(note: Omit<Note, "user_id" | "created_at">): Promise<Note> {
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!response.ok) throw new Error("Failed to create note");
  return response.json();
}

export async function updateNote(id: string, updates: Partial<Note>): Promise<Note> {
  const response = await fetch(`/api/notes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update note");
  return response.json();
}

export async function deleteNote(id: string): Promise<void> {
  const response = await fetch(`/api/notes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete note");
} 