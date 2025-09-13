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
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Eye,
  Heart,
  MessageSquare,
  Award,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BrandAnalyticsProps {
  timeRange: string;
}

interface BrandMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
  category: string;
  description: string;
  benchmark: number;
}

interface BrandTrend {
  date: string;
  mentions: number;
  visibility_score: number;
  sentiment_score: number;
  engagement_rate: number;
  reach: number;
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
  metric: string;
  score: number;
  trend: "up" | "down" | "stable";
  benchmark: number;
  status: "excellent" | "good" | "fair" | "poor";
}

interface TopMention {
  content: string;
  platform: string;
  sentiment: "positive" | "neutral" | "negative";
  reach: number;
  timestamp: string;
  source_url: string;
}

export default function BrandAnalytics({ timeRange }: BrandAnalyticsProps) {
  const [brandMetrics, setBrandMetrics] = useState<BrandMetric[]>([]);
  const [_brandTrends, setBrandTrends] = useState<BrandTrend[]>([]);
  const [_sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [competitorData, setCompetitorData] = useState<CompetitorComparison[]>(
    []
  );
  const [brandHealth, setBrandHealth] = useState<BrandHealth[]>([]);
  const [topMentions, setTopMentions] = useState<TopMention[]>([]);
  const [loading, setLoading] = useState(true);
  // const [selectedMetric, setSelectedMetric] = useState<string>("visibility_score");

  useEffect(() => {
    const fetchBrandData = async () => {
      setLoading(true);
      try {
        // Fetch real brand analytics data from API
        const response = await fetch(
          `/api/brand-analytics?timeRange=${timeRange}&type=overview`
        );
        const data = await response.json();

        if (data.error) {
          console.error("Brand analytics API error:", data.error);
          // Set empty data arrays for graceful handling
          setBrandMetrics([]);
          setBrandTrends([]);
          setSentimentData([]);
          setCompetitorData([]);
          setBrandHealth([]);
          setTopMentions([]);
          return;
        }

        // Update state with real data
        setBrandMetrics(data.brandMetrics || []);
        setBrandTrends(data.brandTrends || []);
        setSentimentData(data.sentimentData || []);
        setCompetitorData(data.competitorData || []);
        setBrandHealth(data.brandHealth || []);
        setTopMentions(data.topMentions || []);
      } catch (error) {
        console.error("Error fetching brand analytics data:", error);
        // Set empty data arrays for graceful handling
        setBrandMetrics([]);
        setBrandTrends([]);
        setSentimentData([]);
        setCompetitorData([]);
        setBrandHealth([]);
        setTopMentions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [timeRange]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-50";
      case "negative":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Brand Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brandMetrics.length > 0 ? (
          brandMetrics.map((metric) => (
            <Card
              key={metric.id}
              className="bg-white/60 backdrop-blur-sm border-white/20"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  {metric.category === "visibility" && (
                    <Eye className="w-4 h-4" />
                  )}
                  {metric.category === "sentiment" && (
                    <Heart className="w-4 h-4" />
                  )}
                  {metric.category === "engagement" && (
                    <MessageSquare className="w-4 h-4" />
                  )}
                  {metric.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {typeof metric.value === "number"
                    ? metric.value.toLocaleString()
                    : metric.value}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {getTrendIcon(metric.trend)}
                  <span
                    className={`font-medium ${
                      metric.change > 0
                        ? "text-green-600"
                        : metric.change < 0
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="text-gray-500">vs benchmark</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Brand Data Available
              </h3>
              <p className="text-gray-600">
                Brand analytics will appear here once AI bots start visiting
                your website and collecting data.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Brand Health Overview */}
      {brandHealth.length > 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Brand Health Overview
            </CardTitle>
            <CardDescription>
              Comprehensive assessment of your brand&apos;s performance across
              AI platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {brandHealth.map((health) => (
                <div
                  key={health.metric}
                  className="bg-white/50 rounded-lg p-4 border border-white/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {health.metric}
                    </span>
                    <Badge className={getStatusColor(health.status)}>
                      {health.status}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {health.score}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {getTrendIcon(health.trend)}
                    <span className="text-gray-600">
                      Benchmark: {health.benchmark}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competitor Analysis */}
      {competitorData.length > 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Competitive Analysis
            </CardTitle>
            <CardDescription>
              How your brand compares to competitors in AI platform mentions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitorData.map((competitor, index) => (
                <div
                  key={competitor.brand}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-semibold text-gray-500">
                      #{index + 1}
                    </div>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: competitor.color }}
                    ></div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {competitor.brand}
                      </div>
                      <div className="text-sm text-gray-600">
                        {competitor.mentions} mentions
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {competitor.market_share}%
                    </div>
                    <div className="text-sm text-gray-600">Market Share</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Mentions */}
      {topMentions.length > 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Recent Brand Mentions
            </CardTitle>
            <CardDescription>
              Latest mentions of your brand across AI platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMentions.map((mention, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/50 rounded-lg border border-white/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {mention.platform}
                      </Badge>
                      <Badge className={getSentimentColor(mention.sentiment)}>
                        {mention.sentiment}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(mention.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-900 mb-2">{mention.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Reach: {mention.reach.toLocaleString()}</span>
                    {mention.source_url && (
                      <a
                        href={mention.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Source
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {brandMetrics.length === 0 &&
        brandHealth.length === 0 &&
        competitorData.length === 0 &&
        topMentions.length === 0 && (
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No Brand Analytics Data Yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Brand analytics will start appearing once AI bots visit your
                website and begin collecting data about your brand mentions and
                visibility.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <AlertTriangle className="w-4 h-4" />
                <span>
                  Make sure your tracking script is properly installed on your
                  website
                </span>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
