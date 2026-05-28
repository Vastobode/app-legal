const express = require('express')
const cors = require('cors')
const pool = require('./db')

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3000

async function criarTabela() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id SERIAL PRIMARY KEY,
      titulo TEXT NOT NULL
    )
  `)
}

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok'
  })
})

app.get('/tarefas', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM tarefas ORDER BY id'
    )

    res.json(resultado.rows)

  } catch (erro) {
    console.error(erro)
    res.status(500).json({
      erro: 'Erro ao buscar tarefas'
    })
  }
})

app.post('/tarefas', async (req, res) => {
  try {

    const { titulo } = req.body

    const resultado = await pool.query(
      'INSERT INTO tarefas (titulo) VALUES ($1) RETURNING *',
      [titulo]
    )

    res.status(201).json(resultado.rows[0])

  } catch (erro) {
    console.error(erro)
    res.status(500).json({
      erro: 'Erro ao criar tarefa'
    })
  }
})

criarTabela().then(() => {

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
  })

})

