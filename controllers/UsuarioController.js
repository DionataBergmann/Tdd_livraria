const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');

const knex = require("../database/dbConfig");

module.exports = {
  async index(req, res) {
    
    const usuarios = await knex('usuarios')
        res.status(200).json(usuarios);
  },

  async store(req, res) {
    // faz a desestruturação do objeto req.body
    const { nome, email, senha} = req.body;

    // validação para os campos
    if (!nome || !email || !senha ) {
      res.status(400).json({ erro: "Enviar nome, email e senha do Usuario" });
     
      return;
    }


    try {
      const dados = await knex("usuarios").where({email});
      if(dados.length){
        res.status(400).json({erro:"E-mail ja cadastrado"})
        return
      }
      
    } catch (error) {
      res.status(400).json({ erro: error.message });
      return
    }

    const hash = bcrypt.hashSync(senha, 10);

    try {
      const novo = await knex("usuarios").insert({ nome, email, senha: hash });
      res.status(201).json({ id: novo[0] });
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  },

  async update(req,res){
  const id = req.params.id;
  const {senha} = req.body;

  try {
   await knex("usuarios").update({senha}).where({id})
    res.status(201).json("Senha atualizada");
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
},

async destroy(req,res){
  const id = req.params.id;

  try {
   await knex("usuarios").del().where({id})
    res.status(201).json({ok:1,msg:"User Deletado"});
  } catch (error) {
    res.status(400).json({ erro: error.message });
      }
  },


      //LOGIN

  async login (req, res){
      const {email, senha} = req.body;

      if(!email || !senha){
        res.status(400).json({erro: "Login/senha incorretos"});
        return;
      }
      try{
        const dados = await knex("usuarios").where({email});
        if(dados.length == 0){
          res.status(400).json({erro: "Login/senha incorretos"});
        return;
        }

        if(bcrypt.compareSync(senha, dados[0].senha)){

          const token = jwt.sign({
            usuario_id: dados[0].id,
            usuario_nome: dados[0].nome
          },
          process.env.JWT_KEY,
          {expiresIn:"1h"}
          );

          res.status(200).json({token})
        }else{
          res.status(400).json({erro:"Login/senha incorretos"})
        }

      }catch(error){
        res.status(400).json({ erro: error.message });
      }
  }

};