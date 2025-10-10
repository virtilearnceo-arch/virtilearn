"use client";
import { useEffect } from "react";

export default function DisableRightClickAndInspect() {
    useEffect(() => {
        // Disable right-click
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();

        // Disable drag and drop
        const handleDrag = (e: DragEvent) => e.preventDefault();
        const handleDrop = (e: DragEvent) => e.preventDefault();

        // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+J
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) ||
                (e.ctrlKey && ["U", "u"].includes(e.key))
            ) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("dragstart", handleDrag);
        document.addEventListener("drop", handleDrop);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("dragstart", handleDrag);
            document.removeEventListener("drop", handleDrop);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return null;
}
