# 🛒 ShopFlow API

API backend estruturada para um sistema de e-commerce, desenvolvida com foco em organização, escalabilidade e boas práticas de arquitetura.

Este projeto foi construído com separação clara de responsabilidades, testes unitários e modelagem consistente com Prisma ORM.

---

## 🚀 Tecnologias Utilizadas

- Node.js <br/>
- TypeScript <br/>
- Prisma ORM <br/>
- PostgreSQL <br/>
- Vitest (Testes unitários) <br/>

---

## 🏗️ Arquitetura

A aplicação segue uma arquitetura em camadas:

src/ <br/>
├── controllers/ <br/>
├── services/ <br/>
├── repositories/ <br/>
├── routes/ <br/>
├── prisma/ <br/>
└── tests/ <br/>


### 🔹 Controllers
Responsáveis por lidar com requisições HTTP e respostas.

### 🔹 Services
Contêm a lógica de negócio da aplicação.

### 🔹 Repositories
Camada de acesso a dados, responsável pela comunicação com o banco via Prisma.

Essa separação garante:

- Melhor organização
- Código mais testável
- Facilidade de manutenção
- Escalabilidade

---

## 📊 Modelagem de Dados

O projeto utiliza Prisma ORM para modelagem e gerenciamento do banco de dados PostgreSQL.

O schema define relacionamentos e entidades voltadas para um cenário real de e-commerce.

Para visualizar o schema:

```
npx prisma studio
```

📄 Funcionalidades Implementadas

Estruturação completa em camadas

Paginação de resultados

Modelagem relacional com Prisma

Testes unitários com Vitest

Organização voltada para escalabilidade

🧪 Testes

Os testes foram implementados utilizando Vitest.

Para rodar os testes:

```
npm run test
```
A estrutura foi pensada para facilitar a manutenção e expansão da cobertura de testes.

⚙️ Como Rodar o Projeto

1️⃣ Clone o repositório
```
git clone https://github.com/ivo-ryan/ShopFlow-Api.git
```

2️⃣ Instale as dependências
```
npm install

```

3️⃣ Configure o arquivo .env

Crie um arquivo .env na raiz do projeto com:

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"
<br/>

4️⃣ Rode as migrations

```
npx prisma migrate dev

```

5️⃣ Inicie o servidor

```
npm run dev

```

🎯 Objetivo do Projeto

O foco principal foi estruturar um backend organizado e escalável, aplicando:

Separação de responsabilidades

Boas práticas de arquitetura

Testabilidade

Tipagem forte com TypeScript

📌 Melhorias Futuras

Implementação de autenticação e autorização

Middleware global de tratamento de erros

Logging estruturado

Documentação com Swagger/OpenAPI

CI/CD

👨‍💻 Autor

Ivo Ryan
Desenvolvedor focado em backend e arquitetura de APIs.

Se este projeto foi útil ou interessante para você, fique à vontade para contribuir ou dar feedback.
