exports.up = function (knex) {
  return knex.schema.createTable("cards", function (table) {
    table.increments();

    table.string("url").unique();
    table.string("status").notNullable().defaultTo("Pending");
    table.integer("member_id").unique().notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));

    table.foreign("member_id").references("id").inTable("members");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("cards");
};
