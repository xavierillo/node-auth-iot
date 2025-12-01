/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    const has = await knex.schema.hasTable("asignacion_rfids");
    if (!has) {
        await knex.schema.createTable("asignacion_rfids", (t) => {
            t.increments("id").primary();

            // FK a rfids
            t
                .integer("rfid_id")
                .unsigned()
                .notNullable()
                .references("id")
                .inTable("rfids")
                .onDelete("RESTRICT"); // no borrar tarjeta si tiene historial

            // FK a users
            t
                .integer("user_id")
                .unsigned()
                .notNullable()
                .references("id")
                .inTable("users")
                .onDelete("RESTRICT"); // no borrar usuario si tiene historial (puedes cambiar a SET NULL si quieres)

            t.timestamp("assigned_at").notNullable().defaultTo(knex.fn.now());
            t.timestamp("unassigned_at").nullable(); // NULL = asignación activa

            t.string("note", 255); // opcional: "Entregado en recepción", etc.

            t.timestamp("created_at").defaultTo(knex.fn.now());
            t.timestamp("updated_at").defaultTo(knex.fn.now());

            // Índices útiles
            t.index(["rfid_id"]);
            t.index(["user_id"]);
            t.index(["rfid_id", "unassigned_at"]); // para buscar asignación activa de una tarjeta
        });
    }
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("asignacion_rfids");
}
