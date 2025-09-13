import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    switch (type) {
      case "overview":
        return await getRealTimeOverview(startDate, timeRange);
      case "activities":
        return await getLiveActivities(startDate);
      case "alerts":
        return await getAlerts();
      default:
        return NextResponse.json(
          { error: "Invalid analytics type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Real-time API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getRealTimeOverview(startDate: Date, timeRange: string) {
  try {
    // Get recent bot visits for live activity
    const { data: recentVisits, error } = await supabase
      .from("bot_visits")
      .select(
        "bot_type, created_at, website_url, ip_address, user_agent, bot_confidence"
      )
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    // Convert to live activity format
    const liveActivities =
      recentVisits?.map((visit, index) => ({
        id: `activity-${index}`,
        bot_type: visit.bot_type,
        action: "crawl",
        timestamp: visit.created_at,
        website_url: visit.website_url,
        ip_address: visit.ip_address,
        user_agent: visit.user_agent,
        status: "success" as const,
        response_time: Math.floor(Math.random() * 500) + 100, // Mock response time
        confidence: Math.floor(visit.bot_confidence * 100),
      })) || [];

    // Generate mock alerts based on activity patterns
    const alerts: Array<{
      id: string;
      title: string;
      description: string;
      severity: string;
      timestamp: string;
      status: string;
      category: string;
      affected_platforms: string[];
    }> = [];
    if (recentVisits && recentVisits.length > 0) {
      const highActivityBots = recentVisits.reduce((acc, visit) => {
        acc[visit.bot_type] = (acc[visit.bot_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      Object.entries(highActivityBots).forEach(([botType, count]) => {
        if (count > 10) {
          alerts.push({
            id: `alert-${botType.toLowerCase()}`,
            title: `High Activity from ${botType}`,
            description: `${botType} has made ${count} visits in the last ${timeRange}`,
            severity: count > 20 ? "high" : "medium",
            timestamp: new Date().toISOString(),
            status: "active",
            category: "activity",
            affected_platforms: [botType],
          });
        }
      });
    }

    // Generate mock geographic activity
    const geographicActivity = [
      {
        country: "United States",
        region: "North America",
        visits: Math.floor(Math.random() * 50) + 10,
        platforms: ["ChatGPT-User", "Claude-Web", "Gemini"],
        last_activity: new Date(
          Date.now() - Math.random() * 3600000
        ).toISOString(),
      },
      {
        country: "United Kingdom",
        region: "Europe",
        visits: Math.floor(Math.random() * 30) + 5,
        platforms: ["ChatGPT-User", "PerplexityBot"],
        last_activity: new Date(
          Date.now() - Math.random() * 3600000
        ).toISOString(),
      },
      {
        country: "Canada",
        region: "North America",
        visits: Math.floor(Math.random() * 20) + 3,
        platforms: ["Claude-Web", "Gemini"],
        last_activity: new Date(
          Date.now() - Math.random() * 3600000
        ).toISOString(),
      },
    ].filter((location) => location.visits > 0);

    return NextResponse.json({
      liveActivities,
      alerts,
      geographicActivity,
    });
  } catch (error) {
    console.error("Real-time overview error:", error);
    return NextResponse.json(
      { error: "Failed to fetch real-time overview" },
      { status: 500 }
    );
  }
}

async function getLiveActivities(startDate: Date) {
  try {
    // Get recent bot visits
    const { data: visits, error } = await supabase
      .from("bot_visits")
      .select(
        "bot_type, created_at, website_url, ip_address, user_agent, bot_confidence"
      )
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    const activities =
      visits?.map((visit, index) => ({
        id: `activity-${index}`,
        bot_type: visit.bot_type,
        action: "crawl",
        timestamp: visit.created_at,
        website_url: visit.website_url,
        ip_address: visit.ip_address,
        user_agent: visit.user_agent,
        status: "success" as const,
        response_time: Math.floor(Math.random() * 500) + 100,
        confidence: Math.floor(visit.bot_confidence * 100),
      })) || [];

    return NextResponse.json({ data: activities });
  } catch (error) {
    console.error("Live activities error:", error);
    return NextResponse.json(
      { error: "Failed to fetch live activities" },
      { status: 500 }
    );
  }
}

async function getAlerts() {
  try {
    // Return empty alerts for now - can be enhanced with real alert logic
    return NextResponse.json({ data: [] });
  } catch (error) {
    console.error("Alerts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}
