import { NextRequest, NextResponse } from 'next/server';

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
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    switch (type) {
      case 'overview':
        return await getAIPlatformOverview();
      case 'platforms':
        return await getAllPlatforms();
      case 'activity':
        return await getPlatformActivity();
      case 'detection':
        return await getDetectionMetrics(startDate);
      case 'trends':
        return await getPlatformTrends();
      case 'engagement':
        return await getEngagementMetrics(startDate);
      case 'comparison':
        return await getPlatformComparison();
      default:
        return NextResponse.json({ error: 'Invalid AI platform type' }, { status: 400 });
    }
  } catch (error) {
    console.error('AI Platform API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getAIPlatformOverview() {
  try {
    const overview = {
      totalPlatforms: 25,
      activePlatforms: 23,
      totalVisits: 45620,
      detectionAccuracy: 94.7,
      topPlatforms: [
        {
          name: 'ChatGPT',
          visits: 15420,
          change: 12.5,
          accuracy: 96.2,
          status: 'active'
        },
        {
          name: 'Claude',
          visits: 8930,
          change: 8.7,
          accuracy: 94.8,
          status: 'active'
        },
        {
          name: 'Gemini',
          visits: 6780,
          change: -2.1,
          accuracy: 93.5,
          status: 'active'
        },
        {
          name: 'Perplexity',
          visits: 4560,
          change: 22.3,
          accuracy: 91.7,
          status: 'active'
        },
        {
          name: 'Copilot',
          visits: 3890,
          change: 5.4,
          accuracy: 89.2,
          status: 'active'
        }
      ],
      metrics: {
        avgSessionDuration: 4.2,
        bounceRate: 23.5,
        conversionRate: 12.8,
        userSatisfaction: 4.3
      }
    };

    return NextResponse.json(overview);
  } catch (error) {
    console.error('AI platform overview error:', error);
    return NextResponse.json({ error: 'Failed to fetch AI platform overview' }, { status: 500 });
  }
}

async function getAllPlatforms() {
  try {
    const platforms = [
      {
        id: 'chatgpt',
        name: 'ChatGPT',
        provider: 'OpenAI',
        category: 'Conversational AI',
        visits: 15420,
        mentions: 8930,
        engagement: 4.5,
        detectionConfidence: 96.2,
        lastSeen: new Date().toISOString(),
        status: 'active',
        userAgent: 'ChatGPT-User',
        crawlPattern: 'Systematic'
      },
      {
        id: 'claude',
        name: 'Claude',
        provider: 'Anthropic',
        category: 'Conversational AI',
        visits: 8930,
        mentions: 5420,
        engagement: 4.3,
        detectionConfidence: 94.8,
        lastSeen: new Date(Date.now() - 300000).toISOString(),
        status: 'active',
        userAgent: 'Claude-Web',
        crawlPattern: 'Selective'
      },
      {
        id: 'gemini',
        name: 'Gemini',
        provider: 'Google',
        category: 'Multimodal AI',
        visits: 6780,
        mentions: 4210,
        engagement: 4.1,
        detectionConfidence: 93.5,
        lastSeen: new Date(Date.now() - 600000).toISOString(),
        status: 'active',
        userAgent: 'Google-Extended',
        crawlPattern: 'Comprehensive'
      },
      {
        id: 'perplexity',
        name: 'Perplexity',
        provider: 'Perplexity AI',
        category: 'Search AI',
        visits: 4560,
        mentions: 2890,
        engagement: 3.9,
        detectionConfidence: 91.7,
        lastSeen: new Date(Date.now() - 900000).toISOString(),
        status: 'active',
        userAgent: 'PerplexityBot',
        crawlPattern: 'Targeted'
      },
      {
        id: 'copilot',
        name: 'GitHub Copilot',
        provider: 'Microsoft',
        category: 'Code AI',
        visits: 3890,
        mentions: 2340,
        engagement: 4.2,
        detectionConfidence: 89.2,
        lastSeen: new Date(Date.now() - 1200000).toISOString(),
        status: 'active',
        userAgent: 'GitHub-Copilot',
        crawlPattern: 'Code-focused'
      },
      {
        id: 'bard',
        name: 'Bard (Legacy)',
        provider: 'Google',
        category: 'Conversational AI',
        visits: 2100,
        mentions: 1560,
        engagement: 3.7,
        detectionConfidence: 87.3,
        lastSeen: new Date(Date.now() - 86400000).toISOString(),
        status: 'inactive',
        userAgent: 'Google-Bard',
        crawlPattern: 'Legacy'
      },
      {
        id: 'you-chat',
        name: 'You.com',
        provider: 'You.com',
        category: 'Search AI',
        visits: 1890,
        mentions: 1230,
        engagement: 3.5,
        detectionConfidence: 85.1,
        lastSeen: new Date(Date.now() - 1800000).toISOString(),
        status: 'active',
        userAgent: 'YouBot',
        crawlPattern: 'Search-oriented'
      },
      {
        id: 'character-ai',
        name: 'Character.AI',
        provider: 'Character Technologies',
        category: 'Character AI',
        visits: 1670,
        mentions: 980,
        engagement: 4.0,
        detectionConfidence: 82.7,
        lastSeen: new Date(Date.now() - 2400000).toISOString(),
        status: 'active',
        userAgent: 'Character-AI',
        crawlPattern: 'Character-based'
      },
      {
        id: 'jasper',
        name: 'Jasper AI',
        provider: 'Jasper',
        category: 'Content AI',
        visits: 1450,
        mentions: 890,
        engagement: 3.8,
        detectionConfidence: 79.4,
        lastSeen: new Date(Date.now() - 3600000).toISOString(),
        status: 'active',
        userAgent: 'JasperBot',
        crawlPattern: 'Content-focused'
      },
      {
        id: 'writesonic',
        name: 'Writesonic',
        provider: 'Writesonic',
        category: 'Writing AI',
        visits: 1230,
        mentions: 670,
        engagement: 3.6,
        detectionConfidence: 76.8,
        lastSeen: new Date(Date.now() - 4800000).toISOString(),
        status: 'active',
        userAgent: 'WritesonicBot',
        crawlPattern: 'Writing-focused'
      }
    ];

    return NextResponse.json({ data: platforms });
  } catch (error) {
    console.error('All platforms error:', error);
    return NextResponse.json({ error: 'Failed to fetch all platforms' }, { status: 500 });
  }
}

async function getPlatformActivity() {
  try {
    const activityData = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(Date.now() - (23 - i) * 60 * 60 * 1000);
      return {
        timestamp: hour.toISOString(),
        visits: Math.floor(50 + Math.random() * 200),
        mentions: Math.floor(20 + Math.random() * 80),
        engagement: 3 + Math.random() * 2,
        detectionConfidence: 85 + Math.random() * 15
      };
    });

    return NextResponse.json({ data: activityData });
  } catch (error) {
    console.error('Platform activity error:', error);
    return NextResponse.json({ error: 'Failed to fetch platform activity' }, { status: 500 });
  }
}

async function getDetectionMetrics(startDate: Date) {
  try {
    const detectionMetrics = {
      overall: {
        accuracy: 94.7,
        precision: 92.3,
        recall: 96.8,
        f1Score: 94.5
      },
      byPlatform: [
        { platform: 'ChatGPT', accuracy: 96.2, confidence: 98.5 },
        { platform: 'Claude', accuracy: 94.8, confidence: 96.1 },
        { platform: 'Gemini', accuracy: 93.5, confidence: 94.7 },
        { platform: 'Perplexity', accuracy: 91.7, confidence: 93.2 },
        { platform: 'Copilot', accuracy: 89.2, confidence: 91.8 }
      ],
      trends: Array.from({ length: 30 }, (_, i) => {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        return {
          date: date.toISOString().split('T')[0],
          accuracy: 90 + Math.random() * 10,
          falsePositives: Math.floor(Math.random() * 20),
          falseNegatives: Math.floor(Math.random() * 15)
        };
      })
    };

    return NextResponse.json(detectionMetrics);
  } catch (error) {
    console.error('Detection metrics error:', error);
    return NextResponse.json({ error: 'Failed to fetch detection metrics' }, { status: 500 });
  }
}

async function getPlatformTrends() {
  try {
    const trends = {
      emerging: [
        {
          platform: 'Claude 3.5 Sonnet',
          growth: 156.7,
          visits: 2340,
          category: 'Conversational AI'
        },
        {
          platform: 'GPT-4 Turbo',
          growth: 134.2,
          visits: 1890,
          category: 'Language Model'
        },
        {
          platform: 'Gemini Ultra',
          growth: 98.5,
          visits: 1560,
          category: 'Multimodal AI'
        }
      ],
      declining: [
        {
          platform: 'GPT-3.5',
          decline: -23.4,
          visits: 890,
          category: 'Language Model'
        },
        {
          platform: 'Bard',
          decline: -67.8,
          visits: 340,
          category: 'Conversational AI'
        }
      ],
      seasonal: [
        {
          pattern: 'Business Hours Peak',
          platforms: ['ChatGPT', 'Claude', 'Copilot'],
          peakHours: [9, 10, 11, 14, 15, 16]
        },
        {
          pattern: 'Weekend Dip',
          platforms: ['All'],
          reduction: 35.2
        }
      ]
    };

    return NextResponse.json(trends);
  } catch (error) {
    console.error('Platform trends error:', error);
    return NextResponse.json({ error: 'Failed to fetch platform trends' }, { status: 500 });
  }
}

async function getEngagementMetrics(startDate: Date) {
  try {
    const engagement = {
      overall: {
        avgEngagement: 4.2,
        totalInteractions: 156420,
        avgSessionDuration: 4.7,
        returnRate: 68.5
      },
      byPlatform: [
        {
          platform: 'ChatGPT',
          engagement: 4.5,
          interactions: 45620,
          sessionDuration: 5.2,
          returnRate: 72.3
        },
        {
          platform: 'Claude',
          engagement: 4.3,
          interactions: 28930,
          sessionDuration: 4.8,
          returnRate: 69.7
        },
        {
          platform: 'Gemini',
          engagement: 4.1,
          interactions: 22780,
          sessionDuration: 4.3,
          returnRate: 65.2
        }
      ],
      trends: Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        return {
          date: date.toISOString().split('T')[0],
          engagement: 3.8 + Math.random() * 1.0,
          interactions: Math.floor(15000 + Math.random() * 10000),
          satisfaction: 4.0 + Math.random() * 0.8
        };
      })
    };

    return NextResponse.json(engagement);
  } catch (error) {
    console.error('Engagement metrics error:', error);
    return NextResponse.json({ error: 'Failed to fetch engagement metrics' }, { status: 500 });
  }
}

async function getPlatformComparison() {
  try {
    const comparison = {
      metrics: ['Visits', 'Engagement', 'Detection Accuracy', 'Growth Rate'],
      platforms: [
        {
          name: 'ChatGPT',
          values: [15420, 4.5, 96.2, 12.5],
          color: '#10B981'
        },
        {
          name: 'Claude',
          values: [8930, 4.3, 94.8, 8.7],
          color: '#3B82F6'
        },
        {
          name: 'Gemini',
          values: [6780, 4.1, 93.5, -2.1],
          color: '#8B5CF6'
        },
        {
          name: 'Perplexity',
          values: [4560, 3.9, 91.7, 22.3],
          color: '#F59E0B'
        },
        {
          name: 'Copilot',
          values: [3890, 4.2, 89.2, 5.4],
          color: '#EF4444'
        }
      ]
    };

    return NextResponse.json(comparison);
  } catch (error) {
    console.error('Platform comparison error:', error);
    return NextResponse.json({ error: 'Failed to fetch platform comparison' }, { status: 500 });
  }
}