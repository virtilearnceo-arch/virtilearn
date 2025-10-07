"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface InstructorInfoProps {
    instructors: {
        id: string;
        name: string;
        bio?: string | null;
        avatar_url?: string | null;
    }[];
}

export default function InstructorInfo({ instructors }: InstructorInfoProps) {
    if (!instructors || instructors.length === 0) return null;

    return (
        <Card className="mt-6 border border-gray-200 shadow-sm rounded-2xl">
            <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg">Instructor{instructors.length > 1 ? "s" : ""}</h3>
                {instructors.map((inst) => (
                    <div key={inst.id} className="flex items-start gap-3">
                        <div className="w-12 h-12 relative rounded-full overflow-hidden border border-gray-200">
                            {inst.avatar_url ? (
                                <Image
                                    src={inst.avatar_url}
                                    alt={inst.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-gray-600">
                                    {inst.name[0]}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">{inst.name}</p>
                            {inst.bio && (
                                <p className="text-sm text-gray-600 line-clamp-3">{inst.bio}</p>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
