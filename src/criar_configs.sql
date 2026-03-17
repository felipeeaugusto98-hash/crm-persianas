-- Tabela de configurações do CRM
-- Execute no Supabase Dashboard > SQL Editor
CREATE TABLE IF NOT EXISTS configs (
  id BIGSERIAL PRIMARY KEY,
  chave TEXT UNIQUE NOT NULL,
  valor TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso total configs" ON configs FOR ALL USING (true) WITH CHECK (true);
