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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Visits</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalVisits}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">U</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Unique Bots</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.uniqueBots}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Most Active</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.topBot}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">24h</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Last 24h</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.recentVisits}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bot Visits Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Bot Visits</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Latest AI bot detections across monitored websites
          </p>
        </div>
        
        {botVisits.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg font-medium">No bot visits detected yet</p>
              <p className="mt-2">Start tracking by embedding the tracking script on your website</p>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {botVisits.map((visit) => (
              <li key={visit.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBotTypeColor(visit.bot_type)}`}>
                        {visit.bot_type}
                      </span>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {visit.website_url || 'Unknown Website'}
                        </p>
                        <p className="text-sm text-gray-500">
                          IP: {visit.ip_address} • Confidence: {(visit.bot_confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{formatDate(visit.created_at)}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 truncate">
                      User Agent: {visit.user_agent}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tracking Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Start Tracking</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Add this tracking script to your website to start detecting AI bots:</p>
              <div className="mt-2 bg-white p-3 rounded border">
                <code className="text-xs text-gray-800">
                  {`<script>
  fetch('${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: window.location.href })
  });
</script>`}
                </code>
              </div>
              <p className="mt-2">Or use the simple pixel tracking method:</p>
              <div className="mt-2 bg-white p-3 rounded border">
                <code className="text-xs text-gray-800">
                  {`<img src="${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/track" width="1" height="1" style="display:none;" />`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}