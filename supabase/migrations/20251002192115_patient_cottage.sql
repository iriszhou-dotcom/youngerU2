/*
  # Create YoungerU Database Schema

  1. New Tables
    - `profiles` - User profile information
    - `planner_sessions` - AI planner results and inputs
    - `library_items` - Supplement library with evidence-based information
    - `habits` - User habits and routines
    - `habit_logs` - Daily habit completion tracking
    - `forecasts` - Wellness projection data
    - `safety_checks` - Supplement safety analysis results
    - `questions` - Community questions
    - `answers` - Community answers to questions

  2. Security
    - Enable RLS on all user tables
    - Add policies for authenticated users to access their own data
    - Public read access for library_items
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  age_band text,
  diet_pattern text,
  created_at timestamptz DEFAULT now()
);

-- Create planner_sessions table
CREATE TABLE IF NOT EXISTS planner_sessions (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  inputs jsonb NOT NULL,
  output jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create library_items table
CREATE TABLE IF NOT EXISTS library_items (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  evidence_level char(1) NOT NULL CHECK (evidence_level IN ('A', 'B', 'C')),
  summary text NOT NULL,
  how_to_take text NOT NULL,
  guardrails text NOT NULL,
  tags text[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  schedule jsonb NOT NULL DEFAULT '{"type": "daily"}',
  reminder_time text,
  created_at timestamptz DEFAULT now()
);

-- Create habit_logs table
CREATE TABLE IF NOT EXISTS habit_logs (
  id serial PRIMARY KEY,
  habit_id integer REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  done boolean DEFAULT false,
  UNIQUE(habit_id, date)
);

-- Create forecasts table
CREATE TABLE IF NOT EXISTS forecasts (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  inputs jsonb NOT NULL,
  projection jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create safety_checks table
CREATE TABLE IF NOT EXISTS safety_checks (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  supplements text[] DEFAULT '{}',
  meds text[] DEFAULT '{}',
  conditions text[] DEFAULT '{}',
  result jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id serial PRIMARY KEY,
  question_id integer REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  body text NOT NULL,
  is_expert boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Planner sessions: Users can access their own sessions
CREATE POLICY "Users can read own planner sessions"
  ON planner_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own planner sessions"
  ON planner_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Library items: Public read access
CREATE POLICY "Anyone can read library items"
  ON library_items
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Habits: Users can manage their own habits
CREATE POLICY "Users can read own habits"
  ON habits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
  ON habits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Habit logs: Users can manage their own logs
CREATE POLICY "Users can read own habit logs"
  ON habit_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habit logs"
  ON habit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habit logs"
  ON habit_logs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Forecasts: Users can access their own forecasts
CREATE POLICY "Users can read own forecasts"
  ON forecasts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own forecasts"
  ON forecasts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Safety checks: Users can access their own checks
CREATE POLICY "Users can read own safety checks"
  ON safety_checks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own safety checks"
  ON safety_checks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Questions: Users can read all, insert their own
CREATE POLICY "Anyone can read questions"
  ON questions
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert own questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Answers: Users can read all, insert their own
CREATE POLICY "Anyone can read answers"
  ON answers
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert own answers"
  ON answers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert sample library items
INSERT INTO library_items (slug, title, category, evidence_level, summary, how_to_take, guardrails, tags) VALUES
(
  'omega-3-epa-dha',
  'Omega-3 (EPA/DHA)',
  'Essential Fatty Acids',
  'A',
  'Omega-3 fatty acids EPA and DHA are essential fats that support brain health, heart function, and reduce inflammation. Strong evidence shows benefits for cognitive function, mood, and cardiovascular health. Most people don''t get enough from diet alone, making supplementation valuable for optimal health.',
  'Take 1-2g combined EPA/DHA daily with meals to improve absorption. Look for third-party tested products to ensure purity. Taking with fat-containing meals enhances uptake.',
  'May increase bleeding risk if taking blood thinners. Start with lower doses if you have digestive sensitivity. Choose reputable brands tested for mercury and other contaminants.',
  '{"Focus", "Recovery", "Heart Health", "Brain Health"}'
),
(
  'vitamin-d3',
  'Vitamin D3',
  'Vitamins',
  'A',
  'Vitamin D3 is crucial for bone health, immune function, and energy levels. Most people are deficient, especially those with limited sun exposure. Strong evidence supports its role in bone health, immune function, and mood regulation.',
  'Take 2000-4000 IU daily with a fat-containing meal. Higher doses may be needed if deficient - get blood levels tested. Take in morning to avoid potential sleep disruption.',
  'Monitor blood levels if taking >4000 IU long-term. Can interact with certain medications. Avoid if you have hypercalcemia or kidney stones without medical supervision.',
  '{"Energy", "Immune", "Bone Health", "Mood"}'
),
(
  'magnesium-glycinate',
  'Magnesium Glycinate',
  'Minerals',
  'B',
  'Magnesium glycinate is a highly absorbable form of magnesium that supports muscle recovery, sleep quality, and stress management. Many people are deficient due to soil depletion and processed foods. The glycinate form is gentle on the stomach.',
  'Take 200-400mg 30-60 minutes before bed. Start with a lower dose and increase gradually. Can be taken with or without food, but consistency is key.',
  'May cause loose stools in some people - reduce dose if this occurs. Can interact with certain antibiotics and medications. Avoid if you have kidney disease without medical supervision.',
  '{"Recovery", "Sleep", "Stress", "Muscle Health"}'
),
(
  'creatine-monohydrate',
  'Creatine Monohydrate',
  'Performance',
  'A',
  'Creatine monohydrate is one of the most researched supplements for athletic performance and muscle recovery. It helps regenerate ATP for energy during high-intensity activities and may support cognitive function.',
  'Take 3-5g daily, timing doesn''t matter. No loading phase needed. Mix with water or add to smoothies. Consistency is more important than timing.',
  'Generally very safe for healthy individuals. May cause minor water retention initially. Ensure adequate hydration. Not recommended if you have kidney disease.',
  '{"Recovery", "Performance", "Energy", "Muscle Building"}'
)
ON CONFLICT (slug) DO NOTHING;