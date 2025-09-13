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
  Search,
  TrendingUp,
  Target,
  Clock,
  Users,
  BarChart3,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Eye,
} from "lucide-react";

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
  search_volume: number;
  competition_level: "low" | "medium" | "high";
  opportunity_score: number;
  related_queries: string[];
  suggested_content: string[];
  target_platforms: string[];
  estimated_traffic: number;
}

interface TopicTrend {
  topic: string;
  trend_score: number;
  growth_rate: number;
  volume: number;
  platforms: string[];
  related_queries: string[];
  peak_period: string;
  seasonality: string;
}

interface QueryCategory {
  name: string;
  count: number;
  avg_opportunity: number;
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
        // Fetch real query discovery data from API
        const response = await fetch(
          `/api/query-discovery?timeRange=${timeRange}&type=overview`
        );
        const data = await response.json();

        if (data.error) {
          console.error("Query discovery API error:", data.error);
          setTrendingQueries([]);
          setContentGaps([]);
          setTopicTrends([]);
          setQueryCategories([]);
          return;
        }

        setTrendingQueries(data.trendingQueries || []);
        setContentGaps(data.contentGaps || []);
        setTopicTrends(data.topicTrends || []);
        setQueryCategories(data.queryCategories || []);
      } catch (error) {
        console.error("Error fetching query discovery data:", error);
        setTrendingQueries([]);
        setContentGaps([]);
        setTopicTrends([]);
        setQueryCategories([]);
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

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {queryCategories.length > 0 ? (
          queryCategories.map((category) => (
            <Card
              key={category.name}
              className="bg-white/60 backdrop-blur-sm border-white/20"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {category.count}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {category.avg_opportunity.toFixed(1)} avg opportunity
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, category.avg_opportunity)}%`,
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Query Data Available
              </h3>
              <p className="text-gray-600">
                Query discovery data will appear here once AI bots start
                visiting your website.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Trending Queries */}
      {trendingQueries.length > 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Trending Queries
            </CardTitle>
            <CardDescription>
              Most popular queries and search terms across AI platforms
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
                  {queryCategories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "frequency" | "growth" | "opportunity"
                    )
                  }
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white"
                >
                  <option value="frequency">Frequency</option>
                  <option value="growth">Growth Rate</option>
                  <option value="opportunity">Opportunity Score</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredQueries.map((query) => (
                <div
                  key={query.id}
                  className="p-4 bg-white/50 rounded-lg border border-white/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {query.query}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline">{query.category}</Badge>
                        <Badge className={getSentimentColor(query.sentiment)}>
                          {query.sentiment}
                        </Badge>
                        <span>•</span>
                        <span>First seen: {query.first_seen}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {query.frequency}
                      </div>
                      <div className="text-sm text-gray-600">Frequency</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {query.growth_rate}%
                      </div>
                      <div className="text-xs text-gray-600">Growth Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {query.opportunity_score}
                      </div>
                      <div className="text-xs text-gray-600">Opportunity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {query.platforms.length}
                      </div>
                      <div className="text-xs text-gray-600">Platforms</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-indigo-600">
                        {query.related_topics.length}
                      </div>
                      <div className="text-xs text-gray-600">
                        Related Topics
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Last seen: {query.last_seen}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>Platforms: {query.platforms.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Gaps */}
      {contentGaps.length > 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Content Gap Opportunities
            </CardTitle>
            <CardDescription>
              Topics with high search volume but low competition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentGaps.map((gap) => (
                <div
                  key={gap.id}
                  className="p-4 bg-white/50 rounded-lg border border-white/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {gap.topic}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge
                          className={getCompetitionColor(gap.competition_level)}
                        >
                          {gap.competition_level} competition
                        </Badge>
                        <span>•</span>
                        <span>
                          {gap.search_volume.toLocaleString()} monthly searches
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {gap.opportunity_score}
                      </div>
                      <div className="text-sm text-gray-600">Opportunity</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {gap.search_volume.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Search Volume</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {gap.estimated_traffic.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Est. Traffic</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {gap.related_queries.length}
                      </div>
                      <div className="text-xs text-gray-600">
                        Related Queries
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Suggested Content
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {gap.suggested_content
                        .slice(0, 3)
                        .map((content, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {content}
                          </Badge>
                        ))}
                      {gap.suggested_content.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{gap.suggested_content.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>
                          Platforms: {gap.target_platforms.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {trendingQueries.length === 0 &&
        contentGaps.length === 0 &&
        topicTrends.length === 0 && (
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No Query Discovery Data Available
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Query discovery and trending topics will start appearing once AI
                bots visit your website and we can analyze their search patterns
                and behavior.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <AlertTriangle className="w-4 h-4" />
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
