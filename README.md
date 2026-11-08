# Nothãn

Aplicação de anotações multiusuário, desenvolvida inicialmente como uma aplicação web responsiva e planejada para possível evolução mobile.

## Stack

- React
- Vite
- JavaScript
- CSS
- Supabase (integração prevista)

## Desenvolvimento local

Requisitos: Node.js 20.19+.

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: inicia o servidor de desenvolvimento.
- `npm run build`: gera a versão de produção.
- `npm run preview`: visualiza localmente a build de produção.

## Segurança

Arquivos de ambiente não devem ser versionados. Nunca coloque a chave `service_role` do Supabase no frontend.