-- 2. Row Level Security Policies

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_test_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_tasks ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = auth_user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = auth_user_id);
CREATE POLICY "Public profiles are readable by authenticated users" ON profiles FOR SELECT USING (auth.role() = 'authenticated');

-- ai_conversations
CREATE POLICY "Users can CRUD own conversations" ON ai_conversations 
FOR ALL USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- ai_messages
CREATE POLICY "Users can CRUD own messages" ON ai_messages 
FOR ALL USING (
  conversation_id IN (
    SELECT id FROM ai_conversations 
    WHERE user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  )
);

-- career_tests
CREATE POLICY "Users can CRUD own tests" ON career_tests
FOR ALL USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- career_test_responses
CREATE POLICY "Users can CRUD own test responses" ON career_test_responses
FOR ALL USING (
  test_id IN (
    SELECT id FROM career_tests
    WHERE user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  )
);

-- career_test_results
CREATE POLICY "Users can CRUD own test results" ON career_test_results
FOR ALL USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- career_roadmaps
CREATE POLICY "Users can CRUD own roadmaps" ON career_roadmaps
FOR ALL USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- roadmap_milestones
CREATE POLICY "Users can CRUD own milestones" ON roadmap_milestones
FOR ALL USING (
  roadmap_id IN (
    SELECT id FROM career_roadmaps
    WHERE user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  )
);

-- roadmap_tasks
CREATE POLICY "Users can CRUD own roadmap tasks" ON roadmap_tasks
FOR ALL USING (
  milestone_id IN (
    SELECT id FROM roadmap_milestones
    WHERE roadmap_id IN (
      SELECT id FROM career_roadmaps
      WHERE user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
    )
  )
);
