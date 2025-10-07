"use client";

import { useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox"; // shadcn checkbox
import { Button } from "@/components/ui/button";

interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: Option[];
    value: string[]; // selected ids
    onChange: (values: string[]) => void;
    placeholder?: string;
}

export function MultiSelect({ options, value, onChange, placeholder = "Select..." }: MultiSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    // ✅ Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (val: string) => {
        if (value.includes(val)) {
            onChange(value.filter((v) => v !== val));
        } else {
            onChange([...value, val]);
        }
    };

    const selectedLabels = options.filter((opt) => value.includes(opt.value)).map((opt) => opt.label);

    return (
        <div ref={ref} className="relative w-full">
            <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
                onClick={() => setOpen((prev) => !prev)}
            >
                {selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder}
                <span className="ml-2">{open ? "▲" : "▼"}</span>
            </Button>

            {open && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-md max-h-60 overflow-y-auto">
                    {options.map((opt) => (
                        <label
                            key={opt.value}
                            className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                        >
                            <Checkbox
                                checked={value.includes(opt.value)}
                                onCheckedChange={() => toggleOption(opt.value)}
                            />
                            <span>{opt.label}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
