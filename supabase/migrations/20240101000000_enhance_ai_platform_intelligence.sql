-- Enhanced database schema for AI Platform Intelligence features
-- This migration adds tables for competitive intelligence, query tracking, brand analytics, and content optimization

-- Competitors table for tracking competitive brands
CREATE TABLE competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitive mentions table for tracking competitor visibility across AI platforms
CREATE TABLE competitive_mentions (
    id UUID DEFAULT gen_random_uuid(),
    competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- ChatGPT, Claude, Gemini, etc.
    query_text TEXT NOT NULL,
    mention_context TEXT,
    rank_position INTEGER,
    sentiment_score FLOAT CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
    confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
    detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, detected_at)
);

-- Note: Using regular tables with time-based indexing instead of TimescaleDB hypertables

-- Query tracking table for discovering trending topics and content gaps
CREATE TABLE query_tracking (
    id UUID DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    search_volume INTEGER DEFAULT 0,
    trend_score FLOAT DEFAULT 0,
    content_gap_score FLOAT DEFAULT 0,
    brand_mentioned BOOLEAN DEFAULT false,
    competitor_mentioned BOOLEAN DEFAULT false,
    opportunity_score FLOAT DEFAULT 0,
    tracked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, tracked_at)
);

-- Brand mentions table for tracking brand visibility across AI platforms
CREATE TABLE brand_mentions (
    id UUID DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    query_text TEXT NOT NULL,
    mention_context TEXT,
    rank_position INTEGER,
    mention_type VARCHAR(20) CHECK (mention_type IN ('direct', 'indirect', 'competitor_comparison')),
    sentiment_score FLOAT CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
    visibility_score FLOAT CHECK (visibility_score >= 0 AND visibility_score <= 100),
    detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, detected_at)
);

-- Using regular tables with optimized time-based indexes

-- Content optimization recommendations table
CREATE TABLE content_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL, -- 'content_gap', 'optimization', 'competitive_response'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority_score INTEGER CHECK (priority_score >= 1 AND priority_score <= 10),
    target_query TEXT,
    target_platform VARCHAR(50),
    expected_impact FLOAT,
    implementation_effort VARCHAR(20) CHECK (implementation_effort IN ('low', 'medium', 'high')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI platforms table for tracking different AI platforms and their characteristics
CREATE TABLE ai_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'llm', 'search', 'assistant', 'research'
    api_endpoint VARCHAR(255),
    crawl_frequency INTEGER DEFAULT 24, -- hours
    is_active BOOLEAN DEFAULT true,
    detection_patterns JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform coverage table for tracking brand coverage across AI platforms
CREATE TABLE platform_coverage (
    id UUID DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform_id UUID NOT NULL REFERENCES ai_platforms(id) ON DELETE CASCADE,
    coverage_percentage FLOAT CHECK (coverage_percentage >= 0 AND coverage_percentage <= 100),
    mention_count INTEGER DEFAULT 0,
    average_rank FLOAT,
    share_of_voice FLOAT CHECK (share_of_voice >= 0 AND share_of_voice <= 100),
    calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, calculated_at)
);

-- Market intelligence table for competitive analysis
CREATE TABLE market_intelligence (
    id UUID DEFAULT gen_random_uuid(),
    competitor_domain VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    mention_count INTEGER DEFAULT 0,
    share_of_voice FLOAT DEFAULT 0.0,
    sentiment_score FLOAT DEFAULT 0.0,
    topic_categories JSONB DEFAULT '[]',
    collected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    PRIMARY KEY (id, collected_at)
);

-- User alerts table for real-time notifications
CREATE TABLE user_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- 'new_mention', 'competitor_activity', 'content_opportunity', 'ranking_change'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    is_read BOOLEAN DEFAULT false,
    action_url VARCHAR(500),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance optimization
CREATE INDEX idx_competitors_user_id ON competitors(user_id);
CREATE INDEX idx_competitors_domain ON competitors(domain);
CREATE INDEX idx_competitive_mentions_competitor_id ON competitive_mentions(competitor_id);
CREATE INDEX idx_competitive_mentions_platform ON competitive_mentions(platform);
CREATE INDEX idx_competitive_mentions_detected_at ON competitive_mentions(detected_at DESC);
CREATE INDEX idx_query_tracking_user_id ON query_tracking(user_id);
CREATE INDEX idx_query_tracking_platform ON query_tracking(platform);
CREATE INDEX idx_query_tracking_tracked_at ON query_tracking(tracked_at DESC);
CREATE INDEX idx_brand_mentions_user_id ON brand_mentions(user_id);
CREATE INDEX idx_brand_mentions_platform ON brand_mentions(platform);
CREATE INDEX idx_brand_mentions_detected_at ON brand_mentions(detected_at DESC);
CREATE INDEX idx_content_recommendations_user_id ON content_recommendations(user_id);
CREATE INDEX idx_content_recommendations_status ON content_recommendations(status);
CREATE INDEX idx_content_recommendations_priority ON content_recommendations(priority_score DESC);
CREATE INDEX idx_platform_coverage_user_id ON platform_coverage(user_id);
CREATE INDEX idx_platform_coverage_platform_id ON platform_coverage(platform_id);
CREATE INDEX idx_platform_coverage_calculated_at ON platform_coverage(calculated_at DESC);
CREATE INDEX idx_market_intelligence_competitor_domain ON market_intelligence(competitor_domain);
CREATE INDEX idx_market_intelligence_collected_at ON market_intelligence(collected_at DESC);
CREATE INDEX idx_user_alerts_user_id ON user_alerts(user_id);
CREATE INDEX idx_user_alerts_created_at ON user_alerts(created_at DESC);
CREATE INDEX idx_user_alerts_is_read ON user_alerts(is_read);

-- Insert comprehensive AI platforms data
INSERT INTO ai_platforms (name, display_name, category, detection_patterns) VALUES
('chatgpt', 'ChatGPT', 'llm', '{"user_agents": ["ChatGPT-User", "GPTBot"], "ip_ranges": ["20.15.240.0/20"]}'),
('claude', 'Claude', 'llm', '{"user_agents": ["Claude-Web", "ClaudeBot"], "ip_ranges": ["52.222.0.0/16"]}'),
('gemini', 'Google Gemini', 'llm', '{"user_agents": ["Google-Extended", "GoogleOther"], "ip_ranges": ["66.249.0.0/16"]}'),
('perplexity', 'Perplexity AI', 'search', '{"user_agents": ["PerplexityBot"], "ip_ranges": ["44.242.0.0/16"]}'),
('bing_chat', 'Bing Chat', 'search', '{"user_agents": ["bingbot"], "ip_ranges": ["40.77.0.0/16"]}'),
('you_chat', 'You.com Chat', 'search', '{"user_agents": ["YouBot"], "ip_ranges": ["54.36.0.0/16"]}'),
('character_ai', 'Character.AI', 'assistant', '{"user_agents": ["CharacterAI"], "ip_ranges": ["35.247.0.0/16"]}'),
('anthropic_research', 'Anthropic Research', 'research', '{"user_agents": ["anthropic-ai"], "ip_ranges": ["52.222.0.0/16"]}'),
('openai_research', 'OpenAI Research', 'research', '{"user_agents": ["OpenAI-SearchBot"], "ip_ranges": ["20.15.240.0/20"]}'),
('cohere', 'Cohere AI', 'llm', '{"user_agents": ["CohereBot"], "ip_ranges": ["35.203.0.0/16"]}'),
('huggingface', 'Hugging Face', 'research', '{"user_agents": ["HuggingFaceBot"], "ip_ranges": ["35.240.0.0/16"]}'),
('stability_ai', 'Stability AI', 'research', '{"user_agents": ["StabilityBot"], "ip_ranges": ["34.102.0.0/16"]}'),
('midjourney', 'Midjourney', 'assistant', '{"user_agents": ["MidjourneyBot"], "ip_ranges": ["35.185.0.0/16"]}'),
('replicate', 'Replicate', 'research', '{"user_agents": ["ReplicateBot"], "ip_ranges": ["35.236.0.0/16"]}'),
('runway', 'Runway ML', 'research', '{"user_agents": ["RunwayBot"], "ip_ranges": ["35.188.0.0/16"]}'),
('jasper', 'Jasper AI', 'assistant', '{"user_agents": ["JasperBot"], "ip_ranges": ["34.118.0.0/16"]}'),
('copy_ai', 'Copy.ai', 'assistant', '{"user_agents": ["CopyAIBot"], "ip_ranges": ["35.224.0.0/16"]}'),
('writesonic', 'Writesonic', 'assistant', '{"user_agents": ["WritesonicBot"], "ip_ranges": ["34.134.0.0/16"]}'),
('notion_ai', 'Notion AI', 'assistant', '{"user_agents": ["NotionBot"], "ip_ranges": ["35.192.0.0/16"]}'),
('github_copilot', 'GitHub Copilot', 'assistant', '{"user_agents": ["GitHubCopilotBot"], "ip_ranges": ["140.82.0.0/16"]}'),
('cursor', 'Cursor AI', 'assistant', '{"user_agents": ["CursorBot"], "ip_ranges": ["35.208.0.0/16"]}'),
('replit', 'Replit AI', 'assistant', '{"user_agents": ["ReplitBot"], "ip_ranges": ["35.196.0.0/16"]}'),
('codeium', 'Codeium', 'assistant', '{"user_agents": ["CodeiumBot"], "ip_ranges": ["35.232.0.0/16"]}'),
('tabnine', 'Tabnine', 'assistant', '{"user_agents": ["TabnineBot"], "ip_ranges": ["35.200.0.0/16"]}'),
('amazon_q', 'Amazon Q', 'assistant', '{"user_agents": ["AmazonQBot"], "ip_ranges": ["52.94.0.0/16"]}'),
('meta_ai', 'Meta AI', 'llm', '{"user_agents": ["Meta-ExternalAgent", "FacebookBot"], "ip_ranges": ["31.13.0.0/16"]}'),
('x_ai', 'xAI Grok', 'llm', '{"user_agents": ["GrokBot"], "ip_ranges": ["104.244.0.0/16"]}'),
('mistral', 'Mistral AI', 'llm', '{"user_agents": ["MistralBot"], "ip_ranges": ["35.180.0.0/16"]}'),
('inflection', 'Inflection Pi', 'assistant', '{"user_agents": ["PiBot"], "ip_ranges": ["35.212.0.0/16"]}'),
('ai21', 'AI21 Labs', 'research', '{"user_agents": ["AI21Bot"], "ip_ranges": ["35.204.0.0/16"]}');

-- Update existing agent_types table with new AI platforms
INSERT INTO agent_types (name, description, category, detection_patterns) VALUES
('ChatGPT-User', 'ChatGPT user browsing agent', 'llm_inference', '{"user_agents": ["ChatGPT-User"], "ip_ranges": ["20.15.240.0/20"]}'),
('ClaudeBot', 'Anthropic Claude web crawler', 'llm_training', '{"user_agents": ["ClaudeBot"], "ip_ranges": ["52.222.0.0/16"]}'),
('Google-Extended', 'Google AI training crawler', 'llm_training', '{"user_agents": ["Google-Extended"], "ip_ranges": ["66.249.0.0/16"]}'),
('YouBot', 'You.com search crawler', 'search_inference', '{"user_agents": ["YouBot"], "ip_ranges": ["54.36.0.0/16"]}'),
('CharacterAI', 'Character.AI crawler', 'llm_inference', '{"user_agents": ["CharacterAI"], "ip_ranges": ["35.247.0.0/16"]}'),
('anthropic-ai', 'Anthropic research crawler', 'research', '{"user_agents": ["anthropic-ai"], "ip_ranges": ["52.222.0.0/16"]}'),
('OpenAI-SearchBot', 'OpenAI search crawler', 'research', '{"user_agents": ["OpenAI-SearchBot"], "ip_ranges": ["20.15.240.0/20"]}'),
('CohereBot', 'Cohere AI crawler', 'llm_training', '{"user_agents": ["CohereBot"], "ip_ranges": ["35.203.0.0/16"]}'),
('HuggingFaceBot', 'Hugging Face model crawler', 'research', '{"user_agents": ["HuggingFaceBot"], "ip_ranges": ["35.240.0.0/16"]}'),
('Meta-ExternalAgent', 'Meta AI external agent', 'llm_training', '{"user_agents": ["Meta-ExternalAgent"], "ip_ranges": ["31.13.0.0/16"]}'),
('GrokBot', 'xAI Grok crawler', 'llm_training', '{"user_agents": ["GrokBot"], "ip_ranges": ["104.244.0.0/16"]}'),
('MistralBot', 'Mistral AI crawler', 'llm_training', '{"user_agents": ["MistralBot"], "ip_ranges": ["35.180.0.0/16"]}'),
('PiBot', 'Inflection Pi crawler', 'llm_inference', '{"user_agents": ["PiBot"], "ip_ranges": ["35.212.0.0/16"]}'),
('AI21Bot', 'AI21 Labs crawler', 'research', '{"user_agents": ["AI21Bot"], "ip_ranges": ["35.204.0.0/16"]}'),
('StabilityBot', 'Stability AI crawler', 'research', '{"user_agents": ["StabilityBot"], "ip_ranges": ["34.102.0.0/16"]}');

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON competitors TO anon;
GRANT ALL PRIVILEGES ON competitors TO authenticated;

GRANT SELECT ON competitive_mentions TO anon;
GRANT ALL PRIVILEGES ON competitive_mentions TO authenticated;

GRANT SELECT ON query_tracking TO anon;
GRANT ALL PRIVILEGES ON query_tracking TO authenticated;

GRANT SELECT ON brand_mentions TO anon;
GRANT ALL PRIVILEGES ON brand_mentions TO authenticated;

GRANT SELECT ON content_recommendations TO anon;
GRANT ALL PRIVILEGES ON content_recommendations TO authenticated;

GRANT SELECT ON ai_platforms TO anon;
GRANT ALL PRIVILEGES ON ai_platforms TO authenticated;

GRANT SELECT ON platform_coverage TO anon;
GRANT ALL PRIVILEGES ON platform_coverage TO authenticated;

GRANT SELECT ON market_intelligence TO anon;
GRANT ALL PRIVILEGES ON market_intelligence TO authenticated;

GRANT SELECT ON user_alerts TO anon;
GRANT ALL PRIVILEGES ON user_alerts TO authenticated;

-- Create Row Level Security (RLS) policies
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own competitors" ON competitors
    FOR ALL USING (auth.uid() = user_id);

ALTER TABLE competitive_mentions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access mentions for their competitors" ON competitive_mentions
    FOR ALL USING (competitor_id IN (SELECT id FROM competitors WHERE user_id = auth.uid()));

ALTER TABLE query_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own query tracking" ON query_tracking
    FOR ALL USING (auth.uid() = user_id);

ALTER TABLE brand_mentions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own brand mentions" ON brand_mentions
    FOR ALL USING (auth.uid() = user_id);

ALTER TABLE content_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own content recommendations" ON content_recommendations
    FOR ALL USING (auth.uid() = user_id);

ALTER TABLE platform_coverage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own platform coverage" ON platform_coverage
    FOR ALL USING (auth.uid() = user_id);

ALTER TABLE user_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own alerts" ON user_alerts
    FOR ALL USING (auth.uid() = user_id);

-- AI platforms and market intelligence are public read-only
ALTER TABLE ai_platforms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AI platforms are publicly readable" ON ai_platforms
    FOR SELECT USING (true);

ALTER TABLE market_intelligence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Market intelligence is publicly readable" ON market_intelligence
    FOR SELECT USING (true);

-- Create materialized views for performance
CREATE MATERIALIZED VIEW daily_brand_metrics AS
SELECT 
    user_id,
    DATE(detected_at) as date,
    platform,
    COUNT(*) as mention_count,
    AVG(rank_position) as avg_rank,
    AVG(visibility_score) as avg_visibility,
    AVG(sentiment_score) as avg_sentiment
FROM brand_mentions
WHERE detected_at >= NOW() - INTERVAL '90 days'
GROUP BY user_id, DATE(detected_at), platform;

CREATE UNIQUE INDEX ON daily_brand_metrics (user_id, date, platform);

CREATE MATERIALIZED VIEW competitive_landscape AS
SELECT 
    c.user_id,
    c.domain,
    DATE(cm.detected_at) as date,
    cm.platform,
    COUNT(*) as total_mentions,
    AVG(cm.rank_position) as avg_rank,
    COUNT(DISTINCT c.id) as active_competitors
FROM competitors c
JOIN competitive_mentions cm ON c.id = cm.competitor_id
WHERE cm.detected_at >= NOW() - INTERVAL '30 days'
GROUP BY c.user_id, c.domain, DATE(cm.detected_at), cm.platform;

CREATE UNIQUE INDEX ON competitive_landscape (user_id, domain, date, platform);

-- Create functions for analytics calculations
CREATE OR REPLACE FUNCTION calculate_share_of_voice(
    p_user_id UUID,
    p_platform VARCHAR(50),
    p_start_date TIMESTAMP WITH TIME ZONE,
    p_end_date TIMESTAMP WITH TIME ZONE
) RETURNS FLOAT AS $$
DECLARE
    brand_mentions_count INTEGER;
    total_mentions_count INTEGER;
BEGIN
    -- Count brand mentions
    SELECT COUNT(*) INTO brand_mentions_count
    FROM brand_mentions
    WHERE user_id = p_user_id
        AND platform = p_platform
        AND detected_at BETWEEN p_start_date AND p_end_date;
    
    -- Count total mentions (brand + competitors)
    SELECT COUNT(*) INTO total_mentions_count
    FROM (
        SELECT 1 FROM brand_mentions bm
        WHERE bm.user_id = p_user_id
            AND bm.platform = p_platform
            AND bm.detected_at BETWEEN p_start_date AND p_end_date
        UNION ALL
        SELECT 1 FROM competitive_mentions cm
        JOIN competitors c ON cm.competitor_id = c.id
        WHERE c.user_id = p_user_id
            AND cm.platform = p_platform
            AND cm.detected_at BETWEEN p_start_date AND p_end_date
    ) combined;
    
    IF total_mentions_count = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN (brand_mentions_count::FLOAT / total_mentions_count::FLOAT) * 100;
END;
$$ LANGUAGE plpgsql;

-- Create function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_brand_metrics;
    REFRESH MATERIALIZED VIEW CONCURRENTLY competitive_landscape;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to refresh views (requires pg_cron extension)
-- SELECT cron.schedule('refresh-analytics', '0 */6 * * *', 'SELECT refresh_analytics_views();');

COMMIT;