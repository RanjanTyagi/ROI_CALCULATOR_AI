-- Drop existing table if needed (be careful with this in production)
DROP TABLE IF EXISTS campaigns CASCADE;

-- Create campaigns table with proper structure
CREATE TABLE campaigns (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cost DECIMAL(10,2) NOT NULL CHECK (cost >= 0),
  revenue DECIMAL(10,2) NOT NULL CHECK (revenue >= 0),
  roi DECIMAL(5,2) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_campaigns_timestamp ON campaigns(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations" ON campaigns FOR ALL USING (true);

-- Insert some sample data for testing
INSERT INTO campaigns (name, cost, revenue, roi, timestamp) VALUES
('Social Media Campaign', 5000.00, 8000.00, 60.00, NOW() - INTERVAL '5 days'),
('Email Marketing', 2000.00, 6000.00, 200.00, NOW() - INTERVAL '3 days'),
('Google Ads Campaign', 10000.00, 15000.00, 50.00, NOW() - INTERVAL '1 day');

