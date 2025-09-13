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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Bot,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Zap,
} from "lucide-react";

interface AIPlatformMonitoringProps {
  timeRange: string;
}

interface PlatformData {
  id: string;
  name: string;
  category: "chatbot" | "search" | "coding" | "research" | "creative";
  visits: number;
  mentions: number;
  last_seen: string;
  status: "active" | "inactive" | "blocked";
  growth_rate: number;
  engagement_score: number;
  crawl_frequency: number;
  user_agent: string;
  detection_confidence: number;
}

interface CategoryStats {
  category: string;
  count: number;
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
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"visits" | "mentions" | "engagement">(
    "visits"
  );

  useEffect(() => {
    const fetchPlatformData = async () => {
      setLoading(true);
      try {
        // const data = await response.json();
        // Update state with real data when backend is ready
        // Mock data for 25+ AI platforms
        const mockPlatforms: PlatformData[] = [
          {
            id: "chatgpt",
            name: "ChatGPT",
            category: "chatbot",
            visits: 1247,
            mentions: 89,
            last_seen: "2 minutes ago",
            status: "active",
            growth_rate: 15.2,
            engagement_score: 92,
            crawl_frequency: 45,
            user_agent: "ChatGPT-User",
            detection_confidence: 98,
          },
          {
            id: "claude",
            name: "Claude (Anthropic)",
            category: "chatbot",
            visits: 892,
            mentions: 67,
            last_seen: "5 minutes ago",
            status: "active",
            growth_rate: 22.8,
            engagement_score: 88,
            crawl_frequency: 38,
            user_agent: "Claude-Web",
            detection_confidence: 95,
          },
          {
            id: "gemini",
            name: "Google Gemini",
            category: "chatbot",
            visits: 734,
            mentions: 52,
            last_seen: "1 minute ago",
            status: "active",
            growth_rate: 18.5,
            engagement_score: 85,
            crawl_frequency: 42,
            user_agent: "Gemini-Pro",
            detection_confidence: 97,
          },
          {
            id: "perplexity",
            name: "Perplexity AI",
            category: "search",
            visits: 623,
            mentions: 43,
            last_seen: "3 minutes ago",
            status: "active",
            growth_rate: 28.3,
            engagement_score: 91,
            crawl_frequency: 35,
            user_agent: "PerplexityBot",
            detection_confidence: 94,
          },
          {
            id: "copilot",
            name: "Microsoft Copilot",
            category: "coding",
            visits: 567,
            mentions: 38,
            last_seen: "7 minutes ago",
            status: "active",
            growth_rate: 12.7,
            engagement_score: 83,
            crawl_frequency: 28,
            user_agent: "Microsoft-Copilot",
            detection_confidence: 96,
          },
          {
            id: "bard",
            name: "Google Bard",
            category: "chatbot",
            visits: 445,
            mentions: 31,
            last_seen: "12 minutes ago",
            status: "active",
            growth_rate: 8.9,
            engagement_score: 79,
            crawl_frequency: 22,
            user_agent: "Bard-Web",
            detection_confidence: 89,
          },
          {
            id: "you",
            name: "You.com AI",
            category: "search",
            visits: 234,
            mentions: 18,
            last_seen: "15 minutes ago",
            status: "active",
            growth_rate: 31.2,
            engagement_score: 76,
            crawl_frequency: 18,
            user_agent: "YouBot",
            detection_confidence: 87,
          },
          {
            id: "character",
            name: "Character.AI",
            category: "creative",
            visits: 198,
            mentions: 14,
            last_seen: "8 minutes ago",
            status: "active",
            growth_rate: 19.4,
            engagement_score: 82,
            crawl_frequency: 15,
            user_agent: "Character-Bot",
            detection_confidence: 91,
          },
          {
            id: "jasper",
            name: "Jasper AI",
            category: "creative",
            visits: 167,
            mentions: 12,
            last_seen: "20 minutes ago",
            status: "active",
            growth_rate: 14.6,
            engagement_score: 74,
            crawl_frequency: 12,
            user_agent: "JasperBot",
            detection_confidence: 85,
          },
          {
            id: "writesonic",
            name: "Writesonic",
            category: "creative",
            visits: 143,
            mentions: 9,
            last_seen: "25 minutes ago",
            status: "active",
            growth_rate: 11.3,
            engagement_score: 71,
            crawl_frequency: 10,
            user_agent: "Writesonic-Bot",
            detection_confidence: 83,
          },
          {
            id: "notion",
            name: "Notion AI",
            category: "research",
            visits: 134,
            mentions: 8,
            last_seen: "18 minutes ago",
            status: "active",
            growth_rate: 16.8,
            engagement_score: 77,
            crawl_frequency: 9,
            user_agent: "NotionBot",
            detection_confidence: 88,
          },
          {
            id: "midjourney",
            name: "Midjourney",
            category: "creative",
            visits: 112,
            mentions: 7,
            last_seen: "30 minutes ago",
            status: "active",
            growth_rate: 25.1,
            engagement_score: 86,
            crawl_frequency: 8,
            user_agent: "MJ-Bot",
            detection_confidence: 92,
          },
          {
            id: "replicate",
            name: "Replicate",
            category: "research",
            visits: 98,
            mentions: 6,
            last_seen: "35 minutes ago",
            status: "active",
            growth_rate: 21.7,
            engagement_score: 73,
            crawl_frequency: 7,
            user_agent: "Replicate-Bot",
            detection_confidence: 81,
          },
          {
            id: "huggingface",
            name: "Hugging Face",
            category: "research",
            visits: 87,
            mentions: 5,
            last_seen: "22 minutes ago",
            status: "active",
            growth_rate: 18.9,
            engagement_score: 79,
            crawl_frequency: 6,
            user_agent: "HF-Bot",
            detection_confidence: 86,
          },
          {
            id: "openai-api",
            name: "OpenAI API",
            category: "research",
            visits: 76,
            mentions: 4,
            last_seen: "40 minutes ago",
            status: "active",
            growth_rate: 13.2,
            engagement_score: 84,
            crawl_frequency: 5,
            user_agent: "OpenAI-Bot",
            detection_confidence: 94,
          },
          {
            id: "cohere",
            name: "Cohere",
            category: "research",
            visits: 65,
            mentions: 3,
            last_seen: "45 minutes ago",
            status: "active",
            growth_rate: 9.8,
            engagement_score: 72,
            crawl_frequency: 4,
            user_agent: "Cohere-Bot",
            detection_confidence: 78,
          },
          {
            id: "stability",
            name: "Stability AI",
            category: "creative",
            visits: 54,
            mentions: 3,
            last_seen: "1 hour ago",
            status: "active",
            growth_rate: 15.4,
            engagement_score: 75,
            crawl_frequency: 3,
            user_agent: "Stability-Bot",
            detection_confidence: 82,
          },
          {
            id: "anthropic-api",
            name: "Anthropic API",
            category: "research",
            visits: 43,
            mentions: 2,
            last_seen: "50 minutes ago",
            status: "active",
            growth_rate: 11.6,
            engagement_score: 81,
            crawl_frequency: 3,
            user_agent: "Anthropic-Bot",
            detection_confidence: 89,
          },
          {
            id: "runway",
            name: "Runway ML",
            category: "creative",
            visits: 38,
            mentions: 2,
            last_seen: "1.2 hours ago",
            status: "active",
            growth_rate: 23.7,
            engagement_score: 77,
            crawl_frequency: 2,
            user_agent: "Runway-Bot",
            detection_confidence: 84,
          },
          {
            id: "deepl",
            name: "DeepL",
            category: "research",
            visits: 32,
            mentions: 1,
            last_seen: "2 hours ago",
            status: "active",
            growth_rate: 7.3,
            engagement_score: 69,
            crawl_frequency: 2,
            user_agent: "DeepL-Bot",
            detection_confidence: 76,
          },
          {
            id: "grammarly",
            name: "Grammarly AI",
            category: "creative",
            visits: 28,
            mentions: 1,
            last_seen: "1.5 hours ago",
            status: "active",
            growth_rate: 5.9,
            engagement_score: 68,
            crawl_frequency: 2,
            user_agent: "Grammarly-Bot",
            detection_confidence: 73,
          },
          {
            id: "copy",
            name: "Copy.ai",
            category: "creative",
            visits: 24,
            mentions: 1,
            last_seen: "3 hours ago",
            status: "active",
            growth_rate: 12.1,
            engagement_score: 70,
            crawl_frequency: 1,
            user_agent: "Copy-Bot",
            detection_confidence: 79,
          },
          {
            id: "synthesia",
            name: "Synthesia",
            category: "creative",
            visits: 19,
            mentions: 1,
            last_seen: "4 hours ago",
            status: "active",
            growth_rate: 18.2,
            engagement_score: 74,
            crawl_frequency: 1,
            user_agent: "Synthesia-Bot",
            detection_confidence: 81,
          },
          {
            id: "elevenlabs",
            name: "ElevenLabs",
            category: "creative",
            visits: 16,
            mentions: 1,
            last_seen: "5 hours ago",
            status: "active",
            growth_rate: 29.4,
            engagement_score: 78,
            crawl_frequency: 1,
            user_agent: "ElevenLabs-Bot",
            detection_confidence: 85,
          },
          {
            id: "luma",
            name: "Luma AI",
            category: "creative",
            visits: 12,
            mentions: 0,
            last_seen: "6 hours ago",
            status: "inactive",
            growth_rate: 14.8,
            engagement_score: 72,
            crawl_frequency: 1,
            user_agent: "Luma-Bot",
            detection_confidence: 77,
          },
        ];

        const mockCategoryStats: CategoryStats[] = [
          {
            category: "Chatbots",
            count: 4,
            total_visits: 3318,
            avg_engagement: 88.5,
            color: "#3b82f6",
          },
          {
            category: "Search",
            count: 2,
            total_visits: 857,
            avg_engagement: 83.5,
            color: "#10b981",
          },
          {
            category: "Creative",
            count: 9,
            total_visits: 647,
            avg_engagement: 75.1,
            color: "#f59e0b",
          },
          {
            category: "Research",
            count: 7,
            total_visits: 435,
            avg_engagement: 77.4,
            color: "#8b5cf6",
          },
          {
            category: "Coding",
            count: 1,
            total_visits: 567,
            avg_engagement: 83.0,
            color: "#ef4444",
          },
        ];

        const mockTrendData: TrendData[] = [
          {
            date: "2024-01-01",
            chatgpt: 1100,
            claude: 750,
            gemini: 650,
            perplexity: 520,
            copilot: 480,
            total: 3500,
          },
          {
            date: "2024-01-02",
            chatgpt: 1150,
            claude: 780,
            gemini: 680,
            perplexity: 550,
            copilot: 490,
            total: 3650,
          },
          {
            date: "2024-01-03",
            chatgpt: 1200,
            claude: 820,
            gemini: 700,
            perplexity: 580,
            copilot: 510,
            total: 3810,
          },
          {
            date: "2024-01-04",
            chatgpt: 1180,
            claude: 850,
            gemini: 720,
            perplexity: 600,
            copilot: 520,
            total: 3870,
          },
          {
            date: "2024-01-05",
            chatgpt: 1220,
            claude: 870,
            gemini: 730,
            perplexity: 610,
            copilot: 540,
            total: 3970,
          },
          {
            date: "2024-01-06",
            chatgpt: 1240,
            claude: 885,
            gemini: 730,
            perplexity: 620,
            copilot: 560,
            total: 4035,
          },
          {
            date: "2024-01-07",
            chatgpt: 1247,
            claude: 892,
            gemini: 734,
            perplexity: 623,
            copilot: 567,
            total: 4063,
          },
        ];

        setPlatforms(mockPlatforms);
        setCategoryStats(mockCategoryStats);
        setTrendData(mockTrendData);
      } catch (error) {
        console.error("Error fetching AI platform data:", error);
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
        default:
          return b.visits - a.visits;
      }
    });

  const totalVisits = platforms.reduce(
    (sum, platform) => sum + platform.visits,
    0
  );
  const activePlatforms = platforms.filter((p) => p.status === "active").length;
  const avgEngagement =
    platforms.reduce((sum, platform) => sum + platform.engagement_score, 0) /
    platforms.length;

  if (loading) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            AI Platform Monitoring
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
              <Bot className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Total Platforms
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {platforms.length}
            </div>
            <div className="text-xs text-green-600">
              {activePlatforms} active
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Total Visits
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalVisits.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Last 7 days</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                Avg Engagement
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {avgEngagement.toFixed(1)}
            </div>
            <div className="text-xs text-purple-600">Engagement score</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">
                Top Platform
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">ChatGPT</div>
            <div className="text-xs text-orange-600">1,247 visits</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="overview">Platform Overview</TabsTrigger>
          <TabsTrigger value="trends">Activity Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="detection">Detection Details</TabsTrigger>
        </TabsList>

        {/* Platform Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white/80 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Categories</option>
              <option value="chatbot">Chatbots</option>
              <option value="search">Search</option>
              <option value="creative">Creative</option>
              <option value="research">Research</option>
              <option value="coding">Coding</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "visits" | "mentions" | "engagement")
              }
              className="px-3 py-2 bg-white/80 border border-gray-200 rounded-lg text-sm"
            >
              <option value="visits">Sort by Visits</option>
              <option value="mentions">Sort by Mentions</option>
              <option value="engagement">Sort by Engagement</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPlatforms.map((platform) => (
              <Card
                key={platform.id}
                className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {platform.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          platform.category === "chatbot"
                            ? "bg-blue-100 text-blue-700"
                            : platform.category === "search"
                            ? "bg-green-100 text-green-700"
                            : platform.category === "creative"
                            ? "bg-yellow-100 text-yellow-700"
                            : platform.category === "research"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {platform.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {platform.status === "active" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : platform.status === "inactive" ? (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          platform.status === "active"
                            ? "text-green-600"
                            : platform.status === "inactive"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {platform.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visits:</span>
                      <span className="font-medium">
                        {platform.visits.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mentions:</span>
                      <span className="font-medium">{platform.mentions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Engagement:</span>
                      <span className="font-medium">
                        {platform.engagement_score}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth:</span>
                      <span
                        className={`font-medium ${
                          platform.growth_rate >= 15
                            ? "text-green-600"
                            : platform.growth_rate >= 10
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        +{platform.growth_rate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Seen:</span>
                      <span className="font-medium text-xs">
                        {platform.last_seen}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activity Trends */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle>Platform Activity Trends</CardTitle>
              <CardDescription>
                Daily visits from top AI platforms over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
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
                    <Line
                      type="monotone"
                      dataKey="chatgpt"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="ChatGPT"
                    />
                    <Line
                      type="monotone"
                      dataKey="claude"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Claude"
                    />
                    <Line
                      type="monotone"
                      dataKey="gemini"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Gemini"
                    />
                    <Line
                      type="monotone"
                      dataKey="perplexity"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Perplexity"
                    />
                    <Line
                      type="monotone"
                      dataKey="copilot"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Copilot"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>
                  Breakdown by AI platform categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryStats}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label
                      >
                        {categoryStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>
                  Total visits and engagement by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryStats.map((category) => (
                    <div
                      key={category.category}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {category.category}
                        </span>
                        <Badge
                          style={{
                            backgroundColor: category.color,
                            color: "white",
                          }}
                        >
                          {category.count} platforms
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total Visits:</span>
                          <span className="ml-2 font-medium">
                            {category.total_visits.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Avg Engagement:</span>
                          <span className="ml-2 font-medium">
                            {category.avg_engagement.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Detection Details */}
        <TabsContent value="detection" className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Detection Details
              </CardTitle>
              <CardDescription>
                User agent strings and detection confidence levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {platforms.slice(0, 10).map((platform) => (
                  <div key={platform.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {platform.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            platform.detection_confidence >= 90
                              ? "bg-green-500"
                              : platform.detection_confidence >= 80
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-sm font-medium">
                          {platform.detection_confidence}%
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded">
                      {platform.user_agent}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Crawl frequency: {platform.crawl_frequency} times/day
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
