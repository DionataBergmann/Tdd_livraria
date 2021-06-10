export default class ValidatorPreco{
    static validLivro(livro){
        const{preco} = livro;
        if(preco < 0){
            throw new Error('Preço deve ser maior que 0')
        }
        else {
            return livro;
        }
    }
}

