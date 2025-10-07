"use client";

import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExtraResourcesProps {
    links: {
        id: string;
        title: string | null;
        url: string | null;
    }[];
}

export default function ExtraResources({ links }: ExtraResourcesProps) {
    if (!links || links.length === 0) return null;

    return (
        <Card className="mt-6 border border-gray-200 shadow-sm rounded-2xl">
            <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-3">Extra Resources</h3>
                <div className="space-y-2">
                    {links.map((link) => (
                        <Button
                            key={link.id}
                            variant="outline"
                            className="w-full justify-between"
                            asChild
                        >
                            <a href={link.url ?? "#"} target="_blank" rel="noopener noreferrer">
                                {link.title ?? "Resource"}
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
