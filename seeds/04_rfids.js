// seeds/02_rfids.js
export async function seed(knex) {
    await knex("rfids").del();

    await knex("rfids").insert([
        {
            id: 1,
            uid: "AA11BB22CC33",
            label: "Llavero Azul",
            is_enabled: true,
        },
        {
            id: 2,
            uid: "DD44EE55FF66",
            label: "Tarjeta Blanca",
            is_enabled: true,
        },
        {
            id: 3,
            uid: "112233445566",
            label: "Tarjeta Roja",
            is_enabled: false, // deshabilitada
        },
    ]);
}
