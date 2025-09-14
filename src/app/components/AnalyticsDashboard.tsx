"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/cards";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Eye,
  Target,
  Brain,
  BarChart3,
  Globe,
  Zap,
  Users,
} from "lucide-react";
import MetricsCards from "./MetricsCards";
import BrandVisibilityChart from "./BrandVisibilityChart";
import ShareOfVoiceChart from "./ShareOfVoiceChart";
import CompetitiveIntelligence from "./CompetitiveIntelligence";
import AIPlatformMonitoring from "./AIPlatformMonitoring";
import QueryDiscovery from "./QueryDiscovery";
import BrandAnalytics from "./BrandAnalytics";
import ContentOptimization from "./ContentOptimization";
import RealTimeMonitoring from "./RealTimeMonitoring";
import TimeRangeFilter from "./TimeRangeFilter";

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");
  // const [loading, setLoading] = useState(false);
  // const [overviewData, setOverviewData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch overview data
        const overviewResponse = await fetch(
          `/api/analytics?timeRange=${timeRange}&type=overview`
        );
        const overviewData = await overviewResponse.json();

        // Fetch visits over time
        const visitsResponse = await fetch(
          `/api/analytics?timeRange=${timeRange}&type=visits-over-time`
        );
        const visitsData = await visitsResponse.json();

        // Fetch top bots
        const botsResponse = await fetch(
          `/api/analytics?timeRange=${timeRange}&type=top-bots`
        );
        const botsData = await botsResponse.json();

        // Fetch hourly trends
        const trendsResponse = await fetch(
          `/api/analytics?timeRange=${timeRange}&type=hourly-trends`
        );
        const trendsData = await trendsResponse.json();

        // Log analytics data for debugging
        console.log("Analytics data loaded:", {
          overviewData,
          visitsData,
          botsData,
          trendsData,
        });
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      }
    };

    fetchData();
  }, [timeRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="container-fluid py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
        {/* Modern Header with Enhanced Responsiveness */}
        <div className="glass-morphism-light dark:glass-morphism-dark rounded-2xl p-6 sm:p-8 lg:p-10 animate-fade-in">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 lg:gap-8">
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <h1 className="text-responsive-lg sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gradient bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI Platform Intelligence
                </h1>
                <p className="text-responsive-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                  Comprehensive monitoring and analytics for your brand&apos;s presence
                  across 25+ AI platforms with real-time insights and competitive intelligence
                </p>
              </div>

              {/* Enhanced Feature Badges */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Badge
                  variant="secondary"
                  className="modern-card bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 hover:scale-105 transition-all duration-200 px-3 py-1.5"
                >
                  <Brain className="w-3 h-3 mr-1.5" />
                  25+ AI Platforms
                </Badge>
                <Badge
                  variant="secondary"
                  className="modern-card bg-gradient-to-r from-green-500/10 to-emerald-600/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700 hover:scale-105 transition-all duration-200 px-3 py-1.5"
                >
                  <Zap className="w-3 h-3 mr-1.5 animate-pulse" />
                  Real-time Monitoring
                </Badge>
                <Badge
                  variant="secondary"
                  className="modern-card bg-gradient-to-r from-purple-500/10 to-indigo-600/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700 hover:scale-105 transition-all duration-200 px-3 py-1.5"
                >
                  <BarChart3 className="w-3 h-3 mr-1.5" />
                  Advanced Analytics
                </Badge>
              </div>
            </div>

            {/* Time Range Filter with Enhanced Styling */}
            <div className="flex flex-col sm:flex-row gap-4 xl:flex-col xl:gap-3 xl:min-w-[200px]">
              <TimeRangeFilter
                selectedRange={timeRange}
                onRangeChange={setTimeRange}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Dashboard Tabs with Modern Design */}
        <div className="glass-morphism-light dark:glass-morphism-dark rounded-2xl p-2 animate-slide-in">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            {/* Responsive Tab Navigation */}
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList className="glass-morphism-light dark:glass-morphism-dark grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 xl:grid-cols-8 w-full min-w-max lg:min-w-full h-auto p-1.5 gap-1 bg-transparent border-0">
                <TabsTrigger
                  value="overview"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 text-sm font-medium"
                >
                  <Eye className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline xl:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="brand"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/25 text-sm font-medium"
                >
                  <TrendingUp className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline xl:inline">Brand</span>
                </TabsTrigger>
                <TabsTrigger
                  value="competitive"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/25 text-sm font-medium"
                >
                  <Target className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline xl:inline">Competitive</span>
                </TabsTrigger>
                <TabsTrigger
                  value="platforms"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/25 text-sm font-medium"
                >
                  <Brain className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:inline xl:inline">AI Platforms</span>
                </TabsTrigger>
                <TabsTrigger
                  value="queries"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 text-sm font-medium"
                >
                  <BarChart3 className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:inline xl:inline">Queries</span>
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-teal-500/25 text-sm font-medium"
                >
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:inline xl:inline">Content</span>
                </TabsTrigger>
                <TabsTrigger
                  value="realtime"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-yellow-500/25 text-sm font-medium"
                >
                  <Zap className="w-4 h-4 flex-shrink-0 animate-pulse data-[state=active]:animate-none" />
                  <span className="hidden lg:inline xl:inline">Real-time</span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25 text-sm font-medium"
                >
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:inline xl:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Enhanced Tab Content with Improved Layouts */}
            <TabsContent value="overview" className="space-y-6 sm:space-y-8 animate-fade-in">
              <MetricsCards timeRange={timeRange} />
              <div className="grid-responsive xl:grid-cols-2">
                <BrandVisibilityChart timeRange={timeRange} />
                <ShareOfVoiceChart timeRange={timeRange} />
              </div>
            </TabsContent>

            <TabsContent value="brand" className="space-y-6 sm:space-y-8 animate-fade-in">
              <BrandAnalytics timeRange={timeRange} />
            </TabsContent>

            <TabsContent value="competitive" className="space-y-6 sm:space-y-8 animate-fade-in">
              <CompetitiveIntelligence timeRange={timeRange} />
            </TabsContent>

            <TabsContent value="platforms" className="space-y-6 sm:space-y-8 animate-fade-in">
              <AIPlatformMonitoring timeRange={timeRange} />
            </TabsContent>

            <TabsContent value="queries" className="space-y-6 sm:space-y-8 animate-fade-in">
              <QueryDiscovery timeRange={timeRange} />
            </TabsContent>

            <TabsContent value="content" className="space-y-6 sm:space-y-8 animate-fade-in">
              <ContentOptimization timeRange={timeRange} />
            </TabsContent>

            <TabsContent value="realtime" className="space-y-6 sm:space-y-8 animate-fade-in">
              <RealTimeMonitoring timeRange={timeRange} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6 sm:space-y-8 animate-fade-in">
              <div className="grid-responsive lg:grid-cols-2 xl:grid-cols-2">
                {/* Advanced Metrics Card */}
                <Card className="modern-card-glass hover:scale-[1.02] transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gradient">Advanced Metrics</h3>
                        <CardDescription className="text-sm">
                          Deep dive into your AI platform performance
                        </CardDescription>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="glass-subtle rounded-xl p-4 hover:bg-gradient-to-r hover:from-green-500/5 hover:to-emerald-500/5 transition-all duration-200">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">Mention Rate Growth</span>
                          </div>
                          <span className="text-xl font-bold text-green-600">+24.5%</span>
                        </div>
                      </div>
                      <div className="glass-subtle rounded-xl p-4 hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-cyan-500/5 transition-all duration-200">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium">Platform Coverage</span>
                          </div>
                          <span className="text-xl font-bold text-blue-600">18/25</span>
                        </div>
                      </div>
                      <div className="glass-subtle rounded-xl p-4 hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-violet-500/5 transition-all duration-200">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-sm font-medium">Competitive Position</span>
                          </div>
                          <span className="text-xl font-bold text-purple-600">#3</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Optimization Opportunities Card */}
                <Card className="modern-card-glass hover:scale-[1.02] transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gradient">Optimization Opportunities</h3>
                        <CardDescription className="text-sm">
                          AI-powered recommendations for growth
                        </CardDescription>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="glass-subtle rounded-xl p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-l-4 border-blue-500 hover:scale-105 transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">High Impact</p>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Optimize for Perplexity AI queries
                        </p>
                      </div>
                      <div className="glass-subtle rounded-xl p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-l-4 border-green-500 hover:scale-105 transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-green-800 dark:text-green-200">Medium Impact</p>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          Improve Claude visibility
                        </p>
                      </div>
                      <div className="glass-subtle rounded-xl p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-l-4 border-yellow-500 hover:scale-105 transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Low Impact</p>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        </div>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">
                          Monitor emerging platforms
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
