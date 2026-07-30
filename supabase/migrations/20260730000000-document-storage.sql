-- Storage bucket real para documentos de processo (Fase B).
-- Convenção de path: {processId}/{documentId}-{filename}
-- A primeira pasta do path é sempre o processId, o que permite às
-- policies abaixo checar acesso via join com a tabela processes,
-- sem precisar de organization_id direto em storage.objects.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'process-documents',
  'process-documents',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

CREATE POLICY "Users can view documents of accessible processes"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'process-documents'
  AND EXISTS (
    SELECT 1 FROM public.processes
    WHERE processes.id::text = (storage.foldername(name))[1]
      AND processes.organization_id = public.current_user_org_id()
      AND (processes.client_id = auth.uid() OR public.current_user_role() = 'admin')
  )
);

CREATE POLICY "Users can upload documents to accessible processes"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'process-documents'
  AND EXISTS (
    SELECT 1 FROM public.processes
    WHERE processes.id::text = (storage.foldername(name))[1]
      AND processes.organization_id = public.current_user_org_id()
      AND (processes.client_id = auth.uid() OR public.current_user_role() = 'admin')
  )
);

CREATE POLICY "Admins can delete documents of their organization"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'process-documents'
  AND EXISTS (
    SELECT 1 FROM public.processes
    WHERE processes.id::text = (storage.foldername(name))[1]
      AND processes.organization_id = public.current_user_org_id()
      AND public.current_user_role() = 'admin'
  )
);
