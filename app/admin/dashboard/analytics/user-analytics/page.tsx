"use client";

import { useEffect, useState } from "react";
import {
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,

} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { supabase } from "@/lib/supabase/client";

// export const description = "A radar chart with dots (Users Analytics)";

function getLast6Months() {
    const today = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const label = date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
        months.push({ month: label, count: 0 });
    }

    return months;
}

const chartConfig = {
    users: {
        label: "Users",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

export default function ChartRadarDots() {
    const [chartData, setChartData] = useState(getLast6Months());

    useEffect(() => {
        const fetchUserGrowth = async () => {
            const { data: users, error } = await supabase
                .from("users")
                .select("created_at");

            if (error) {
                console.error(error);
                return;
            }

            const months = getLast6Months();

            users?.forEach((user) => {
                const date = new Date(user.created_at);
                const label = date.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                });

                const found = months.find((m) => m.month === label);
                if (found) {
                    found.count += 1;
                }
            });

            setChartData(months);
        };

        fetchUserGrowth();
    }, []);

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="items-center">
                <CardTitle>User Growth Radar Chart</CardTitle>
                <CardDescription>
                    Showing user signups for the last 6 months
                </CardDescription>
            </CardHeader>

            <CardContent className="pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[350px]"
                >
                    <RadarChart data={chartData}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <PolarAngleAxis dataKey="month" />
                        <PolarGrid />
                        <Radar
                            dataKey="count"
                            fill="var(--color-users)"
                            fillOpacity={0.6}
                            dot={{
                                r: 4,
                                fillOpacity: 1,
                            }}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Total users for the period:{" "}
                    {chartData.reduce((acc, item) => acc + item.count, 0)}
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                    {chartData[0]?.month} – {chartData[5]?.month}
                </div>
            </CardFooter>
        </Card>
    );
}
