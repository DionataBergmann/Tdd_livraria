import {uuid} from 'uuidv4';

export default class Livro {
    constructor(code, titulo, autor_id, ano, preco, foto, destaque=0, id=uuid()){
        this.code = code;
        this.titulo = titulo;
        this.autor_id = autor_id;
        this.ano = ano;
        this.preco = preco;
        this.foto = foto;
        this.destaque = destaque;
        this.id = id;
    }
}