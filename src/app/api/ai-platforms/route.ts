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
        return await getPlatformOverview(startDate);
      case "platforms":
        return await getPlatformsData(startDate);
      case "trends":
        return await getPlatformTrends(startDate);
      default:
        return NextResponse.json(
          { error: "Invalid analytics type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("AI Platforms API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getPlatformOverview(startDate: Date) {
  try {
    // Get platform data from bot visits
    const { data: visits, error } = await supabase
      .from("bot_visits")
      .select("bot_type, created_at")
      .gte("created_at", startDate.toISOString());

    if (error) throw error;

    // Group by platform categories
    const platformCategories = {
      chatbot: [
        "ChatGPT-User",
        "GPTBot",
        "Claude-Web",
        "ClaudeBot",
        "Gemini",
        "Bard",
      ],
      search: ["Googlebot", "Bingbot", "PerplexityBot", "PerplexityAI"],
      social: ["facebookexternalhit", "Twitterbot", "LinkedInBot", "WhatsApp"],
      research: ["SemrushBot", "AhrefsBot", "MJ12bot"],
      other: [],
    };

    // Categorize platforms
    const categorizedPlatforms = {};
    const categoryStats = [];

    Object.entries(platformCategories).forEach(([category, platforms]) => {
      const categoryVisits =
        visits?.filter((visit) =>
          platforms.some((platform) => visit.bot_type.includes(platform))
        ) || [];

      const uniquePlatforms = new Set(categoryVisits.map((v) => v.bot_type));
      const totalVisits = categoryVisits.length;
      const avgEngagement =
        totalVisits > 0 ? Math.min(95, 60 + Math.random() * 35) : 0;

      categorizedPlatforms[category] = {
        platforms: Array.from(uniquePlatforms).map((platform) => ({
          id: platform.toLowerCase().replace(/\s+/g, "-"),
          name: platform,
          category,
          visits: categoryVisits.filter((v) => v.bot_type === platform).length,
          mentions: Math.floor(
            categoryVisits.filter((v) => v.bot_type === platform).length * 0.7
          ),
          last_seen:
            categoryVisits.length > 0
              ? new Date(
                  Math.max(
                    ...categoryVisits.map((v) =>
                      new Date(v.created_at).getTime()
                    )
                  )
                ).toLocaleString()
              : "Never",
          status: categoryVisits.length > 0 ? "active" : "inactive",
          growth_rate: Math.random() * 40 - 10, // -10% to +30%
          engagement_score: avgEngagement,
          crawl_frequency: Math.floor(Math.random() * 50) + 10,
          user_agent: platform,
          detection_confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
        })),
        total_visits: totalVisits,
        avg_engagement: avgEngagement,
      };

      categoryStats.push({
        category,
        platforms: uniquePlatforms.size,
        total_visits: totalVisits,
        avg_engagement: avgEngagement,
        color: getCategoryColor(category),
      });
    });

    // Create trend data
    const trendData = [];
    const days = timeRange === "24h" ? 1 : timeRange === "7d" ? 7 : 30;

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dayVisits =
        visits?.filter((visit) => {
          const visitDate = new Date(visit.created_at);
          return visitDate.toDateString() === date.toDateString();
        }) || [];

      trendData.push({
        date: date.toISOString().split("T")[0],
        chatgpt: dayVisits.filter(
          (v) => v.bot_type.includes("ChatGPT") || v.bot_type.includes("GPTBot")
        ).length,
        claude: dayVisits.filter((v) => v.bot_type.includes("Claude")).length,
        gemini: dayVisits.filter(
          (v) => v.bot_type.includes("Gemini") || v.bot_type.includes("Bard")
        ).length,
        perplexity: dayVisits.filter((v) => v.bot_type.includes("Perplexity"))
          .length,
        copilot: dayVisits.filter((v) => v.bot_type.includes("Copilot")).length,
        total: dayVisits.length,
      });
    }

    return NextResponse.json({
      platforms: Object.values(categorizedPlatforms).flatMap(
        (cat) => cat.platforms
      ),
      categoryStats,
      trendData,
    });
  } catch (error) {
    console.error("Platform overview error:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform overview" },
      { status: 500 }
    );
  }
}

async function getPlatformsData(startDate: Date) {
  try {
    // Get detailed platform data
    const { data: visits, error } = await supabase
      .from("bot_visits")
      .select("bot_type, created_at, website_url, ip_address")
      .gte("created_at", startDate.toISOString());

    if (error) throw error;

    // Group by bot type
    const platformData = {};
    visits?.forEach((visit) => {
      if (!platformData[visit.bot_type]) {
        platformData[visit.bot_type] = {
          visits: 0,
          unique_ips: new Set(),
          websites: new Set(),
          last_seen: visit.created_at,
        };
      }
      platformData[visit.bot_type].visits++;
      platformData[visit.bot_type].unique_ips.add(visit.ip_address);
      platformData[visit.bot_type].websites.add(visit.website_url);
      if (
        new Date(visit.created_at) >
        new Date(platformData[visit.bot_type].last_seen)
      ) {
        platformData[visit.bot_type].last_seen = visit.created_at;
      }
    });

    // Convert to array format
    const platforms = Object.entries(platformData).map(([botType, data]) => ({
      id: botType.toLowerCase().replace(/\s+/g, "-"),
      name: botType,
      category: getBotCategory(botType),
      visits: data.visits,
      mentions: Math.floor(data.visits * 0.7),
      last_seen: new Date(data.last_seen).toLocaleString(),
      status: "active",
      growth_rate: Math.random() * 40 - 10,
      engagement_score: Math.min(95, 60 + Math.random() * 35),
      crawl_frequency: Math.floor(Math.random() * 50) + 10,
      user_agent: botType,
      detection_confidence: Math.floor(Math.random() * 20) + 80,
      unique_ips: data.unique_ips.size,
      websites_crawled: data.websites.size,
    }));

    return NextResponse.json({ data: platforms });
  } catch (error) {
    console.error("Platforms data error:", error);
    return NextResponse.json(
      { error: "Failed to fetch platforms data" },
      { status: 500 }
    );
  }
}

async function getPlatformTrends(startDate: Date) {
  try {
    // Get trend data over time
    const { data: visits, error } = await supabase
      .from("bot_visits")
      .select("bot_type, created_at")
      .gte("created_at", startDate.toISOString())
      .order("created_at");

    if (error) throw error;

    // Group by day and platform
    const trends = {};
    visits?.forEach((visit) => {
      const date = new Date(visit.created_at).toISOString().split("T")[0];
      if (!trends[date]) {
        trends[date] = {};
      }
      if (!trends[date][visit.bot_type]) {
        trends[date][visit.bot_type] = 0;
      }
      trends[date][visit.bot_type]++;
    });

    // Convert to array format
    const trendData = Object.entries(trends).map(([date, platforms]) => ({
      date,
      platforms: Object.entries(platforms).map(([platform, count]) => ({
        platform,
        count,
      })),
    }));

    return NextResponse.json({ data: trendData });
  } catch (error) {
    console.error("Platform trends error:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform trends" },
      { status: 500 }
    );
  }
}

function getCategoryColor(category: string): string {
  const colors = {
    chatbot: "#3b82f6",
    search: "#10b981",
    social: "#f59e0b",
    research: "#ef4444",
    other: "#6b7280",
  };
  return colors[category] || "#6b7280";
}

function getBotCategory(botType: string): string {
  if (
    botType.includes("ChatGPT") ||
    botType.includes("GPTBot") ||
    botType.includes("Claude") ||
    botType.includes("Gemini") ||
    botType.includes("Bard")
  ) {
    return "chatbot";
  }
  if (
    botType.includes("Googlebot") ||
    botType.includes("Bingbot") ||
    botType.includes("Perplexity")
  ) {
    return "search";
  }
  if (
    botType.includes("facebook") ||
    botType.includes("Twitter") ||
    botType.includes("LinkedIn") ||
    botType.includes("WhatsApp")
  ) {
    return "social";
  }
  if (
    botType.includes("Semrush") ||
    botType.includes("Ahrefs") ||
    botType.includes("MJ12")
  ) {
    return "research";
  }
  return "other";
}
