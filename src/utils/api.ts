import { Note } from "@/types/note";

export async function fetchNotes(): Promise<Note[]> {
  const response = await fetch("/api/notes");
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch notes");
  }
  return response.json();
}

// Omit removes specified properties from a type, creating a new type without those fields
// Here we create a type from Note but without the user_id and created_at properties
export async function createNote(note: Omit<Note, "user_id" | "created_at">): Promise<Note> {
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create note");
  }
  return response.json();
}

export async function updateNote(id: string, updates: Partial<Note>): Promise<Note> {
  const response = await fetch(`/api/notes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update note");
  }
  return response.json();
}

export async function deleteNote(id: string): Promise<void> {
  const response = await fetch(`/api/notes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete note");
  }
} 