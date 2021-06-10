
import express from 'express';
import cors from 'cors';
import Livro from '../src/models/livro'
//import { uuid } from 'uuidv4';

const app = express();

app.use(express.json());
app.use(cors());


let livros = [];

app.get('/livros', (request, response) => {
  response.json(livros);
});

app.post('/livros', (request, response) => {
  // TODO: Desenvolver registro no array livros
  const {
    code, titulo, autor_id, ano, preco, foto, id
  } = request.body;
  const l = livros.find((v) => v.code == code);
  const destacar = l ? l.destaque : 0;

  const livro =  new Livro(code, titulo, autor_id, ano, preco, foto, destacar, id);

  livros.push(livro);
  response.status(201).json(livro);
});


app.put('/livros/:id', (request, response) => {
  // TODO: Desenvolver atualização de livro por ID
  const { id } = request.params;

  const {
    titulo, autor_id, ano, preco, foto,
  } = request.body;

  const l = livros.find((v) => v.id == id);

  if (l) {
    l.titulo = titulo;
    l.autor_id = autor_id;
    l.ano = ano;
    l.preco = preco;
    l.foto = foto;

    response.json(l);
  } else {
    response.status(400).send();
  }
});

app.delete('/livros/:code', (request, response) => {
  const { code } = request.params;
  const index = livros.findIndex((v) => v.code == code);

  if (index == -1) {
    response.status(400).send();
  } else {
    livros = livros.filter((v) => v.code != code);
    response.status(204).send();
  }
});

app.post('/livros/:code/destaque', (request, response) => {
  const { code } = request.params;

  const l = livros.find((v) => v.code == code);

  if (!l) {
    response.status(400).send();
  } else {
    livros.filter((v) => v.code == code)
      .map((val) => val.destaque += 1);

    response.json({
      destaque: l.destaque,
    });
  }
});

app.get('/livros/:code', (request, response) => {
  // TODO: Desenvolver busca de livros por código
});

export default app;
