// app/(dashboard)/internships/[id]/learn/components/Sidebar.tsx
"use client";

import { useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    CheckCircle,
    Lock,
    ShieldCheck,
    ClipboardList,
    Menu,
    FileCheck,
    Download,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { useInternshipResources } from "../../../../utils/hooks/useInternshipResources"; // ✅ new import


interface InternshipTab {
    id: string;
    title: string;
}

interface InternshipSubsection {
    id: string;
    title: string;
    internship_tabs: InternshipTab[];
}

interface InternshipSection {
    id: string;
    title: string;
    internship_subsections: InternshipSubsection[];
}

interface SidebarProps {
    sections: InternshipSection[];
    progress: Record<string, boolean>;
    activeTabId?: string;
    onSelectTab: (tab: InternshipTab) => void;
    finalExam: {
        available: boolean;
        unlocked: boolean;
        passed: boolean;
        onOpen: () => void;
    };
}

export default function Sidebar({
    sections,
    progress,
    activeTabId,
    onSelectTab,
    finalExam,
}: SidebarProps) {
    const [openSections, setOpenSections] = useState<string[]>([]);
    const [sidebarWidth, setSidebarWidth] = useState<number>(280);
    const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

    const params = useParams();
    const router = useRouter();
    const internshipId = params.id as string;

    const { id } = useParams(); // internshipId from route

    const { resources, loading, error } = useInternshipResources(id as string);

    if (loading) return <p className="p-4 text-sm text-gray-500">Loading resources...</p>;
    if (error) return <p className="p-4 text-sm text-red-500">Error: {error}</p>;
    if (resources.length === 0) return null;


    const toggleSection = (sectionId: string) => {
        setOpenSections((prev) =>
            prev.includes(sectionId)
                ? prev.filter((id) => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const startResizing = (e: React.MouseEvent) => {
        if (typeof window !== "undefined" && window.innerWidth < 768) return;
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = sidebarWidth;

        const onMouseMove = (ev: MouseEvent) => {
            const next = Math.max(240, startWidth + (ev.clientX - startX));
            setSidebarWidth(next);
        };
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    // 🔹 DEBUG: log fetched data
    // console.log("Sidebar props - sections:", sections);
    // console.log("Resources fetched:", resources);
    // console.log("Loading:", loading, "Error:", error);



    // Shared content renderer
    const SidebarContent = () => (
        <>
            {/* Header */}
            <div className="p-5 border-b border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-black/50 backdrop-blur-md">
                <h2 className="text-lg font-extrabold tracking-wide bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
                    🎯 Internship Roadmap
                </h2>
            </div>

            {/* Sections */}
            <div className="p-4 space-y-5">
                {sections.map((section) => {
                    const isOpen = openSections.includes(section.id);
                    return (
                        <div key={section.id}>
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="flex items-center gap-2 w-full py-2 px-3 font-semibold text-left rounded-lg 
                  bg-gradient-to-r from-gray-100 to-gray-50 hover:from-purple-100 hover:to-indigo-100 
                  dark:from-neutral-900 dark:to-neutral-950 
                  dark:hover:from-purple-900/40 dark:hover:to-indigo-900/30 
                  transition-all border border-gray-200 dark:border-neutral-800 shadow-sm"
                            >
                                {isOpen ? (
                                    <ChevronDown size={16} className="text-purple-500" />
                                ) : (
                                    <ChevronRight size={16} className="text-purple-500" />
                                )}
                                <span>{section.title}</span>
                            </button>

                            {isOpen && (
                                <div className="mt-2 ml-6 space-y-3">
                                    {section.internship_subsections.map((sub) => (
                                        <div key={sub.id}>
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                                {sub.title}
                                            </p>
                                            <ul className="space-y-1">
                                                {sub.internship_tabs.map((tab) => {
                                                    const done = progress?.[tab.id] ?? false;
                                                    const isActive = activeTabId === tab.id;
                                                    return (
                                                        <li
                                                            key={tab.id}
                                                            onClick={() => {
                                                                onSelectTab(tab);
                                                                if (typeof window !== "undefined" && window.innerWidth < 768) {
                                                                    setIsMobileOpen(false);
                                                                }
                                                            }}
                                                            className={`flex items-center justify-between py-1.5 px-3 rounded-md text-sm transition-all group
                                ${isActive
                                                                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md border-l-4 border-purple-700 dark:border-purple-400"
                                                                    : "cursor-pointer hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/40 dark:hover:to-indigo-900/30"
                                                                }`}
                                                        >
                                                            <span
                                                                className={`flex-1 truncate ${isActive
                                                                    ? "font-bold text-white"
                                                                    : "group-hover:text-purple-600 dark:group-hover:text-purple-300"
                                                                    }`}
                                                            >
                                                                {tab.title}
                                                            </span>
                                                            {done ? (
                                                                <CheckCircle
                                                                    size={18}
                                                                    className="text-green-500 dark:text-green-400 flex-shrink-0 ml-2"
                                                                />
                                                            ) : (
                                                                <Lock size={16} className="text-gray-400 ml-2" />
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 📂 Premium Resources */}
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

                            {/* Glow */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 blur-lg transition" />
                        </a>
                    ))}
                </div>
            </div>

            {/* Final Exam */}
            {finalExam.available && (
                <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
                    <button
                        onClick={finalExam.unlocked && !finalExam.passed ? finalExam.onOpen : undefined}
                        disabled={!finalExam.unlocked || finalExam.passed}
                        className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-left font-medium transition-all
    ${finalExam.passed
                                ? "bg-green-600 text-white shadow-md"
                                : finalExam.unlocked
                                    ? "bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:from-amber-600 hover:to-pink-600 shadow-md"
                                    : "bg-gray-200 text-gray-600 cursor-not-allowed"
                            }`}
                    >
                        {finalExam.passed ? <ShieldCheck className="h-4 w-4" />
                            : finalExam.unlocked ? <ClipboardList className="h-4 w-4" />
                                : <Lock className="h-4 w-4" />
                        }
                        <span>Final Internship Exam</span>
                    </button>

                </div>
            )}

            {/* Final Project Submission */}
            <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
                <button
                    onClick={() => {
                        router.push(`/internships/${internshipId}/project`);
                        if (typeof window !== "undefined" && window.innerWidth < 768) {
                            setIsMobileOpen(false);
                        }
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-left font-medium transition-all
               bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
               hover:from-purple-700 hover:to-indigo-700 shadow-md"
                >
                    <FileCheck className="h-4 w-4" />
                    <span>Final Project Submission</span>
                </button>
            </div>

        </>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-lg shadow-lg"
                onClick={() => setIsMobileOpen((p) => !p)}
                aria-label="Toggle sidebar"
            >
                <Menu size={20} />
            </button>

            {/* Mobile overlay backdrop */}
            <div
                className={`md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsMobileOpen(false)}
            />

            {/* Mobile drawer */}
            {/* Mobile drawer */}
            <div
                className={`md:hidden fixed top-0 left-0 h-screen w-64 z-50
      transform transition-transform duration-300
      bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900
      dark:from-neutral-950 dark:via-black dark:to-neutral-950 dark:text-neutral-100 dark:border-neutral-800
      border-r shadow-xl
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
    `}
            >
                {/* ✅ Make it scrollable */}
                <div className="h-full overflow-y-auto">
                    <SidebarContent />
                </div>
            </div>


            {/* Desktop sidebar */}
            <aside
                className="hidden md:block relative shrink-0"
                style={{ width: `${sidebarWidth}px` }}
            >
                <div
                    className="sticky top-0 h-screen border-r overflow-y-auto shadow-xl
            bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900
            dark:from-neutral-950 dark:via-black dark:to-neutral-950 dark:text-neutral-100 dark:border-neutral-800"
                >
                    <SidebarContent />
                </div>
                <div
                    onMouseDown={startResizing}
                    className="hidden md:block absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-purple-400/40"
                />
            </aside>
        </>
    );
}
