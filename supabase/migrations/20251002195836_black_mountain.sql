/*
  # Add missing columns to questions table

  1. Schema Updates
    - Add is_published column with default true
    - Add likes_count and answers_count columns
    - Ensure tags column exists
    - Update existing records to have proper defaults

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control
*/

-- Add missing columns to questions table
DO $$
BEGIN
  -- Add is_published column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE questions ADD COLUMN is_published boolean DEFAULT true;
  END IF;

  -- Add likes_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'likes_count'
  ) THEN
    ALTER TABLE questions ADD COLUMN likes_count integer DEFAULT 0;
  END IF;

  -- Add answers_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'answers_count'
  ) THEN
    ALTER TABLE questions ADD COLUMN answers_count integer DEFAULT 0;
  END IF;

  -- Ensure tags column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'tags'
  ) THEN
    ALTER TABLE questions ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
END $$;

-- Update existing records to have proper defaults
UPDATE questions 
SET 
  is_published = COALESCE(is_published, true),
  likes_count = COALESCE(likes_count, 0),
  answers_count = COALESCE(answers_count, 0),
  tags = COALESCE(tags, '{}');

-- Add missing columns to answers table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'answers') THEN
    -- Add likes_count column if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'answers' AND column_name = 'likes_count'
    ) THEN
      ALTER TABLE answers ADD COLUMN likes_count integer DEFAULT 0;
    END IF;
    
    -- Update existing records
    UPDATE answers SET likes_count = COALESCE(likes_count, 0);
  END IF;
END $$;