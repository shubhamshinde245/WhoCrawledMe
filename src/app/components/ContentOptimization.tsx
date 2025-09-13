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
  Lightbulb,
  TrendingUp,
  Target,
  Clock,
  BarChart3,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface ContentOptimizationProps {
  timeRange: string;
}

interface ContentRecommendation {
  id: string;
  title: string;
  type: "topic" | "keyword" | "content" | "technical";
  priority: "high" | "medium" | "low";
  impact_score: number;
  effort_level: "low" | "medium" | "high";
  description: string;
  reasoning: string;
  suggested_actions: string[];
  target_platforms: string[];
  estimated_reach: number;
  confidence: number;
  category: string;
}

export default function ContentOptimization({
  timeRange,
}: ContentOptimizationProps) {
  const [recommendations, setRecommendations] = useState<
    ContentRecommendation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");

  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
      try {
        // Fetch real content optimization data from API
        const response = await fetch(
          `/api/content-optimization?timeRange=${timeRange}&type=overview`
        );
        const data = await response.json();

        if (data.error) {
          console.error("Content optimization API error:", data.error);
          setRecommendations([]);
          return;
        }

        setRecommendations(data.recommendations || []);
      } catch (error) {
        console.error("Error fetching content optimization data:", error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContentData();
  }, [timeRange]);

  const filteredRecommendations = recommendations.filter((rec) => {
    const typeMatch = selectedType === "all" || rec.type === selectedType;
    const priorityMatch =
      selectedPriority === "all" || rec.priority === selectedPriority;
    return typeMatch && priorityMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "topic":
        return <Target className="w-4 h-4" />;
      case "keyword":
        return <TrendingUp className="w-4 h-4" />;
      case "content":
        return <BarChart3 className="w-4 h-4" />;
      case "technical":
        return <Clock className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            Content Optimization Recommendations
          </CardTitle>
          <CardDescription>
            AI-powered suggestions to improve your content&apos;s visibility
            across AI platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white"
              >
                <option value="all">All Types</option>
                <option value="topic">Topics</option>
                <option value="keyword">Keywords</option>
                <option value="content">Content</option>
                <option value="technical">Technical</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Priority:
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Grid */}
      {filteredRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((recommendation) => (
            <Card
              key={recommendation.id}
              className="bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(recommendation.type)}
                    <CardTitle className="text-lg">
                      {recommendation.title}
                    </CardTitle>
                  </div>
                  <Badge className={getPriorityColor(recommendation.priority)}>
                    {recommendation.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant="outline">{recommendation.type}</Badge>
                  <span>•</span>
                  <span>{recommendation.category}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  {recommendation.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Impact Score</span>
                    <span className="font-semibold text-blue-600">
                      {recommendation.impact_score}/100
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Effort Level</span>
                    <span
                      className={`font-semibold ${getEffortColor(
                        recommendation.effort_level
                      )}`}
                    >
                      {recommendation.effort_level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Confidence</span>
                    <span className="font-semibold text-green-600">
                      {recommendation.confidence}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Est. Reach</span>
                    <span className="font-semibold text-purple-600">
                      {recommendation.estimated_reach.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Target Platforms
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.target_platforms.map((platform) => (
                      <Badge
                        key={platform}
                        variant="secondary"
                        className="text-xs"
                      >
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Suggested Actions
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {recommendation.suggested_actions
                      .slice(0, 3)
                      .map((action, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    {recommendation.suggested_actions.length > 3 && (
                      <li className="text-xs text-gray-500">
                        +{recommendation.suggested_actions.length - 3} more
                        actions
                      </li>
                    )}
                  </ul>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 italic">
                    {recommendation.reasoning}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No Content Recommendations Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Content optimization recommendations will appear here once AI bots
              start visiting your website and we can analyze their behavior
              patterns.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <AlertCircle className="w-4 h-4" />
              <span>Make sure your tracking script is properly installed</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {recommendations.length === 0 && !loading && (
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No Content Optimization Data Available
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Content optimization recommendations will start appearing once AI
              bots visit your website and we can analyze their behavior patterns
              to suggest improvements.
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
