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
    const category = searchParams.get('category');

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
        return await getQueryOverview(startDate);
      case 'trending':
        return await getTrendingQueries(startDate, category);
      case 'gaps':
        return await getContentGaps(startDate);
      case 'topics':
        return await getTopicTrends(startDate);
      case 'categories':
        return await getQueryCategories(startDate);
      case 'opportunities':
        return await getContentOpportunities(startDate);
      case 'keywords':
        return await getKeywordAnalysis(startDate);
      default:
        return NextResponse.json({ error: 'Invalid query discovery type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Query Discovery API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getQueryOverview(startDate: Date) {
  try {
    const overview = {
      totalQueries: 89420,
      uniqueQueries: 34560,
      trendingTopics: 156,
      contentGaps: 23,
      topCategories: [
        {
          category: 'Technology',
          queries: 25420,
          growth: 15.2,
          share: 28.4
        },
        {
          category: 'Business',
          queries: 18930,
          growth: 8.7,
          share: 21.2
        },
        {
          category: 'Education',
          queries: 14780,
          growth: 12.3,
          share: 16.5
        },
        {
          category: 'Health',
          queries: 12560,
          growth: 22.1,
          share: 14.0
        },
        {
          category: 'Finance',
          queries: 9890,
          growth: 5.4,
          share: 11.1
        }
      ],
      metrics: {
        avgQueriesPerSession: 3.2,
        querySuccessRate: 87.5,
        avgResponseTime: 1.8,
        userSatisfaction: 4.3
      }
    };

    return NextResponse.json(overview);
  } catch (error) {
    console.error('Query overview error:', error);
    return NextResponse.json({ error: 'Failed to fetch query overview' }, { status: 500 });
  }
}

async function getTrendingQueries(startDate: Date, category?: string | null) {
  try {
    const trendingQueries = [
      {
        id: '1',
        query: 'AI platform comparison 2024',
        volume: 15420,
        growth: 156.7,
        category: 'Technology',
        difficulty: 'Medium',
        opportunity: 'High',
        platforms: ['ChatGPT', 'Claude', 'Gemini'],
        relatedKeywords: ['AI tools', 'machine learning', 'automation']
      },
      {
        id: '2',
        query: 'best practices for remote work',
        volume: 12890,
        growth: 134.2,
        category: 'Business',
        difficulty: 'Low',
        opportunity: 'Medium',
        platforms: ['ChatGPT', 'Perplexity'],
        relatedKeywords: ['remote team', 'productivity', 'collaboration']
      },
      {
        id: '3',
        query: 'sustainable energy solutions',
        volume: 9560,
        growth: 98.5,
        category: 'Environment',
        difficulty: 'High',
        opportunity: 'High',
        platforms: ['Gemini', 'Claude'],
        relatedKeywords: ['renewable energy', 'solar power', 'green technology']
      },
      {
        id: '4',
        query: 'machine learning algorithms explained',
        volume: 8230,
        growth: 87.3,
        category: 'Education',
        difficulty: 'High',
        opportunity: 'Medium',
        platforms: ['ChatGPT', 'Claude', 'Copilot'],
        relatedKeywords: ['deep learning', 'neural networks', 'data science']
      },
      {
        id: '5',
        query: 'cryptocurrency investment strategies',
        volume: 7890,
        growth: 76.1,
        category: 'Finance',
        difficulty: 'Medium',
        opportunity: 'Low',
        platforms: ['Perplexity', 'You.com'],
        relatedKeywords: ['bitcoin', 'blockchain', 'trading']
      },
      {
        id: '6',
        query: 'healthy meal prep ideas',
        volume: 6540,
        growth: 65.4,
        category: 'Health',
        difficulty: 'Low',
        opportunity: 'High',
        platforms: ['ChatGPT', 'Gemini'],
        relatedKeywords: ['nutrition', 'diet', 'cooking']
      },
      {
        id: '7',
        query: 'digital marketing trends 2024',
        volume: 5670,
        growth: 54.2,
        category: 'Marketing',
        difficulty: 'Medium',
        opportunity: 'Medium',
        platforms: ['Claude', 'Jasper'],
        relatedKeywords: ['SEO', 'social media', 'content marketing']
      },
      {
        id: '8',
        query: 'climate change impact analysis',
        volume: 4890,
        growth: 43.7,
        category: 'Environment',
        difficulty: 'High',
        opportunity: 'High',
        platforms: ['Gemini', 'Perplexity'],
        relatedKeywords: ['global warming', 'environmental science', 'sustainability']
      }
    ];

    // Filter by category if provided
    const filteredQueries = category 
      ? trendingQueries.filter(q => q.category.toLowerCase() === category.toLowerCase())
      : trendingQueries;

    return NextResponse.json({ data: filteredQueries });
  } catch (error) {
    console.error('Trending queries error:', error);
    return NextResponse.json({ error: 'Failed to fetch trending queries' }, { status: 500 });
  }
}

async function getContentGaps(startDate: Date) {
  try {
    const contentGaps = [
      {
        id: '1',
        topic: 'AI Ethics in Healthcare',
        searchVolume: 8900,
        competitionLevel: 'Low',
        opportunityScore: 92,
        estimatedTraffic: 15600,
        difficulty: 'Medium',
        suggestedContent: [
          'Comprehensive guide to AI ethics in medical diagnosis',
          'Case studies of ethical AI implementation in hospitals',
          'Regulatory framework for healthcare AI'
        ],
        relatedQueries: [
          'AI bias in medical diagnosis',
          'Healthcare AI regulations',
          'Ethical AI implementation'
        ]
      },
      {
        id: '2',
        topic: 'Quantum Computing Applications',
        searchVolume: 6700,
        competitionLevel: 'Medium',
        opportunityScore: 87,
        estimatedTraffic: 12400,
        difficulty: 'High',
        suggestedContent: [
          'Practical quantum computing use cases',
          'Quantum vs classical computing comparison',
          'Future of quantum technology'
        ],
        relatedQueries: [
          'quantum computing explained',
          'quantum algorithms',
          'quantum supremacy'
        ]
      },
      {
        id: '3',
        topic: 'Sustainable Web Development',
        searchVolume: 4500,
        competitionLevel: 'Low',
        opportunityScore: 84,
        estimatedTraffic: 8900,
        difficulty: 'Low',
        suggestedContent: [
          'Green coding practices for developers',
          'Carbon footprint of web applications',
          'Sustainable hosting solutions'
        ],
        relatedQueries: [
          'green software development',
          'eco-friendly coding',
          'sustainable tech practices'
        ]
      }
    ];

    return NextResponse.json({ data: contentGaps });
  } catch (error) {
    console.error('Content gaps error:', error);
    return NextResponse.json({ error: 'Failed to fetch content gaps' }, { status: 500 });
  }
}

async function getTopicTrends(startDate: Date) {
  try {
    const topicTrends = {
      trending: [
        {
          topic: 'Artificial Intelligence',
          volume: 45620,
          growth: 23.5,
          sentiment: 'Positive',
          platforms: ['ChatGPT', 'Claude', 'Gemini'],
          subtopics: ['Machine Learning', 'Deep Learning', 'AI Ethics']
        },
        {
          topic: 'Remote Work',
          volume: 32890,
          growth: 18.7,
          sentiment: 'Neutral',
          platforms: ['ChatGPT', 'Perplexity'],
          subtopics: ['Productivity', 'Team Collaboration', 'Work-Life Balance']
        },
        {
          topic: 'Sustainability',
          volume: 28450,
          growth: 34.2,
          sentiment: 'Positive',
          platforms: ['Gemini', 'Claude'],
          subtopics: ['Climate Change', 'Renewable Energy', 'Green Technology']
        }
      ],
      emerging: [
        {
          topic: 'Quantum Computing',
          volume: 8900,
          growth: 156.7,
          potential: 'High'
        },
        {
          topic: 'Web3 Technologies',
          volume: 6700,
          growth: 134.2,
          potential: 'Medium'
        },
        {
          topic: 'Biotech Innovation',
          volume: 4500,
          growth: 98.5,
          potential: 'High'
        }
      ],
      seasonal: [
        {
          topic: 'Tax Planning',
          peakMonths: ['March', 'April'],
          volume: 12400,
          seasonality: 'High'
        },
        {
          topic: 'Holiday Marketing',
          peakMonths: ['November', 'December'],
          volume: 8900,
          seasonality: 'Very High'
        }
      ]
    };

    return NextResponse.json(topicTrends);
  } catch (error) {
    console.error('Topic trends error:', error);
    return NextResponse.json({ error: 'Failed to fetch topic trends' }, { status: 500 });
  }
}

async function getQueryCategories(startDate: Date) {
  try {
    const categories = [
      {
        name: 'Technology',
        queries: 25420,
        share: 28.4,
        growth: 15.2,
        avgDifficulty: 'Medium',
        topQueries: [
          'AI platform comparison',
          'machine learning tutorials',
          'cloud computing benefits'
        ]
      },
      {
        name: 'Business',
        queries: 18930,
        share: 21.2,
        growth: 8.7,
        avgDifficulty: 'Low',
        topQueries: [
          'remote work best practices',
          'digital transformation',
          'startup funding strategies'
        ]
      },
      {
        name: 'Education',
        queries: 14780,
        share: 16.5,
        growth: 12.3,
        avgDifficulty: 'Medium',
        topQueries: [
          'online learning platforms',
          'study techniques',
          'career development'
        ]
      },
      {
        name: 'Health',
        queries: 12560,
        share: 14.0,
        growth: 22.1,
        avgDifficulty: 'High',
        topQueries: [
          'healthy lifestyle tips',
          'mental health resources',
          'nutrition guidelines'
        ]
      },
      {
        name: 'Finance',
        queries: 9890,
        share: 11.1,
        growth: 5.4,
        avgDifficulty: 'Medium',
        topQueries: [
          'investment strategies',
          'personal budgeting',
          'cryptocurrency trends'
        ]
      }
    ];

    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error('Query categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch query categories' }, { status: 500 });
  }
}

async function getContentOpportunities(startDate: Date) {
  try {
    const opportunities = [
      {
        id: '1',
        title: 'AI-Powered Content Creation Tools',
        description: 'High search volume with low competition for comprehensive guides',
        opportunityScore: 94,
        estimatedTraffic: 25600,
        difficulty: 'Medium',
        timeToRank: '3-6 months',
        requiredResources: 'High',
        contentTypes: ['Guide', 'Comparison', 'Tutorial'],
        targetKeywords: ['AI content tools', 'automated writing', 'content generation']
      },
      {
        id: '2',
        title: 'Sustainable Technology Practices',
        description: 'Growing interest in eco-friendly tech solutions',
        opportunityScore: 89,
        estimatedTraffic: 18900,
        difficulty: 'Low',
        timeToRank: '2-4 months',
        requiredResources: 'Medium',
        contentTypes: ['Article', 'Case Study', 'Best Practices'],
        targetKeywords: ['green technology', 'sustainable coding', 'eco-friendly software']
      },
      {
        id: '3',
        title: 'Remote Team Management',
        description: 'Consistent demand for remote work optimization content',
        opportunityScore: 85,
        estimatedTraffic: 15400,
        difficulty: 'Medium',
        timeToRank: '4-8 months',
        requiredResources: 'Medium',
        contentTypes: ['Guide', 'Template', 'Checklist'],
        targetKeywords: ['remote team management', 'virtual collaboration', 'distributed teams']
      }
    ];

    return NextResponse.json({ data: opportunities });
  } catch (error) {
    console.error('Content opportunities error:', error);
    return NextResponse.json({ error: 'Failed to fetch content opportunities' }, { status: 500 });
  }
}

async function getKeywordAnalysis(startDate: Date) {
  try {
    const keywordAnalysis = {
      topKeywords: [
        {
          keyword: 'artificial intelligence',
          volume: 89400,
          difficulty: 85,
          cpc: 4.25,
          trend: 'Rising',
          competition: 'High'
        },
        {
          keyword: 'machine learning',
          volume: 67800,
          difficulty: 78,
          cpc: 3.89,
          trend: 'Stable',
          competition: 'High'
        },
        {
          keyword: 'remote work',
          volume: 45600,
          difficulty: 62,
          cpc: 2.15,
          trend: 'Rising',
          competition: 'Medium'
        },
        {
          keyword: 'sustainability',
          volume: 34500,
          difficulty: 58,
          cpc: 1.95,
          trend: 'Rising',
          competition: 'Medium'
        }
      ],
      longTail: [
        {
          keyword: 'best AI platform for content creation 2024',
          volume: 2400,
          difficulty: 35,
          opportunity: 'High'
        },
        {
          keyword: 'how to implement machine learning in small business',
          volume: 1800,
          difficulty: 28,
          opportunity: 'High'
        },
        {
          keyword: 'sustainable web development practices guide',
          volume: 1200,
          difficulty: 22,
          opportunity: 'Medium'
        }
      ],
      semantic: {
        clusters: [
          {
            theme: 'AI Technology',
            keywords: ['artificial intelligence', 'machine learning', 'deep learning', 'neural networks'],
            totalVolume: 234500
          },
          {
            theme: 'Remote Work',
            keywords: ['remote work', 'work from home', 'virtual teams', 'distributed workforce'],
            totalVolume: 156700
          }
        ]
      }
    };

    return NextResponse.json(keywordAnalysis);
  } catch (error) {
    console.error('Keyword analysis error:', error);
    return NextResponse.json({ error: 'Failed to fetch keyword analysis' }, { status: 500 });
  }
}