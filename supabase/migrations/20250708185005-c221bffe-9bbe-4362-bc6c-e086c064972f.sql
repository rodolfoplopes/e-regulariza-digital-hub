-- Create document audit logs table for tracking document validation history
CREATE TABLE public.document_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL,
  action TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  observation TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.document_audit_logs 
ADD CONSTRAINT fk_document_audit_logs_document_id 
FOREIGN KEY (document_id) REFERENCES public.process_documents(id) ON DELETE CASCADE;

ALTER TABLE public.document_audit_logs 
ADD CONSTRAINT fk_document_audit_logs_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Enable RLS on document_audit_logs
ALTER TABLE public.document_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for document_audit_logs
CREATE POLICY "Admins can view all document audit logs" 
ON public.document_audit_logs 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = ANY(ARRAY['admin', 'admin_master', 'admin_editor', 'admin_viewer'])
));

CREATE POLICY "Admins can create document audit logs" 
ON public.document_audit_logs 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = ANY(ARRAY['admin', 'admin_master', 'admin_editor'])
));

-- Create index for better performance
CREATE INDEX idx_document_audit_logs_document_id ON public.document_audit_logs(document_id);
CREATE INDEX idx_document_audit_logs_created_at ON public.document_audit_logs(created_at DESC);

-- Create function to automatically create audit log when document status changes
CREATE OR REPLACE FUNCTION public.create_document_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create audit log if status or review_notes changed
  IF OLD.status IS DISTINCT FROM NEW.status OR OLD.review_notes IS DISTINCT FROM NEW.review_notes THEN
    INSERT INTO public.document_audit_logs (
      document_id,
      action,
      previous_status,
      new_status,
      observation,
      user_id
    ) VALUES (
      NEW.id,
      CASE 
        WHEN NEW.status = 'aprovado' THEN 'approved'
        WHEN NEW.status = 'rejeitado' THEN 'rejected'
        ELSE 'updated'
      END,
      OLD.status,
      NEW.status,
      NEW.review_notes,
      COALESCE(NEW.reviewed_by, auth.uid())
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic audit logging
CREATE TRIGGER trigger_document_audit_log
  AFTER UPDATE ON public.process_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.create_document_audit_log();