exports.up = (knex) => {

    return knex.schema.createTable('avaliacao', (table) => {
  
      table.increments();
  
      table.string('comentario', 500).notNullable();
      table.integer("livros_id").notNullable().unsigned()
      table.foreign("livros_id")
           .references("livros.id")
           .onDelete("restrict")
           .onUpdate("cascade")

      table.timestamps(true, true);
  
    })
  
  };
  
  exports.down = (knex) => knex.schema.dropTable('avaliacao');