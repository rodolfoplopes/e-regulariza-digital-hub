
# e-regulariza - Plataforma de Regularização Imobiliária

![e-regulariza Logo](./public/lovable-uploads/3b439cb9-4071-4319-8787-a968cea832a7.png)

## 📋 Sobre o Projeto

A e-regulariza é uma plataforma digital moderna para gerenciamento e acompanhamento de processos de regularização imobiliária. Oferece uma interface intuitiva para clientes acompanharem seus processos e um painel administrativo completo para a equipe técnica.

## 🚀 Funcionalidades Principais

### Para Clientes
- Dashboard personalizado com status do processo
- Upload e visualização de documentos
- Chat em tempo real com a equipe técnica
- Timeline interativa do progresso
- Notificações automáticas

### Para Administradores
- Gestão completa de processos e clientes
- CMS para conteúdos institucionais
- Relatórios e exportação de dados
- Sistema de mensagens e notificações
- Configurações avançadas do sistema

## 🛠️ Stack Tecnológica

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Estado**: TanStack Query (React Query)
- **Roteamento**: React Router DOM
- **Ícones**: Lucide React
- **Gráficos**: Recharts

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── admin/          # Componentes específicos do admin
│   ├── dashboard/      # Componentes do dashboard
│   ├── layout/         # Componentes de layout
│   ├── process/        # Componentes de processos
│   ├── ui/            # Componentes base (shadcn/ui)
│   └── user/          # Componentes de usuário
├── hooks/             # Custom hooks
├── pages/             # Páginas principais
├── services/          # Serviços e APIs
├── types/             # Definições de tipos TypeScript
├── utils/             # Utilitários e helpers
└── integrations/      # Configurações de integração (Supabase)
```

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ e npm
- Conta no Supabase

### Configuração Local

1. **Clone o repositório**
```bash
git clone <URL_DO_REPOSITORIO>
cd e-regulariza
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Supabase**
   - Acesse [Supabase Dashboard](https://supabase.com/dashboard)
   - Crie um novo projeto ou use o existente
   - Configure as variáveis no arquivo `src/integrations/supabase/client.ts`

4. **Execute as migrações do banco**
   - Acesse o SQL Editor no Supabase
   - Execute os scripts SQL da pasta `/docs/database/`

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build localmente
- `npm run lint` - Executa linting do código

## 🔐 Sistema de Permissões

### Roles Disponíveis
- **admin**: Acesso completo ao sistema
- **cliente**: Acesso aos próprios processos

### Mapeamento de Rotas por Permissão
- **Públicas**: `/`, `/login`, `/register`, `/politica-privacidade`, `/termos-uso`
- **Cliente**: `/dashboard`, `/processo/:id`, `/configuracoes`
- **Admin**: `/admin/*`, todas as rotas de cliente

## 🗃️ Banco de Dados

### Principais Tabelas
- `profiles` - Dados dos usuários
- `processes` - Processos de regularização
- `process_steps` - Etapas dos processos
- `process_messages` - Chat/mensagens
- `process_documents` - Documentos anexados
- `cms_contents` - Conteúdos do CMS
- `notifications` - Sistema de notificações

## 🚀 Deploy

### Usando Lovable
1. Clique em "Publish" no editor Lovable
2. Configure domínio personalizado se necessário

### Supabase Configuration
- Configure as URLs de redirecionamento
- Ative RLS em todas as tabelas sensíveis
- Configure as políticas de segurança

## 📚 Documentação Adicional

- [Fluxograma do Sistema](./docs/system-flow.md)
- [Guia de Componentes](./docs/components-guide.md)
- [API Reference](./docs/api-reference.md)
- [Roadmap Técnico](./docs/technical-roadmap.md)

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o projeto:
- Email: dev@e-regulariza.com
- Documentação: [docs.lovable.dev](https://docs.lovable.dev)

## 📄 Licença

Este projeto é propriedade da e-regulariza. Todos os direitos reservados.
