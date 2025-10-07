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
        months.push({ month: label, orders: 0, revenue: 0 });
    }

    return months;
}

const chartConfig = {
    orders: {
        label: "Orders",
        color: "var(--chart-1)",
    },
    revenue: {
        label: "Revenue",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export default function OrderAnalyticsChart() {
    const [chartData, setChartData] = useState(getLast6Months());

    useEffect(() => {
        const fetchOrderAnalytics = async () => {
            const { data, error } = await supabase
                .from("purchases")
                .select("amount, created_at, status");

            if (error) {
                console.error(error);
                return;
            }

            const months = getLast6Months();

            data?.forEach((purchase) => {
                const createdDate = new Date(purchase.created_at);
                const label = createdDate.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                });

                const monthEntry = months.find((m) => m.month === label);
                if (monthEntry && purchase.status === "completed") {
                    monthEntry.orders += 1;
                    monthEntry.revenue += Number(purchase.amount);
                }
            });

            setChartData(months);
        };

        fetchOrderAnalytics();
    }, []);

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Order Analytics</CardTitle>
                <CardDescription>
                    Showing revenue and orders (Last 6 months)
                </CardDescription>
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
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />

                        {["orders", "revenue"].map((key) => (
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
                    Total Orders:{" "}
                    {chartData.reduce((acc, item) => acc + item.orders, 0)} | Total
                    Revenue: ₹
                    {chartData.reduce((acc, item) => acc + item.revenue, 0).toFixed(2)}
                </div>
                <div className="text-muted-foreground leading-none">
                    {chartData[0]?.month} – {chartData[5]?.month}
                </div>
            </CardFooter>
        </Card>
    );
}
