const knex = require("../database/dbConfig");
const {edit} = require('./EditLivrosController');


module.exports = {

  async index(req, res) {
    
    const comentario = await knex
      .select("c.id", "l.titulo as livros", "c.comentario")
      .from("avaliacao as c")
      .leftJoin("livros as l", "c.livros_id", "l.id")
      .orderBy("c.id", "desc");

    res.status(200).json(comentario);
  },

  async store(req, res) {
    // faz a desestruturação do objeto req.body
    const { livros_id, comentario } = req.body;

    // validação para os campos
    if (!livros_id || !comentario) {
      res.status(400).json({ erro: "Enviar id do livro e comentario" });
      return;
    }

    try {
      const novo = await knex("avaliacao").insert({ livros_id, comentario });
      res.status(201).json({ id: novo[0] });
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  },

  async edit(req,res){
      const id = req.params.id;
      const {comentario} = req.body;

      try {
       await knex("avaliacao").update({comentario}).where({id})
        res.status(201).json("Atualizado");
      } catch (error) {
        res.status(400).json({ erro: error.message });
      }
  },

  async destroy(req,res){
    const id = req.params.id;

    try {
     await knex("avaliacao").del().where({id})
      res.status(201).json({ok:1,msg:"Deletado"});
    } catch (error) {
      res.status(400).json({ erro: error.message });
        }
    }
};