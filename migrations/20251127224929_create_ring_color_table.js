export async function up(knex) {
    const has = await knex.schema.hasTable("ring_color");
    if (!has) {
        await knex.schema.createTable("ring_color", (t) => {
            t.increments("id").primary();
            t.string("name", 50).notNullable().defaultTo("main_ring");
            t.integer("red").notNullable().defaultTo(255); // 0-255
            t.integer("green").notNullable().defaultTo(0);
            t.integer("blue").notNullable().defaultTo(0);
            t.integer("brightness").notNullable().defaultTo(50); // opcional
            t.timestamp("created_at").defaultTo(knex.fn.now());
            t.timestamp("updated_at").defaultTo(knex.fn.now());
        });
    }
}

export async function down(knex) {
    await knex.schema.dropTableIfExists("ring_color");
}
