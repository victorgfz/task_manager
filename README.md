# Documentação do Projeto


## 1. Introdução

O **Task Manager** é um sistema de gerenciamento de tarefas para equipes, desenvolvido para facilitar o acompanhamento das atividades de cada membro do time. O projeto foi inspirado na dinâmica de um escritório de marketing, onde a gestão precisa ter visibilidade sobre as tarefas atribuídas aos funcionários para delegar novas atividades de forma eficiente.

O sistema permite que as tarefas passem por diferentes estados (Disponível, Em Processo, Concluída), proporcionando uma visão clara do andamento do trabalho da equipe. Com isso, tanto os colaboradores quanto os gestores conseguem monitorar e organizar melhor suas atividades.


## 2. Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

- Next.js 15 - Framework React para aplicações web
- Drizzle ORM - ORM para manipulação do banco de dados
- Auth.js - Gerenciamento de autenticação
- Tailwind CSS - Estilização do front-end
- SWR - Gerenciamento de requisições assíncronas


## 3. Estrutura do Projeto

A estrutura do projeto está organizada da seguinte forma:

```
/task_manager
│-- /public
│   │-- /images           # Arquivos de imagem públicos
│-- /src
│   │-- /app              # Lógica principal da aplicação
│   │-- /components       # Componentes reutilizáveis
│   │-- /db               # Configuração do banco de dados e models do Drizzle ORM
│   │-- /hooks            # Hooks personalizados para gerenciamento de estados
│   │-- /styles           # Configurações do Tailwind CSS
│   │-- /utils            # Funções utilitárias
```


## 4. Funcionalidades

O sistema conta com as seguintes funcionalidades principais:

- Autenticação de Usuários: Controle de acesso utilizando Auth.js.
- Gerenciamento de Tarefas:
  - Criar novas tarefas.
  - Atribuir tarefas a membros da equipe.
  - Atualizar o status das tarefas (**Disponível, Em Processo, Concluída**).
  - Visualizar as tarefas atribuídas.
  - Filtrar tarefas por status.

Esse projeto foi desenvolvido com foco em simplicidade e objetividade, permitindo que os gestores tenham um panorama claro das tarefas em andamento e consigam delegar novas atividades de forma mais eficiente.


## 5. Melhorias Futuras

Para tornar o Task Manager ainda mais funcional e eficiente, algumas melhorias estão planejadas para versões futuras:

Priorização de Tarefas: Permitir a definição de níveis de prioridade para cada tarefa, facilitando a organização do fluxo de trabalho.

Anexos de Arquivos: Possibilitar o envio de arquivos junto às tarefas, permitindo que documentos, imagens e outros recursos necessários sejam compartilhados diretamente na plataforma.

Criação de Projetos: Introduzir a funcionalidade de criação de projetos, que poderão ser divididos em tarefas menores, ajudando no planejamento e na organização do trabalho em equipe.

Essas melhorias visam aprimorar a experiência dos usuários e aumentar a eficiência da gestão de tarefas dentro das equipes.

[Task Manager](https://task-manager-jade-nine.vercel.app)

