/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    const has = await knex.schema.hasTable("rfids");
    if (!has) {
        await knex.schema.createTable("rfids", (t) => {
            t.increments("id").primary();
            t.string("uid", 64).notNullable().unique(); // código único de la tarjeta/llavero
            t.string("label", 120);                     // nombre amigable ("Llavero azul", etc.)
            t.boolean("is_enabled").notNullable().defaultTo(true); // tarjeta habilitada en el sistema
            t.timestamp("created_at").defaultTo(knex.fn.now());
            t.timestamp("updated_at").defaultTo(knex.fn.now());
        });
    }
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("rfids");
}
