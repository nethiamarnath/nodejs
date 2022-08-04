/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex, Promise) {
    return knex.schema.createTable("employees", (table) => {
        table.increments() // it will automatically create id as primary
        table.string("f_name")
        table.string("l_name")
        table.string("email")
        table.timestamps("join_date")
        table.timestamps("create_at")
        table.timestamps("update_at")

    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex, Promise) {
    return knex.schema.dropTable("employees")
};