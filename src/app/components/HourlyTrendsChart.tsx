"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ScriptableContext,
  type TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface HourlyData {
  hour: number;
  visits: number;
}

interface HourlyTrendsChartProps {
  timeRange: string;
}

export default function HourlyTrendsChart({
  timeRange,
}: HourlyTrendsChartProps) {
  const [data, setData] = useState<HourlyData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHourlyData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/analytics?type=hourly-trends&timeRange=${timeRange}`
      );
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error("Failed to fetch hourly data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchHourlyData();
  }, [fetchHourlyData]);

  // Create 24-hour data array with zeros for missing hours
  const createHourlyData = () => {
    const hourlyMap = new Map(data.map((item) => [item.hour, item.visits]));
    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      visits: hourlyMap.get(hour) || 0,
    }));
  };

  const hourlyData = createHourlyData();

  const chartData = {
    labels: hourlyData.map((item) => {
      const hour = item.hour;
      if (hour === 0) return "12 AM";
      if (hour === 12) return "12 PM";
      if (hour < 12) return `${hour} AM`;
      return `${hour - 12} PM`;
    }),
    datasets: [
      {
        label: "Bot Visits",
        data: hourlyData.map((item) => item.visits),
        backgroundColor: (context: ScriptableContext<"bar">) => {
          const value = context.parsed.y;
          const maxValue = Math.max(...hourlyData.map((d) => d.visits));
          const intensity = maxValue > 0 ? value / maxValue : 0;
          return `rgba(59, 130, 246, ${0.3 + intensity * 0.5})`;
        },
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
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
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(59, 130, 246, 0.5)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: TooltipItem<"bar">[]) => {
            const hour = hourlyData[context[0].dataIndex]?.hour;
            if (hour === 0) return "12:00 AM - 12:59 AM";
            if (hour === 12) return "12:00 PM - 12:59 PM";
            if (hour < 12) return `${hour}:00 AM - ${hour}:59 AM`;
            return `${hour - 12}:00 PM - ${hour - 12}:59 PM`;
          },
          label: (context: TooltipItem<"bar">) =>
            `${context.parsed.y} bot visits`,
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
          color: "rgb(107, 114, 128)",
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
        },
        border: {
          display: false,
        },
        ticks: {
          color: "rgb(107, 114, 128)",
          font: {
            size: 12,
          },
          callback: function (value: string | number) {
            return Number.isInteger(value) ? value : "";
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  // Calculate peak hours
  const peakHour = hourlyData.reduce(
    (max, current) => (current.visits > max.visits ? current : max),
    hourlyData[0]
  );

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hourly Activity Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalVisits = hourlyData.reduce((sum, item) => sum + item.visits, 0);

  if (totalVisits === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hourly Activity Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">⏰</div>
              <p>No hourly data available for the selected time range</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Hourly Activity Trends</span>
          <span className="text-sm font-normal text-gray-500">
            {timeRange === "24h"
              ? "Last 24 Hours"
              : timeRange === "7d"
              ? "Last 7 Days"
              : "Last 30 Days"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Bar data={chartData} options={options} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {formatHour(peakHour?.hour || 0)}
            </div>
            <div className="text-gray-500">Peak Hour</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {peakHour?.visits || 0}
            </div>
            <div className="text-gray-500">Peak Visits</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {(totalVisits / 24).toFixed(1)}
            </div>
            <div className="text-gray-500">Avg/Hour</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
