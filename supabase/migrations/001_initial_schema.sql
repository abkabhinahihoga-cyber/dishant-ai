-- 0. Utility: Auto-update Trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. USERS & AUTH
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  age SMALLINT CHECK (age BETWEEN 10 AND 100),
  gender TEXT CHECK (gender IN ('male','female','non-binary','prefer_not_to_say')),
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  phone TEXT,
  college TEXT,
  degree TEXT,
  branch TEXT,
  year_of_study SMALLINT CHECK (year_of_study BETWEEN 1 AND 6),
  graduation_year SMALLINT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  dream_career TEXT,
  preferred_language TEXT DEFAULT 'en',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'student' CHECK (role IN ('student','mentor','admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_auth_user_id ON profiles(auth_user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_college ON profiles(college);
CREATE INDEX idx_profiles_skills ON profiles USING GIN (skills);
CREATE INDEX idx_profiles_interests ON profiles USING GIN (interests);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- 2. AI CONVERSATIONS
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New Chat',
  context_type TEXT DEFAULT 'career_mentor' CHECK (context_type IN ('career_mentor','study_help','interview_prep','resume_review','general')),
  model_used TEXT,
  metadata JSONB DEFAULT '{}',
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX idx_ai_messages_created_at ON ai_messages(created_at);

CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- 3. CAREER TEST (Psychometric Assessment)
CREATE TABLE IF NOT EXISTS career_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL CHECK (test_type IN ('interest','aptitude','personality','work_preference','comprehensive')),
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed','expired')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_test_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID NOT NULL REFERENCES career_tests(id) ON DELETE CASCADE,
  question_number SMALLINT NOT NULL,
  question_text TEXT NOT NULL,
  selected_option TEXT,
  score SMALLINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID NOT NULL UNIQUE REFERENCES career_tests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interest_scores JSONB,
  aptitude_scores JSONB,
  personality_type TEXT,
  personality_scores JSONB,
  work_preference_scores JSONB,
  top_careers JSONB,
  overall_fit_score NUMERIC(5,2),
  ai_analysis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_career_tests_user_id ON career_tests(user_id);
CREATE INDEX idx_career_test_results_user_id ON career_test_results(user_id);
CREATE INDEX idx_career_test_responses_test_id ON career_test_responses(test_id);

-- 4. ROADMAPS
CREATE TABLE IF NOT EXISTS career_roadmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  career_goal TEXT NOT NULL,
  duration_months SMALLINT NOT NULL,
  ai_generated BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','completed','paused','abandoned')),
  overall_progress NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roadmap_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_id UUID NOT NULL REFERENCES career_roadmaps(id) ON DELETE CASCADE,
  month_number SMALLINT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  skills_to_learn TEXT[] DEFAULT '{}',
  resources JSONB DEFAULT '[]',
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  sort_order SMALLINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roadmap_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  milestone_id UUID NOT NULL REFERENCES roadmap_milestones(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  sort_order SMALLINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_career_roadmaps_user_id ON career_roadmaps(user_id);
CREATE INDEX idx_roadmap_milestones_roadmap_id ON roadmap_milestones(roadmap_id);
CREATE INDEX idx_roadmap_tasks_milestone_id ON roadmap_tasks(milestone_id);

CREATE TRIGGER update_career_roadmaps_updated_at BEFORE UPDATE ON career_roadmaps FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER update_roadmap_milestones_updated_at BEFORE UPDATE ON roadmap_milestones FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
