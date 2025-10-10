"use client";
import { useEffect } from "react";

export default function DisableRightClickAndDrag() {
    useEffect(() => {
        // Disable right-click
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();

        // Disable drag and drop
        const handleDrag = (e: DragEvent) => e.preventDefault();
        const handleDrop = (e: DragEvent) => e.preventDefault();

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("dragstart", handleDrag);
        document.addEventListener("drop", handleDrop);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("dragstart", handleDrag);
            document.removeEventListener("drop", handleDrop);
        };
    }, []);

    return null; // This component doesn't render anything
}
