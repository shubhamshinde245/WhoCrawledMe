-- Create foundational tables for WhoCrawledMe
-- This migration creates the base schema required for the AI platform intelligence system

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    subscription_tier VARCHAR(20) DEFAULT 'starter' CHECK (subscription_tier IN ('starter', 'pro', 'business', 'enterprise')),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Websites table
CREATE TABLE websites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL,
    tracking_code VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent types table
CREATE TABLE agent_types (
    name VARCHAR(50) PRIMARY KEY,
    description TEXT,
    category VARCHAR(30) NOT NULL,
    detection_patterns JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Agent visits table (enhanced version of bot_visits)
CREATE TABLE agent_visits (
    id UUID DEFAULT gen_random_uuid(),
    website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    agent_type VARCHAR(50) REFERENCES agent_types(name),
    user_agent TEXT NOT NULL,
    ip_address INET NOT NULL,
    url_path TEXT NOT NULL,
    purpose VARCHAR(20) CHECK (purpose IN ('training', 'inference', 'research', 'unknown')),
    confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
    headers JSONB,
    geo_data JSONB,
    visit_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, visit_time)
);

-- Note: TimescaleDB not available, using regular table with time-based partitioning via indexes

-- Session data table
CREATE TABLE session_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL,
    page_views INTEGER DEFAULT 1,
    dwell_time INTEGER DEFAULT 0,
    bandwidth_used BIGINT DEFAULT 0,
    crawl_pattern JSONB,
    session_start TIMESTAMP WITH TIME ZONE NOT NULL,
    session_end TIMESTAMP WITH TIME ZONE
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(20) NOT NULL,
    visit_limit INTEGER NOT NULL,
    retention_days INTEGER NOT NULL,
    api_access BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- API keys table
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    permissions JSONB DEFAULT '{}',
    last_used TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_agent_visits_website_id ON agent_visits(website_id);
CREATE INDEX idx_agent_visits_agent_type ON agent_visits(agent_type);
CREATE INDEX idx_agent_visits_visit_time ON agent_visits(visit_time DESC);
CREATE INDEX idx_agent_visits_ip_address ON agent_visits(ip_address);
CREATE INDEX idx_session_data_visit_id ON session_data(visit_id);
CREATE INDEX idx_websites_user_id ON websites(user_id);
CREATE INDEX idx_websites_tracking_code ON websites(tracking_code);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);

-- Insert initial agent types
INSERT INTO agent_types (name, description, category, detection_patterns) VALUES
('GPTBot', 'OpenAI GPT web crawler', 'llm_training', '{"user_agents": ["GPTBot"], "ip_ranges": ["20.15.240.0/20"]}'),
('Claude-Web', 'Anthropic Claude web crawler', 'llm_training', '{"user_agents": ["Claude-Web"], "ip_ranges": ["52.222.0.0/16"]}'),
('PerplexityBot', 'Perplexity AI search crawler', 'search_inference', '{"user_agents": ["PerplexityBot"], "ip_ranges": ["44.242.0.0/16"]}'),
('Bingbot', 'Microsoft Bing crawler with AI features', 'search_inference', '{"user_agents": ["bingbot"], "ip_ranges": ["40.77.0.0/16"]}'),
('Googlebot-AI', 'Google AI training crawler', 'llm_training', '{"user_agents": ["Googlebot"], "ip_ranges": ["66.249.0.0/16"]}');

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON users TO anon;
GRANT ALL PRIVILEGES ON users TO authenticated;

GRANT SELECT ON websites TO anon;
GRANT ALL PRIVILEGES ON websites TO authenticated;

GRANT SELECT ON agent_types TO anon;
GRANT ALL PRIVILEGES ON agent_types TO authenticated;

GRANT SELECT ON agent_visits TO anon;
GRANT ALL PRIVILEGES ON agent_visits TO authenticated;

GRANT SELECT ON session_data TO anon;
GRANT ALL PRIVILEGES ON session_data TO authenticated;

GRANT SELECT ON subscriptions TO anon;
GRANT ALL PRIVILEGES ON subscriptions TO authenticated;

GRANT SELECT ON api_keys TO anon;
GRANT ALL PRIVILEGES ON api_keys TO authenticated;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own data" ON users
    FOR ALL USING (auth.uid() = id);

ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own websites" ON websites
    FOR ALL USING (auth.uid() = user_id);

ALTER TABLE agent_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access visits to their websites" ON agent_visits
    FOR ALL USING (website_id IN (SELECT id FROM websites WHERE user_id = auth.uid()));

ALTER TABLE session_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their session data" ON session_data
    FOR ALL USING (visit_id IN (SELECT id FROM agent_visits WHERE website_id IN (SELECT id FROM websites WHERE user_id = auth.uid())));

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own subscriptions" ON subscriptions
    FOR ALL USING (auth.uid() = user_id);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own API keys" ON api_keys
    FOR ALL USING (auth.uid() = user_id);

-- Agent types are publicly readable
ALTER TABLE agent_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agent types are publicly readable" ON agent_types
    FOR SELECT USING (true);

COMMIT;