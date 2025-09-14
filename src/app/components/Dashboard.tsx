'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BotVisit {
  id: string;
  created_at: string;
  bot_type: string;
  user_agent: string;
  ip_address: string;
  website_url: string;
  referer: string;
  bot_confidence: number;
  additional_data: Record<string, unknown>;
}

interface Stats {
  totalVisits: number;
  uniqueBots: number;
  topBot: string;
  recentVisits: number;
}

export default function Dashboard() {
  const [botVisits, setBotVisits] = useState<BotVisit[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalVisits: 0,
    uniqueBots: 0,
    topBot: 'N/A',
    recentVisits: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBotVisits = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bot_visits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setBotVisits(data || []);
      calculateStats(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBotVisits();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('bot_visits_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'bot_visits' },
        (payload) => {
          setBotVisits(prev => [payload.new as BotVisit, ...prev]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchBotVisits]);

  const calculateStats = (visits: BotVisit[]) => {
    const totalVisits = visits.length;
    const uniqueBots = new Set(visits.map(v => v.bot_type)).size;
    
    // Find most common bot
    const botCounts = visits.reduce((acc, visit) => {
      acc[visit.bot_type] = (acc[visit.bot_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topBot = Object.entries(botCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
    
    // Recent visits (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentVisits = visits.filter(v => 
      new Date(v.created_at) > oneDayAgo
    ).length;

    setStats({ totalVisits, uniqueBots, topBot, recentVisits });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getBotTypeColor = (botType: string) => {
    const colors = {
      'GPTBot': 'bg-green-100 text-green-800',
      'Claude-Web': 'bg-purple-100 text-purple-800',
      'PerplexityBot': 'bg-blue-100 text-blue-800',
      'Bingbot': 'bg-orange-100 text-orange-800',
      'Googlebot': 'bg-red-100 text-red-800',
      'Generic Bot': 'bg-gray-100 text-gray-800'
    };
    return colors[botType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-shimmer w-12 h-12 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modern-card-glass border-red-200/30 bg-red-50/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">!</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Enhanced Stats Cards with Better Mobile Design */}
      <div className="grid-responsive sm:grid-cols-2 xl:grid-cols-4">
        <div className="modern-card-glass group hover:scale-105 transition-all duration-300 card-mobile overflow-hidden">
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-responsive-base font-medium text-muted-foreground mb-1">Total Visits</p>
                <p className="text-2xl sm:text-3xl font-bold text-gradient">{stats.totalVisits}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">Live tracking</span>
                </div>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:rotate-3">
                <span className="text-white font-bold text-lg sm:text-xl">📊</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
          </div>
        </div>

        <div className="modern-card-glass group hover:scale-105 transition-all duration-300 card-mobile overflow-hidden">
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-responsive-base font-medium text-muted-foreground mb-1">Unique Bots</p>
                <p className="text-2xl sm:text-3xl font-bold text-gradient">{stats.uniqueBots}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">AI platforms</span>
                </div>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/25 transition-all duration-300 group-hover:rotate-3">
                <span className="text-white font-bold text-lg sm:text-xl">🤖</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
          </div>
        </div>

        <div className="modern-card-glass group hover:scale-105 transition-all duration-300 card-mobile overflow-hidden">
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-responsive-base font-medium text-muted-foreground mb-1">Most Active</p>
                <p className="text-lg sm:text-xl font-bold text-gradient truncate">{stats.topBot}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">Leading bot</span>
                </div>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:rotate-3">
                <span className="text-white font-bold text-lg sm:text-xl">⭐</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
          </div>
        </div>

        <div className="modern-card-glass group hover:scale-105 transition-all duration-300 card-mobile overflow-hidden">
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-responsive-base font-medium text-muted-foreground mb-1">Last 24h</p>
                <p className="text-2xl sm:text-3xl font-bold text-gradient">{stats.recentVisits}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">Recent activity</span>
                </div>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300 group-hover:rotate-3">
                <span className="text-white font-bold text-lg sm:text-xl">🕐</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
          </div>
        </div>
      </div>

      {/* Bot Visits Table */}
      <div className="modern-card-glass animate-fade-in">
        <div className="px-6 py-6 border-b border-border/50">
          <h3 className="text-xl font-bold text-gradient">Recent Bot Visits</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Latest AI bot detections across monitored websites
          </p>
        </div>
        
        {botVisits.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🔍</span>
            </div>
            <div className="text-muted-foreground">
              <p className="text-lg font-semibold">No bot visits detected yet</p>
              <p className="mt-2 text-sm">Start tracking by embedding the tracking script on your website</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {botVisits.map((visit, index) => (
              <div key={visit.id} className="px-6 py-4 hover:bg-muted/30 transition-colors group animate-slide-in" style={{animationDelay: `${index * 50}ms`}}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getBotTypeColor(visit.bot_type)} shadow-sm`}>
                      {visit.bot_type}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {visit.website_url || 'Unknown Website'}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-xs text-muted-foreground">
                          IP: <span className="font-mono">{visit.ip_address}</span>
                        </p>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <p className="text-xs text-muted-foreground">
                            Confidence: {(visit.bot_confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{formatDate(visit.created_at)}</p>
                  </div>
                </div>
                <div className="mt-3 pl-0">
                  <p className="text-xs text-muted-foreground font-mono truncate bg-muted/50 px-3 py-1 rounded">
                    {visit.user_agent}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tracking Instructions */}
      <div className="modern-card-glass border-blue-200/30 bg-gradient-to-br from-blue-50/80 to-indigo-50/80">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">🚀</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-800 mb-3">Start Tracking</h3>
            <p className="text-sm text-blue-700 mb-4">Add this tracking script to your website to start detecting AI bots:</p>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-blue-800 mb-2">JavaScript Method:</p>
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-blue-200/50 shadow-sm">
                  <code className="text-xs text-gray-800 font-mono leading-relaxed">
                    {`<script>
  fetch('${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: window.location.href })
  });
</script>`}
                  </code>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-blue-800 mb-2">Simple Pixel Method:</p>
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-blue-200/50 shadow-sm">
                  <code className="text-xs text-gray-800 font-mono leading-relaxed">
                    {`<img src="${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/track" width="1" height="1" style="display:none;" />`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}