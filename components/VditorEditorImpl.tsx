"use client";

import { useEffect, useRef, useState } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

const VditorEditor = ({ value, onChange }: Props) => {
    const vditorRef = useRef<HTMLDivElement>(null);
    const editorInstance = useRef<Vditor | null>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!vditorRef.current || editorInstance.current || initialized) return;

        editorInstance.current = new Vditor(vditorRef.current, {
            height: 300,
            cache: { enable: false },
            value,
            lang: "en_US",
            mode: "sv",
            toolbar: ["bold", "italic", "strike", "|", "link", "code", "table", "preview", "fullscreen"],
            preview: { math: { engine: "KaTeX" } },
            input: (val: string) => onChange(val),
            after: () => {
                if (editorInstance.current) {
                    setTimeout(() => {
                        editorInstance.current?.setValue(value);
                    }, 0);
                    setInitialized(true);
                }
            }
        });
    }, [value, initialized]);

    // optional cleanup on unmount
    useEffect(() => {
        return () => {
            editorInstance.current = null;
            setInitialized(false);
        };
    }, []);

    return <div ref={vditorRef} />;
};

export default VditorEditor;
