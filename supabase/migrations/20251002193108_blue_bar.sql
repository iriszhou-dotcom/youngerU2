@@ .. @@
 ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
 
 CREATE POLICY "Anyone can read questions"
   ON questions
   FOR SELECT
   TO anon, authenticated
   USING (true);
 
 CREATE POLICY "Users can insert own questions"
   ON questions
   FOR INSERT
   TO authenticated
   WITH CHECK (auth.uid() = user_id);
 
+-- Add foreign key constraint for questions -> profiles relationship
+ALTER TABLE questions 
+ADD CONSTRAINT questions_user_id_profiles_fkey 
+FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE;
+
 -- Create answers table
 CREATE TABLE IF NOT EXISTS answers (
   id SERIAL PRIMARY KEY,