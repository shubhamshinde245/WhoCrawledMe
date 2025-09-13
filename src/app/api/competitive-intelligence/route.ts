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
    const competitor = searchParams.get('competitor');

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
        return await getCompetitiveOverview(startDate);
      case 'benchmarks':
        return await getCompetitiveBenchmarks(startDate);
      case 'market-share':
        return await getMarketShare(startDate);
      case 'platform-comparison':
        return await getPlatformComparison(startDate);
      case 'swot':
        return await getSWOTAnalysis(competitor);
      case 'gaps':
        return await getCompetitiveGaps(startDate);
      case 'positioning':
        return await getCompetitivePositioning(startDate);
      default:
        return NextResponse.json({ error: 'Invalid competitive intelligence type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Competitive Intelligence API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getCompetitiveOverview(startDate: Date) {
  try {
    const overview = {
      marketPosition: 2,
      totalCompetitors: 12,
      marketShare: 23.8,
      competitiveStrength: 87.5,
      threatLevel: 'Medium',
      opportunities: 8,
      topCompetitors: [
        {
          name: 'Competitor A',
          marketShare: 28.5,
          strength: 92.1,
          change: 5.2,
          threat: 'High'
        },
        {
          name: 'Competitor B',
          marketShare: 19.3,
          strength: 84.7,
          change: -2.1,
          threat: 'Medium'
        },
        {
          name: 'Competitor C',
          marketShare: 15.8,
          strength: 78.9,
          change: 8.7,
          threat: 'Medium'
        }
      ],
      keyMetrics: {
        visibilityGap: -4.2,
        featureGap: 2.1,
        pricingAdvantage: 12.5,
        customerSatisfaction: 4.3
      }
    };

    return NextResponse.json(overview);
  } catch (error) {
    console.error('Competitive overview error:', error);
    return NextResponse.json({ error: 'Failed to fetch competitive overview' }, { status: 500 });
  }
}

async function getCompetitiveBenchmarks(startDate: Date) {
  try {
    const benchmarks = {
      categories: [
        {
          name: 'AI Platform Coverage',
          yourScore: 87.5,
          industryAverage: 72.3,
          topCompetitor: 92.1,
          benchmark: 'Above Average'
        },
        {
          name: 'Real-time Monitoring',
          yourScore: 94.2,
          industryAverage: 68.7,
          topCompetitor: 89.5,
          benchmark: 'Industry Leader'
        },
        {
          name: 'Analytics Depth',
          yourScore: 82.1,
          industryAverage: 75.4,
          topCompetitor: 95.3,
          benchmark: 'Above Average'
        },
        {
          name: 'User Experience',
          yourScore: 89.7,
          industryAverage: 71.2,
          topCompetitor: 88.9,
          benchmark: 'Industry Leader'
        },
        {
          name: 'Pricing Competitiveness',
          yourScore: 91.5,
          industryAverage: 78.6,
          topCompetitor: 85.2,
          benchmark: 'Industry Leader'
        }
      ],
      trends: Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return {
          month: date.toISOString().slice(0, 7),
          yourScore: 80 + Math.random() * 15,
          industryAverage: 70 + Math.random() * 10,
          topCompetitor: 85 + Math.random() * 10
        };
      })
    };

    return NextResponse.json(benchmarks);
  } catch (error) {
    console.error('Competitive benchmarks error:', error);
    return NextResponse.json({ error: 'Failed to fetch competitive benchmarks' }, { status: 500 });
  }
}

async function getMarketShare(startDate: Date) {
  try {
    const marketShare = {
      total: {
        yourShare: 23.8,
        change: 2.1,
        rank: 2
      },
      bySegment: [
        {
          segment: 'Enterprise',
          yourShare: 31.2,
          change: 4.5,
          competitors: [
            { name: 'Competitor A', share: 35.8 },
            { name: 'Competitor B', share: 18.7 },
            { name: 'Competitor C', share: 14.3 }
          ]
        },
        {
          segment: 'SMB',
          yourShare: 19.4,
          change: -1.2,
          competitors: [
            { name: 'Competitor A', share: 28.9 },
            { name: 'Competitor B', share: 22.1 },
            { name: 'Competitor C', share: 16.8 }
          ]
        },
        {
          segment: 'Startup',
          yourShare: 41.7,
          change: 8.3,
          competitors: [
            { name: 'Competitor A', share: 25.4 },
            { name: 'Competitor B', share: 18.2 },
            { name: 'Competitor C', share: 14.7 }
          ]
        }
      ],
      trends: Array.from({ length: 24 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (23 - i));
        return {
          month: date.toISOString().slice(0, 7),
          yourShare: 20 + Math.random() * 8,
          competitorA: 25 + Math.random() * 10,
          competitorB: 15 + Math.random() * 8,
          competitorC: 12 + Math.random() * 6
        };
      })
    };

    return NextResponse.json(marketShare);
  } catch (error) {
    console.error('Market share error:', error);
    return NextResponse.json({ error: 'Failed to fetch market share data' }, { status: 500 });
  }
}

async function getPlatformComparison(startDate: Date) {
  try {
    const comparison = {
      platforms: [
        {
          name: 'Your Platform',
          features: {
            aiPlatforms: 25,
            realTimeMonitoring: true,
            competitiveIntel: true,
            brandAnalytics: true,
            queryDiscovery: true,
            contentOptimization: true
          },
          metrics: {
            accuracy: 94.2,
            speed: 89.7,
            coverage: 87.5,
            usability: 91.3
          },
          pricing: {
            starter: 49,
            professional: 149,
            enterprise: 499
          }
        },
        {
          name: 'Competitor A',
          features: {
            aiPlatforms: 18,
            realTimeMonitoring: true,
            competitiveIntel: false,
            brandAnalytics: true,
            queryDiscovery: false,
            contentOptimization: true
          },
          metrics: {
            accuracy: 91.8,
            speed: 85.2,
            coverage: 82.1,
            usability: 88.9
          },
          pricing: {
            starter: 59,
            professional: 179,
            enterprise: 599
          }
        },
        {
          name: 'Competitor B',
          features: {
            aiPlatforms: 22,
            realTimeMonitoring: false,
            competitiveIntel: true,
            brandAnalytics: false,
            queryDiscovery: true,
            contentOptimization: false
          },
          metrics: {
            accuracy: 88.5,
            speed: 92.1,
            coverage: 79.3,
            usability: 85.7
          },
          pricing: {
            starter: 39,
            professional: 129,
            enterprise: 449
          }
        }
      ]
    };

    return NextResponse.json(comparison);
  } catch (error) {
    console.error('Platform comparison error:', error);
    return NextResponse.json({ error: 'Failed to fetch platform comparison' }, { status: 500 });
  }
}

async function getSWOTAnalysis(competitor?: string | null) {
  try {
    const swot = {
      strengths: [
        'Comprehensive AI platform coverage (25+ platforms)',
        'Real-time monitoring capabilities',
        'Advanced competitive intelligence',
        'User-friendly interface',
        'Competitive pricing'
      ],
      weaknesses: [
        'Newer player in the market',
        'Limited brand recognition',
        'Smaller customer base',
        'Less enterprise features'
      ],
      opportunities: [
        'Growing AI market demand',
        'Increasing need for AI monitoring',
        'Expansion into new verticals',
        'Partnership opportunities',
        'International market expansion'
      ],
      threats: [
        'Established competitors with larger budgets',
        'Rapid technology changes',
        'Economic downturn affecting budgets',
        'New entrants with innovative solutions'
      ]
    };

    return NextResponse.json(swot);
  } catch (error) {
    console.error('SWOT analysis error:', error);
    return NextResponse.json({ error: 'Failed to fetch SWOT analysis' }, { status: 500 });
  }
}

async function getCompetitiveGaps(startDate: Date) {
  try {
    const gaps = {
      featureGaps: [
        {
          feature: 'Advanced ML Models',
          yourCapability: 7.5,
          competitorBest: 9.2,
          gap: -1.7,
          priority: 'High'
        },
        {
          feature: 'API Integrations',
          yourCapability: 8.9,
          competitorBest: 8.1,
          gap: 0.8,
          priority: 'Low'
        },
        {
          feature: 'Mobile App',
          yourCapability: 6.2,
          competitorBest: 8.7,
          gap: -2.5,
          priority: 'Medium'
        }
      ],
      marketGaps: [
        {
          segment: 'Healthcare',
          opportunity: 'High',
          competitorPresence: 'Low',
          marketSize: '$2.4B'
        },
        {
          segment: 'Financial Services',
          opportunity: 'Medium',
          competitorPresence: 'High',
          marketSize: '$1.8B'
        },
        {
          segment: 'Education',
          opportunity: 'High',
          competitorPresence: 'Medium',
          marketSize: '$1.2B'
        }
      ]
    };

    return NextResponse.json(gaps);
  } catch (error) {
    console.error('Competitive gaps error:', error);
    return NextResponse.json({ error: 'Failed to fetch competitive gaps' }, { status: 500 });
  }
}

async function getCompetitivePositioning(startDate: Date) {
  try {
    const positioning = {
      quadrant: {
        yourPosition: { x: 8.5, y: 7.8 },
        competitors: [
          { name: 'Competitor A', x: 9.2, y: 8.9, size: 35.8 },
          { name: 'Competitor B', x: 7.1, y: 6.5, size: 22.1 },
          { name: 'Competitor C', x: 6.8, y: 7.2, size: 18.7 },
          { name: 'Competitor D', x: 5.9, y: 5.8, size: 12.4 }
        ],
        axes: {
          x: 'Market Presence',
          y: 'Innovation Score'
        }
      },
      recommendations: [
        'Focus on increasing market presence through strategic partnerships',
        'Invest in advanced AI capabilities to match top competitors',
        'Leverage pricing advantage to capture market share',
        'Expand into underserved market segments'
      ]
    };

    return NextResponse.json(positioning);
  } catch (error) {
    console.error('Competitive positioning error:', error);
    return NextResponse.json({ error: 'Failed to fetch competitive positioning' }, { status: 500 });
  }
}