exports.up = (knex) => {

    return knex.schema.createTable('livros', (table) => {
  
      table.increments();
  
      table.string('titulo', 80).notNullable();
  
      table.string('foto').notNullable();
  
      table.integer('ano').notNullable();
  
      table.decimal('preco', 9.2).notNullable();
  
      table.boolean('destaque').notNullable().defaultTo(false);
  
      table.integer("autor_id").notNullable().unsigned();
  
      table.foreign('autor_id')
  
           .references("autores.id")
  
           .onDelete("restrict")
  
           .onUpdate("cascade")
  
  
  
      // cria os campos created_at e updated_at
  
      table.timestamps(true, true);
  
    })
  
  };
  
  
  
  exports.down = (knex) => knex.schema.dropTable('livros');