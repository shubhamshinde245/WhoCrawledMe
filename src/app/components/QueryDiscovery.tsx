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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { Search, TrendingUp, Target, Hash, Lightbulb } from "lucide-react";

interface QueryDiscoveryProps {
  timeRange: string;
}

interface TrendingQuery {
  id: string;
  query: string;
  category: string;
  frequency: number;
  growth_rate: number;
  platforms: string[];
  sentiment: "positive" | "neutral" | "negative";
  opportunity_score: number;
  related_topics: string[];
  first_seen: string;
  last_seen: string;
}

interface ContentGap {
  id: string;
  topic: string;
  demand_score: number;
  competition_level: "low" | "medium" | "high";
  suggested_content: string[];
  target_platforms: string[];
  estimated_impact: number;
  difficulty: "easy" | "medium" | "hard";
  keywords: string[];
}

interface TopicTrend {
  date: string;
  ai_tools: number;
  machine_learning: number;
  automation: number;
  data_science: number;
  programming: number;
}

interface QueryCategory {
  name: string;
  count: number;
  growth: number;
  color: string;
}

export default function QueryDiscovery({ timeRange }: QueryDiscoveryProps) {
  const [trendingQueries, setTrendingQueries] = useState<TrendingQuery[]>([]);
  const [contentGaps, setContentGaps] = useState<ContentGap[]>([]);
  const [topicTrends, setTopicTrends] = useState<TopicTrend[]>([]);
  const [queryCategories, setQueryCategories] = useState<QueryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"frequency" | "growth" | "opportunity">(
    "frequency"
  );

  useEffect(() => {
    const fetchQueryData = async () => {
      setLoading(true);
      try {
        // const response = await fetch(
        //   `/api/query-discovery?timeRange=${timeRange}&type=overview`
        // );

        // Mock trending queries data
        const mockTrendingQueries: TrendingQuery[] = [
          {
            id: "1",
            query: "best AI tools for content creation",
            category: "AI Tools",
            frequency: 847,
            growth_rate: 34.2,
            platforms: ["ChatGPT", "Claude", "Perplexity"],
            sentiment: "positive",
            opportunity_score: 92,
            related_topics: [
              "content marketing",
              "copywriting",
              "social media",
            ],
            first_seen: "2024-01-01",
            last_seen: "2 hours ago",
          },
          {
            id: "2",
            query: "machine learning model deployment",
            category: "Machine Learning",
            frequency: 623,
            growth_rate: 28.7,
            platforms: ["ChatGPT", "Gemini", "Copilot"],
            sentiment: "neutral",
            opportunity_score: 85,
            related_topics: ["MLOps", "cloud computing", "DevOps"],
            first_seen: "2024-01-02",
            last_seen: "1 hour ago",
          },
          {
            id: "3",
            query: "automated testing frameworks comparison",
            category: "Automation",
            frequency: 456,
            growth_rate: 41.3,
            platforms: ["ChatGPT", "Claude", "Copilot"],
            sentiment: "positive",
            opportunity_score: 78,
            related_topics: ["software testing", "QA", "CI/CD"],
            first_seen: "2024-01-03",
            last_seen: "30 minutes ago",
          },
          {
            id: "4",
            query: "data visualization best practices",
            category: "Data Science",
            frequency: 389,
            growth_rate: 22.1,
            platforms: ["ChatGPT", "Perplexity"],
            sentiment: "positive",
            opportunity_score: 73,
            related_topics: [
              "dashboard design",
              "analytics",
              "business intelligence",
            ],
            first_seen: "2024-01-01",
            last_seen: "45 minutes ago",
          },
          {
            id: "5",
            query: "Python vs JavaScript for beginners",
            category: "Programming",
            frequency: 334,
            growth_rate: 15.8,
            platforms: ["ChatGPT", "Claude", "Gemini"],
            sentiment: "neutral",
            opportunity_score: 68,
            related_topics: [
              "programming languages",
              "web development",
              "learning",
            ],
            first_seen: "2024-01-02",
            last_seen: "1.5 hours ago",
          },
          {
            id: "6",
            query: "AI ethics and responsible development",
            category: "AI Ethics",
            frequency: 298,
            growth_rate: 52.4,
            platforms: ["Claude", "ChatGPT", "Perplexity"],
            sentiment: "positive",
            opportunity_score: 89,
            related_topics: ["responsible AI", "bias detection", "fairness"],
            first_seen: "2024-01-04",
            last_seen: "20 minutes ago",
          },
          {
            id: "7",
            query: "cloud migration strategies",
            category: "Cloud Computing",
            frequency: 267,
            growth_rate: 19.6,
            platforms: ["ChatGPT", "Gemini"],
            sentiment: "neutral",
            opportunity_score: 71,
            related_topics: ["AWS", "Azure", "infrastructure"],
            first_seen: "2024-01-03",
            last_seen: "2.5 hours ago",
          },
          {
            id: "8",
            query: "cybersecurity threat detection",
            category: "Security",
            frequency: 245,
            growth_rate: 37.9,
            platforms: ["ChatGPT", "Claude"],
            sentiment: "positive",
            opportunity_score: 82,
            related_topics: [
              "threat intelligence",
              "incident response",
              "SIEM",
            ],
            first_seen: "2024-01-05",
            last_seen: "1 hour ago",
          },
        ];

        // Mock content gaps data
        const mockContentGaps: ContentGap[] = [
          {
            id: "1",
            topic: "AI-powered code review tools",
            demand_score: 94,
            competition_level: "low",
            suggested_content: [
              "Comprehensive comparison guide",
              "Implementation tutorial",
              "ROI analysis case study",
            ],
            target_platforms: ["ChatGPT", "Copilot", "Claude"],
            estimated_impact: 87,
            difficulty: "medium",
            keywords: ["code review", "AI tools", "development workflow"],
          },
          {
            id: "2",
            topic: "No-code AI model training",
            demand_score: 89,
            competition_level: "medium",
            suggested_content: [
              "Step-by-step tutorial",
              "Platform comparison",
              "Use case examples",
            ],
            target_platforms: ["ChatGPT", "Gemini", "Perplexity"],
            estimated_impact: 82,
            difficulty: "easy",
            keywords: ["no-code", "machine learning", "AutoML"],
          },
          {
            id: "3",
            topic: "AI prompt engineering strategies",
            demand_score: 86,
            competition_level: "high",
            suggested_content: [
              "Advanced techniques guide",
              "Industry-specific prompts",
              "Optimization framework",
            ],
            target_platforms: ["ChatGPT", "Claude", "Gemini"],
            estimated_impact: 79,
            difficulty: "hard",
            keywords: ["prompt engineering", "AI optimization", "LLM"],
          },
          {
            id: "4",
            topic: "Sustainable AI development practices",
            demand_score: 83,
            competition_level: "low",
            suggested_content: [
              "Green AI guidelines",
              "Energy efficiency metrics",
              "Carbon footprint calculator",
            ],
            target_platforms: ["Claude", "Perplexity"],
            estimated_impact: 75,
            difficulty: "medium",
            keywords: [
              "sustainable AI",
              "green computing",
              "environmental impact",
            ],
          },
          {
            id: "5",
            topic: "AI in healthcare diagnostics",
            demand_score: 81,
            competition_level: "medium",
            suggested_content: [
              "Regulatory compliance guide",
              "Implementation case studies",
              "Privacy considerations",
            ],
            target_platforms: ["ChatGPT", "Gemini"],
            estimated_impact: 88,
            difficulty: "hard",
            keywords: ["healthcare AI", "medical diagnostics", "FDA approval"],
          },
        ];

        // Mock topic trends data
        const mockTopicTrends: TopicTrend[] = [
          {
            date: "2024-01-01",
            ai_tools: 120,
            machine_learning: 95,
            automation: 78,
            data_science: 65,
            programming: 110,
          },
          {
            date: "2024-01-02",
            ai_tools: 135,
            machine_learning: 102,
            automation: 85,
            data_science: 72,
            programming: 118,
          },
          {
            date: "2024-01-03",
            ai_tools: 148,
            machine_learning: 108,
            automation: 92,
            data_science: 78,
            programming: 125,
          },
          {
            date: "2024-01-04",
            ai_tools: 162,
            machine_learning: 115,
            automation: 98,
            data_science: 84,
            programming: 132,
          },
          {
            date: "2024-01-05",
            ai_tools: 175,
            machine_learning: 122,
            automation: 105,
            data_science: 89,
            programming: 138,
          },
          {
            date: "2024-01-06",
            ai_tools: 189,
            machine_learning: 128,
            automation: 112,
            data_science: 95,
            programming: 145,
          },
          {
            date: "2024-01-07",
            ai_tools: 203,
            machine_learning: 135,
            automation: 118,
            data_science: 101,
            programming: 152,
          },
        ];

        // Mock query categories
        const mockQueryCategories: QueryCategory[] = [
          { name: "AI Tools", count: 1247, growth: 34.2, color: "#3b82f6" },
          {
            name: "Machine Learning",
            count: 892,
            growth: 28.7,
            color: "#10b981",
          },
          { name: "Programming", count: 734, growth: 15.8, color: "#f59e0b" },
          { name: "Data Science", count: 623, growth: 22.1, color: "#8b5cf6" },
          { name: "Automation", count: 456, growth: 41.3, color: "#ef4444" },
          { name: "Security", count: 334, growth: 37.9, color: "#06b6d4" },
        ];

        setTrendingQueries(mockTrendingQueries);
        setContentGaps(mockContentGaps);
        setTopicTrends(mockTopicTrends);
        setQueryCategories(mockQueryCategories);
      } catch (error) {
        console.error("Error fetching query discovery data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueryData();
  }, [timeRange]);

  const filteredQueries = trendingQueries
    .filter(
      (query) =>
        selectedCategory === "all" || query.category === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "frequency":
          return b.frequency - a.frequency;
        case "growth":
          return b.growth_rate - a.growth_rate;
        case "opportunity":
          return b.opportunity_score - a.opportunity_score;
        default:
          return b.frequency - a.frequency;
      }
    });

  const totalQueries = trendingQueries.reduce(
    (sum, query) => sum + query.frequency,
    0
  );
  const avgGrowthRate =
    trendingQueries.reduce((sum, query) => sum + query.growth_rate, 0) /
    trendingQueries.length;
  const highOpportunityGaps = contentGaps.filter(
    (gap) => gap.demand_score >= 85
  ).length;

  if (loading) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-green-600" />
            Query Discovery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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
              <Hash className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Total Queries
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalQueries.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Last 7 days</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Avg Growth
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {avgGrowthRate.toFixed(1)}%
            </div>
            <div className="text-xs text-green-600">Query growth rate</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">
                Content Gaps
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {contentGaps.length}
            </div>
            <div className="text-xs text-yellow-600">
              {highOpportunityGaps} high opportunity
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                Top Category
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">AI Tools</div>
            <div className="text-xs text-purple-600">+34.2% growth</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="trending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="trending">Trending Queries</TabsTrigger>
          <TabsTrigger value="gaps">Content Gaps</TabsTrigger>
          <TabsTrigger value="trends">Topic Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Trending Queries */}
        <TabsContent value="trending" className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white/80 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Categories</option>
              <option value="AI Tools">AI Tools</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Programming">Programming</option>
              <option value="Data Science">Data Science</option>
              <option value="Automation">Automation</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "frequency" | "growth" | "opportunity"
                )
              }
              className="px-3 py-2 bg-white/80 border border-gray-200 rounded-lg text-sm"
            >
              <option value="frequency">Sort by Frequency</option>
              <option value="growth">Sort by Growth</option>
              <option value="opportunity">Sort by Opportunity</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredQueries.map((query, index) => (
              <Card
                key={query.id}
                className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        <h3 className="font-semibold text-gray-900">
                          {query.query}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 text-xs"
                        >
                          {query.category}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>
                          Frequency:{" "}
                          <span className="font-medium text-gray-900">
                            {query.frequency}
                          </span>
                        </span>
                        <span>
                          Growth:{" "}
                          <span
                            className={`font-medium ${
                              query.growth_rate >= 30
                                ? "text-green-600"
                                : query.growth_rate >= 20
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            +{query.growth_rate.toFixed(1)}%
                          </span>
                        </span>
                        <span>
                          Opportunity:{" "}
                          <span className="font-medium text-purple-600">
                            {query.opportunity_score}/100
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">
                          Platforms:
                        </span>
                        {query.platforms.map((platform) => (
                          <Badge
                            key={platform}
                            variant="outline"
                            className="text-xs"
                          >
                            {platform}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Related:</span>
                        <div className="flex flex-wrap gap-1">
                          {query.related_topics.slice(0, 3).map((topic) => (
                            <span
                              key={topic}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          query.sentiment === "positive"
                            ? "bg-green-500"
                            : query.sentiment === "neutral"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        title={`${query.sentiment} sentiment`}
                      ></div>
                      <span className="text-xs text-gray-500">
                        {query.last_seen}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Content Gaps */}
        <TabsContent value="gaps" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contentGaps.map((gap) => (
              <Card
                key={gap.id}
                className="bg-white/60 backdrop-blur-sm border-white/20"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{gap.topic}</h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          gap.competition_level === "low"
                            ? "bg-green-100 text-green-700"
                            : gap.competition_level === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {gap.competition_level} competition
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Demand Score:</span>
                      <span className="font-medium text-blue-600">
                        {gap.demand_score}/100
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Est. Impact:</span>
                      <span className="font-medium text-green-600">
                        {gap.estimated_impact}/100
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Difficulty:</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          gap.difficulty === "easy"
                            ? "border-green-500 text-green-600"
                            : gap.difficulty === "medium"
                            ? "border-yellow-500 text-yellow-600"
                            : "border-red-500 text-red-600"
                        }`}
                      >
                        {gap.difficulty}
                      </Badge>
                    </div>

                    <div>
                      <span className="text-xs text-gray-500 mb-1 block">
                        Suggested Content:
                      </span>
                      <ul className="text-xs text-gray-700 space-y-1">
                        {gap.suggested_content.map((content, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Lightbulb className="w-3 h-3 text-yellow-500" />
                            {content}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-xs text-gray-500 mb-1 block">
                        Target Platforms:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {gap.target_platforms.map((platform) => (
                          <Badge
                            key={platform}
                            variant="outline"
                            className="text-xs"
                          >
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-gray-500 mb-1 block">
                        Keywords:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {gap.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Topic Trends */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle>Topic Trends Over Time</CardTitle>
              <CardDescription>
                Query volume trends by topic category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={topicTrends}
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
                      dataKey="ai_tools"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="AI Tools"
                    />
                    <Line
                      type="monotone"
                      dataKey="machine_learning"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Machine Learning"
                    />
                    <Line
                      type="monotone"
                      dataKey="automation"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Automation"
                    />
                    <Line
                      type="monotone"
                      dataKey="data_science"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Data Science"
                    />
                    <Line
                      type="monotone"
                      dataKey="programming"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Programming"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories */}
        <TabsContent value="categories" className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle>Query Categories Performance</CardTitle>
              <CardDescription>
                Query volume and growth by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={queryCategories}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="count" name="Query Count">
                      {queryCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {queryCategories.map((category) => (
              <Card
                key={category.name}
                className="bg-white/60 backdrop-blur-sm border-white/20"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    ></div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Queries:</span>
                      <span className="font-medium">
                        {category.count.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth:</span>
                      <span
                        className={`font-medium ${
                          category.growth >= 30
                            ? "text-green-600"
                            : category.growth >= 20
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        +{category.growth.toFixed(1)}%
                      </span>
                    </div>
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
