"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import StickyNote from "@/components/StickyNote";
import { useRouter } from "next/navigation";

interface Note {
  id: string;
  text: string;
  x: number;
  y: number;
  user_id: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Fetch notes on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data: notes, error } = await supabase
          .from("notes")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) {
          throw error;
        }

        if (notes) {
          setNotes(notes);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();

    // Set up realtime subscription
    const channel = supabase
      .channel("notes_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotes((current) => [...current, payload.new as Note]);
          } else if (payload.eventType === "UPDATE") {
            setNotes((current) =>
              current.map((note) =>
                note.id === payload.new.id ? (payload.new as Note) : note
              )
            );
          }
        }
      )
      .subscribe();

    // Check for authentication
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      }
    };

    checkUser();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  const handleDragEnd = async (id: string, x: number, y: number) => {
    try {
      const { error } = await supabase
        .from("notes")
        .update({ x, y })
        .eq("id", id);

      if (error) throw error;

      setNotes(
        notes.map((note) => (note.id === id ? { ...note, x, y } : note))
      );
    } catch (error) {
      console.error("Error updating note position:", error);
    }
  };

  const addNewNote = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const newNote: Note = {
      id: Date.now().toString(),
      text: "New note",
      x: Math.random() * (window.innerWidth - 200),
      y: Math.random() * (window.innerHeight - 150),
      user_id: user.id,
    };

    try {
      const { error } = await supabase.from("notes").insert(newNote);

      if (error) throw error;

      // Note: We don't need to setNotes here because the realtime subscription will handle it
    } catch (error) {
      console.error("Error adding new note:", error);
    }
  };

  const handleTextChange = async (id: string, newText: string) => {
    try {
      // Optimistically update the local state first
      setNotes(current =>
        current.map((note) =>
          note.id === id ? { ...note, text: newText } : note
        )
      );

      // Then update the server
      const { error } = await supabase
        .from("notes")
        .update({ text: newText })
        .eq("id", id);

      if (error) {
        // If server update fails, revert the optimistic update
        setNotes(current =>
          current.map((note) =>
            note.id === id ? { ...note, text: note.text } : note
          )
        );
        throw error;
      }

      // No need to update state here since we already did it optimistically
    } catch (error) {
      console.error("Error updating note text:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "white",
        position: "relative",
      }}
      onClick={() => {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement?.tagName === "TEXTAREA") {
          activeElement.blur();
        }
      }}
    >
      <button
        onClick={addNewNote}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add Note
      </button>
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          id={note.id}
          text={note.text}
          x={note.x}
          y={note.y}
          onDragEnd={handleDragEnd}
          onTextChange={handleTextChange}
        />
      ))}
    </main>
  );
}
