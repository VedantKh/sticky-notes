"use client";

import { useState } from "react";
import StickyNote from "@/components/StickyNote";

interface Note {
  id: string;
  text: string;
  x: number;
  y: number;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([
    { id: "1", text: "This is a sample note", x: 100, y: 100 },
  ]);

  const handleDragEnd = (id: string, x: number, y: number) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, x, y } : note)));
  };

  const addNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      text: "New note",
      x: Math.random() * (window.innerWidth - 200),
      y: Math.random() * (window.innerHeight - 150),
    };
    setNotes([...notes, newNote]);
  };

  const handleTextChange = (id: string, newText: string) => {
    setNotes(
      // Maps through the notes array and updates the text of the note with matching id
      // If the note id matches, spread the existing note properties and update the text
      // Otherwise return the note unchanged
      notes.map((note) => (note.id === id ? { ...note, text: newText } : note))
    );
  };

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
