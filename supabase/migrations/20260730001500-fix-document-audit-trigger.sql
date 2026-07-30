-- create_document_audit_log trigger inserted into document_audit_logs
-- without organization_id, which is NOT NULL since the Fase A
-- multi-tenant migration. NEW.organization_id (the process_documents
-- row being updated) already has it, no lookup needed.
CREATE OR REPLACE FUNCTION public.create_document_audit_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status OR OLD.review_notes IS DISTINCT FROM NEW.review_notes THEN
    INSERT INTO public.document_audit_logs (
      organization_id,
      document_id,
      action,
      previous_status,
      new_status,
      observation,
      user_id
    ) VALUES (
      NEW.organization_id,
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
$function$;
