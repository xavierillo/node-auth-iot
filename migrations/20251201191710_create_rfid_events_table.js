/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    const has = await knex.schema.hasTable("rfid_events");
    if (!has) {
        await knex.schema.createTable("rfid_events", (t) => {
            t.increments("id").primary();

            // Puede venir desde tarjeta física (rfid_id) y/o usuario (user_id)
            t
                .integer("rfid_id")
                .unsigned()
                .nullable()
                .references("id")
                .inTable("rfids")
                .onDelete("SET NULL");

            t
                .integer("user_id")
                .unsigned()
                .nullable()
                .references("id")
                .inTable("users")
                .onDelete("SET NULL");

            // Fuente del evento: "rfid" = lector físico, "app" = aplicación móvil, etc.
            t.string("source", 20).notNullable(); // ej: 'rfid', 'app'

            // Acción realizada: 'OPEN_DOOR', 'DENIED', 'ENABLE', 'DISABLE', etc.
            t.string("action", 50).notNullable();

            // Información adicional, en texto o JSON serializado
            t.text("metadata").nullable(); // ejemplo: '{"door":"principal","reason":"inactive"}'

            t.timestamp("created_at").defaultTo(knex.fn.now());

            // Índices para consultas rápidas
            t.index(["rfid_id"]);
            t.index(["user_id"]);
            t.index(["source"]);
            t.index(["action"]);
        });
    }
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("rfid_events");
}
