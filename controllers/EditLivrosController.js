const knex = require('../database/dbConfig')
const { edit } = require('./AvaliacaoController')

module.exports = {

    async edit(req,res){
        const dado = req.body
        const dados = Object.getOwnPropertyNames(dado)

        if(dados[0] == "titulo" || dados[1] == "autor" || dados[2] == "preco"){
        const id = req.params.id;
        const {titulo, autor, preco} = req.body;

        try{
            await knex('livros').update({titulo, autor, preco}).where({id});
            res.status(200).json("Dados alterados");

        }catch(error){
            res.status(400).json({msg: error.message})
        }
    }
    }

}