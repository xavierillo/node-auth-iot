// seeds/03_asignacion_rfids.js
export async function seed(knex) {
    await knex("asignacion_rfids").del();

    await knex("asignacion_rfids").insert([
        {
            id: 1,
            rfid_id: 1,          // Llavero Azul
            user_id: 2,          // Ana
            assigned_at: knex.fn.now(),
            unassigned_at: null, // asignación activa
            note: "Entregado en recepción",
        },
        {
            id: 2,
            rfid_id: 2,          // Tarjeta Blanca
            user_id: 3,          // Benjamín
            assigned_at: knex.fn.now(),
            unassigned_at: null,
            note: "Asignación inicial",
        },
        {
            id: 3,
            rfid_id: 3,          // Tarjeta Roja
            user_id: 2,          // Ana
            assigned_at: knex.fn.now(),
            unassigned_at: knex.fn.now(), // asignación terminada
            note: "Llavero devuelto",
        },
    ]);
}
