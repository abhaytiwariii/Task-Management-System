"use client";
import { useEffect, useState, ReactNode } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

interface BoardDndContextProps {
  onDragEnd: (result: DropResult) => void;
  children: ReactNode;
}

export function BoardDndContext({ onDragEnd, children }: BoardDndContextProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);
  
  if (!isMounted) return null;

  return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>;
}
