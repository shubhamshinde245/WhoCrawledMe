"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/cards";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, Eye } from "lucide-react";

interface BrandVisibilityChartProps {
  timeRange: string;
}

interface VisibilityData {
  date: string;
  mentions: number;
  visibility_score: number;
  reach: number;
  engagement: number;
}

export default function BrandVisibilityChart({
  timeRange,
}: BrandVisibilityChartProps) {
  const [data, setData] = useState<VisibilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<
    "mentions" | "visibility_score" | "reach"
  >("mentions");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch real brand visibility data from API
        const response = await fetch(
          `/api/brand-analytics?timeRange=${timeRange}&type=visibility`
        );
        const result = await response.json();

        if (result.error) {
          console.error("Brand visibility API error:", result.error);
          setData([]);
          return;
        }

        setData(result.data || []);
      } catch (error) {
        console.error("Error fetching brand visibility data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case "mentions":
        return "#3b82f6";
      case "visibility_score":
        return "#10b981";
      case "reach":
        return "#8b5cf6";
      default:
        return "#3b82f6";
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case "mentions":
        return "Brand Mentions";
      case "visibility_score":
        return "Visibility Score";
      case "reach":
        return "Estimated Reach";
      default:
        return "Brand Mentions";
    }
  };

  const formatValue = (value: number, metric: string) => {
    if (metric === "reach") {
      return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toString();
    }
    return value.toString();
  };

  const currentValue =
    data.length > 0 ? data[data.length - 1][selectedMetric] : 0;
  const previousValue =
    data.length > 1 ? data[data.length - 2][selectedMetric] : 0;
  const changePercent =
    previousValue > 0
      ? ((currentValue - previousValue) / previousValue) * 100
      : 0;

  if (loading) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            Brand Visibility Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-600" />
          Brand Visibility Metrics
        </CardTitle>
        <CardDescription>
          Track your brands visibility across AI platforms over time
        </CardDescription>

        {/* Metric Selector */}
        <div className="flex gap-2 mt-4">
          {(["mentions", "visibility_score", "reach"] as const).map(
            (metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  selectedMetric === metric
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {getMetricLabel(metric)}
              </button>
            )
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Current Value and Change */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-gray-900">
              {formatValue(currentValue, selectedMetric)}
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                changePercent >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendingUp
                className={`w-4 h-4 ${changePercent < 0 ? "rotate-180" : ""}`}
              />
              {Math.abs(changePercent).toFixed(1)}%
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {getMetricLabel(selectedMetric)} in the last {timeRange}
          </p>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id={`gradient-${selectedMetric}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={getMetricColor(selectedMetric)}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={getMetricColor(selectedMetric)}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => formatValue(value, selectedMetric)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }
                formatter={(value: number) => [
                  formatValue(value, selectedMetric),
                  getMetricLabel(selectedMetric),
                ]}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={getMetricColor(selectedMetric)}
                strokeWidth={2}
                fill={`url(#gradient-${selectedMetric})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {data.reduce((sum, item) => sum + item.mentions, 0)}
            </div>
            <div className="text-xs text-gray-600">Total Mentions</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {data.length > 0
                ? Math.round(
                    data.reduce((sum, item) => sum + item.visibility_score, 0) /
                      data.length
                  )
                : 0}
            </div>
            <div className="text-xs text-gray-600">Avg Visibility</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {data.length > 0
                ? formatValue(
                    Math.max(...data.map((item) => item.reach)),
                    "reach"
                  )
                : "0"}
            </div>
            <div className="text-xs text-gray-600">Peak Reach</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
