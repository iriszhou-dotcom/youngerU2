@@ .. @@
 -- Enable RLS on all tables
 ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
 ALTER TABLE planner_sessions ENABLE ROW LEVEL SECURITY;
 ALTER TABLE library_items ENABLE ROW LEVEL SECURITY;
 ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
 ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
 ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
 ALTER TABLE safety_checks ENABLE ROW LEVEL SECURITY;
 ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
 ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
 
 -- RLS Policies
@@ .. @@
 CREATE POLICY "Users can read own safety checks" ON safety_checks FOR SELECT TO authenticated USING (auth.uid() = user_id);
 CREATE POLICY "Users can insert own safety checks" ON safety_checks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
 
--- Questions and Answers (public read, authenticated insert)
-CREATE POLICY "Anyone can read questions" ON questions FOR SELECT TO anon, authenticated USING (true);
-CREATE POLICY "Users can insert own questions" ON questions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
+-- Questions policies
+CREATE POLICY "questions read (authed)" ON questions FOR SELECT TO authenticated USING (true);
+CREATE POLICY "questions insert (authed)" ON questions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
+CREATE POLICY "questions read (anon)" ON questions FOR SELECT TO anon USING (true);
 
 CREATE POLICY "Anyone can read answers" ON answers FOR SELECT TO anon, authenticated USING (true);
 CREATE POLICY "Users can insert own answers" ON answers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);