exports.up = function (knex) {
    return knex.schema.createTable('daily_records', tbl => {
      tbl.increments()
      tbl
        .integer('contract_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('contracts')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      tbl.date('trade_date').notNullable()
      tbl.integer('days_till_expiry').notNullable()
      tbl.integer('open_interest')
      tbl.integer('volume').notNullable()
      tbl.integer('vwap').notNullable()
      tbl.integer('last_bid')
      tbl.integer('last_ask')
      tbl.integer('delta')
      tbl.integer('implied_vol')
    })
  }
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('daily_records')
  }
  