const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Criar Usuário + Perfil
app.post('/usuarios', async (req, res) => {
  const { nome, email, senha, perfil_nome } = req.body;

  try {
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha,
        perfil: {
          create: {
            perfil_nome,
          },
        },
      },
      include: { perfil: true }, // Retorna o perfil junto
    });
    res.status(201).json(usuario);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Listar Usuários com Perfil
app.get('/usuarios', async (req, res) => {
  const usuarios = await prisma.usuario.findMany({
    include: { perfil: true },
  });
  res.json(usuarios);
});

// Atualizar Usuário + Perfil
app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, perfil_nome } = req.body;

  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        nome,
        email,
        senha,
        perfil: {
          update: {
            perfil_nome,
          },
        },
      },
      include: { perfil: true },
    });
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ error: 'Usuário não encontrado ou erro ao atualizar' });
  }
});

// Deletar Usuário
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.usuario.delete({ where: { id: Number(id) } });
    res.json({ message: 'Usuário deletado' });
  } catch (error) {
    res.status(404).json({ error: 'Usuário não encontrado' });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));