"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/cards";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Heart,
  BarChart3,
  Award,
  Users,
} from "lucide-react";

interface BrandAnalyticsProps {
  timeRange: string;
}

interface BrandMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
  category: "visibility" | "engagement" | "sentiment" | "reach";
  description: string;
  benchmark: number;
}

interface BrandTrend {
  date: string;
  visibility_score: number;
  mention_rate: number;
  sentiment_score: number;
  engagement_rate: number;
  share_of_voice: number;
  brand_awareness: number;
}

interface SentimentData {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

interface CompetitorComparison {
  brand: string;
  visibility: number;
  mentions: number;
  sentiment: number;
  engagement: number;
  market_share: number;
  color: string;
}

interface BrandHealth {
  category: string;
  score: number;
  max_score: number;
}

interface TopMention {
  id: string;
  platform: string;
  content: string;
  sentiment: "positive" | "neutral" | "negative";
  engagement: number;
  reach: number;
  timestamp: string;
  source_url: string;
}

export default function BrandAnalytics({ timeRange }: BrandAnalyticsProps) {
  const [brandMetrics, setBrandMetrics] = useState<BrandMetric[]>([]);
  const [brandTrends, setBrandTrends] = useState<BrandTrend[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [competitorData, setCompetitorData] = useState<CompetitorComparison[]>(
    []
  );
  const [brandHealth, setBrandHealth] = useState<BrandHealth[]>([]);
  const [topMentions, setTopMentions] = useState<TopMention[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] =
    useState<string>("visibility_score");

  useEffect(() => {
    const fetchBrandData = async () => {
      setLoading(true);
      try {
        // const response = await fetch(`/api/brand-analytics?timeRange=${timeRange}&type=overview`);
        // const data = await response.json();
        // Update state with real data when backend is ready

        // Mock brand metrics data
        const mockBrandMetrics: BrandMetric[] = [
          {
            id: "1",
            name: "Brand Visibility Score",
            value: 87.3,
            change: 12.4,
            trend: "up",
            category: "visibility",
            description: "Overall brand presence across AI platforms",
            benchmark: 75.0,
          },
          {
            id: "2",
            name: "Mention Rate",
            value: 234,
            change: 18.7,
            trend: "up",
            category: "visibility",
            description: "Daily brand mentions across platforms",
            benchmark: 200,
          },
          {
            id: "3",
            name: "Sentiment Score",
            value: 78.9,
            change: -2.1,
            trend: "down",
            category: "sentiment",
            description: "Average sentiment of brand mentions",
            benchmark: 80.0,
          },
          {
            id: "4",
            name: "Engagement Rate",
            value: 6.8,
            change: 24.3,
            trend: "up",
            category: "engagement",
            description: "User interaction rate with brand content",
            benchmark: 5.5,
          },
          {
            id: "5",
            name: "Share of Voice",
            value: 23.4,
            change: 8.9,
            trend: "up",
            category: "reach",
            description: "Brand presence vs competitors",
            benchmark: 20.0,
          },
          {
            id: "6",
            name: "Brand Awareness",
            value: 64.2,
            change: 15.6,
            trend: "up",
            category: "reach",
            description: "Recognition across target audience",
            benchmark: 55.0,
          },
          {
            id: "7",
            name: "Response Rate",
            value: 89.1,
            change: 5.3,
            trend: "up",
            category: "engagement",
            description: "AI platform response to brand queries",
            benchmark: 85.0,
          },
          {
            id: "8",
            name: "Trust Score",
            value: 82.7,
            change: -1.4,
            trend: "down",
            category: "sentiment",
            description: "Perceived trustworthiness of brand",
            benchmark: 80.0,
          },
        ];

        // Mock brand trends data
        const mockBrandTrends: BrandTrend[] = [
          {
            date: "2024-01-01",
            visibility_score: 75.2,
            mention_rate: 198,
            sentiment_score: 76.4,
            engagement_rate: 5.2,
            share_of_voice: 19.8,
            brand_awareness: 58.3,
          },
          {
            date: "2024-01-02",
            visibility_score: 78.1,
            mention_rate: 212,
            sentiment_score: 77.8,
            engagement_rate: 5.6,
            share_of_voice: 20.4,
            brand_awareness: 59.7,
          },
          {
            date: "2024-01-03",
            visibility_score: 80.5,
            mention_rate: 225,
            sentiment_score: 79.2,
            engagement_rate: 6.1,
            share_of_voice: 21.2,
            brand_awareness: 61.2,
          },
          {
            date: "2024-01-04",
            visibility_score: 83.2,
            mention_rate: 238,
            sentiment_score: 78.6,
            engagement_rate: 6.4,
            share_of_voice: 22.1,
            brand_awareness: 62.8,
          },
          {
            date: "2024-01-05",
            visibility_score: 85.7,
            mention_rate: 251,
            sentiment_score: 78.1,
            engagement_rate: 6.7,
            share_of_voice: 22.8,
            brand_awareness: 63.9,
          },
          {
            date: "2024-01-06",
            visibility_score: 86.9,
            mention_rate: 243,
            sentiment_score: 78.5,
            engagement_rate: 6.9,
            share_of_voice: 23.2,
            brand_awareness: 64.1,
          },
          {
            date: "2024-01-07",
            visibility_score: 87.3,
            mention_rate: 234,
            sentiment_score: 78.9,
            engagement_rate: 6.8,
            share_of_voice: 23.4,
            brand_awareness: 64.2,
          },
        ];

        // Mock sentiment data
        const mockSentimentData: SentimentData[] = [
          { date: "2024-01-01", positive: 65, neutral: 25, negative: 10 },
          { date: "2024-01-02", positive: 68, neutral: 23, negative: 9 },
          { date: "2024-01-03", positive: 71, neutral: 21, negative: 8 },
          { date: "2024-01-04", positive: 69, neutral: 22, negative: 9 },
          { date: "2024-01-05", positive: 67, neutral: 24, negative: 9 },
          { date: "2024-01-06", positive: 70, neutral: 22, negative: 8 },
          { date: "2024-01-07", positive: 72, neutral: 20, negative: 8 },
        ];

        // Mock competitor comparison data
        const mockCompetitorData: CompetitorComparison[] = [
          {
            brand: "Your Brand",
            visibility: 87.3,
            mentions: 234,
            sentiment: 78.9,
            engagement: 6.8,
            market_share: 23.4,
            color: "#3b82f6",
          },
          {
            brand: "Competitor A",
            visibility: 82.1,
            mentions: 198,
            sentiment: 75.2,
            engagement: 5.9,
            market_share: 19.8,
            color: "#ef4444",
          },
          {
            brand: "Competitor B",
            visibility: 79.5,
            mentions: 176,
            sentiment: 73.6,
            engagement: 5.4,
            market_share: 17.2,
            color: "#10b981",
          },
          {
            brand: "Competitor C",
            visibility: 76.8,
            mentions: 165,
            sentiment: 71.9,
            engagement: 5.1,
            market_share: 15.6,
            color: "#f59e0b",
          },
          {
            brand: "Competitor D",
            visibility: 74.2,
            mentions: 142,
            sentiment: 69.3,
            engagement: 4.7,
            market_share: 13.8,
            color: "#8b5cf6",
          },
          {
            brand: "Others",
            visibility: 65.4,
            mentions: 98,
            sentiment: 65.1,
            engagement: 3.9,
            market_share: 10.2,
            color: "#6b7280",
          },
        ];

        // Mock brand health data
        const mockBrandHealth: BrandHealth[] = [
          { category: "Visibility", score: 87, max_score: 100 },
          { category: "Sentiment", score: 79, max_score: 100 },
          { category: "Engagement", score: 68, max_score: 100 },
          { category: "Trust", score: 83, max_score: 100 },
          { category: "Innovation", score: 91, max_score: 100 },
          { category: "Support", score: 76, max_score: 100 },
        ];

        // Mock top mentions data
        const mockTopMentions: TopMention[] = [
          {
            id: "1",
            platform: "ChatGPT",
            content:
              "WhoCrawledMe provides excellent AI platform monitoring with comprehensive analytics and real-time insights.",
            sentiment: "positive",
            engagement: 156,
            reach: 2340,
            timestamp: "2 hours ago",
            source_url: "https://chat.openai.com/conversation/abc123",
          },
          {
            id: "2",
            platform: "Claude",
            content:
              "For tracking AI crawler activity, WhoCrawledMe offers detailed visibility into platform behavior and user interactions.",
            sentiment: "positive",
            engagement: 134,
            reach: 1890,
            timestamp: "4 hours ago",
            source_url: "https://claude.ai/chat/def456",
          },
          {
            id: "3",
            platform: "Perplexity",
            content:
              "WhoCrawledMe dashboard shows comprehensive metrics but could improve real-time update frequency.",
            sentiment: "neutral",
            engagement: 89,
            reach: 1456,
            timestamp: "6 hours ago",
            source_url: "https://perplexity.ai/search/ghi789",
          },
          {
            id: "4",
            platform: "Gemini",
            content:
              "The competitive intelligence features in WhoCrawledMe provide valuable market insights for AI platform analysis.",
            sentiment: "positive",
            engagement: 112,
            reach: 1678,
            timestamp: "8 hours ago",
            source_url: "https://gemini.google.com/chat/jkl012",
          },
          {
            id: "5",
            platform: "ChatGPT",
            content:
              "WhoCrawledMe interface needs better mobile optimization for monitoring on-the-go.",
            sentiment: "negative",
            engagement: 67,
            reach: 923,
            timestamp: "12 hours ago",
            source_url: "https://chat.openai.com/conversation/mno345",
          },
        ];

        setBrandMetrics(mockBrandMetrics);
        setBrandTrends(mockBrandTrends);
        setSentimentData(mockSentimentData);
        setCompetitorData(mockCompetitorData);
        setBrandHealth(mockBrandHealth);
        setTopMentions(mockTopMentions);
      } catch (error) {
        console.error("Error fetching brand analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [timeRange]);

  const overallScore =
    brandMetrics.reduce((sum, metric) => sum + metric.value, 0) /
    brandMetrics.length;
  const positiveMetrics = brandMetrics.filter(
    (metric) => metric.trend === "up"
  ).length;
  const totalMentions = brandTrends.reduce(
    (sum, trend) => sum + trend.mention_rate,
    0
  );
  const avgSentiment =
    sentimentData.reduce((sum, data) => sum + data.positive, 0) /
    sentimentData.length;

  if (loading) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Brand Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Overall Score
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {overallScore.toFixed(1)}
            </div>
            <div className="text-xs text-blue-600">Brand health index</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Positive Trends
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {positiveMetrics}/{brandMetrics.length}
            </div>
            <div className="text-xs text-green-600">Metrics improving</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                Total Mentions
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalMentions.toLocaleString()}
            </div>
            <div className="text-xs text-purple-600">Last 7 days</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-gray-700">
                Avg Sentiment
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {avgSentiment.toFixed(1)}%
            </div>
            <div className="text-xs text-red-600">Positive mentions</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="competition">Competition</TabsTrigger>
          <TabsTrigger value="mentions">Top Mentions</TabsTrigger>
        </TabsList>

        {/* Key Metrics */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metrics Grid */}
            <div className="space-y-4">
              {brandMetrics.map((metric) => (
                <Card
                  key={metric.id}
                  className="bg-white/60 backdrop-blur-sm border-white/20"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {metric.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {metric.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : metric.trend === "down" ? (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        ) : (
                          <div className="w-4 h-4 bg-gray-400 rounded-full" />
                        )}
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            metric.category === "visibility"
                              ? "bg-blue-100 text-blue-700"
                              : metric.category === "engagement"
                              ? "bg-green-100 text-green-700"
                              : metric.category === "sentiment"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {metric.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {metric.name.includes("Rate") &&
                          !metric.name.includes("Mention")
                            ? `${metric.value.toFixed(1)}%`
                            : metric.value.toLocaleString()}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            metric.change >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {metric.change >= 0 ? "+" : ""}
                          {metric.change.toFixed(1)}%
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 mb-2">
                        {metric.description}
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Benchmark:</span>
                        <span
                          className={`font-medium ${
                            metric.value >= metric.benchmark
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {metric.benchmark.toLocaleString()}
                          {metric.name.includes("Rate") &&
                          !metric.name.includes("Mention")
                            ? "%"
                            : ""}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            metric.value >= metric.benchmark
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (metric.value / (metric.benchmark * 1.2)) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Brand Health Radar */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Brand Health Overview</CardTitle>
                <CardDescription>
                  Multi-dimensional brand performance analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      data={brandHealth}
                      margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                    >
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis
                        dataKey="category"
                        tick={{ fontSize: 12, fill: "#64748b" }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fontSize: 10, fill: "#64748b" }}
                      />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends" className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 bg-white/80 border border-gray-200 rounded-lg text-sm"
            >
              <option value="visibility_score">Visibility Score</option>
              <option value="mention_rate">Mention Rate</option>
              <option value="sentiment_score">Sentiment Score</option>
              <option value="engagement_rate">Engagement Rate</option>
              <option value="share_of_voice">Share of Voice</option>
              <option value="brand_awareness">Brand Awareness</option>
            </select>
          </div>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle>Brand Metrics Trends</CardTitle>
              <CardDescription>
                Track brand performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={brandTrends}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="metricGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#metricGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sentiment */}
        <TabsContent value="sentiment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Sentiment Trends</CardTitle>
                <CardDescription>
                  Sentiment distribution over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={sentimentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="positive"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.8}
                      />
                      <Area
                        type="monotone"
                        dataKey="neutral"
                        stackId="1"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.8}
                      />
                      <Area
                        type="monotone"
                        dataKey="negative"
                        stackId="1"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.8}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Current Sentiment Distribution</CardTitle>
                <CardDescription>Latest sentiment breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Positive",
                            value:
                              sentimentData[sentimentData.length - 1]
                                ?.positive || 0,
                            fill: "#10b981",
                          },
                          {
                            name: "Neutral",
                            value:
                              sentimentData[sentimentData.length - 1]
                                ?.neutral || 0,
                            fill: "#f59e0b",
                          },
                          {
                            name: "Negative",
                            value:
                              sentimentData[sentimentData.length - 1]
                                ?.negative || 0,
                            fill: "#ef4444",
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      ></Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Competition */}
        <TabsContent value="competition" className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle>Competitive Landscape</CardTitle>
              <CardDescription>
                Brand performance vs competitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={competitorData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="brand" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="visibility" name="Visibility Score">
                      {competitorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitorData.map((competitor) => (
              <Card
                key={competitor.brand}
                className="bg-white/60 backdrop-blur-sm border-white/20"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {competitor.brand}
                    </h3>
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: competitor.color }}
                    ></div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visibility:</span>
                      <span className="font-medium">
                        {competitor.visibility.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mentions:</span>
                      <span className="font-medium">{competitor.mentions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sentiment:</span>
                      <span className="font-medium">
                        {competitor.sentiment.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Engagement:</span>
                      <span className="font-medium">
                        {competitor.engagement.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Market Share:</span>
                      <span className="font-medium">
                        {competitor.market_share.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Top Mentions */}
        <TabsContent value="mentions" className="space-y-6">
          <div className="space-y-4">
            {topMentions.map((mention) => (
              <Card
                key={mention.id}
                className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {mention.platform}
                      </Badge>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          mention.sentiment === "positive"
                            ? "bg-green-500"
                            : mention.sentiment === "neutral"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        title={`${mention.sentiment} sentiment`}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {mention.timestamp}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                    {mention.content}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{mention.engagement}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{mention.reach.toLocaleString()}</span>
                      </div>
                    </div>
                    <a
                      href={mention.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View Source
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
