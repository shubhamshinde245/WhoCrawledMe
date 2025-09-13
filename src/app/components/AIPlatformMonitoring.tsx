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
import {
  Bot,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Eye,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface AIPlatformMonitoringProps {
  timeRange: string;
}

interface PlatformData {
  id: string;
  name: string;
  category: string;
  visits: number;
  mentions: number;
  last_seen: string;
  status: "active" | "inactive" | "unknown";
  growth_rate: number;
  engagement_score: number;
  crawl_frequency: number;
  user_agent: string;
  detection_confidence: number;
}

interface CategoryStats {
  category: string;
  platforms: number;
  total_visits: number;
  avg_engagement: number;
  color: string;
}

interface TrendData {
  date: string;
  chatgpt: number;
  claude: number;
  gemini: number;
  perplexity: number;
  copilot: number;
  total: number;
}

export default function AIPlatformMonitoring({
  timeRange,
}: AIPlatformMonitoringProps) {
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [_trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("visits");

  useEffect(() => {
    const fetchPlatformData = async () => {
      setLoading(true);
      try {
        // Fetch real AI platform data from API
        const response = await fetch(
          `/api/ai-platforms?timeRange=${timeRange}&type=overview`
        );
        const data = await response.json();

        if (data.error) {
          console.error("AI platform monitoring API error:", data.error);
          // Set empty data arrays for graceful handling
          setPlatforms([]);
          setCategoryStats([]);
          setTrendData([]);
          return;
        }

        // Update state with real data
        setPlatforms(data.platforms || []);
        setCategoryStats(data.categoryStats || []);
        setTrendData(data.trendData || []);
      } catch (error) {
        console.error("Error fetching AI platform data:", error);
        // Set empty data arrays for graceful handling
        setPlatforms([]);
        setCategoryStats([]);
        setTrendData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformData();
  }, [timeRange]);

  const filteredPlatforms = platforms
    .filter(
      (platform) =>
        selectedCategory === "all" || platform.category === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "visits":
          return b.visits - a.visits;
        case "mentions":
          return b.mentions - a.mentions;
        case "engagement":
          return b.engagement_score - a.engagement_score;
        case "growth":
          return b.growth_rate - a.growth_rate;
        default:
          return b.visits - a.visits;
      }
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "inactive":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (growth < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
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
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryStats.length > 0 ? (
          categoryStats.map((category) => (
            <Card
              key={category.category}
              className="bg-white/60 backdrop-blur-sm border-white/20"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  {category.category.charAt(0).toUpperCase() +
                    category.category.slice(1)}{" "}
                  Platforms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {category.platforms}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {category.total_visits.toLocaleString()} total visits
                </div>
                <div className="text-xs text-gray-500">
                  Avg engagement: {category.avg_engagement.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No AI Platform Data Available
              </h3>
              <p className="text-gray-600">
                AI platform monitoring data will appear here once bots start
                visiting your website.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Platform List */}
      {platforms.length > 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              AI Platform Activity
            </CardTitle>
            <CardDescription>
              Detailed monitoring of AI platform visits and activity
            </CardDescription>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Category:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="chatbot">Chatbots</option>
                  <option value="search">Search Engines</option>
                  <option value="social">Social Media</option>
                  <option value="research">Research Tools</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white"
                >
                  <option value="visits">Visits</option>
                  <option value="mentions">Mentions</option>
                  <option value="engagement">Engagement</option>
                  <option value="growth">Growth Rate</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPlatforms.map((platform) => (
                <div
                  key={platform.id}
                  className="p-4 bg-white/50 rounded-lg border border-white/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {platform.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge variant="outline" className="text-xs">
                            {platform.category}
                          </Badge>
                          <span>•</span>
                          <span>{platform.user_agent}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(platform.status)}
                      <Badge className={getStatusColor(platform.status)}>
                        {platform.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {platform.visits}
                      </div>
                      <div className="text-xs text-gray-600">Visits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {platform.mentions}
                      </div>
                      <div className="text-xs text-gray-600">Mentions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {platform.engagement_score}%
                      </div>
                      <div className="text-xs text-gray-600">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {platform.detection_confidence}%
                      </div>
                      <div className="text-xs text-gray-600">Confidence</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Last seen: {platform.last_seen}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span>Crawl freq: {platform.crawl_frequency}/day</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getGrowthIcon(platform.growth_rate)}
                      <span
                        className={
                          platform.growth_rate > 0
                            ? "text-green-600"
                            : platform.growth_rate < 0
                            ? "text-red-600"
                            : "text-gray-600"
                        }
                      >
                        {platform.growth_rate > 0 ? "+" : ""}
                        {platform.growth_rate}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {platforms.length === 0 && categoryStats.length === 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No AI Platform Activity Detected
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              AI platform monitoring will start showing data once bots from
              ChatGPT, Claude, Gemini, and other AI platforms begin visiting
              your website.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <AlertCircle className="w-4 h-4" />
              <span>
                Ensure your tracking script is properly installed and active
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
