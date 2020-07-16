exports.up = function (knex) {
  return knex.schema.createTable('contracts', tbl => {
    tbl.increments()
    tbl
      .integer('exchange_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('exchanges')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
    tbl.date('expiry_date').notNullable()
    tbl.string('contract_type', 128).notNullable()
    tbl.string('option_type').defaultTo(null)
    tbl.integer('option_strike').defaultTo(null)
    tbl.string('contract_ccy').notNullable()
    tbl.boolean('expired').notNullable().defaultTo(false)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('contracts')
}
