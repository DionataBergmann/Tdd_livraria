exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('autores').del()
    .then(function () {
      // Inserts seed entries
      return knex('autores').insert([
        {nome: 'George Orwell'}, //4
        {nome: 'Charlie Donlea'}, //5
        {nome: 'Edécio Fernando Iepsen'} // 6
      ]);
    });
};
