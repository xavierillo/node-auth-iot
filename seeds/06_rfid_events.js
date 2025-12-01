// seeds/04_rfid_events.js
export async function seed(knex) {
    await knex("rfid_events").del();

    await knex("rfid_events").insert([
        {
            id: 1,
            rfid_id: 1,
            user_id: 2,
            source: "rfid",
            action: "OPEN_DOOR",
            metadata: JSON.stringify({ door: "Principal", method: "RFID" }),
            created_at: knex.fn.now(),
        },
        {
            id: 2,
            rfid_id: 2,
            user_id: 3,
            source: "rfid",
            action: "OPEN_DOOR",
            metadata: JSON.stringify({ door: "Patio", method: "RFID" }),
            created_at: knex.fn.now(),
        },
        {
            id: 3,
            rfid_id: 3,
            user_id: null,
            source: "rfid",
            action: "DENIED",
            metadata: JSON.stringify({ reason: "disabled", door: "Principal" }),
            created_at: knex.fn.now(),
        },
        {
            id: 4,
            rfid_id: 1,
            user_id: 2,
            source: "app",
            action: "DISABLE",
            metadata: JSON.stringify({ feature: "user_action" }),
            created_at: knex.fn.now(),
        },
    ]);
}
