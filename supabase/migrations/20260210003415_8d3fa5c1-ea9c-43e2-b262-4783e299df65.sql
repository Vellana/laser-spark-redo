CREATE POLICY "Allow updating confirmation_sent" 
ON public.email_leads 
FOR UPDATE 
USING (true) 
WITH CHECK (true);