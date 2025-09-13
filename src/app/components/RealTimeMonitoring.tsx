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
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Zap,
  Eye,
  Bot,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface RealTimeMonitoringProps {
  timeRange: string;
}

interface LiveActivity {
  id: string;
  bot_type: string;
  action: string;
  timestamp: string;
  website_url: string;
  ip_address: string;
  user_agent: string;
  status: "success" | "error" | "warning";
  response_time: number;
  confidence: number;
}

interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  status: "active" | "acknowledged" | "resolved";
  category: string;
  affected_platforms: string[];
}

interface GeographicActivity {
  country: string;
  region: string;
  visits: number;
  platforms: string[];
  last_activity: string;
}

export default function RealTimeMonitoring({
  timeRange,
}: RealTimeMonitoringProps) {
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [geographicActivity, setGeographicActivity] = useState<
    GeographicActivity[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        // Fetch real-time monitoring data from API
        const response = await fetch(
          `/api/real-time?timeRange=${timeRange}&type=overview`
        );
        const data = await response.json();

        if (data.error) {
          console.error("Real-time monitoring API error:", data.error);
          setLiveActivities([]);
          setAlerts([]);
          setGeographicActivity([]);
          return;
        }

        setLiveActivities(data.liveActivities || []);
        setAlerts(data.alerts || []);
        setGeographicActivity(data.geographicActivity || []);
        setIsConnected(true);
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Error fetching real-time data:", error);
        setLiveActivities([]);
        setAlerts([]);
        setGeographicActivity([]);
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchRealTimeData();

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchRealTimeData, 30000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800";
      case "acknowledged":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            ></div>
            Real-time Monitoring
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Live monitoring of AI bot activity and system alerts
            {lastUpdate && (
              <span className="ml-2 text-xs text-gray-500">
                Last update: {formatTimeAgo(lastUpdate.toISOString())}
              </span>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Live Activity Feed */}
      {liveActivities.length > 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>
              Real-time bot activity and crawling events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {liveActivities.slice(0, 20).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-white/30"
                >
                  <div className="flex-shrink-0">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        {activity.bot_type}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {activity.action}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="truncate">{activity.website_url}</span>
                      <span className="mx-2">•</span>
                      <span>{activity.response_time}ms</span>
                      <span className="mx-2">•</span>
                      <span>{activity.confidence}% confidence</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Active Alerts
            </CardTitle>
            <CardDescription>
              System alerts and notifications requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 bg-white/50 rounded-lg border border-white/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {alert.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {alert.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <Badge className={getAlertStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(alert.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {alert.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>{alert.affected_platforms.join(", ")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Geographic Activity */}
      {geographicActivity.length > 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              Geographic Activity
            </CardTitle>
            <CardDescription>
              Bot activity by geographic location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {geographicActivity.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-white/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {location.country}
                      </div>
                      <div className="text-sm text-gray-600">
                        {location.region}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {location.visits}
                    </div>
                    <div className="text-xs text-gray-600">visits</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {location.platforms.length} platforms
                    </div>
                    <div className="text-xs text-gray-500">
                      Last: {formatTimeAgo(location.last_activity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {liveActivities.length === 0 &&
        alerts.length === 0 &&
        geographicActivity.length === 0 && (
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No Real-time Activity Detected
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Real-time monitoring will start showing live activity once AI
                bots begin visiting your website. The system will track bot
                visits, crawling patterns, and system alerts in real-time.
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
