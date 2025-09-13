import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    const type = searchParams.get('type') || 'overview';

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    switch (type) {
      case 'overview':
        return await getOverviewData(startDate);
      case 'visits-over-time':
        return await getVisitsOverTime(startDate, timeRange);
      case 'top-bots':
        return await getTopBots(startDate);
      case 'hourly-trends':
        return await getHourlyTrends(startDate);
      default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getOverviewData(startDate: Date) {
  try {
    // Total visits
    const { count: totalVisits } = await supabase
      .from('bot_visits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    // Unique bots
    const { data: uniqueBots } = await supabase
      .from('bot_visits')
      .select('bot_type')
      .gte('created_at', startDate.toISOString());

    const uniqueBotCount = new Set(uniqueBots?.map(v => v.bot_type)).size;

    // Most active bot
    const { data: botVisits } = await supabase
      .from('bot_visits')
      .select('bot_type')
      .gte('created_at', startDate.toISOString());

    // Count bot types manually
    const botCounts = botVisits?.reduce((acc: any, visit) => {
      acc[visit.bot_type] = (acc[visit.bot_type] || 0) + 1;
      return acc;
    }, {}) || {};

    // Find most active bot
    const mostActiveBot = Object.entries(botCounts)
      .sort(([,a]: any, [,b]: any) => b - a)[0]?.[0] || 'None';

    // Recent visits (last 24h vs previous 24h)
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const previous24h = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const { count: recentVisits } = await supabase
      .from('bot_visits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', last24h.toISOString());

    const { count: previousVisits } = await supabase
      .from('bot_visits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', previous24h.toISOString())
      .lt('created_at', last24h.toISOString());

    const changePercent = previousVisits ? 
      ((recentVisits || 0) - previousVisits) / previousVisits * 100 : 0;

    return NextResponse.json({
      totalVisits: totalVisits || 0,
      uniqueBots: uniqueBotCount,
      mostActiveBot: mostActiveBot || 'None',
      recentVisits: recentVisits || 0,
      changePercent: Math.round(changePercent * 100) / 100
    });
  } catch (error) {
    console.error('Overview data error:', error);
    return NextResponse.json({ error: 'Failed to fetch overview data' }, { status: 500 });
  }
}

async function getVisitsOverTime(startDate: Date, timeRange: string) {
  try {
    const { data: visits } = await supabase
      .from('bot_visits')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at');

    if (!visits) {
      return NextResponse.json({ data: [] });
    }

    // Group visits by time period
    const grouped = visits.reduce((acc: any, visit) => {
      let key: string;
      const date = new Date(visit.created_at);
      
      if (timeRange === '24h') {
        // Group by hour
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
      } else {
        // Group by day
        key = date.toISOString().split('T')[0];
      }
      
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(grouped)
      .map(([date, count]) => ({ date, visits: count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({ data: chartData });
  } catch (error) {
    console.error('Visits over time error:', error);
    return NextResponse.json({ error: 'Failed to fetch visits over time' }, { status: 500 });
  }
}

async function getTopBots(startDate: Date) {
  try {
    const { data, error } = await supabase
      .from('bot_visits')
      .select('bot_type')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    // Count bot types
    const botCounts = data?.reduce((acc: any, visit) => {
      acc[visit.bot_type] = (acc[visit.bot_type] || 0) + 1;
      return acc;
    }, {}) || {};

    // Convert to array and sort
    const topBots = Object.entries(botCounts)
      .map(([bot, count]) => ({ bot, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({ data: topBots });
  } catch (error) {
    console.error('Top bots error:', error);
    return NextResponse.json({ error: 'Failed to fetch top bots' }, { status: 500 });
  }
}

async function getHourlyTrends(startDate: Date) {
  try {
    const { data, error } = await supabase
      .from('bot_visits')
      .select('created_at')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    // Group by hour
    const hourlyData = data?.reduce((acc: any, visit) => {
      const hour = new Date(visit.created_at).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {}) || {};

    // Create array for all 24 hours
    const hourlyTrends = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      visits: hourlyData[hour] || 0
    }));

    return NextResponse.json({ data: hourlyTrends });
  } catch (error) {
    console.error('Hourly trends error:', error);
    return NextResponse.json({ error: 'Failed to fetch hourly trends' }, { status: 500 });
  }
}