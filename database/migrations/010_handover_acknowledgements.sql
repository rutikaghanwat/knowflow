-- Durable recipient acknowledgement and immutable acknowledgement metadata.
CREATE TABLE IF NOT EXISTS public.handover_acknowledgements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handover_id UUID NOT NULL UNIQUE REFERENCES public.handovers(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE RESTRICT,
  comments TEXT NULL,
  acknowledged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_handover_acknowledgements_recipient ON public.handover_acknowledgements(recipient_id, acknowledged_at DESC);
ALTER TABLE public.handover_acknowledgements ENABLE ROW LEVEL SECURITY;
-- Direct client access remains denied. All access is mediated by the authenticated backend.
