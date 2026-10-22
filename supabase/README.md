# WeGuest + Supabase — início multi-casal

## O que esta migração adiciona
A migration `supabase/migrations/202610210001_weguest_multicouple_foundation.sql` cria tabelas novas com prefixo `wg_` para casais, conteúdo de sites, mídias, convidados, presentes, mural e transações. As tabelas antigas não são alteradas.

## Antes de executar
1. Confirme que está no projeto Supabase correto.
2. Faça backup/exportação do banco e verifique se há dados importantes.
3. Revise a migration com alguém responsável pelo banco. Não execute direto em produção sem validar em um projeto de teste.
4. Abra Supabase Dashboard → SQL Editor, cole o conteúdo da migration e execute.

## Importante sobre acesso
- RLS está habilitado nas tabelas novas.
- Casais administram registros ligados ao seu `owner_user_id`; staff deve ser provisionado por operador confiável.
- A view `wg_public_sites` publica somente campos selecionados dos sites com status `published`.
- A migration não libera criação pública de RSVP/recados nem gravação de transações no cliente.
- Pagamentos devem ser confirmados por webhook verificado em backend/Edge Function; nunca confiar em aprovação gerada no navegador.
- Configuração de políticas de Supabase Storage ainda precisa ser implantada e testada antes de habilitar upload. Não torne um bucket privado público inadvertidamente.

## Configuração local (não colocar segredos no Git)
Crie `.env.local` na raiz do projeto, usando o `.env.example` apenas como modelo:

```dotenv
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICAVEL
```

O `.gitignore` atual contém `.env*` e libera apenas `.env.example`. Confira se o `.env.local` continua ignorado antes de qualquer commit. Use apenas publishable/anon key no frontend; nunca use `service_role`, secret key, senha de banco ou credenciais de pagamento no navegador.

## Estado da integração
Esta é a fundação SQL, não a migração completa do app. O frontend ainda possui estado demonstrativo/localStorage e ainda precisa de autenticação, seleção de casal/site, integração de consultas/mutações, Storage e fluxos de convite seguros. A criação de tabelas não comprova carga/capacidade nem segurança de ponta a ponta.
