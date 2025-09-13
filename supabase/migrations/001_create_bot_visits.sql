-- Create bot_visits table to track AI bot visits
CREATE TABLE IF NOT EXISTS bot_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bot_type VARCHAR(100) NOT NULL,
  user_agent TEXT NOT NULL,
  ip_address INET,
  website_url TEXT,
  referer TEXT,
  is_bot BOOLEAN DEFAULT true,
  bot_confidence DECIMAL(3,2) DEFAULT 1.0,
  additional_data JSONB DEFAULT '{}'
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bot_visits_created_at ON bot_visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bot_visits_bot_type ON bot_visits(bot_type);
CREATE INDEX IF NOT EXISTS idx_bot_visits_website_url ON bot_visits(website_url);

-- Enable Row Level Security
ALTER TABLE bot_visits ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for dashboard)
CREATE POLICY "Allow public read access" ON bot_visits
  FOR SELECT USING (true);

-- Create policy to allow public insert (for tracking endpoint)
CREATE POLICY "Allow public insert" ON bot_visits
  FOR INSERT WITH CHECK (true);

-- Grant permissions to anon and authenticated roles
GRANT SELECT, INSERT ON bot_visits TO anon;
GRANT SELECT, INSERT ON bot_visits TO authenticated;