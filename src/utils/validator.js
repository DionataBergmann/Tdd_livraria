

export default class Validator{
    static validLivro(livro){
        const{titulo} = livro;
        if(titulo.length < 4){
            throw new Error('Descricao deve estar entre 4 e 100 caracteres')
        }
        else if(titulo.length > 100){
            throw new Error('Descricao deve ser menor que 100 caracteres')
        }
        else {
            return livro;
        }
    }
}

