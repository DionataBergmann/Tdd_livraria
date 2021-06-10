/* eslint-disable no-undef */
import request from 'supertest';

import app from '../src/app';
import Livro from '../src/models/livro';
import Validator from '../src/utils/validator'
import ValidatorAutor from '../src/utils/ValidatorAutor';
import ValidatorPreco from '../src/utils/ValidatorPreco';


let livros;

beforeEach(() => {
  livros = [ new Livro(
    9,
   'A garota do lago',
    2,
    2021,
    19.90,
    'https//teste.jpg',
    
  )];
});

test('soma de 2 numeros', async () =>{
    const a = 2
    const b = 3
    const soma = a + b
    expect(soma).toBe(5)
})

test('deve ser possível criar um novo livro', async () => {
  const response = await request(app)
    .post('/livros') 
    .send(livros[0]); 

  expect(response.body).toMatchObject({
    ...livros[0],
    destaque: 0,
  });
});

test('o status code de um livro criado deverá ser 201', async () => {
  const response = await request(app)
    .post('/livros')
    .send(livros[0]);
  expect(response.status).toBe(201);
});

test('deve ser possível atualizar dados de um livro', async () => {
  const responseSave = await request(app)
    .post('/livros')
    .send(livros[0]);
  const updatedLivro = {
    ...livros[0],
    titulo: 'Livro Alterado',

  };
  const responseUpdate = await request(app)
    .put(`/livros/${responseSave.body.id}`)
    .send(updatedLivro);

  expect(responseUpdate.body).toMatchObject(updatedLivro);
});

test('não deve ser possível atualizar um livro inexistente', async () => {
  await request(app)
    .put('/livros/999999')
    .expect(400);
});


test('não deve ser possível remover um livro inexistente', async () => {
  await request(app)
    .put('/livros/999999')
    .expect(400);
});

test('deve retornar o código 204 quando um livro for removido', async () => {
  const response = await request(app)
    .post('/livros')
    .send(livros[0]);

  await request(app)
    .delete(`/livros/${response.body.code}`)
    .expect(204);
});

test('deve ser possível remover os livros pelo código', async () => {
  const response = await request(app)
    .post('/livros')
    .send(livros[0]);

  await request(app)
    .post('/livros')
    .send(livros[1]);

  await request(app)
    .delete(`/livros/${response.body.code}`)
    .expect(204);

  const all = await request(app)
    .get('/livros');

  expect(all.body).not.toMatchObject([{ code: response.body.code }]);
});

test('deve ser possível listar todos os livros', async () => {
  const responseSave = await request(app)
    .post('/livros')
    .send(livros[0]);

  const response = await request(app)
    .get('/livros');
  expect(response.body).toEqual(
    expect.arrayContaining([
      {
        id: responseSave.body.id,
        ...livros[0],
        destaque: 0,

      },
    ]),
  );
});

test('não deve ser possível atualizar o número de destaque de um livro manualmente', async () => {
  const responseSave = await request(app)
    .post('/livros')
    .send(livros[0]);
  const updatedLivro = {
    ...livros[0],
    destaque: 10000000,
  };
  const responseUpdate = await request(app)
    .put(`/livros/${responseSave.body.id}`)
    .send(updatedLivro);

  expect(responseUpdate.body.destaque).toBe(0);
});

test('deve ser possível destacar um livro', async () => {
  const response = await request(app)
    .post('/livros')
    .send(livros[0]);

  const response2 = await request(app)
    .post(`/livros/${response.body.code}/destaque`)
    .send(response.body);

  expect(response2.body).toMatchObject({
    destaque: 1,
  });
});

test('deve possuir o número de destaque igual a 0 um livro recém criado o qual o seu código seja inexistente', async () => {
  const response = await request(app)
    .post('/livros')
    .send({
      ...livros[0],
      code: 12344321,
      destaque: 10,
    });
  expect(response.body).toMatchObject({
    destaque: 0,
  });
});

test('Um livro deverá herdar o número de destaque caso seu código já exista', async () => {
  const response = await request(app)
    .post('/livros')
    .send({
      ...livros[0],
      code: 201,
    });

  await request(app)
    .post(`/livros/${response.body.code}/destaque`)
    .send(response.body);

  const response2 = await request(app)
    .post('/livros')
    .send({
      ...livros[0],
      code: 201,
    });

  expect(response2.body).toMatchObject({
    destaque: 1,
  });
});

test('livros de mesmo código devem compartilhar o destaque', async () => {
  const response = await request(app)
    .post('/livros')
    .send({
      ...livros[0],
      code: 201,
    });

  await request(app)
    .post(`/livros/${response.body.code}/destaque`)
    .send(response.body);

  const response2 = await request(app)
    .post('/livros')
    .send({
      ...livros[0],
      code: 201,
    });

  await request(app)
    .post(`/livros/${response2.body.code}/destaque`)
    .send(response2.body);


  expect(response2.body).toMatchObject({
    destaque: 2,
  });
});

//--------------------------------------------------------------------

test('Não deve ser aceito titulo menor que 4 caracteres', () => {
    expect(() =>{
      Validator.validLivro(new Livro(
        12,
        '19',
         3,
         2021,
         29.90,
         'https//teste2.jpg',))
    }).toThrow(new Error('Descricao deve estar entre 4 e 100 caracteres'));
});

test('Deve ser aceito titulo com 4 caracteres', () => {

  const livro = Validator.validLivro(new Livro(
    13,
    '1984',
     4,
     2020,
     9.90,
     'https//teste3.jpg',))
expect(livro.titulo).toBe('1984');
});

test('Não deve ser aceito titulo maior que 100 caracteres', () => {
  expect(() =>{
    Validator.validLivro(new Livro(
      12,
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
       3,
       2021,
       29.90,
       'https//teste2.jpg',))
  }).toThrow(new Error('Descricao deve ser menor que 100 caracteres'));
});

test('Deve ser aceito titulo com até 100 caracteres', () => {

    const livro = Validator.validLivro(new Livro(
      13,
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
       4,
       2020,
       9.90,
       'https//teste3.jpg',))
  expect(livro.titulo).toBe('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
});




test('Não deve ser aceito autor_id menor que 0', () => {
  expect(() =>{
    ValidatorAutor.validLivro(new Livro(
      12,
      '1984',
       -1,
       2020,
       29.90,
       'https//teste2.jpg',))
  }).toThrow(new Error('Autor deve ser maior que 0'));
});

test('Deve ser aceito autor_id maior que 0', () => {

  const livro = ValidatorAutor.validLivro(new Livro(
    13,
    '1984',
     2,
     2020,
     9.90,
     'https//teste3.jpg',))
expect(livro.autor_id).toBe(2);
});


test('Não deve ser aceito preço menor que 0', () => {
  expect(() =>{
    ValidatorPreco.validLivro(new Livro(
      12,
      '1984',
       2,
       2020,
       -29.99,
       'https//teste2.jpg',))
  }).toThrow(new Error('Preço deve ser maior que 0'));
});

test('Deve ser aceito preço maior que 0', () => {

  const livro = ValidatorPreco.validLivro(new Livro(
    13,
    '1984',
     2,
     2020,
     9.90,
     'https//teste3.jpg',))
expect(livro.preco).toBe(9.90);
});

