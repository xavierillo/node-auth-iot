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
      name: "Admin",
      last_name: "Demo",
      email: "admin@demo.com",
      password_hash: hash, // hash Bcrypt
      role: "admin"
    },
    {
      name: "Usuario",
      last_name: "Demo",
      email: "user@demo.com",
      password_hash: hash, 
      role: "user"
    }
  ]);
}
