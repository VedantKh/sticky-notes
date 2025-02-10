import { useState, useEffect, useRef } from "react";

interface StickyNoteProps {
  id: string;
  text: string;
  x: number;
  y: number;
  onDragEnd: (id: string, x: number, y: number) => void;
  onTextChange: (id: string, newText: string) => void;
}

export default function StickyNote({
  id,
  text,
  x,
  y,
  onDragEnd,
  onTextChange,
}: StickyNoteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x, y });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd(id, position.x, position.y);
    }
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      setIsEditing(true);
      e.stopPropagation();
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editText !== text) {
      onTextChange(id, editText);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: "200px",
        minHeight: "150px",
        padding: "15px",
        backgroundColor: "#feff9c",
        boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "transparent",
            resize: "none",
            outline: "none",
            cursor: "text",
            fontFamily: "inherit",
            fontSize: "inherit",
            color: "black",
          }}
        />
      ) : (
        <div style={{ cursor: "text", color: "black" }}>{text}</div>
      )}
    </div>
  );
}
