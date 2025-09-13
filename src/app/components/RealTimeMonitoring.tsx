'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/cards';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Activity, Zap, Bot, AlertTriangle, CheckCircle, Clock, Users, Search } from 'lucide-react';

interface RealTimeMonitoringProps {
  timeRange: string;
}

interface LiveActivity {
  id: string;
  timestamp: string;
  type: 'visit' | 'crawl' | 'mention' | 'query' | 'alert' | 'optimization';
  platform: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata: {
    ip?: string;
    user_agent?: string;
    url?: string;
    query?: string;
    confidence?: number;
    location?: string;
  };
}

interface RealTimeMetric {
  timestamp: string;
  active_crawlers: number;
  total_visits: number;
  ai_mentions: number;
  query_volume: number;
  engagement_rate: number;
  response_time: number;
}

interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  category: 'performance' | 'security' | 'content' | 'crawling' | 'system';
  affected_platforms: string[];
}

interface LiveStats {
  active_sessions: number;
  crawlers_online: number;
  queries_per_minute: number;
  avg_response_time: number;
  uptime_percentage: number;
  data_processed_mb: number;
}

interface GeographicActivity {
  country: string;
  country_code: string;
  visits: number;
  crawlers: number;
  queries: number;
  percentage: number;
}

export default function RealTimeMonitoring({ timeRange }: RealTimeMonitoringProps) {
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetric[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [liveStats, setLiveStats] = useState<LiveStats>({
    active_sessions: 0,
    crawlers_online: 0,
    queries_per_minute: 0,
    avg_response_time: 0,
    uptime_percentage: 0,
    data_processed_mb: 0
  });
  const [geographicActivity, setGeographicActivity] = useState<GeographicActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedActivityType, setSelectedActivityType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  // const wsRef = useRef<WebSocket | null>(null);
  const metricsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate WebSocket connection
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        // const response = await fetch('/api/real-time?type=overview');
        // const data = await response.json();
        // Update state with real data when backend is ready
      } catch (error) {
        console.error('Failed to fetch real-time data:', error);
      }
    };

    fetchRealTimeData();

    const connectWebSocket = () => {
      try {
        // In a real implementation, this would be a WebSocket connection
        // wsRef.current = new WebSocket('ws://localhost:3001/realtime');
        
        // Simulate connection
        setIsConnected(true);
        
        // Simulate real-time data updates
        const interval = setInterval(() => {
          // Generate new activity
          const newActivity: LiveActivity = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            type: ['visit', 'crawl', 'mention', 'query', 'alert', 'optimization'][Math.floor(Math.random() * 6)] as 'visit' | 'crawl' | 'mention' | 'query' | 'alert' | 'optimization',
            platform: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Copilot', 'Bard'][Math.floor(Math.random() * 6)],
            description: generateRandomActivity(),
            severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical',
            metadata: {
              ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
              confidence: Math.floor(Math.random() * 40) + 60,
              location: ['US', 'UK', 'CA', 'DE', 'FR', 'JP', 'AU'][Math.floor(Math.random() * 7)]
            }
          };
          
          setLiveActivities(prev => [newActivity, ...prev.slice(0, 49)]); // Keep last 50 activities
          
          // Update live stats
          setLiveStats(prev => ({
            active_sessions: prev.active_sessions + Math.floor(Math.random() * 3) - 1,
            crawlers_online: Math.max(0, prev.crawlers_online + Math.floor(Math.random() * 3) - 1),
            queries_per_minute: Math.max(0, prev.queries_per_minute + Math.floor(Math.random() * 10) - 5),
            avg_response_time: Math.max(50, prev.avg_response_time + Math.floor(Math.random() * 20) - 10),
            uptime_percentage: Math.min(100, Math.max(95, prev.uptime_percentage + (Math.random() - 0.5) * 0.1)),
            data_processed_mb: prev.data_processed_mb + Math.random() * 5
          }));
          
          // Update real-time metrics
          const newMetric: RealTimeMetric = {
            timestamp: new Date().toISOString(),
            active_crawlers: Math.floor(Math.random() * 20) + 10,
            total_visits: Math.floor(Math.random() * 100) + 50,
            ai_mentions: Math.floor(Math.random() * 30) + 10,
            query_volume: Math.floor(Math.random() * 50) + 20,
            engagement_rate: Math.random() * 10 + 5,
            response_time: Math.random() * 200 + 100
          };
          
          setRealTimeMetrics(prev => [newMetric, ...prev.slice(0, 29)]); // Keep last 30 metrics
        }, 2000); // Update every 2 seconds
        
        metricsIntervalRef.current = interval;
        
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setIsConnected(false);
      }
    };

    const generateRandomActivity = () => {
      const activities = [
        'New AI crawler detected analyzing content',
        'High-value query processed successfully',
        'Brand mention identified in AI response',
        'Content optimization recommendation generated',
        'Competitive intelligence data updated',
        'Real-time alert triggered for unusual activity',
        'User engagement metrics updated',
        'AI platform response analyzed',
        'Query trend pattern detected',
        'Content performance threshold exceeded'
      ];
      return activities[Math.floor(Math.random() * activities.length)];
    };

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Mock initial data
        const mockActivities: LiveActivity[] = Array.from({ length: 20 }, (_, i) => ({
          id: (Date.now() - i * 1000).toString(),
          timestamp: new Date(Date.now() - i * 1000).toISOString(),
          type: ['visit', 'crawl', 'mention', 'query', 'alert', 'optimization'][Math.floor(Math.random() * 6)] as 'visit' | 'crawl' | 'mention' | 'query' | 'alert' | 'optimization',
          platform: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Copilot', 'Bard'][Math.floor(Math.random() * 6)],
          description: 'Initial activity data loaded',
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical',
          metadata: {
            ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            confidence: Math.floor(Math.random() * 40) + 60,
            location: ['US', 'UK', 'CA', 'DE', 'FR', 'JP', 'AU'][Math.floor(Math.random() * 7)]
          }
        }));

        const mockAlerts: AlertItem[] = [
          {
            id: '1',
            title: 'High Crawler Activity Detected',
            description: 'Unusual spike in AI crawler activity from ChatGPT platform',
            severity: 'high',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            status: 'active',
            category: 'crawling',
            affected_platforms: ['ChatGPT']
          },
          {
            id: '2',
            title: 'Response Time Degradation',
            description: 'Average response time increased by 40% in the last 10 minutes',
            severity: 'medium',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            status: 'acknowledged',
            category: 'performance',
            affected_platforms: ['Claude', 'Gemini']
          },
          {
            id: '3',
            title: 'Content Optimization Opportunity',
            description: 'New high-impact keyword opportunity identified',
            severity: 'low',
            timestamp: new Date(Date.now() - 900000).toISOString(),
            status: 'active',
            category: 'content',
            affected_platforms: ['Perplexity']
          },
          {
            id: '4',
            title: 'Security Scan Completed',
            description: 'Weekly security scan completed successfully',
            severity: 'low',
            timestamp: new Date(Date.now() - 1200000).toISOString(),
            status: 'resolved',
            category: 'security',
            affected_platforms: ['All']
          }
        ];

        const mockGeographicActivity: GeographicActivity[] = [
          { country: 'United States', country_code: 'US', visits: 1250, crawlers: 45, queries: 890, percentage: 35.2 },
          { country: 'United Kingdom', country_code: 'UK', visits: 680, crawlers: 28, queries: 520, percentage: 19.1 },
          { country: 'Canada', country_code: 'CA', visits: 420, crawlers: 18, queries: 310, percentage: 11.8 },
          { country: 'Germany', country_code: 'DE', visits: 380, crawlers: 15, queries: 280, percentage: 10.7 },
          { country: 'France', country_code: 'FR', visits: 290, crawlers: 12, queries: 220, percentage: 8.2 },
          { country: 'Japan', country_code: 'JP', visits: 240, crawlers: 10, queries: 180, percentage: 6.8 },
          { country: 'Australia', country_code: 'AU', visits: 190, crawlers: 8, queries: 140, percentage: 5.4 },
          { country: 'Others', country_code: 'XX', visits: 100, crawlers: 4, queries: 80, percentage: 2.8 }
        ];

        setLiveActivities(mockActivities);
        setAlerts(mockAlerts);
        setGeographicActivity(mockGeographicActivity);
        setLiveStats({
          active_sessions: 1247,
          crawlers_online: 34,
          queries_per_minute: 156,
          avg_response_time: 245,
          uptime_percentage: 99.7,
          data_processed_mb: 2847.3
        });
      } catch (error) {
        console.error('Error fetching real-time data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
    connectWebSocket();

    return () => {
      // if (wsRef.current) {
      //   wsRef.current.close();
      // }
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
      }
    };
  }, [timeRange]);

  const filteredActivities = liveActivities.filter(activity => {
    const typeMatch = selectedActivityType === 'all' || activity.type === selectedActivityType;
    const severityMatch = selectedSeverity === 'all' || activity.severity === selectedSeverity;
    return typeMatch && severityMatch;
  });

  const activeAlerts = alerts.filter(alert => alert.status === 'active').length;
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical').length;
  const avgResponseTime = realTimeMetrics.length > 0 
    ? realTimeMetrics.slice(0, 10).reduce((sum, metric) => sum + metric.response_time, 0) / Math.min(10, realTimeMetrics.length)
    : 0;

  if (loading) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Real-Time Monitoring
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
      {/* Connection Status */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">
                {isConnected ? 'Connected to Real-Time Feed' : 'Disconnected'}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Active Sessions</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{liveStats.active_sessions.toLocaleString()}</div>
            <div className="text-xs text-blue-600">+12 from last hour</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Crawlers Online</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{liveStats.crawlers_online}</div>
            <div className="text-xs text-green-600">AI platforms active</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Queries/Min</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{liveStats.queries_per_minute}</div>
            <div className="text-xs text-purple-600">Real-time processing</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Avg Response</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{Math.round(avgResponseTime)}ms</div>
            <div className="text-xs text-orange-600">Response time</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Uptime</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{liveStats.uptime_percentage.toFixed(1)}%</div>
            <div className="text-xs text-green-600">System availability</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">Data Processed</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{liveStats.data_processed_mb.toFixed(1)}</div>
            <div className="text-xs text-yellow-600">MB today</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="activity">Live Activity</TabsTrigger>
          <TabsTrigger value="metrics">Real-Time Metrics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>

        {/* Live Activity */}
        <TabsContent value="activity" className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <select 
              value={selectedActivityType} 
              onChange={(e) => setSelectedActivityType(e.target.value)}
              className="px-3 py-2 bg-white/80 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Activities</option>
              <option value="visit">Visits</option>
              <option value="crawl">Crawls</option>
              <option value="mention">Mentions</option>
              <option value="query">Queries</option>
              <option value="alert">Alerts</option>
              <option value="optimization">Optimizations</option>
            </select>
            
            <select 
              value={selectedSeverity} 
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 bg-white/80 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            
            <div className="text-sm text-gray-600">
              Showing {filteredActivities.length} of {liveActivities.length} activities
            </div>
          </div>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Live Activity Feed
              </CardTitle>
              <CardDescription>
                Real-time monitoring of AI platform interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'visit' ? 'bg-blue-500' :
                      activity.type === 'crawl' ? 'bg-green-500' :
                      activity.type === 'mention' ? 'bg-purple-500' :
                      activity.type === 'query' ? 'bg-orange-500' :
                      activity.type === 'alert' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`}></div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{activity.description}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            activity.severity === 'critical' ? 'border-red-500 text-red-600' :
                            activity.severity === 'high' ? 'border-orange-500 text-orange-600' :
                            activity.severity === 'medium' ? 'border-yellow-500 text-yellow-600' :
                            'border-green-500 text-green-600'
                          }`}
                        >
                          {activity.severity}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {activity.platform}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                        {activity.metadata.ip && <span>IP: {activity.metadata.ip}</span>}
                        {activity.metadata.location && <span>Location: {activity.metadata.location}</span>}
                        {activity.metadata.confidence && <span>Confidence: {activity.metadata.confidence}%</span>}
                      </div>
                    </div>
                    
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      activity.type === 'visit' ? 'bg-blue-100 text-blue-700' :
                      activity.type === 'crawl' ? 'bg-green-100 text-green-700' :
                      activity.type === 'mention' ? 'bg-purple-100 text-purple-700' :
                      activity.type === 'query' ? 'bg-orange-100 text-orange-700' :
                      activity.type === 'alert' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {activity.type}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Real-Time Metrics */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Active Crawlers</CardTitle>
                <CardDescription>Real-time AI crawler activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={realTimeMetrics.slice(0, 20).reverse()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke="#64748b" 
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleTimeString().slice(0, 5)}
                      />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="active_crawlers" 
                        stroke="#10b981" 
                        fill="url(#crawlerGradient)" 
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="crawlerGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Query Volume</CardTitle>
                <CardDescription>Real-time query processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={realTimeMetrics.slice(0, 20).reverse()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke="#64748b" 
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleTimeString().slice(0, 5)}
                      />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                      <Line type="monotone" dataKey="query_volume" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
                <CardDescription>System performance monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={realTimeMetrics.slice(0, 20).reverse()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke="#64748b" 
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleTimeString().slice(0, 5)}
                      />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="response_time" 
                        stroke="#f59e0b" 
                        fill="url(#responseGradient)" 
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Engagement Rate</CardTitle>
                <CardDescription>User interaction metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={realTimeMetrics.slice(0, 20).reverse()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke="#64748b" 
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleTimeString().slice(0, 5)}
                      />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                      <Line type="monotone" dataKey="engagement_rate" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-gray-700">Active Alerts</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{activeAlerts}</div>
                <div className="text-xs text-red-600">Require attention</div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">Critical</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{criticalAlerts}</div>
                <div className="text-xs text-orange-600">High priority</div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Resolved</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{alerts.filter(a => a.status === 'resolved').length}</div>
                <div className="text-xs text-green-600">Last 24 hours</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                            alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}
                        >
                          {alert.severity}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            alert.status === 'active' ? 'border-red-500 text-red-600' :
                            alert.status === 'acknowledged' ? 'border-yellow-500 text-yellow-600' :
                            'border-green-500 text-green-600'
                          }`}
                        >
                          {alert.status}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-700 mb-3 text-sm">{alert.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        <span>Category: {alert.category}</span>
                        <span>Platforms: {alert.affected_platforms.join(', ')}</span>
                      </div>
                    </div>
                    
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.category === 'performance' ? 'bg-blue-100 text-blue-700' :
                      alert.category === 'security' ? 'bg-red-100 text-red-700' :
                      alert.category === 'content' ? 'bg-green-100 text-green-700' :
                      alert.category === 'crawling' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {alert.category}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Geographic */}
        <TabsContent value="geographic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Activity by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {geographicActivity.map((country) => (
                    <div key={country.country_code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                          {country.country_code}
                        </div>
                        <span className="font-medium text-gray-900">{country.country}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-right">
                          <div className="font-medium">{country.visits.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">visits</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{country.crawlers}</div>
                          <div className="text-xs text-gray-500">crawlers</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-blue-600">{country.percentage.toFixed(1)}%</div>
                          <div className="text-xs text-gray-500">share</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Activity Breakdown</CardTitle>
                <CardDescription>Visits, crawlers, and queries by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={geographicActivity.slice(0, 6)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="country_code" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="visits" fill="#3b82f6" name="Visits" />
                      <Bar dataKey="crawlers" fill="#10b981" name="Crawlers" />
                      <Bar dataKey="queries" fill="#8b5cf6" name="Queries" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}