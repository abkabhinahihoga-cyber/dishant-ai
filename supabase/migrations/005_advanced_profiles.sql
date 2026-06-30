-- 1. Add advanced profile columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS resume_url TEXT;

-- 2. Create the Storage Bucket for resumes
-- Note: Requires superuser or the Supabase dashboard to execute properly, 
-- but we declare the policy here for completeness.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS for the resumes bucket
-- Allow users to upload their own resume
CREATE POLICY "Users can upload their own resume" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'resumes' AND auth.uid() = owner);

-- Allow users to view their own resume
CREATE POLICY "Users can view their own resume" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'resumes' AND auth.uid() = owner);

-- Allow users to delete their own resume
CREATE POLICY "Users can delete their own resume" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'resumes' AND auth.uid() = owner);
