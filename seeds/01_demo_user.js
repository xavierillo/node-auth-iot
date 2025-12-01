import bcrypt from 'bcryptjs';

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    await knex('users').del();
    const hash = await bcrypt.hash('123456', 10);
    await knex('users').insert([
        {
            id: 1,
            name: "Admin",
            last_name: "Master",
            email: "admin@iot.com",
            password_hash: hash,
            role: "admin",
        },
        {
            id: 2,
            name: "Ana",
            last_name: "Perez",
            email: "ana@iot.com",
            password_hash: hash,
            role: "user",
        },
        {
            id: 3,
            name: "Benjamín",
            last_name: "Rojas",
            email: "benja@iot.com",
            password_hash: hash,
            role: "user",
        },
    ]);
}
