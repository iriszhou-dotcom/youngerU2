@@ .. @@
 CREATE POLICY "Users can read own safety checks"
   ON safety_checks
   FOR SELECT
   TO authenticated
   USING (uid() = user_id);

+-- Questions table RLS policies
+ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
+
+-- READ: authenticated users can read all published questions
+CREATE POLICY "questions select (authed)"
+  ON questions
+  FOR SELECT
+  TO authenticated
+  USING (is_published = true);
+
+-- INSERT: users can only insert their own questions
+CREATE POLICY "questions insert own (authed)"
+  ON questions
+  FOR INSERT
+  TO authenticated
+  WITH CHECK (user_id = uid());
+
+-- READ: anonymous users can read published questions (optional for public access)
+CREATE POLICY "questions select (anon)"
+  ON questions
+  FOR SELECT
+  TO anon
+  USING (is_published = true);
+
+-- Ensure columns and defaults exist
+ALTER TABLE questions
+  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
+  ADD COLUMN IF NOT EXISTS tags TEXT[];
+
+-- Update any existing null values
+UPDATE questions SET is_published = true WHERE is_published IS NULL;