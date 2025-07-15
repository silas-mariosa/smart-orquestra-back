# Documentação da API - Smart Orquestra Backend

## Visão Geral

Esta API gerencia um sistema de orquestra inteligente, permitindo o controle de usuários, instrumentos, louvores, grupos e categorias. Todas as rotas requerem autenticação via JWT token no header `Authorization: Bearer <token>`.

**Base URL:** `http://localhost:4000` (ou porta configurada via variável de ambiente PORT)

---

## 🔐 Autenticação (`/auth`)

### POST `/auth/signup`

**Descrição:** Registra um novo administrador e cria uma nova orquestra.

**Body:**

```json
{
  "nameOrquestra": "string",
  "name": "string",
  "email": "string",
  "senha": "string"
}
```

**Resposta de Sucesso:**

```json
{
  "success": true
}
```

**Resposta de Erro:**

```json
{
  "error": "E-mail ou senha não conferem!"
}
```

---

### POST `/auth/signupUsers`

**Descrição:** Registra um novo membro em uma orquestra existente (requer token de administrador).

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "name": "string",
  "email": "string",
  "senha": "string"
}
```

**Resposta de Sucesso:**

```json
{
  "success": true
}
```

---

### POST `/auth/signin`

**Descrição:** Realiza login do usuário e retorna token JWT.

**Body:**

```json
{
  "email": "string",
  "senha": "string"
}
```

**Resposta de Sucesso:**

```json
{
  "token": "jwt_token_here"
}
```

**Cookie:** `authTokenSmart` será definido automaticamente.

---

## 👥 Usuários (`/usuario`)

### GET `/usuario/`

**Descrição:** Lista todos os usuários da orquestra.

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso:**

```json
[
  {
    "id": "string",
    "name": "string",
    "accessLevel": "Administrador" | "Membro",
    "orchestraId": "string",
    "createdAt": "date"
  }
]
```

---

### GET `/usuario/:id`

**Descrição:** Obtém dados de um usuário específico.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID do usuário

**Resposta de Sucesso:**

```json
{
  "id": "string",
  "name": "string",
  "accessLevel": "string",
  "orchestraId": "string"
}
```

---

### POST `/usuario/`

**Descrição:** Cria um novo usuário na orquestra.

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "auth_id": "string",
  "orchestraId": "string",
  "accessLevel": "Administrador" | "Membro",
  "name": "string",
  "instrumentListId": "string",
  "groupId": "string"
}
```

---

### PUT `/usuario/update-usuario`

**Descrição:** Atualiza dados pessoais do usuário logado.

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "name": "string",
  "brithday": "string",
  "whatsapp": "string",
  "cep": "string",
  "estado": "string",
  "cidade": "string",
  "bairro": "string",
  "endereco": "string",
  "numero": "string",
  "complemento": "string"
}
```

---

### POST `/usuario/create-with-password`

**Descrição:** Cria um novo usuário com senha aleatória gerada automaticamente.

**Headers:** `Authorization: Bearer <token>`

**Permissão:** Apenas usuários com nível "Administrador"

**Body:**

```json
{
  "name": "string",
  "email": "string",
  "accessLevel": "Administrador" | "Membro"
}
```

**Resposta de Sucesso:**

```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "string",
    "name": "string",
    "accessLevel": "string",
    "orchestraId": "string",
    "createdAt": "date"
  },
  "password": "senha_gerada_aleatoriamente"
}
```

**Resposta de Erro (Acesso Negado):**

```json
{
  "error": "Acesso negado. Apenas administradores podem criar usuários."
}
```

---

### POST `/usuario/:id/reset-password`

**Descrição:** Gera uma nova senha aleatória para um usuário específico.

**Headers:** `Authorization: Bearer <token>`

**Permissão:** Apenas usuários com nível "Administrador"

**Parâmetros:** `id` - ID do usuário

**Resposta de Sucesso:**

```json
{
  "message": "Senha redefinida com sucesso",
  "user": {
    "id": "string",
    "name": "string",
    "accessLevel": "string",
    "orchestraId": "string"
  },
  "newPassword": "nova_senha_gerada_aleatoriamente"
}
```

**Resposta de Erro (Acesso Negado):**

```json
{
  "error": "Acesso negado. Apenas administradores podem redefinir senhas."
}
```

---

## 🎵 Louvores (`/louvores`)

### GET `/louvores/`

**Descrição:** Lista todos os louvores da orquestra com informações dos instrumentos.

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso:**

```json
[
  {
    "id": "string",
    "nameLouvor": "string",
    "description": "string",
    "pdf": "string",
    "mp3": "string",
    "instrumentos": "string",
    "instrumentoName": "string",
    "instrumentoCategories": "string",
    "instrumentoTipo": "string",
    "orchestraId": "string"
  }
]
```

---

### GET `/louvores/:id`

**Descrição:** Obtém um louvor específico por ID.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID do louvor

---

### POST `/louvores/`

**Descrição:** Cria um novo louvor.

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "nameLouvor": "string",
  "description": "string",
  "pdf": "string",
  "mp3": "string",
  "instrumentos": "string"
}
```

---

### PUT `/louvores/:id`

**Descrição:** Atualiza um louvor existente.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID do louvor

**Body:**

```json
{
  "nameLouvor": "string",
  "description": "string",
  "pdf": "string",
  "mp3": "string",
  "instrumentos": "string"
}
```

---

### DELETE `/louvores/:id`

**Descrição:** Remove um louvor.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID do louvor

---

## 🎼 Instrumentos (`/instrumentos`)

### GET `/instrumentos/`

**Descrição:** Lista todos os instrumentos da orquestra.

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso:**

```json
[
  {
    "id": "string",
    "nameInstrument": "string",
    "typeInstrument": "string",
    "categories": "string",
    "description": "string",
    "orchestraId": "string"
  }
]
```

---

### GET `/instrumentos/:id`

**Descrição:** Obtém um instrumento específico por ID.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID do instrumento

---

### POST `/instrumentos/`

**Descrição:** Cria um novo instrumento.

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "nameInstrument": "string",
  "typeInstrument": "string",
  "categories": "string",
  "description": "string"
}
```

---

### PUT `/instrumentos/:id`

**Descrição:** Atualiza um instrumento existente.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID do instrumento

**Body:**

```json
{
  "nameInstrument": "string",
  "typeInstrument": "string",
  "categories": "string",
  "description": "string"
}
```

---

### GET `/instrumentos/category/:id`

**Descrição:** Lista instrumentos por categoria.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID da categoria

---

### DELETE `/instrumentos/:id`

**Descrição:** Remove um instrumento.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID do instrumento

---

## 📂 Categorias (`/categorias`)

### GET `/categorias/`

**Descrição:** Lista todas as categorias da orquestra.

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso:**

```json
[
  {
    "id": "string",
    "name": "string",
    "orchestraId": "string"
  }
]
```

---

### GET `/categorias/:id`

**Descrição:** Obtém uma categoria específica por ID.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID da categoria

---

### POST `/categorias/`

**Descrição:** Cria uma nova categoria.

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "name": "string"
}
```

---

### PUT `/categorias/:id`

**Descrição:** Atualiza uma categoria existente.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID da categoria

**Body:**

```json
{
  "name": "string"
}
```

---

### DELETE `/categorias/:id`

**Descrição:** Remove uma categoria.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID da categoria

---

## 👥 Grupos (`/grupos`)

### GET `/grupos/`

**Descrição:** Lista todos os grupos da orquestra.

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso:**

```json
[
  {
    "id": "string",
    "name": "string",
    "historia": "string",
    "orchestraId": "string"
  }
]
```

---

### GET `/grupos/:id`

**Descrição:** Obtém um grupo específico por ID.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID do grupo

---

### POST `/grupos/`

**Descrição:** Cria um novo grupo.

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "name": "string",
  "historia": "string"
}
```

---

### PUT `/grupos/:id`

**Descrição:** Atualiza um grupo existente.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID do grupo

**Body:**

```json
{
  "name": "string",
  "historia": "string"
}
```

---

### DELETE `/grupos/:id`

**Descrição:** Remove um grupo.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID do grupo

---

## 📋 Lista de Grupos (`/grupo-lista`)

### GET `/grupo-lista/`

**Descrição:** Lista todas as associações de usuários com grupos.

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso:**

```json
[
  {
    "id": "string",
    "GroupId": "string",
    "userId": "string",
    "orchestraId": "string"
  }
]
```

---

### GET `/grupo-lista/:id`

**Descrição:** Obtém uma associação específica por ID.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID da associação

---

### POST `/grupo-lista/`

**Descrição:** Adiciona um usuário a um grupo.

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "GroupId": "string"
}
```

---

### PUT `/grupo-lista/:id`

**Descrição:** Atualiza a associação de um usuário com grupo.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID da associação

**Body:**

```json
{
  "GroupId": "string"
}
```

---

### DELETE `/grupo-lista/:id`

**Descrição:** Remove um usuário de um grupo.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID da associação

---

## 🎸 Lista de Instrumentos (`/instrumentos-lista`)

### GET `/instrumentos-lista/`

**Descrição:** Lista todos os instrumentos pessoais dos usuários.

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso:**

```json
[
  {
    "id": "string",
    "instrumentId": "string",
    "user_id": "string",
    "owner": "string",
    "position": "string",
    "serie": "string",
    "brand": "string",
    "model": "string",
    "orchestraId": "string"
  }
]
```

---

### GET `/instrumentos-lista/:id`

**Descrição:** Obtém um instrumento pessoal específico por ID.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID do instrumento pessoal

---

### GET `/instrumentos-lista/by-user`

**Descrição:** Lista instrumentos pessoais do usuário logado.

**Headers:** `Authorization: Bearer <token>`

---

### POST `/instrumentos-lista/`

**Descrição:** Adiciona um instrumento pessoal ao usuário.

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "instrumentId": "string",
  "owner": "string",
  "position": "string",
  "serie": "string",
  "brand": "string",
  "model": "string"
}
```

---

### PUT `/instrumentos-lista/:id`

**Descrição:** Atualiza um instrumento pessoal.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID do instrumento pessoal

**Body:**

```json
{
  "instrumentId": "string",
  "owner": "string",
  "position": "string",
  "serie": "string",
  "brand": "string",
  "model": "string"
}
```

---

### DELETE `/instrumentos-lista/:id`

**Descrição:** Remove um instrumento pessoal.

**Headers:** `Authorization: Bearer <token>`

**Parâmetros:** `id` - ID do instrumento pessoal

---

## 📊 Dashboard (`/dashboard`)

### GET `/dashboard/membros`

**Descrição:** Retorna dados para o dashboard de membros com os 10 últimos louvores cadastrados.

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso:**

```json
{
  "ultimosLouvores": [
    {
      "id": "string",
      "nameLouvor": "string",
      "description": "string",
      "pdf": "string",
      "mp3": "string",
      "instrumentos": "string",
      "orchestraId": "string",
      "createdAt": "date"
    }
  ],
  "totalLouvores": 10
}
```

---

### GET `/dashboard/admin`

**Descrição:** Retorna dados para o dashboard administrativo com estatísticas e listas dos últimos registros.

**Headers:** `Authorization: Bearer <token>`

**Permissão:** Apenas usuários com nível "Administrador"

**Resposta de Sucesso:**

```json
{
  "estatisticas": {
    "totalUsuarios": 25,
    "totalLouvores": 150,
    "usuariosPorNivel": {
      "Administrador": 2,
      "Membro": 23
    }
  },
  "ultimosUsuarios": [
    {
      "id": "string",
      "name": "string",
      "accessLevel": "string",
      "orchestraId": "string",
      "createdAt": "date"
    }
  ],
  "ultimosLouvores": [
    {
      "id": "string",
      "nameLouvor": "string",
      "description": "string",
      "pdf": "string",
      "mp3": "string",
      "instrumentos": "string",
      "orchestraId": "string",
      "createdAt": "date"
    }
  ]
}
```

**Resposta de Erro (Acesso Negado):**

```json
{
  "error": "Acesso negado. Apenas administradores podem acessar este dashboard."
}
```

---

## 🔧 Configuração e Execução

### Variáveis de Ambiente

```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/database
JWT_SECRET=your_jwt_secret_here
```

### Instalação e Execução

```bash
# Instalar dependências
bun install

# Executar em modo desenvolvimento
bun dev

# Executar migrações
bun run migrate

# Gerar schema
bun run generate
```

### Swagger UI

Acesse `http://localhost:4000/swagger` para visualizar a documentação interativa da API.

---

## 📝 Notas Importantes

1. **Autenticação:** Todas as rotas (exceto `/auth/signup` e `/auth/signin`) requerem token JWT válido.
2. **OrchestraId:** A maioria das operações é filtrada pelo `orchestraId` do usuário logado.
3. **Permissões:** Usuários com nível "Administrador" têm acesso total, "Membros" têm acesso limitado.
4. **Validação:** Todos os dados de entrada são validados usando Zod.
5. **CORS:** A API está configurada para aceitar requisições de diferentes origens.

---

## 🚨 Códigos de Erro Comuns

- `400` - Dados inválidos ou token inválido
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

---

_Documentação gerada automaticamente - Smart Orquestra Backend_
