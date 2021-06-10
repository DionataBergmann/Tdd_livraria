exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('livros').del()
    .then(function () {
      // Inserts seed entries
      return knex('livros').insert([
        {titulo: 'A garota do lago', autor_id:5,ano:2017, preco:12.50, foto:'https://www.storytel.com/images/200x200/0000843433.jpg'},
        {titulo: '1984', autor_id:4,ano:2021, preco:14.90, foto:'https://images-na.ssl-images-amazon.com/images/I/51VXYaKO-sL._SX346_BO1,204,203,200_.jpg'},

      ]);
    });
};
