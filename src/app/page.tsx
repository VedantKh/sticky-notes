"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import StickyNote from "@/components/StickyNote";
import { useRouter } from "next/navigation";
import * as api from "@/utils/api";

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
    const loadNotes = async () => {
      try {
        const notes = await api.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error("Error loading notes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();

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
      await api.updateNote(id, { x, y });
      setNotes(
        notes.map((note) => (note.id === id ? { ...note, x, y } : note))
      );
    } catch (error) {
      console.error("Error updating note position:", error);
    }
  };

  const addNewNote = async () => {
    const newNote = {
      id: Date.now().toString(),
      text: "New note",
      x: Math.random() * (window.innerWidth - 200),
      y: Math.random() * (window.innerHeight - 150),
    };

    try {
      const createdNote = await api.createNote(newNote);
      // Note: We don't need to setNotes here because the realtime subscription will handle it
    } catch (error) {
      console.error("Error adding new note:", error);
    }
  };

  const handleTextChange = async (id: string, newText: string) => {
    try {
      // Optimistic update
      setNotes((current) =>
        current.map((note) =>
          note.id === id ? { ...note, text: newText } : note
        )
      );

      await api.updateNote(id, { text: newText });
    } catch (error) {
      console.error("Error updating note text:", error);
      // Revert optimistic update on error
      setNotes((current) =>
        current.map((note) =>
          note.id === id ? { ...note, text: note.text } : note
        )
      );
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
