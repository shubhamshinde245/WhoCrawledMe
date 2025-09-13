'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye, Target, Brain, BarChart3, Globe, Zap, Users } from 'lucide-react';
import MetricsCards from './MetricsCards';
import BrandVisibilityChart from './BrandVisibilityChart';
import ShareOfVoiceChart from './ShareOfVoiceChart';
import CompetitiveIntelligence from './CompetitiveIntelligence';
import AIPlatformMonitoring from './AIPlatformMonitoring';
import QueryDiscovery from './QueryDiscovery';
import BrandAnalytics from './BrandAnalytics';
import ContentOptimization from './ContentOptimization';
import RealTimeMonitoring from './RealTimeMonitoring';
import TimeRangeFilter from './TimeRangeFilter';

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [overviewData, setOverviewData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch overview data
        const overviewResponse = await fetch(`/api/analytics?timeRange=${timeRange}&type=overview`);
        const overviewData = await overviewResponse.json();
        setOverviewData(overviewData);

        // Fetch visits over time
        const visitsResponse = await fetch(`/api/analytics?timeRange=${timeRange}&type=visits-over-time`);
        const visitsData = await visitsResponse.json();
        
        // Fetch top bots
        const botsResponse = await fetch(`/api/analytics?timeRange=${timeRange}&type=top-bots`);
        const botsData = await botsResponse.json();
        
        // Fetch hourly trends
        const trendsResponse = await fetch(`/api/analytics?timeRange=${timeRange}&type=hourly-trends`);
        const trendsData = await trendsResponse.json();
        
        // Update chart data with real API responses
        console.log('Analytics data loaded:', { overviewData, visitsData, botsData, trendsData });
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Platform Intelligence
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Comprehensive monitoring and analytics for your brand's presence across 25+ AI platforms
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                <Brain className="w-3 h-3 mr-1" />
                25+ AI Platforms
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                <Zap className="w-3 h-3 mr-1" />
                Real-time Monitoring
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                <BarChart3 className="w-3 h-3 mr-1" />
                Advanced Analytics
              </Badge>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <TimeRangeFilter 
              selectedRange={timeRange} 
              onRangeChange={setTimeRange} 
            />
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 h-auto p-1 bg-white/50 backdrop-blur-sm border border-white/20">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="brand" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Brand</span>
            </TabsTrigger>
            <TabsTrigger value="competitive" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Competitive</span>
            </TabsTrigger>
            <TabsTrigger value="platforms" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">AI Platforms</span>
            </TabsTrigger>
            <TabsTrigger value="queries" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Queries</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Real-time</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <MetricsCards timeRange={timeRange} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <BrandVisibilityChart timeRange={timeRange} />
              <ShareOfVoiceChart timeRange={timeRange} />
            </div>
          </TabsContent>

          {/* Brand Analytics Tab */}
          <TabsContent value="brand" className="space-y-6">
            <BrandAnalytics timeRange={timeRange} />
          </TabsContent>

          {/* Competitive Intelligence Tab */}
          <TabsContent value="competitive" className="space-y-6">
            <CompetitiveIntelligence timeRange={timeRange} />
          </TabsContent>

          {/* AI Platform Monitoring Tab */}
          <TabsContent value="platforms" className="space-y-6">
            <AIPlatformMonitoring timeRange={timeRange} />
          </TabsContent>

          {/* Query Discovery Tab */}
          <TabsContent value="queries" className="space-y-6">
            <QueryDiscovery timeRange={timeRange} />
          </TabsContent>

          {/* Content Optimization Tab */}
          <TabsContent value="content" className="space-y-6">
            <ContentOptimization timeRange={timeRange} />
          </TabsContent>

          {/* Real-time Monitoring Tab */}
          <TabsContent value="realtime" className="space-y-6">
            <RealTimeMonitoring timeRange={timeRange} />
          </TabsContent>

          {/* Advanced Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Advanced Metrics
                  </CardTitle>
                  <CardDescription>
                    Deep dive into your AI platform performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Mention Rate Growth</span>
                      <span className="text-lg font-bold text-green-600">+24.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Platform Coverage</span>
                      <span className="text-lg font-bold text-blue-600">18/25</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Competitive Position</span>
                      <span className="text-lg font-bold text-purple-600">#3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Optimization Opportunities
                  </CardTitle>
                  <CardDescription>
                    AI-powered recommendations for growth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-800">High Impact</p>
                      <p className="text-xs text-blue-600">Optimize for Perplexity AI queries</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-800">Medium Impact</p>
                      <p className="text-xs text-green-600">Improve Claude visibility</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm font-medium text-yellow-800">Low Impact</p>
                      <p className="text-xs text-yellow-600">Monitor emerging platforms</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}