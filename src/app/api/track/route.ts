import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { UAParser } from 'ua-parser-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Known AI bot user agents - Comprehensive list of 30+ AI crawlers
const AI_BOTS = [
  // OpenAI bots
  'GPTBot',
  'ChatGPT-User',
  'OpenAI-SearchBot',
  'OpenAI',
  
  // Anthropic bots
  'Claude-Web',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-3',
  
  // Google bots
  'Googlebot',
  'Google-Extended',
  'Bard',
  'Gemini',
  'GoogleOther',
  
  // Microsoft/Bing bots
  'Bingbot',
  'BingPreview',
  'msnbot',
  
  // Perplexity
  'PerplexityBot',
  'PerplexityAI',
  
  // Social media bots
  'facebookexternalhit',
  'FacebookBot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'Slackbot',
  'TelegramBot',
  'DiscordBot',
  
  // Other AI/ML bots
  'CCBot',
  'YouBot',
  'Character.AI',
  'Replika',
  'Jasper',
  'Copy.ai',
  'Writesonic',
  'Grammarly',
  'QuillBot',
  
  // Research/Academic bots
  'SemrushBot',
  'AhrefsBot',
  'MJ12bot',
  'DotBot',
  'DataForSeoBot',
  
  // Other crawlers
  'ia_archiver',
  'archive.org_bot',
  'Wayback'
];

function detectBot(userAgent: string): { isBot: boolean; botType: string; confidence: number } {
  const ua = userAgent.toLowerCase();
  
  // Check for known AI bots
  for (const bot of AI_BOTS) {
    if (ua.includes(bot.toLowerCase())) {
      return { isBot: true, botType: bot, confidence: 1.0 };
    }
  }
  
  // Check for common bot indicators
  const botIndicators = ['bot', 'crawler', 'spider', 'scraper', 'agent'];
  for (const indicator of botIndicators) {
    if (ua.includes(indicator)) {
      return { isBot: true, botType: 'Generic Bot', confidence: 0.8 };
    }
  }
  
  return { isBot: false, botType: 'Human', confidence: 0.1 };
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const referer = request.headers.get('referer') || '';
    const ip = getClientIP(request);
    
    // Parse the request body for website URL
    const body = await request.json().catch(() => ({}));
    const websiteUrl = body.url || referer || 'unknown';
    
    // Detect if it's a bot
    const detection = detectBot(userAgent);
    
    // Parse user agent for additional info
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    // Only log if it's detected as a bot
    if (detection.isBot) {
      const { error } = await supabase
        .from('bot_visits')
        .insert({
          bot_type: detection.botType,
          user_agent: userAgent,
          ip_address: ip,
          website_url: websiteUrl,
          referer: referer,
          is_bot: detection.isBot,
          bot_confidence: detection.confidence,
          additional_data: {
            browser: result.browser,
            os: result.os,
            device: result.device,
            timestamp: new Date().toISOString()
          }
        });
      
      if (error) {
        console.error('Error inserting bot visit:', error);
        return NextResponse.json({ error: 'Failed to log visit' }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      success: true,
      detected: detection.isBot,
      botType: detection.botType,
      confidence: detection.confidence
    });
    
  } catch (error) {
    console.error('Error in track API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Simple GET endpoint for basic tracking via image pixel
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const referer = request.headers.get('referer') || '';
  const ip = getClientIP(request);
  
  const detection = detectBot(userAgent);
  
  if (detection.isBot) {
    await supabase
      .from('bot_visits')
      .insert({
        bot_type: detection.botType,
        user_agent: userAgent,
        ip_address: ip,
        website_url: referer,
        referer: referer,
        is_bot: detection.isBot,
        bot_confidence: detection.confidence,
        additional_data: {
          method: 'GET',
          timestamp: new Date().toISOString()
        }
      });
  }
  
  // Return a 1x1 transparent pixel
  const pixel = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64'
  );
  
  return new NextResponse(pixel, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}