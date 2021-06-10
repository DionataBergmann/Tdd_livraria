exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('avaliacao').del()
    .then(function () {
      // Inserts seed entries
      return knex('avaliacao').insert([
        {comentario: 'Livro sensacional!', livros_id:'13'},
        {comentario: 'Livro sensacional, top demais!', livros_id:'12'}
      ]);
    });
};
