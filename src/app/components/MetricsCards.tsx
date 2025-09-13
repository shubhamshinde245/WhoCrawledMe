'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MetricsData {
  totalVisits: number;
  uniqueBots: number;
  mostActiveBot: string;
  recentVisits: number;
  changePercent: number;
}

interface MetricsCardsProps {
  timeRange: string;
}

export default function MetricsCards({ timeRange }: MetricsCardsProps) {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?type=overview&timeRange=${timeRange}`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
    );
  }

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Failed to load metrics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">Total Bot Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{(metrics.totalVisits || 0).toLocaleString()}</div>
          <p className="text-xs text-blue-600 mt-1">
            Last {timeRange === '24h' ? '24 hours' : timeRange === '7d' ? '7 days' : '30 days'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Unique Bot Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{metrics.uniqueBots || 0}</div>
          <p className="text-xs text-green-600 mt-1">Different AI crawlers detected</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700">Most Active Bot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-purple-900 truncate">{metrics.mostActiveBot || 'N/A'}</div>
          <p className="text-xs text-purple-600 mt-1">Top crawler this period</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-700">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{metrics.recentVisits || 0}</div>
          <p className={`text-xs mt-1 flex items-center ${getChangeColor(metrics.changePercent || 0)}`}>
            <span className="mr-1">{getChangeIcon(metrics.changePercent || 0)}</span>
            {Math.abs(metrics.changePercent || 0)}% vs previous period
          </p>
        </CardContent>
      </Card>
    </div>
  );
}