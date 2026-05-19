-- Create database tables for GTM + LinkedIn setup app

-- Users table (stores user accounts)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  company_name VARCHAR(255),
  website_domain VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- GTM Credentials table
CREATE TABLE IF NOT EXISTS gtm_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gtm_account_id VARCHAR(255) NOT NULL,
  gtm_container_id VARCHAR(255) NOT NULL,
  gtm_container_name VARCHAR(255),
  api_key VARCHAR(255),
  encrypted_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, gtm_container_id)
);

-- LinkedIn Credentials table
CREATE TABLE IF NOT EXISTS linkedin_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  linkedin_ad_account_id VARCHAR(255) NOT NULL,
  partner_id VARCHAR(255),
  insight_tag_id VARCHAR(255),
  api_key VARCHAR(255),
  encrypted_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, linkedin_ad_account_id)
);

-- Implementation Progress table (tracks checklist completion)
CREATE TABLE IF NOT EXISTS implementation_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phase_key VARCHAR(50) NOT NULL,
  task_id VARCHAR(100) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, phase_key, task_id)
);

-- Conversion Events Configuration table
CREATE TABLE IF NOT EXISTS conversion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_name VARCHAR(100) NOT NULL,
  event_key VARCHAR(100) NOT NULL,
  description TEXT,
  linkedin_conversion_id VARCHAR(255),
  gtm_trigger_id VARCHAR(255),
  gtm_tag_id VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Implementation Notes & Logs table
CREATE TABLE IF NOT EXISTS implementation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_gtm_credentials_user_id ON gtm_credentials(user_id);
CREATE INDEX idx_linkedin_credentials_user_id ON linkedin_credentials(user_id);
CREATE INDEX idx_implementation_progress_user_id ON implementation_progress(user_id);
CREATE INDEX idx_conversion_events_user_id ON conversion_events(user_id);
CREATE INDEX idx_implementation_logs_user_id ON implementation_logs(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gtm_credentials_updated_at BEFORE UPDATE ON gtm_credentials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_linkedin_credentials_updated_at BEFORE UPDATE ON linkedin_credentials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_implementation_progress_updated_at BEFORE UPDATE ON implementation_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversion_events_updated_at BEFORE UPDATE ON conversion_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
