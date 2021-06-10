
export default class ValidatorAutor{
    static validLivro(livro){
        const{autor_id} = livro;
        if(autor_id < 0){
            throw new Error('Autor deve ser maior que 0')
        }
        else {
            return livro;
        }
    }
}

