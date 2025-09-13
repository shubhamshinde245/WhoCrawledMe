'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/cards';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Target, TrendingUp, Users, Eye, Brain, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface CompetitiveIntelligenceProps {
  timeRange: string;
}

interface CompetitorData {
  name: string;
  mentions: number;
  visibility_score: number;
  growth_rate: number;
  platform_coverage: number;
  engagement_rate: number;
  market_share: number;
  strengths: string[];
  weaknesses: string[];
  isYourBrand?: boolean;
}

interface BenchmarkData {
  metric: string;
  yourBrand: number;
  competitor1: number;
  competitor2: number;
  competitor3: number;
  industry_avg: number;
}

interface PlatformComparison {
  platform: string;
  yourBrand: number;
  topCompetitor: number;
  marketLeader: number;
}

export default function CompetitiveIntelligence({ timeRange }: CompetitiveIntelligenceProps) {
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData[]>([]);
  const [platformData, setPlatformData] = useState<PlatformComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'benchmarks' | 'platforms'>('overview');

  useEffect(() => {
    const fetchCompetitiveData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/competitive-intelligence?timeRange=${timeRange}&type=overview`);
        const data = await response.json();
        // Update state with real data when backend is ready
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch competitive intelligence:', error);
        setLoading(false);
      }
    };

    fetchCompetitiveData();
  }, [timeRange]);

  const yourBrand = competitors.find(c => c.isYourBrand);
  const topCompetitors = competitors.filter(c => !c.isYourBrand).slice(0, 3);

  if (loading) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Competitive Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Market Position</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">#3</div>
            <div className="text-xs text-gray-600">of {competitors.length} tracked brands</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Growth Rate</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{yourBrand?.growth_rate.toFixed(1)}%</div>
            <div className="text-xs text-green-600">Above industry avg</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Platform Coverage</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{yourBrand?.platform_coverage}/25</div>
            <div className="text-xs text-gray-600">AI platforms monitored</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Visibility Gap</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">-4pts</div>
            <div className="text-xs text-orange-600">vs market leader</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedView} onValueChange={(value: any) => setSelectedView(value)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="overview">Competitor Overview</TabsTrigger>
          <TabsTrigger value="benchmarks">Performance Benchmarks</TabsTrigger>
          <TabsTrigger value="platforms">Platform Analysis</TabsTrigger>
        </TabsList>

        {/* Competitor Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Competitor Comparison Table */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Competitor Comparison
                </CardTitle>
                <CardDescription>
                  Key metrics comparison with top competitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitors.map((competitor, index) => (
                    <div key={competitor.name} className={`p-4 rounded-lg border ${
                      competitor.isYourBrand 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                          <span className={`font-semibold ${
                            competitor.isYourBrand ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {competitor.name}
                          </span>
                          {competitor.isYourBrand && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {competitor.market_share.toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Mentions:</span>
                          <span className="ml-2 font-medium">{competitor.mentions}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Visibility:</span>
                          <span className="ml-2 font-medium">{competitor.visibility_score}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Growth:</span>
                          <span className={`ml-2 font-medium ${
                            competitor.growth_rate >= 10 ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {competitor.growth_rate >= 0 ? '+' : ''}{competitor.growth_rate.toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Platforms:</span>
                          <span className="ml-2 font-medium">{competitor.platform_coverage}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SWOT Analysis */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Competitive Analysis
                </CardTitle>
                <CardDescription>
                  Strengths and opportunities vs competitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Your Brand Analysis */}
                  {yourBrand && (
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-3">Your Brand</h4>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-green-700 mb-2">Strengths</h5>
                          <div className="space-y-1">
                            {yourBrand.strengths.map((strength, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <ArrowUpRight className="w-3 h-3 text-green-600" />
                                <span className="text-gray-700">{strength}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-red-700 mb-2">Areas for Improvement</h5>
                          <div className="space-y-1">
                            {yourBrand.weaknesses.map((weakness, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <ArrowDownRight className="w-3 h-3 text-red-600" />
                                <span className="text-gray-700">{weakness}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Top Competitor Insights */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Top Competitor Insights</h4>
                    <div className="space-y-3">
                      {topCompetitors.slice(0, 1).map((competitor) => (
                        <div key={competitor.name} className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">{competitor.name}</h5>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>• {competitor.strengths[0]}</p>
                            <p>• {competitor.strengths[1]}</p>
                            <p className="text-orange-600">⚠ {competitor.weaknesses[0]}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Benchmarks */}
        <TabsContent value="benchmarks" className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle>Performance Benchmarks</CardTitle>
              <CardDescription>
                Compare your performance across key metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={benchmarkData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="metric" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="yourBrand" fill="#3b82f6" name="Your Brand" />
                    <Bar dataKey="competitor1" fill="#ef4444" name="TechCorp" />
                    <Bar dataKey="competitor2" fill="#f59e0b" name="InnovateLabs" />
                    <Bar dataKey="industry_avg" fill="#6b7280" name="Industry Avg" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Analysis */}
        <TabsContent value="platforms" className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle>AI Platform Performance</CardTitle>
              <CardDescription>
                Your visibility score across different AI platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformData.map((platform) => (
                  <div key={platform.platform} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{platform.platform}</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-blue-600 font-medium">You: {platform.yourBrand}</span>
                        <span className="text-red-600">Top: {platform.topCompetitor}</span>
                        <span className="text-gray-600">Leader: {platform.marketLeader}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Your Brand Bar */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-blue-600 w-16">You</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${platform.yourBrand}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 w-8">{platform.yourBrand}</span>
                      </div>
                      
                      {/* Top Competitor Bar */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-red-600 w-16">Top</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${platform.topCompetitor}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 w-8">{platform.topCompetitor}</span>
                      </div>
                      
                      {/* Market Leader Bar */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-600 w-16">Leader</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gray-500 h-2 rounded-full" 
                            style={{ width: `${platform.marketLeader}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 w-8">{platform.marketLeader}</span>
                      </div>
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