"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, CheckCircle, Menu, Lock } from "lucide-react";
import { getCourseResources } from "@/lib/getCourseResources"; // 👈 use function above
import { Download } from "lucide-react"; // ✅ import the icon


interface Lesson {
    id: string;
    title: string;
    section: string;
    order: number;
    section_order: number; // ✅ add this

}

interface Course {
    id: string;
    name: string;
    course_data: Lesson[];
}

interface Progress {
    lesson_id: string;
    is_completed: boolean;
}

interface SidebarProps {
    course: Course;
    progress: Progress[];
    onSelectLesson: (lesson: Lesson) => void;
    activeLessonId?: string;
    certificateEarned?: boolean;   // ✅ new flag

}
interface Resource {
    id: string;
    type: "ebook" | "project";
    file_url: string;
}


export default function Sidebar({
    course,
    progress,
    onSelectLesson,
    activeLessonId,
    certificateEarned = false,     // default false

}: SidebarProps) {
    const [openSections, setOpenSections] = useState<string[]>([]);
    const [sidebarWidth, setSidebarWidth] = useState(280);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [resources, setResources] = useState<Resource[]>([]);

    // ✅ Determine unlocked lessons
    const completedLessonIds = progress.filter(p => p.is_completed).map(p => p.lesson_id);

    // Find index of the last completed lesson
    const orderedLessons = [...course.course_data].sort((a, b) => a.order - b.order);
    const lastCompletedIndex = orderedLessons.findIndex(l => !completedLessonIds.includes(l.id)) - 1;
    const unlockedUpToIndex = lastCompletedIndex >= 0 ? lastCompletedIndex + 1 : 0;


    // 🔹 Step 1: Preprocess lessons into sections with proper order
    const sectionedLessons = Object.entries(
        course.course_data.reduce<Record<string, Lesson[]>>((acc, lesson) => {
            acc[lesson.section] = acc[lesson.section] || [];
            acc[lesson.section].push(lesson);
            return acc;
        }, {})
    )
        .map(([section, lessons]) => ({
            section,
            lessons: lessons.sort((a, b) => a.order - b.order), // sort inside section
            section_order: lessons[0].section_order ?? 0,        // take section_order from first lesson
        }))
        .sort((a, b) => a.section_order - b.section_order);  // sort sections by section_order


    // 🔹 Close sidebar when screen size is resized
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileOpen(true);
            } else {
                setIsMobileOpen(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        (async () => {
            const res = await getCourseResources(course.id);
            setResources(res);
        })();
    }, [course.id]);

    const toggleSection = (section: string) => {
        setOpenSections((prev) =>
            prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
        );
    };

    const startResizing = (e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = sidebarWidth;
        const onMouseMove = (e: MouseEvent) => {
            setSidebarWidth(Math.max(220, startWidth + (e.clientX - startX)));
        };
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    return (
        <>
            {/* Mobile toggle */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-lg shadow-lg"
                onClick={() => setIsMobileOpen((prev) => !prev)}
            >
                <Menu size={20} />
            </button>

            {/* Overlay for mobile */}
            {isMobileOpen && window.innerWidth < 768 && (
                <div
                    className="fixed inset-0 bg-black/40 z-30"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                style={{ width: sidebarWidth }}
                className={`fixed md:relative top-0 left-0 h-screen z-40 transform transition-transform duration-300
        border-r shadow-md overflow-y-auto 
        bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900
        dark:from-neutral-950 dark:via-black dark:to-neutral-950 dark:text-neutral-100 dark:border-neutral-800
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
                {/* Header */}
                <div className="p-5 border-b border-gray-200 dark:border-neutral-800 bg-white/60 dark:bg-black/40 backdrop-blur-md flex justify-between items-center">
                    <h2 className="text-lg font-extrabold tracking-wide 
              bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 
              bg-clip-text text-transparent animate-pulse"
                    >
                        ⚡ Course Outline
                    </h2>
                    <button
                        className="md:hidden text-gray-600 dark:text-gray-300"
                        onClick={() => setIsMobileOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                {/* Sections */}
                {/* Sections */}
                <div className="p-4 space-y-5">
                    {sectionedLessons.map(({ section, lessons }) => {
                        const isOpen = openSections.includes(section);

                        return (
                            <div key={section}>
                                <button
                                    onClick={() => toggleSection(section)}
                                    className="flex items-center gap-2 w-full py-2 px-3 font-semibold text-left rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 hover:from-purple-100 hover:to-pink-100 dark:from-neutral-900 dark:to-neutral-950 dark:hover:from-purple-900/40 dark:hover:to-pink-900/30 transition-all border border-gray-200 dark:border-neutral-800 shadow-inner"
                                >
                                    {isOpen ? (
                                        <ChevronDown size={16} className="text-purple-500" />
                                    ) : (
                                        <ChevronRight size={16} className="text-purple-500" />
                                    )}
                                    <span>{section}</span>
                                </button>

                                {isOpen && (
                                    <ul className="mt-2 ml-6 space-y-1">
                                        {lessons.map((lesson) => {
                                            const lessonIndex = orderedLessons.findIndex(l => l.id === lesson.id);

                                            const done = progress.some(p => p.lesson_id === lesson.id && p.is_completed);

                                            const unlocked = certificateEarned
                                                ? true
                                                : done || lessonIndex <= unlockedUpToIndex + 1;

                                            const isActive = activeLessonId === lesson.id;


                                            return (
                                                <li
                                                    key={lesson.id}
                                                    onClick={() => {
                                                        if (unlocked) {
                                                            onSelectLesson(lesson);
                                                            if (window.innerWidth < 768) setIsMobileOpen(false);
                                                        }
                                                    }}
                                                    className={`flex items-center justify-between py-1.5 px-3 rounded-md text-sm transition-all group
                    ${unlocked
                                                            ? isActive
                                                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border-l-4 border-purple-700 dark:border-purple-400"
                                                                : "cursor-pointer hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/40 dark:hover:to-pink-900/30"
                                                            : "opacity-50 cursor-not-allowed"
                                                        }`}
                                                >
                                                    <span
                                                        className={`flex-1 truncate ${isActive
                                                            ? "font-bold text-white"
                                                            : "group-hover:text-purple-600 dark:group-hover:text-purple-300"
                                                            }`}
                                                    >
                                                        {lesson.title}
                                                    </span>
                                                    {done ? (
                                                        <CheckCircle
                                                            size={18}
                                                            className="text-green-500 dark:text-green-400 flex-shrink-0 ml-2"
                                                        />
                                                    ) : !unlocked ? (
                                                        <Lock size={16} className="text-gray-400 ml-2" />
                                                    ) : null}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 📂 Course Resources */}
                {resources.length > 0 && (
                    <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
                        <h3 className="text-md font-bold mb-3 text-purple-600 dark:text-purple-400 flex items-center gap-2">
                            <span className="text-xl">⚡</span> Premium Resources
                        </h3>
                        <div className="space-y-3">
                            {resources.map((res) => (
                                <a
                                    key={res.id}
                                    href={res.file_url}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative flex items-center justify-between p-3 rounded-xl border border-purple-300/30 
                     bg-gradient-to-r from-purple-50 via-white to-purple-100
                     dark:from-neutral-900 dark:via-black dark:to-neutral-950
                     shadow-sm hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Icon + Type */}
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-purple-600/10 group-hover:bg-purple-600/20 transition">
                                            <Download
                                                size={20}
                                                className="text-purple-600 group-hover:scale-110 group-hover:text-purple-500 transition-transform duration-300"
                                            />
                                        </div>
                                        <span className="capitalize font-semibold text-gray-800 dark:text-gray-200">
                                            {res.type === "ebook" ? "📘 eBook" : "🛠 Project Files"}
                                        </span>
                                    </div>

                                    {/* Floating glow on hover */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 blur-lg transition" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}


                {/* Resizer */}
                <div
                    onMouseDown={startResizing}
                    className="hidden md:block absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-purple-400/40"
                ></div>
            </div>
        </>
    );
}
