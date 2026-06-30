-- Gamification Engine additions

-- 1. Add xp and level columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}';

-- 2. Create a table to track XP transactions (optional but good for history)
CREATE TABLE IF NOT EXISTS xp_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create a function to award XP securely
CREATE OR REPLACE FUNCTION award_xp(p_user_id UUID, p_amount INTEGER, p_reason TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_xp INTEGER;
  new_level INTEGER;
BEGIN
  -- Insert transaction
  INSERT INTO xp_transactions (user_id, amount, reason)
  VALUES (p_user_id, p_amount, p_reason);

  -- Get current XP and update
  UPDATE profiles
  SET xp = xp + p_amount
  WHERE id = p_user_id
  RETURNING xp INTO current_xp;

  -- Calculate level (e.g., Level = 1 + floor(XP / 100))
  new_level := 1 + FLOOR(current_xp / 100);

  -- Update level if changed
  UPDATE profiles
  SET level = new_level
  WHERE id = p_user_id AND level != new_level;
END;
$$;
