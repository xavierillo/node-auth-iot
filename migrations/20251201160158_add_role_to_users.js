/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    const has = await knex.schema.hasTable('users');
    if (has) {
        await knex.schema.alterTable('users', (t) => {
            t.string('role', 50)
                .notNullable()
                .defaultTo('user'); // valores: 'user' o 'admin'
        });
    }
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    const has = await knex.schema.hasTable('users');
    if (has) {
        await knex.schema.alterTable('users', (t) => {
            t.dropColumn('role');
        });
    }
}
