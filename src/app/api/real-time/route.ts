import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'activity';
    const limit = parseInt(searchParams.get('limit') || '50');
    const platform = searchParams.get('platform');

    switch (type) {
      case 'activity':
        return await getLiveActivity(limit, platform);
      case 'metrics':
        return await getRealTimeMetrics();
      case 'alerts':
        return await getActiveAlerts();
      case 'geographic':
        return await getGeographicActivity();
      case 'platforms':
        return await getPlatformActivity(platform);
      case 'trends':
        return await getLiveTrends();
      case 'performance':
        return await getPerformanceMetrics();
      case 'security':
        return await getSecurityEvents();
      default:
        return NextResponse.json({ error: 'Invalid real-time monitoring type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Real-time Monitoring API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getLiveActivity(limit: number, platform?: string | null) {
  try {
    // Simulate real-time activity data
    const activities = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        type: 'crawl',
        platform: 'ChatGPT',
        action: 'Content Analysis',
        url: '/blog/ai-platform-comparison',
        userAgent: 'ChatGPT-User/1.0',
        ipAddress: '192.168.1.100',
        location: 'San Francisco, CA',
        status: 'completed',
        duration: 2.3,
        dataExtracted: 1247,
        confidence: 94.2
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        type: 'crawl',
        platform: 'Claude',
        action: 'Content Indexing',
        url: '/guides/remote-work-best-practices',
        userAgent: 'Claude-Bot/2.1',
        ipAddress: '10.0.0.45',
        location: 'New York, NY',
        status: 'in_progress',
        duration: 1.8,
        dataExtracted: 892,
        confidence: 89.7
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        type: 'crawl',
        platform: 'Gemini',
        action: 'Data Mining',
        url: '/articles/sustainable-technology',
        userAgent: 'Gemini-Crawler/1.5',
        ipAddress: '172.16.0.23',
        location: 'London, UK',
        status: 'completed',
        duration: 3.1,
        dataExtracted: 1567,
        confidence: 91.8
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 90000).toISOString(),
        type: 'alert',
        platform: 'Perplexity',
        action: 'Unusual Activity Detected',
        url: '/api/data',
        userAgent: 'Perplexity-Bot/1.0',
        ipAddress: '203.0.113.15',
        location: 'Tokyo, Japan',
        status: 'flagged',
        duration: 0.5,
        dataExtracted: 0,
        confidence: 76.3
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        type: 'crawl',
        platform: 'You.com',
        action: 'Content Analysis',
        url: '/tutorials/machine-learning',
        userAgent: 'YouBot/1.2',
        ipAddress: '198.51.100.42',
        location: 'Berlin, Germany',
        status: 'completed',
        duration: 2.7,
        dataExtracted: 1123,
        confidence: 87.4
      },
      {
        id: '6',
        timestamp: new Date(Date.now() - 150000).toISOString(),
        type: 'crawl',
        platform: 'Copilot',
        action: 'Code Analysis',
        url: '/docs/api-reference',
        userAgent: 'GitHub-Copilot/1.0',
        ipAddress: '192.0.2.78',
        location: 'Seattle, WA',
        status: 'completed',
        duration: 1.9,
        dataExtracted: 756,
        confidence: 92.1
      },
      {
        id: '7',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        type: 'crawl',
        platform: 'Jasper',
        action: 'Content Mining',
        url: '/blog/content-optimization',
        userAgent: 'Jasper-AI/2.0',
        ipAddress: '203.0.113.89',
        location: 'Sydney, Australia',
        status: 'completed',
        duration: 2.1,
        dataExtracted: 934,
        confidence: 88.6
      },
      {
        id: '8',
        timestamp: new Date(Date.now() - 210000).toISOString(),
        type: 'security',
        platform: 'Unknown',
        action: 'Suspicious Access Attempt',
        url: '/admin/dashboard',
        userAgent: 'Mozilla/5.0 (Suspicious)',
        ipAddress: '198.51.100.123',
        location: 'Unknown',
        status: 'blocked',
        duration: 0.1,
        dataExtracted: 0,
        confidence: 95.7
      }
    ];

    // Filter by platform if specified
    const filteredActivities = platform 
      ? activities.filter(a => a.platform.toLowerCase() === platform.toLowerCase())
      : activities;

    // Limit results
    const limitedActivities = filteredActivities.slice(0, limit);

    return NextResponse.json({ 
      data: limitedActivities,
      total: filteredActivities.length,
      lastUpdate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Live activity error:', error);
    return NextResponse.json({ error: 'Failed to fetch live activity' }, { status: 500 });
  }
}

async function getRealTimeMetrics() {
  try {
    const metrics = {
      current: {
        activeCrawlers: 12,
        requestsPerMinute: 234,
        dataProcessed: 15.7, // MB
        avgResponseTime: 1.8,
        successRate: 94.2,
        alertsActive: 3
      },
      trends: {
        last5Minutes: [
          { timestamp: new Date(Date.now() - 300000).toISOString(), requests: 198, crawlers: 8 },
          { timestamp: new Date(Date.now() - 240000).toISOString(), requests: 215, crawlers: 10 },
          { timestamp: new Date(Date.now() - 180000).toISOString(), requests: 243, crawlers: 11 },
          { timestamp: new Date(Date.now() - 120000).toISOString(), requests: 267, crawlers: 13 },
          { timestamp: new Date(Date.now() - 60000).toISOString(), requests: 234, crawlers: 12 }
        ]
      },
      platforms: {
        active: [
          { name: 'ChatGPT', requests: 89, status: 'active', lastSeen: new Date().toISOString() },
          { name: 'Claude', requests: 67, status: 'active', lastSeen: new Date(Date.now() - 30000).toISOString() },
          { name: 'Gemini', requests: 45, status: 'active', lastSeen: new Date(Date.now() - 45000).toISOString() },
          { name: 'Perplexity', requests: 23, status: 'idle', lastSeen: new Date(Date.now() - 120000).toISOString() },
          { name: 'Copilot', requests: 10, status: 'active', lastSeen: new Date(Date.now() - 15000).toISOString() }
        ]
      },
      performance: {
        cpuUsage: 67.3,
        memoryUsage: 78.9,
        diskUsage: 45.2,
        networkThroughput: 125.7, // Mbps
        errorRate: 2.1
      },
      geographic: {
        topRegions: [
          { region: 'North America', requests: 145, percentage: 62.0 },
          { region: 'Europe', requests: 56, percentage: 23.9 },
          { region: 'Asia Pacific', requests: 23, percentage: 9.8 },
          { region: 'Other', requests: 10, percentage: 4.3 }
        ]
      }
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Real-time metrics error:', error);
    return NextResponse.json({ error: 'Failed to fetch real-time metrics' }, { status: 500 });
  }
}

async function getActiveAlerts() {
  try {
    const alerts = [
      {
        id: '1',
        type: 'security',
        severity: 'high',
        title: 'Suspicious Activity Detected',
        description: 'Multiple failed access attempts from IP 198.51.100.123',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'active',
        platform: 'Unknown',
        location: 'Unknown',
        actions: ['Block IP', 'Investigate', 'Notify Admin'],
        metadata: {
          ipAddress: '198.51.100.123',
          attempts: 15,
          timeWindow: '5 minutes'
        }
      },
      {
        id: '2',
        type: 'performance',
        severity: 'medium',
        title: 'High Response Time',
        description: 'Average response time exceeded 3 seconds for ChatGPT requests',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        status: 'investigating',
        platform: 'ChatGPT',
        location: 'Global',
        actions: ['Check Server Load', 'Optimize Queries', 'Scale Resources'],
        metadata: {
          avgResponseTime: 3.2,
          threshold: 2.5,
          affectedRequests: 45
        }
      },
      {
        id: '3',
        type: 'anomaly',
        severity: 'low',
        title: 'Unusual Traffic Pattern',
        description: 'Perplexity showing 300% increase in crawling activity',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        status: 'monitoring',
        platform: 'Perplexity',
        location: 'Multiple',
        actions: ['Monitor Trends', 'Analyze Pattern', 'Update Baselines'],
        metadata: {
          normalVolume: 15,
          currentVolume: 45,
          increasePercentage: 300
        }
      }
    ];

    return NextResponse.json({ data: alerts });
  } catch (error) {
    console.error('Active alerts error:', error);
    return NextResponse.json({ error: 'Failed to fetch active alerts' }, { status: 500 });
  }
}

async function getGeographicActivity() {
  try {
    const geographic = {
      global: {
        totalRequests: 1247,
        uniqueLocations: 45,
        topCountries: [
          { country: 'United States', requests: 456, percentage: 36.6, platforms: ['ChatGPT', 'Claude', 'Copilot'] },
          { country: 'United Kingdom', requests: 234, percentage: 18.8, platforms: ['Gemini', 'Perplexity'] },
          { country: 'Germany', requests: 189, percentage: 15.2, platforms: ['Claude', 'You.com'] },
          { country: 'Japan', requests: 156, percentage: 12.5, platforms: ['Gemini', 'ChatGPT'] },
          { country: 'Canada', requests: 123, percentage: 9.9, platforms: ['ChatGPT', 'Copilot'] },
          { country: 'Australia', requests: 89, percentage: 7.1, platforms: ['Jasper', 'Claude'] }
        ]
      },
      realTime: {
        activeRegions: [
          {
            region: 'North America',
            coordinates: [39.8283, -98.5795],
            requests: 145,
            activePlatforms: 8,
            status: 'high_activity'
          },
          {
            region: 'Europe',
            coordinates: [54.5260, 15.2551],
            requests: 89,
            activePlatforms: 6,
            status: 'normal'
          },
          {
            region: 'Asia Pacific',
            coordinates: [34.0479, 100.6197],
            requests: 67,
            activePlatforms: 5,
            status: 'normal'
          }
        ]
      },
      heatmap: {
        data: [
          { lat: 37.7749, lng: -122.4194, intensity: 0.8, city: 'San Francisco' },
          { lat: 40.7128, lng: -74.0060, intensity: 0.9, city: 'New York' },
          { lat: 51.5074, lng: -0.1278, intensity: 0.7, city: 'London' },
          { lat: 52.5200, lng: 13.4050, intensity: 0.6, city: 'Berlin' },
          { lat: 35.6762, lng: 139.6503, intensity: 0.5, city: 'Tokyo' },
          { lat: 43.6532, lng: -79.3832, intensity: 0.4, city: 'Toronto' },
          { lat: -33.8688, lng: 151.2093, intensity: 0.3, city: 'Sydney' }
        ]
      }
    };

    return NextResponse.json(geographic);
  } catch (error) {
    console.error('Geographic activity error:', error);
    return NextResponse.json({ error: 'Failed to fetch geographic activity' }, { status: 500 });
  }
}

async function getPlatformActivity(platform?: string | null) {
  try {
    const platformData = {
      overview: {
        totalPlatforms: 25,
        activePlatforms: 12,
        totalRequests: 1247,
        avgRequestsPerPlatform: 49.9
      },
      platforms: [
        {
          name: 'ChatGPT',
          status: 'active',
          requests: 234,
          lastActivity: new Date().toISOString(),
          avgResponseTime: 1.8,
          successRate: 96.2,
          dataExtracted: 3.2, // MB
          trend: 'increasing'
        },
        {
          name: 'Claude',
          status: 'active',
          requests: 189,
          lastActivity: new Date(Date.now() - 30000).toISOString(),
          avgResponseTime: 2.1,
          successRate: 94.7,
          dataExtracted: 2.8,
          trend: 'stable'
        },
        {
          name: 'Gemini',
          status: 'active',
          requests: 156,
          lastActivity: new Date(Date.now() - 45000).toISOString(),
          avgResponseTime: 1.9,
          successRate: 92.3,
          dataExtracted: 2.1,
          trend: 'increasing'
        },
        {
          name: 'Perplexity',
          status: 'idle',
          requests: 123,
          lastActivity: new Date(Date.now() - 120000).toISOString(),
          avgResponseTime: 2.3,
          successRate: 89.1,
          dataExtracted: 1.9,
          trend: 'decreasing'
        },
        {
          name: 'Copilot',
          status: 'active',
          requests: 98,
          lastActivity: new Date(Date.now() - 15000).toISOString(),
          avgResponseTime: 1.6,
          successRate: 97.8,
          dataExtracted: 1.5,
          trend: 'stable'
        }
      ]
    };

    // Filter by specific platform if requested
    if (platform) {
      const specificPlatform = platformData.platforms.find(
        p => p.name.toLowerCase() === platform.toLowerCase()
      );
      if (specificPlatform) {
        return NextResponse.json({ platform: specificPlatform });
      } else {
        return NextResponse.json({ error: 'Platform not found' }, { status: 404 });
      }
    }

    return NextResponse.json(platformData);
  } catch (error) {
    console.error('Platform activity error:', error);
    return NextResponse.json({ error: 'Failed to fetch platform activity' }, { status: 500 });
  }
}

async function getLiveTrends() {
  try {
    const trends = {
      trending: [
        {
          topic: 'AI Platform Comparison',
          mentions: 89,
          growth: 156.7,
          platforms: ['ChatGPT', 'Claude', 'Gemini'],
          timeframe: 'last_hour'
        },
        {
          topic: 'Remote Work Tools',
          mentions: 67,
          growth: 134.2,
          platforms: ['ChatGPT', 'Perplexity'],
          timeframe: 'last_hour'
        },
        {
          topic: 'Sustainable Technology',
          mentions: 45,
          growth: 98.5,
          platforms: ['Gemini', 'Claude'],
          timeframe: 'last_hour'
        }
      ],
      emerging: [
        {
          topic: 'Quantum Computing Applications',
          mentions: 23,
          growth: 234.5,
          confidence: 78.2
        },
        {
          topic: 'Green Energy Solutions',
          mentions: 18,
          growth: 189.3,
          confidence: 82.1
        }
      ],
      declining: [
        {
          topic: 'Cryptocurrency Trading',
          mentions: 12,
          decline: -45.2,
          platforms: ['You.com', 'Perplexity']
        }
      ]
    };

    return NextResponse.json(trends);
  } catch (error) {
    console.error('Live trends error:', error);
    return NextResponse.json({ error: 'Failed to fetch live trends' }, { status: 500 });
  }
}

async function getPerformanceMetrics() {
  try {
    const performance = {
      system: {
        uptime: '99.97%',
        responseTime: 1.8,
        throughput: 234.5, // requests/minute
        errorRate: 0.03,
        availability: 99.97
      },
      database: {
        connectionPool: 85,
        queryTime: 0.45,
        cacheHitRate: 94.2,
        activeConnections: 23
      },
      api: {
        totalRequests: 15420,
        successfulRequests: 15375,
        failedRequests: 45,
        avgLatency: 125.7,
        p95Latency: 234.5,
        p99Latency: 456.2
      },
      resources: {
        cpu: 67.3,
        memory: 78.9,
        disk: 45.2,
        network: 125.7
      }
    };

    return NextResponse.json(performance);
  } catch (error) {
    console.error('Performance metrics error:', error);
    return NextResponse.json({ error: 'Failed to fetch performance metrics' }, { status: 500 });
  }
}

async function getSecurityEvents() {
  try {
    const security = {
      overview: {
        totalEvents: 45,
        criticalEvents: 2,
        blockedRequests: 23,
        suspiciousActivity: 8
      },
      events: [
        {
          id: '1',
          type: 'blocked_request',
          severity: 'high',
          timestamp: new Date().toISOString(),
          source: '198.51.100.123',
          description: 'Multiple failed authentication attempts',
          action: 'IP blocked for 24 hours',
          platform: 'Unknown'
        },
        {
          id: '2',
          type: 'rate_limit_exceeded',
          severity: 'medium',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          source: '203.0.113.45',
          description: 'Request rate exceeded 100/minute threshold',
          action: 'Temporary rate limiting applied',
          platform: 'ChatGPT'
        },
        {
          id: '3',
          type: 'suspicious_pattern',
          severity: 'low',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          source: '192.0.2.78',
          description: 'Unusual crawling pattern detected',
          action: 'Monitoring increased',
          platform: 'Perplexity'
        }
      ],
      threats: {
        blocked: 23,
        mitigated: 12,
        investigating: 3,
        resolved: 7
      }
    };

    return NextResponse.json(security);
  } catch (error) {
    console.error('Security events error:', error);
    return NextResponse.json({ error: 'Failed to fetch security events' }, { status: 500 });
  }
}