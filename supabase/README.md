# WeGuest + Supabase — início multi-casal

## O que esta fundação adiciona
- `supabase/migrations/202610210001_weguest_multicouple_foundation.sql`: tabelas novas com prefixo `wg_` para casais, conteúdo de sites, mídias, convidados, presentes, mural e transações. As tabelas antigas não são alteradas.
- `supabase/migrations/202610210002_weguest_media_publication.sql`: estado explícito de publicação e política para leitura pública somente de mídias publicadas em casais com site publicado.
- `supabase/functions/manage-media-publication/index.ts`: Edge Function autenticada para publicar/despublicar cópias de mídia entre os buckets.

## Antes de executar
1. Confirme que está no projeto Supabase correto.
2. Faça backup/exportação do banco e verifique se há dados importantes.
3. Revise as migrations com alguém responsável pelo banco. Não execute em produção sem validar em um projeto de teste.
4. Execute somente migrations ainda não aplicadas, na ordem numérica. A segunda migration é aditiva e usa `IF NOT EXISTS` para as colunas.
5. Configure os buckets `weguest-private` e `weguest-public` e revise as políticas de Storage antes de habilitar uploads.

## Publicação de mídia
O fluxo esperado é:
1. O upload original entra em `weguest-private` no caminho `<couple UUID>/<filename>`.
2. A linha correspondente em `public.wg_media` começa com `storage_bucket='weguest-private'`, `is_published=false` e `published_at=NULL`.
3. O casal autenticado solicita publicação chamando a Edge Function `manage-media-publication` com `{ "coupleId": "<uuid>", "mediaId": "<uuid>", "action": "publish" }`.
4. A função usa o JWT do usuário e RLS para validar acesso, verifica que o site está publicado, copia a mídia para `weguest-public` e só então atualiza os metadados.
5. Para despublicar, envie `"action": "unpublish"`. A função remove a cópia pública e mantém o original privado.

Exemplo de chamada pelo cliente, depois de inicializar o Supabase JS e autenticar o usuário:

```ts
const { data, error } = await supabase.functions.invoke(
  "manage-media-publication",
  { body: { coupleId, mediaId, action: "publish" } },
);
if (error) throw error;
```

## Implantação da Edge Function
Com Supabase CLI instalado e projeto vinculado:

```bash
supabase functions deploy manage-media-publication
```

A função usa as variáveis padrão `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` fornecidas pelo ambiente de Edge Functions. A chave `service_role` deve permanecer no servidor e nunca ser incluída no frontend, no `.env.local` do Vite ou no Git.

## Limites e avisos de segurança
- Um bucket público permite acesso por URL direta; políticas de SELECT não protegem URLs públicas. Despublicar remove a cópia pública, mas caches/CDNs e cópias baixadas anteriormente podem persistir.
- A função de publicação exige que o site do casal esteja com `status='published'`. A seleção visual de mídias e o upload no frontend ainda precisam ser implementados.
- As políticas de Storage usam caminhos `<couple UUID>/<filename>`; não aceite caminhos de arquivo arbitrários do cliente.
- A função confia no RLS da sessão autenticada para autorizar a linha de mídia e atualizá-la. Teste com dois usuários/casais distintos antes de produção.
- RLS está habilitado nas tabelas novas, mas permissões de tabela e políticas precisam ser avaliadas em conjunto.
- A view `wg_public_sites` deve ser revisada separadamente para garantir que não exponha conteúdo privado via privilégios do proprietário da view.
- A migration não libera criação pública de RSVP/recados nem gravação de transações no cliente. Pagamentos devem ser confirmados por webhook verificado em backend/Edge Function.

## Configuração local (não colocar segredos no Git)
Crie `.env.local` na raiz do projeto, usando `.env.example` apenas como modelo:

```dotenv
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICAVEL
```

O `.gitignore` deve manter `.env.local` ignorado. Use apenas publishable/anon key no frontend; nunca use `service_role`, secret key, senha de banco ou credenciais de pagamento no navegador.

## Estado da integração
Esta é a fundação SQL e o primeiro endpoint de publicação, não a integração completa do aplicativo. O frontend ainda possui estado demonstrativo/localStorage e ainda precisa de autenticação, seleção de casal/site, upload e galeria, integração de consultas/mutações e testes de segurança/carga. Não considere a publicação pronta para produção antes de implantar as migrations e a função, revisar o código, e executar testes reais.
