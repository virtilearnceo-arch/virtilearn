"use client";

import { useEffect, useState } from "react";
import { GitCommitVertical } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

function getLast6Months() {
    const today = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const label = date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
        months.push({ month: label, created: 0, updated: 0 });
    }

    return months;
}

const chartConfig = {
    created: {
        label: "Created",
        color: "var(--chart-1)",
    },
    updated: {
        label: "Updated",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export default function CourseLineAnalyticsChart() {
    const [chartData, setChartData] = useState(getLast6Months());

    useEffect(() => {
        const fetchCourseAnalytics = async () => {
            const { data, error } = await supabase
                .from("courses")
                .select("created_at, updated_at");

            if (error) {
                console.error(error);
                return;
            }

            const months = getLast6Months();

            data?.forEach((course) => {
                const createdDate = new Date(course.created_at);
                const updatedDate = new Date(course.updated_at);

                const createdLabel = createdDate.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                });

                const updatedLabel = updatedDate.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                });

                const createdMonth = months.find((m) => m.month === createdLabel);
                if (createdMonth) createdMonth.created += 1;

                const updatedMonth = months.find((m) => m.month === updatedLabel);
                if (updatedMonth) updatedMonth.updated += 1;
            });

            setChartData(months);
        };

        fetchCourseAnalytics();
    }, []);

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Courses Growth Analytics</CardTitle>
                <CardDescription>Showing created and updated courses (Last 6 months)</CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

                        {["created", "updated"].map((key) => (
                            <Line
                                key={key}
                                dataKey={key}
                                type="natural"
                                stroke={`var(--color-${key})`}
                                strokeWidth={2}
                                dot={({ cx, cy, payload }) => {
                                    const r = 18;
                                    return (
                                        <GitCommitVertical
                                            key={`${payload.month}-${key}`}
                                            x={cx - r / 2}
                                            y={cy - r / 2}
                                            width={r}
                                            height={r}
                                            fill="hsl(var(--background))"
                                            stroke={`var(--color-${key})`}
                                        />
                                    );
                                }}
                            />
                        ))}
                    </LineChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Total Courses:{" "}
                    {chartData.reduce((acc, item) => acc + item.created, 0)} Created,{" "}
                    {chartData.reduce((acc, item) => acc + item.updated, 0)} Updated
                </div>
                <div className="text-muted-foreground leading-none">
                    {chartData[0]?.month} – {chartData[5]?.month}
                </div>
            </CardFooter>
        </Card>
    );
}
