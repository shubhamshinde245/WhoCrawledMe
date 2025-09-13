"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/cards";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface VisitsData {
  date: string;
  visits: number;
}

interface VisitsChartProps {
  timeRange: string;
}

export default function VisitsChart({ timeRange }: VisitsChartProps) {
  const [data, setData] = useState<VisitsData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisitsData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/analytics?type=visits-over-time&timeRange=${timeRange}`
      );
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error("Failed to fetch visits data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchVisitsData();
  }, [fetchVisitsData]);

  const chartData = {
    labels: data.map((item) => {
      const date = new Date(item.date);
      if (timeRange === "24h") {
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }),
    datasets: [
      {
        label: "Bot Visits",
        data: data.map((item) => item.visits),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: (context: {
          chart: {
            ctx: CanvasRenderingContext2D;
            chartArea: { top: number; bottom: number };
          };
        }) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(99, 102, 241, 0.1)";
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(99, 102, 241, 0.3)");
          gradient.addColorStop(0.5, "rgba(99, 102, 241, 0.1)");
          gradient.addColorStop(1, "rgba(99, 102, 241, 0.05)");
          return gradient;
        },
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "white",
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "rgb(79, 70, 229)",
        pointHoverBorderColor: "white",
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "rgb(248, 250, 252)",
        bodyColor: "rgb(226, 232, 240)",
        borderColor: "rgba(99, 102, 241, 0.6)",
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: false,
        padding: 12,
        titleFont: {
          size: 13,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 12,
          weight: "normal" as const,
        },
        callbacks: {
          title: (context: TooltipItem<"line">[]) => {
            const date = new Date(data[context[0].dataIndex]?.date);
            if (timeRange === "24h") {
              return date.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            }
            return date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            });
          },
          label: (context: TooltipItem<"line">) =>
            `🤖 ${context.parsed.y} bot visits`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
          font: {
            size: 11,
            weight: "normal" as const,
          },
          maxTicksLimit: 8,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "hsl(var(--border))",
          lineWidth: 1,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
          font: {
            size: 11,
            weight: "normal" as const,
          },
          callback: function (value: string | number) {
            return Number.isInteger(value) ? value : "";
          },
          padding: 8,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    elements: {
      point: {
        hoverRadius: 8,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart" as const,
    },
  };

  if (loading) {
    return (
      <div className="sticky top-5 z-50 transition-all duration-500 ease-in-out">
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-gradient">
              Bot Visits Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <div className="loading-shimmer w-12 h-12 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="sticky top-5 z-50 transition-all duration-500 ease-in-out">
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-gradient">
              Bot Visits Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">📊</span>
                </div>
                <p className="text-muted-foreground font-medium">
                  No data available for the selected time range
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="sticky top-5 z-50 transition-all duration-500 ease-in-out">
      <Card className="group hover:shadow-2xl transition-all duration-300 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/30 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-gradient">Bot Visits Over Time</span>
            <span className="text-sm font-semibold text-muted-foreground bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 dark:border-gray-600/20">
              {timeRange === "24h"
                ? "Last 24 Hours"
                : timeRange === "7d"
                ? "Last 7 Days"
                : "Last 30 Days"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 dark:from-indigo-950/10 dark:to-purple-950/10 rounded-lg -z-10 backdrop-blur-sm"></div>
            <Line data={chartData} options={options} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
