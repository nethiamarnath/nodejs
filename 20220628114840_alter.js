/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.dropTable("employees", (table) => {


    })
};

exports.down = function(knex) {

};