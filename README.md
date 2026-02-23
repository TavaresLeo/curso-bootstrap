# Portfólio Full Stack - hDC Agency

Projeto de portfólio modernizado com:

- **Frontend responsivo** em Bootstrap + JS.
- **Backend em Node.js/Express**.
- **Persistência em SQLite** para cadastro de clientes.
- Painel no próprio site com **últimos clientes cadastrados em tempo real**.

## Como executar

```bash
npm install
npm start
```

Abra `http://localhost:3000`.

## API

### `GET /api/health`
Verifica saúde da aplicação.

### `GET /api/clients?limit=6`
Lista clientes mais recentes.

### `POST /api/clients`
Cadastra cliente.

Exemplo de payload:

```json
{
  "name": "Ana Souza",
  "email": "ana@empresa.com",
  "company": "Empresa XPTO",
  "service": "Desenvolvimento Web",
  "budget": 12000,
  "message": "Quero criar uma plataforma de assinaturas"
}
```
