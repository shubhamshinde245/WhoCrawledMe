'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/cards';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Target, TrendingUp, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ShareOfVoiceChartProps {
  timeRange: string;
}

interface ShareOfVoiceData {
  brand: string;
  mentions: number;
  share: number;
  change: number;
  color: string;
  isYourBrand?: boolean;
}

interface TrendData {
  date: string;
  yourShare: number;
  competitorShare: number;
}

export default function ShareOfVoiceChart({ timeRange }: ShareOfVoiceChartProps) {
  const [shareData, setShareData] = useState<ShareOfVoiceData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'pie' | 'trend'>('pie');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock data for now - replace with actual API call
        const mockShareData: ShareOfVoiceData[] = [
          { brand: 'Your Brand', mentions: 245, share: 28.5, change: 5.2, color: '#3b82f6', isYourBrand: true },
          { brand: 'Competitor A', mentions: 198, share: 23.1, change: -2.1, color: '#ef4444' },
          { brand: 'Competitor B', mentions: 156, share: 18.2, change: 1.8, color: '#f59e0b' },
          { brand: 'Competitor C', mentions: 134, share: 15.6, change: -0.9, color: '#10b981' },
          { brand: 'Others', mentions: 125, share: 14.6, change: -3.2, color: '#6b7280' },
        ];

        const mockTrendData: TrendData[] = [
          { date: '2024-01-01', yourShare: 25.2, competitorShare: 74.8 },
          { date: '2024-01-02', yourShare: 26.1, competitorShare: 73.9 },
          { date: '2024-01-03', yourShare: 24.8, competitorShare: 75.2 },
          { date: '2024-01-04', yourShare: 27.3, competitorShare: 72.7 },
          { date: '2024-01-05', yourShare: 28.1, competitorShare: 71.9 },
          { date: '2024-01-06', yourShare: 29.2, competitorShare: 70.8 },
          { date: '2024-01-07', yourShare: 28.5, competitorShare: 71.5 },
        ];
        
        setShareData(mockShareData);
        setTrendData(mockTrendData);
      } catch (error) {
        console.error('Error fetching share of voice data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const yourBrand = shareData.find(item => item.isYourBrand);
  const topCompetitor = shareData.filter(item => !item.isYourBrand).sort((a, b) => b.share - a.share)[0];

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { brand: string; mentions: number; share: number; change: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.brand}</p>
          <p className="text-sm text-gray-600">
            {data.mentions} mentions ({data.share}%)
          </p>
          <p className={`text-sm font-medium ${
            data.change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.change >= 0 ? '+' : ''}{data.change}% vs last period
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Share of Voice Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-green-600" />
          Share of Voice Analysis
        </CardTitle>
        <CardDescription>
          Your brands competitive position in AI platform mentions
        </CardDescription>
        
        {/* View Mode Selector */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setViewMode('pie')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              viewMode === 'pie'
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Market Share
          </button>
          <button
            onClick={() => setViewMode('trend')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              viewMode === 'trend'
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Trend Analysis
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Your Share</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {yourBrand?.share.toFixed(1)}%
            </div>
            <div className={`text-sm font-medium ${
              (yourBrand?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {(yourBrand?.change || 0) >= 0 ? '+' : ''}{yourBrand?.change.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Top Competitor</span>
            </div>
            <div className="text-2xl font-bold text-red-900">
              {topCompetitor?.share.toFixed(1)}%
            </div>
            <div className="text-xs text-red-700">
              {topCompetitor?.brand}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          {viewMode === 'pie' ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="share"
                >
                  {shareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)}%`, 
                    name === 'yourShare' ? 'Your Share' : 'Competitors'
                  ]}
                />
                <Bar dataKey="yourShare" fill="#3b82f6" name="yourShare" />
                <Bar dataKey="competitorShare" fill="#ef4444" name="competitorShare" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Brand Rankings */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Brand Rankings</h4>
          <div className="space-y-2">
            {shareData.map((brand, index) => (
              <div key={brand.brand} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-gray-500">#{index + 1}</div>
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: brand.color }}
                  ></div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${
                      brand.isYourBrand ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {brand.brand}
                    </span>
                    {brand.isYourBrand && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        You
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {brand.mentions} mentions
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {brand.share.toFixed(1)}%
                  </span>
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    brand.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${
                      brand.change < 0 ? 'rotate-180' : ''
                    }`} />
                    {Math.abs(brand.change).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}