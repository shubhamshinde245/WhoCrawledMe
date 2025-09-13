import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "7d";
    const type = searchParams.get("type") || "overview";

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case "24h":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    switch (type) {
      case "overview":
        return await getBrandOverview();
      case "visibility":
        return await getBrandVisibility(startDate);
      case "mentions":
        return await getBrandMentions();
      case "sentiment":
        return await getBrandSentiment(startDate);
      case "competitors":
        return await getCompetitorComparison();
      case "health":
        return await getBrandHealth();
      case "trends":
        return await getBrandTrends();
      default:
        return NextResponse.json(
          { error: "Invalid analytics type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Brand Analytics API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getBrandOverview() {
  try {
    // Mock data for brand overview
    const overview = {
      totalMentions: 15420,
      visibilityScore: 87.5,
      sentimentScore: 4.2,
      shareOfVoice: 23.8,
      brandHealth: 92,
      changePercent: 12.5,
      topPlatforms: [
        { platform: "ChatGPT", mentions: 5420, change: 15.2 },
        { platform: "Claude", mentions: 3210, change: 8.7 },
        { platform: "Gemini", mentions: 2890, change: -2.1 },
        { platform: "Perplexity", mentions: 2100, change: 22.3 },
        { platform: "Copilot", mentions: 1800, change: 5.4 },
      ],
      metrics: {
        reach: 2.4e6,
        engagement: 156000,
        impressions: 8.9e6,
        clicks: 234000,
      },
    };

    return NextResponse.json(overview);
  } catch (error) {
    console.error("Brand overview error:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand overview" },
      { status: 500 }
    );
  }
}

async function getBrandVisibility(startDate: Date) {
  try {
    // Mock visibility data over time
    const visibilityData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      return {
        date: date.toISOString().split("T")[0],
        visibility: 75 + Math.random() * 25,
        mentions: Math.floor(400 + Math.random() * 200),
        reach: Math.floor(50000 + Math.random() * 30000),
        engagement: Math.floor(3000 + Math.random() * 2000),
      };
    });

    return NextResponse.json({ data: visibilityData });
  } catch (error) {
    console.error("Brand visibility error:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand visibility" },
      { status: 500 }
    );
  }
}

async function getBrandMentions() {
  try {
    const mentions = [
      {
        id: "1",
        platform: "ChatGPT",
        content: "User asking about best practices for web development",
        sentiment: "positive",
        timestamp: new Date().toISOString(),
        engagement: 156,
        reach: 12400,
      },
      {
        id: "2",
        platform: "Claude",
        content: "Discussion about AI platform comparison",
        sentiment: "neutral",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        engagement: 89,
        reach: 8900,
      },
      {
        id: "3",
        platform: "Gemini",
        content: "Technical question about implementation",
        sentiment: "positive",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        engagement: 234,
        reach: 15600,
      },
    ];

    return NextResponse.json({ data: mentions });
  } catch (error) {
    console.error("Brand mentions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand mentions" },
      { status: 500 }
    );
  }
}

async function getBrandSentiment(startDate: Date) {
  try {
    const sentimentData = {
      overall: 4.2,
      distribution: {
        positive: 68.5,
        neutral: 24.3,
        negative: 7.2,
      },
      trends: Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        return {
          date: date.toISOString().split("T")[0],
          positive: 60 + Math.random() * 20,
          neutral: 20 + Math.random() * 15,
          negative: 5 + Math.random() * 10,
        };
      }),
    };

    return NextResponse.json(sentimentData);
  } catch (error) {
    console.error("Brand sentiment error:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand sentiment" },
      { status: 500 }
    );
  }
}

async function getCompetitorComparison() {
  try {
    const competitors = [
      {
        name: "Competitor A",
        mentions: 12400,
        visibility: 82.3,
        sentiment: 4.1,
        shareOfVoice: 19.2,
        change: 8.7,
      },
      {
        name: "Competitor B",
        mentions: 9800,
        visibility: 76.8,
        sentiment: 3.9,
        shareOfVoice: 15.1,
        change: -3.2,
      },
      {
        name: "Competitor C",
        mentions: 8200,
        visibility: 71.2,
        sentiment: 4.0,
        shareOfVoice: 12.6,
        change: 15.4,
      },
    ];

    return NextResponse.json({ data: competitors });
  } catch (error) {
    console.error("Competitor comparison error:", error);
    return NextResponse.json(
      { error: "Failed to fetch competitor comparison" },
      { status: 500 }
    );
  }
}

async function getBrandHealth() {
  try {
    const healthMetrics = {
      overall: 92,
      metrics: {
        awareness: 88,
        perception: 94,
        consideration: 91,
        preference: 89,
        loyalty: 96,
      },
      trends: Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return {
          month: date.toISOString().slice(0, 7),
          score: 85 + Math.random() * 15,
        };
      }),
    };

    return NextResponse.json(healthMetrics);
  } catch (error) {
    console.error("Brand health error:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand health" },
      { status: 500 }
    );
  }
}

async function getBrandTrends() {
  try {
    const trends = {
      keywords: [
        { keyword: "AI platform", volume: 15400, change: 23.5 },
        { keyword: "machine learning", volume: 12800, change: 18.2 },
        { keyword: "automation", volume: 9600, change: -5.1 },
        { keyword: "data analysis", volume: 8200, change: 12.7 },
      ],
      topics: [
        { topic: "Product Features", mentions: 5420, sentiment: 4.3 },
        { topic: "Customer Support", mentions: 3210, sentiment: 4.1 },
        { topic: "Pricing", mentions: 2890, sentiment: 3.8 },
        { topic: "Integration", mentions: 2100, sentiment: 4.2 },
      ],
      emerging: [
        { trend: "AI Ethics", growth: 156.7, mentions: 890 },
        { trend: "Responsible AI", growth: 134.2, mentions: 670 },
        { trend: "AI Transparency", growth: 98.5, mentions: 540 },
      ],
    };

    return NextResponse.json(trends);
  } catch (error) {
    console.error("Brand trends error:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand trends" },
      { status: 500 }
    );
  }
}
