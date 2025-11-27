/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    await knex("ring_color").del();

    await knex("ring_color").insert([
        {
            name: "main_ring",
            red: 255,
            green: 0,
            blue: 0,
            brightness: 50,
        },
    ]);
}
