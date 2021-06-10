const knex = require('../database/dbConfig')
const { index } = require('./LivroController')

module.exports = {
    async index(req, res){
        try{
            const dados = await knex('livros').where({'destaque': 1})
            if(dados.length == 0){
                res.status(201).json({msg:"Sem destaques"})
                return;
            }
            res.status(200).json({dados});
        }catch(error){
            res.status(400).json({erro: error.message});
        }
    },
    async update(req, res){
        const id = req.params["id"];
        try{
            const dados = await knex('livros').where({id})
            if(dados.length == 0){
                res.status(400).json({msg:"Informe um livro valido"})
                return;
            }
            if(dados[0].destaque == 1){
                await knex ('livros').where({id}).update({'destaque':0})
                res.status(200).json({msg:"Removido dos destaques"})
               
            }else{
                await knex ('livros').where({id}).update({'destaque':1})
                res.status(200).json({msg:"Livro em destaque"})
            }
        }catch(error){
            res.status(400).json({erro: error.message});

        }
    }
}