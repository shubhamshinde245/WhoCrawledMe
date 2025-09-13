'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/cards';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Lightbulb, Target, TrendingUp, CheckCircle } from 'lucide-react';

interface ContentOptimizationProps {
  timeRange: string;
}

interface ContentRecommendation {
  id: string;
  title: string;
  type: 'topic' | 'keyword' | 'format' | 'timing' | 'platform';
  priority: 'high' | 'medium' | 'low';
  impact_score: number;
  effort_level: 'easy' | 'medium' | 'hard';
  description: string;
  reasoning: string;
  suggested_actions: string[];
  target_platforms: string[];
  estimated_reach: number;
  confidence: number;
  category: string;
}

interface ContentPerformance {
  id: string;
  title: string;
  type: 'article' | 'video' | 'infographic' | 'tutorial' | 'case_study';
  platform: string;
  views: number;
  engagement_rate: number;
  sentiment_score: number;
  ai_mentions: number;
  optimization_score: number;
  published_date: string;
  last_updated: string;
  status: 'optimized' | 'needs_update' | 'underperforming';
}

interface KeywordOpportunity {
  keyword: string;
  search_volume: number;
  competition: 'low' | 'medium' | 'high';
  relevance_score: number;
  current_ranking: number | null;
  opportunity_score: number;
  trending: boolean;
  related_topics: string[];
}

interface ContentGap {
  topic: string;
  demand_score: number;
  supply_gap: number;
  target_audience: string;
  content_types: string[];
  keywords: string[];
  estimated_traffic: number;
  competition_level: 'low' | 'medium' | 'high';
}

interface OptimizationMetric {
  date: string;
  content_score: number;
  seo_score: number;
  engagement_rate: number;
  ai_visibility: number;
  conversion_rate: number;
}

export default function ContentOptimization({ timeRange }: ContentOptimizationProps) {
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [contentPerformance, setContentPerformance] = useState<ContentPerformance[]>([]);
  const [keywordOpportunities, setKeywordOpportunities] = useState<KeywordOpportunity[]>([]);
  const [contentGaps, setContentGaps] = useState<ContentGap[]>([]);
  const [optimizationMetrics, setOptimizationMetrics] = useState<OptimizationMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'impact' | 'priority' | 'confidence'>('impact');

  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
      try {
        // const response = await fetch(`/api/content-optimization?timeRange=${timeRange}&type=overview`);
        // const data = await response.json();
        // Update state with real data when backend is ready  
        
        // Mock content recommendations data for now
        const mockRecommendations: ContentRecommendation[] = [
          {
            id: '1',
            title: 'Create AI Ethics Guide for Developers',
            type: 'topic',
            priority: 'high',
            impact_score: 94,
            effort_level: 'medium',
            description: 'Develop comprehensive guide on ethical AI development practices',
            reasoning: 'High search volume (2.3K/month) with low competition. AI ethics is trending topic with 340% growth.',
            suggested_actions: [
              'Research current AI ethics frameworks',
              'Interview industry experts',
              'Create practical implementation checklist',
              'Include real-world case studies'
            ],
            target_platforms: ['ChatGPT', 'Claude', 'Perplexity'],
            estimated_reach: 15000,
            confidence: 89,
            category: 'AI & Ethics'
          },
          {
            id: '2',
            title: 'Optimize for "AI model deployment" keyword',
            type: 'keyword',
            priority: 'high',
            impact_score: 87,
            effort_level: 'easy',
            description: 'Target high-volume keyword with strategic content optimization',
            reasoning: 'Keyword has 4.1K monthly searches, medium competition, and aligns with your expertise.',
            suggested_actions: [
              'Update existing deployment articles',
              'Add keyword to meta descriptions',
              'Create deployment checklist',
              'Build internal linking structure'
            ],
            target_platforms: ['ChatGPT', 'Gemini', 'Copilot'],
            estimated_reach: 12500,
            confidence: 92,
            category: 'SEO & Keywords'
          },
          {
            id: '3',
            title: 'Develop Interactive AI Tool Comparison',
            type: 'format',
            priority: 'medium',
            impact_score: 82,
            effort_level: 'hard',
            description: 'Create interactive comparison tool for AI platforms',
            reasoning: 'Interactive content gets 2x more engagement and is highly shareable across AI communities.',
            suggested_actions: [
              'Design comparison matrix interface',
              'Gather comprehensive platform data',
              'Implement filtering and sorting',
              'Add user rating system'
            ],
            target_platforms: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'],
            estimated_reach: 18000,
            confidence: 76,
            category: 'Interactive Content'
          },
          {
            id: '4',
            title: 'Publish content on Tuesday 2-4 PM EST',
            type: 'timing',
            priority: 'medium',
            impact_score: 73,
            effort_level: 'easy',
            description: 'Optimize publishing schedule for maximum AI platform visibility',
            reasoning: 'Analysis shows 45% higher engagement when content is published during peak AI usage hours.',
            suggested_actions: [
              'Schedule posts for optimal times',
              'Monitor engagement patterns',
              'A/B test different time slots',
              'Adjust for different time zones'
            ],
            target_platforms: ['ChatGPT', 'Claude', 'Gemini'],
            estimated_reach: 8500,
            confidence: 84,
            category: 'Publishing Strategy'
          },
          {
            id: '5',
            title: 'Expand presence on Perplexity AI',
            type: 'platform',
            priority: 'high',
            impact_score: 91,
            effort_level: 'medium',
            description: 'Increase content optimization for Perplexity AI platform',
            reasoning: 'Perplexity shows 67% growth in your niche with lower competition than other platforms.',
            suggested_actions: [
              'Research Perplexity content preferences',
              'Optimize existing content for citations',
              'Create Perplexity-specific content',
              'Monitor performance metrics'
            ],
            target_platforms: ['Perplexity'],
            estimated_reach: 14200,
            confidence: 88,
            category: 'Platform Strategy'
          },
          {
            id: '6',
            title: 'Create "No-Code AI" Tutorial Series',
            type: 'topic',
            priority: 'high',
            impact_score: 89,
            effort_level: 'medium',
            description: 'Develop comprehensive tutorial series for no-code AI solutions',
            reasoning: 'No-code AI searches increased 280% with high commercial intent and low content saturation.',
            suggested_actions: [
              'Plan 6-part tutorial series',
              'Include hands-on examples',
              'Create downloadable resources',
              'Build community around content'
            ],
            target_platforms: ['ChatGPT', 'Claude', 'Gemini'],
            estimated_reach: 16800,
            confidence: 85,
            category: 'Educational Content'
          }
        ];

        // Mock content performance data
        const mockContentPerformance: ContentPerformance[] = [
          {
            id: '1',
            title: 'Complete Guide to AI Model Training',
            type: 'article',
            platform: 'ChatGPT',
            views: 15420,
            engagement_rate: 8.7,
            sentiment_score: 87,
            ai_mentions: 234,
            optimization_score: 92,
            published_date: '2024-01-01',
            last_updated: '2024-01-05',
            status: 'optimized'
          },
          {
            id: '2',
            title: 'Machine Learning Deployment Best Practices',
            type: 'tutorial',
            platform: 'Claude',
            views: 12350,
            engagement_rate: 7.2,
            sentiment_score: 82,
            ai_mentions: 189,
            optimization_score: 78,
            published_date: '2023-12-28',
            last_updated: '2024-01-03',
            status: 'needs_update'
          },
          {
            id: '3',
            title: 'AI Ethics Framework Visualization',
            type: 'infographic',
            platform: 'Perplexity',
            views: 8940,
            engagement_rate: 12.4,
            sentiment_score: 91,
            ai_mentions: 156,
            optimization_score: 85,
            published_date: '2024-01-02',
            last_updated: '2024-01-02',
            status: 'optimized'
          },
          {
            id: '4',
            title: 'Building Your First AI Chatbot',
            type: 'video',
            platform: 'Gemini',
            views: 6780,
            engagement_rate: 5.8,
            sentiment_score: 74,
            ai_mentions: 98,
            optimization_score: 65,
            published_date: '2023-12-25',
            last_updated: '2023-12-25',
            status: 'underperforming'
          },
          {
            id: '5',
            title: 'AI in Healthcare: Case Study Analysis',
            type: 'case_study',
            platform: 'ChatGPT',
            views: 11200,
            engagement_rate: 9.1,
            sentiment_score: 88,
            ai_mentions: 167,
            optimization_score: 89,
            published_date: '2024-01-04',
            last_updated: '2024-01-06',
            status: 'optimized'
          }
        ];

        // Mock keyword opportunities data
        const mockKeywordOpportunities: KeywordOpportunity[] = [
          {
            keyword: 'AI model optimization',
            search_volume: 3200,
            competition: 'medium',
            relevance_score: 94,
            current_ranking: null,
            opportunity_score: 87,
            trending: true,
            related_topics: ['model compression', 'inference speed', 'deployment']
          },
          {
            keyword: 'machine learning pipeline',
            search_volume: 2800,
            competition: 'high',
            relevance_score: 89,
            current_ranking: 15,
            opportunity_score: 73,
            trending: false,
            related_topics: ['MLOps', 'data processing', 'automation']
          },
          {
            keyword: 'AI ethics guidelines',
            search_volume: 2100,
            competition: 'low',
            relevance_score: 92,
            current_ranking: null,
            opportunity_score: 91,
            trending: true,
            related_topics: ['responsible AI', 'bias detection', 'fairness']
          },
          {
            keyword: 'no-code AI platforms',
            search_volume: 1900,
            competition: 'low',
            relevance_score: 86,
            current_ranking: 8,
            opportunity_score: 82,
            trending: true,
            related_topics: ['AutoML', 'citizen data science', 'democratization']
          },
          {
            keyword: 'AI model monitoring',
            search_volume: 1650,
            competition: 'medium',
            relevance_score: 88,
            current_ranking: null,
            opportunity_score: 79,
            trending: false,
            related_topics: ['model drift', 'performance tracking', 'alerts']
          }
        ];

        // Mock content gaps data
        const mockContentGaps: ContentGap[] = [
          {
            topic: 'AI Model Interpretability',
            demand_score: 89,
            supply_gap: 76,
            target_audience: 'Data Scientists & ML Engineers',
            content_types: ['Technical Guide', 'Tutorial', 'Case Study'],
            keywords: ['explainable AI', 'model interpretability', 'SHAP', 'LIME'],
            estimated_traffic: 4200,
            competition_level: 'medium'
          },
          {
            topic: 'AI Governance Frameworks',
            demand_score: 84,
            supply_gap: 82,
            target_audience: 'Enterprise Decision Makers',
            content_types: ['Whitepaper', 'Framework Guide', 'Checklist'],
            keywords: ['AI governance', 'enterprise AI', 'compliance'],
            estimated_traffic: 3800,
            competition_level: 'low'
          },
          {
            topic: 'Edge AI Deployment',
            demand_score: 81,
            supply_gap: 74,
            target_audience: 'IoT Developers & Engineers',
            content_types: ['Technical Tutorial', 'Best Practices', 'Tools Comparison'],
            keywords: ['edge computing', 'mobile AI', 'IoT machine learning'],
            estimated_traffic: 3200,
            competition_level: 'medium'
          },
          {
            topic: 'AI Cost Optimization',
            demand_score: 78,
            supply_gap: 71,
            target_audience: 'Engineering Managers & CTOs',
            content_types: ['Cost Analysis', 'Optimization Guide', 'ROI Calculator'],
            keywords: ['AI costs', 'cloud optimization', 'resource management'],
            estimated_traffic: 2900,
            competition_level: 'high'
          }
        ];

        // Mock optimization metrics data
        const mockOptimizationMetrics: OptimizationMetric[] = [
          { date: '2024-01-01', content_score: 72, seo_score: 68, engagement_rate: 5.2, ai_visibility: 45, conversion_rate: 2.1 },
          { date: '2024-01-02', content_score: 75, seo_score: 71, engagement_rate: 5.8, ai_visibility: 48, conversion_rate: 2.3 },
          { date: '2024-01-03', content_score: 78, seo_score: 74, engagement_rate: 6.2, ai_visibility: 52, conversion_rate: 2.5 },
          { date: '2024-01-04', content_score: 81, seo_score: 77, engagement_rate: 6.7, ai_visibility: 56, conversion_rate: 2.8 },
          { date: '2024-01-05', content_score: 84, seo_score: 80, engagement_rate: 7.1, ai_visibility: 59, conversion_rate: 3.0 },
          { date: '2024-01-06', content_score: 86, seo_score: 82, engagement_rate: 7.4, ai_visibility: 62, conversion_rate: 3.2 },
          { date: '2024-01-07', content_score: 88, seo_score: 85, engagement_rate: 7.8, ai_visibility: 65, conversion_rate: 3.4 }
        ];
        
        setRecommendations(mockRecommendations);
        setContentPerformance(mockContentPerformance);
        setKeywordOpportunities(mockKeywordOpportunities);
        setContentGaps(mockContentGaps);
        setOptimizationMetrics(mockOptimizationMetrics);
      } catch (error) {
        console.error('Error fetching content optimization data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContentData();
  }, [timeRange]);

  const filteredRecommendations = recommendations
    .filter(rec => selectedCategory === 'all' || rec.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'impact': return b.impact_score - a.impact_score;
        case 'priority': 
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'confidence': return b.confidence - a.confidence;
        default: return b.impact_score - a.impact_score;
      }
    });

  const totalRecommendations = recommendations.length;
  const highPriorityRecs = recommendations.filter(rec => rec.priority === 'high').length;
  const avgImpactScore = recommendations.reduce((sum, rec) => sum + rec.impact_score, 0) / recommendations.length;
  const optimizedContent = contentPerformance.filter(content => content.status === 'optimized').length;

  if (loading) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Content Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
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
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">Recommendations</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalRecommendations}</div>
            <div className="text-xs text-yellow-600">{highPriorityRecs} high priority</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Avg Impact</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{avgImpactScore.toFixed(1)}</div>
            <div className="text-xs text-blue-600">Impact score</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Optimized</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{optimizedContent}/{contentPerformance.length}</div>
            <div className="text-xs text-green-600">Content pieces</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Growth</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">+22.4%</div>
            <div className="text-xs text-purple-600">Content performance</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="gaps">Content Gaps</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        {/* Recommendations */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white/80 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Categories</option>
              <option value="AI &amp; Ethics">AI &amp; Ethics</option>
                <option value="SEO &amp; Keywords">SEO &amp; Keywords</option>
              <option value="Interactive Content">Interactive Content</option>
              <option value="Publishing Strategy">Publishing Strategy</option>
              <option value="Platform Strategy">Platform Strategy</option>
              <option value="Educational Content">Educational Content</option>
            </select>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as 'impact' | 'priority' | 'confidence')}
              className="px-3 py-2 bg-white/80 border border-gray-200 rounded-lg text-sm"
            >
              <option value="impact">Sort by Impact</option>
              <option value="priority">Sort by Priority</option>
              <option value="confidence">Sort by Confidence</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredRecommendations.map((rec, index) => (
              <Card key={rec.id} className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}
                        >
                          {rec.priority} priority
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            rec.type === 'topic' ? 'border-blue-500 text-blue-600' :
                            rec.type === 'keyword' ? 'border-green-500 text-green-600' :
                            rec.type === 'format' ? 'border-purple-500 text-purple-600' :
                            rec.type === 'timing' ? 'border-orange-500 text-orange-600' :
                            'border-pink-500 text-pink-600'
                          }`}
                        >
                          {rec.type}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-700 mb-3 text-sm">{rec.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>Impact: <span className="font-medium text-blue-600">{rec.impact_score}/100</span></span>
                        <span>Effort: <span className={`font-medium ${
                          rec.effort_level === 'easy' ? 'text-green-600' :
                          rec.effort_level === 'medium' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>{rec.effort_level}</span></span>
                        <span>Confidence: <span className="font-medium text-purple-600">{rec.confidence}%</span></span>
                        <span>Est. Reach: <span className="font-medium text-gray-900">{rec.estimated_reach.toLocaleString()}</span></span>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <p className="text-xs text-gray-600 mb-2"><strong>Reasoning:</strong></p>
                        <p className="text-xs text-gray-700">{rec.reasoning}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500 mb-1 block">Suggested Actions:</span>
                          <ul className="text-xs text-gray-700 space-y-1">
                            {rec.suggested_actions.map((action, actionIndex) => (
                              <li key={actionIndex} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <span className="text-xs text-gray-500 mb-1 block">Target Platforms:</span>
                          <div className="flex flex-wrap gap-1">
                            {rec.target_platforms.map((platform) => (
                              <Badge key={platform} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{rec.impact_score}</div>
                        <div className="text-xs text-gray-500">Impact Score</div>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {rec.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-6">
          <div className="space-y-4">
            {contentPerformance.map((content) => (
              <Card key={content.id} className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{content.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            content.type === 'article' ? 'border-blue-500 text-blue-600' :
                            content.type === 'video' ? 'border-red-500 text-red-600' :
                            content.type === 'tutorial' ? 'border-green-500 text-green-600' :
                            content.type === 'infographic' ? 'border-purple-500 text-purple-600' :
                            'border-orange-500 text-orange-600'
                          }`}
                        >
                          {content.type}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            content.status === 'optimized' ? 'bg-green-100 text-green-700' :
                            content.status === 'needs_update' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}
                        >
                          {content.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 block">Platform:</span>
                          <span className="font-medium">{content.platform}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Views:</span>
                          <span className="font-medium">{content.views.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Engagement:</span>
                          <span className="font-medium">{content.engagement_rate.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Sentiment:</span>
                          <span className="font-medium">{content.sentiment_score}/100</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">AI Mentions:</span>
                          <span className="font-medium">{content.ai_mentions}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Optimization:</span>
                          <span className={`font-medium ${
                            content.optimization_score >= 80 ? 'text-green-600' :
                            content.optimization_score >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {content.optimization_score}/100
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        <span>Published: {content.published_date}</span>
                        <span>Updated: {content.last_updated}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Optimization Score Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div 
                      className={`h-2 rounded-full ${
                        content.optimization_score >= 80 ? 'bg-green-500' :
                        content.optimization_score >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${content.optimization_score}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Keywords */}
        <TabsContent value="keywords" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {keywordOpportunities.map((keyword) => (
              <Card key={keyword.keyword} className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{keyword.keyword}</h3>
                        {keyword.trending && (
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            keyword.competition === 'low' ? 'border-green-500 text-green-600' :
                            keyword.competition === 'medium' ? 'border-yellow-500 text-yellow-600' :
                            'border-red-500 text-red-600'
                          }`}
                        >
                          {keyword.competition} competition
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Search Volume:</span>
                          <span className="font-medium">{keyword.search_volume.toLocaleString()}/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Relevance:</span>
                          <span className="font-medium text-blue-600">{keyword.relevance_score}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Ranking:</span>
                          <span className="font-medium">
                            {keyword.current_ranking ? `#${keyword.current_ranking}` : 'Not ranked'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Opportunity:</span>
                          <span className="font-medium text-green-600">{keyword.opportunity_score}/100</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <span className="text-xs text-gray-500 mb-1 block">Related Topics:</span>
                        <div className="flex flex-wrap gap-1">
                          {keyword.related_topics.map((topic) => (
                            <span key={topic} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{keyword.opportunity_score}</div>
                      <div className="text-xs text-gray-500">Opportunity</div>
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
            {contentGaps.map((gap, index) => (
              <Card key={index} className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{gap.topic}</h3>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        gap.competition_level === 'low' ? 'bg-green-100 text-green-700' :
                        gap.competition_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      {gap.competition_level} competition
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Demand Score:</span>
                      <span className="font-medium text-blue-600">{gap.demand_score}/100</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Supply Gap:</span>
                      <span className="font-medium text-red-600">{gap.supply_gap}/100</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Est. Traffic:</span>
                      <span className="font-medium text-green-600">{gap.estimated_traffic.toLocaleString()}/month</span>
                    </div>
                    
                    <div>
                      <span className="text-xs text-gray-500 mb-1 block">Target Audience:</span>
                      <span className="text-sm text-gray-700">{gap.target_audience}</span>
                    </div>
                    
                    <div>
                      <span className="text-xs text-gray-500 mb-1 block">Content Types:</span>
                      <div className="flex flex-wrap gap-1">
                        {gap.content_types.map((type) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs text-gray-500 mb-1 block">Keywords:</span>
                      <div className="flex flex-wrap gap-1">
                        {gap.keywords.map((keyword) => (
                          <span key={keyword} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
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

        {/* Metrics */}
        <TabsContent value="metrics" className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle>Content Optimization Trends</CardTitle>
              <CardDescription>
                Track optimization performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={optimizationMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line type="monotone" dataKey="content_score" stroke="#3b82f6" strokeWidth={2} name="Content Score" />
                    <Line type="monotone" dataKey="seo_score" stroke="#10b981" strokeWidth={2} name="SEO Score" />
                    <Line type="monotone" dataKey="engagement_rate" stroke="#f59e0b" strokeWidth={2} name="Engagement Rate" />
                    <Line type="monotone" dataKey="ai_visibility" stroke="#8b5cf6" strokeWidth={2} name="AI Visibility" />
                    <Line type="monotone" dataKey="conversion_rate" stroke="#ef4444" strokeWidth={2} name="Conversion Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}