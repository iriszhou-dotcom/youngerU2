/*
  # Fix Community Schema and RLS Policies

  1. Tables
    - Ensure questions table exists with proper structure
    - Add missing columns if needed
    - Create interaction tables (likes, saves, answers)

  2. Security
    - Enable RLS on all tables
    - Add proper policies for authenticated and anonymous users
    - Ensure foreign key relationships work with RLS

  3. Functions
    - Add trigger functions to maintain counts
    - Ensure data consistency
*/

-- Ensure questions table exists with all required columns
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  likes_count INTEGER DEFAULT 0,
  answers_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add missing columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'is_published') THEN
    ALTER TABLE questions ADD COLUMN is_published BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'likes_count') THEN
    ALTER TABLE questions ADD COLUMN likes_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'answers_count') THEN
    ALTER TABLE questions ADD COLUMN answers_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'tags') THEN
    ALTER TABLE questions ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Update any null values
UPDATE questions SET is_published = true WHERE is_published IS NULL;
UPDATE questions SET likes_count = 0 WHERE likes_count IS NULL;
UPDATE questions SET answers_count = 0 WHERE answers_count IS NULL;
UPDATE questions SET tags = '{}' WHERE tags IS NULL;

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_expert BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create question_likes table
CREATE TABLE IF NOT EXISTS question_likes (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(question_id, user_id)
);

-- Create answer_likes table
CREATE TABLE IF NOT EXISTS answer_likes (
  id SERIAL PRIMARY KEY,
  answer_id INTEGER NOT NULL REFERENCES answers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(answer_id, user_id)
);

-- Create saved_questions table
CREATE TABLE IF NOT EXISTS saved_questions (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(question_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "questions_select_anon" ON questions;
DROP POLICY IF EXISTS "questions_select_authenticated" ON questions;
DROP POLICY IF EXISTS "questions_insert_authenticated" ON questions;
DROP POLICY IF EXISTS "answers_select_all" ON answers;
DROP POLICY IF EXISTS "answers_insert_authenticated" ON answers;
DROP POLICY IF EXISTS "question_likes_select_all" ON question_likes;
DROP POLICY IF EXISTS "question_likes_insert_authenticated" ON question_likes;
DROP POLICY IF EXISTS "question_likes_delete_own" ON question_likes;
DROP POLICY IF EXISTS "answer_likes_select_all" ON answer_likes;
DROP POLICY IF EXISTS "answer_likes_insert_authenticated" ON answer_likes;
DROP POLICY IF EXISTS "answer_likes_delete_own" ON answer_likes;
DROP POLICY IF EXISTS "saved_questions_select_own" ON saved_questions;
DROP POLICY IF EXISTS "saved_questions_insert_authenticated" ON saved_questions;
DROP POLICY IF EXISTS "saved_questions_delete_own" ON saved_questions;

-- Questions policies
CREATE POLICY "questions_select_anon" ON questions
  FOR SELECT TO anon
  USING (is_published = true);

CREATE POLICY "questions_select_authenticated" ON questions
  FOR SELECT TO authenticated
  USING (is_published = true);

CREATE POLICY "questions_insert_authenticated" ON questions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Answers policies
CREATE POLICY "answers_select_all" ON answers
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "answers_insert_authenticated" ON answers
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Question likes policies
CREATE POLICY "question_likes_select_all" ON question_likes
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "question_likes_insert_authenticated" ON question_likes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "question_likes_delete_own" ON question_likes
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Answer likes policies
CREATE POLICY "answer_likes_select_all" ON answer_likes
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "answer_likes_insert_authenticated" ON answer_likes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "answer_likes_delete_own" ON answer_likes
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Saved questions policies
CREATE POLICY "saved_questions_select_own" ON saved_questions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "saved_questions_insert_authenticated" ON saved_questions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "saved_questions_delete_own" ON saved_questions
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Functions to update counts
CREATE OR REPLACE FUNCTION update_question_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE questions 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.question_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE questions 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.question_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_question_answers_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE questions 
    SET answers_count = answers_count + 1 
    WHERE id = NEW.question_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE questions 
    SET answers_count = answers_count - 1 
    WHERE id = OLD.question_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_answer_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE answers 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.answer_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE answers 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.answer_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers
DROP TRIGGER IF EXISTS question_likes_count_trigger ON question_likes;
DROP TRIGGER IF EXISTS question_answers_count_trigger ON answers;
DROP TRIGGER IF EXISTS answer_likes_count_trigger ON answer_likes;

-- Create triggers
CREATE TRIGGER question_likes_count_trigger
  AFTER INSERT OR DELETE ON question_likes
  FOR EACH ROW EXECUTE FUNCTION update_question_likes_count();

CREATE TRIGGER question_answers_count_trigger
  AFTER INSERT OR DELETE ON answers
  FOR EACH ROW EXECUTE FUNCTION update_question_answers_count();

CREATE TRIGGER answer_likes_count_trigger
  AFTER INSERT OR DELETE ON answer_likes
  FOR EACH ROW EXECUTE FUNCTION update_answer_likes_count();

-- Insert some sample data if questions table is empty
INSERT INTO questions (user_id, title, body, tags, is_published) 
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid,
  'Welcome to YoungerU Community!',
  'This is the first question in our community. Feel free to ask anything about supplements, wellness, and healthy aging.',
  ARRAY['Welcome', 'Community'],
  true
WHERE NOT EXISTS (SELECT 1 FROM questions LIMIT 1);