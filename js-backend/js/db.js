const Pool = require('pg').Pool
const pool = new Pool({
    user: 'geluid',
    host: 'pgsql',
    database: 'geluid',
    password: 'geluid',
    port: 5432
})

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    },
    p: () => {
        return pool
    }
}
