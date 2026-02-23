const path = require('path');
const express = require('express');
const { initializeDatabase, createClient, listClients } = require('./backend/database');

const app = express();
const PORT = process.env.PORT || 3000;

initializeDatabase();

app.use(express.json({ limit: '300kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname)));

function sanitizeText(value = '') {
  return String(value).trim();
}

function parseBudget(value) {
  const cleaned = String(value ?? '').replace(',', '.').trim();
  if (!cleaned) {
    return null;
  }

  const budget = Number(cleaned);
  return Number.isFinite(budget) && budget >= 0 ? budget : NaN;
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/clients', async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 20);
    const clients = await listClients(limit);
    res.json({ data: clients });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar clientes.' });
  }
});

app.post('/api/clients', async (req, res) => {
  const payload = {
    name: sanitizeText(req.body.name),
    email: sanitizeText(req.body.email).toLowerCase(),
    company: sanitizeText(req.body.company),
    service: sanitizeText(req.body.service),
    budget: parseBudget(req.body.budget),
    message: sanitizeText(req.body.message)
  };

  if (!payload.name || payload.name.length < 3) {
    return res.status(400).json({ error: 'Nome deve ter ao menos 3 caracteres.' });
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }

  if (!payload.company) {
    return res.status(400).json({ error: 'Empresa é obrigatória.' });
  }

  if (!payload.service) {
    return res.status(400).json({ error: 'Selecione um serviço de interesse.' });
  }

  if (Number.isNaN(payload.budget)) {
    return res.status(400).json({ error: 'Orçamento deve ser numérico.' });
  }

  try {
    const created = await createClient(payload);
    return res.status(201).json({
      message: 'Cliente cadastrado com sucesso.',
      data: created
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'Já existe cadastro com este e-mail.' });
    }

    return res.status(500).json({ error: 'Erro ao cadastrar cliente.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
