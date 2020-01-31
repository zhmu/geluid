const db = require('../db')
const router = require('express').Router()

router.get('/by/:key', (request, response) => {
    const key = request.params.key
    let expr = {
        'a': "LOWER(name) LIKE 'a%'",
        'b': "LOWER(name) LIKE 'b%'",
        'c': "LOWER(name) LIKE 'c%'",
        'd': "LOWER(name) LIKE 'd%'",
        'e': "LOWER(name) LIKE 'e%'",
        'f': "LOWER(name) LIKE 'f%'",
        'g': "LOWER(name) LIKE 'g%'",
        'h': "LOWER(name) LIKE 'h%'",
        'i': "LOWER(name) LIKE 'i%'",
        'j': "LOWER(name) LIKE 'j%'",
        'k': "LOWER(name) LIKE 'k%'",
        'l': "LOWER(name) LIKE 'l%'",
        'm': "LOWER(name) LIKE 'm%'",
        'n': "LOWER(name) LIKE 'n%'",
        'o': "LOWER(name) LIKE 'o%'",
        'p': "LOWER(name) LIKE 'p%'",
        'q': "LOWER(name) LIKE 'q%'",
        'r': "LOWER(name) LIKE 'r%'",
        's': "LOWER(name) LIKE 's%'",
        't': "LOWER(name) LIKE 't%'",
        'u': "LOWER(name) LIKE 'u%'",
        'v': "LOWER(name) LIKE 'v%'",
        'w': "LOWER(name) LIKE 'w%'",
        'x': "LOWER(name) LIKE 'x%'",
        'y': "LOWER(name) LIKE 'y%'",
        'z': "LOWER(name) LIKE 'z%'",
        'other': "name !~ '^[a-zA-Z]'",
        'all': "1=1"
    }
    if (!key in expr) throw "Unrecognised key"
    db.query('SELECT artistid,name FROM artist WHERE ' + expr[key], [], (error, results) => {
        if (error) throw error
        response.status(200).json(results.rows)
    })
})

router.get('/:id', (request, response) => {
    const artistId = parseInt(request.params.id)
    db.query('SELECT ar.name AS artistname,al.albumid,al.year,al.name,d.discid,d.volume,EXISTS(SELECT NULL FROM file f WHERE f.albumid=al.albumid) AS paid FROM artist ar,album al,disc d WHERE al.artistid=$1 AND ar.artistid=al.artistid AND d.albumid=al.albumid', [artistId], (err, data) => {
        if (err) throw err
        let result = { 'artist': null, 'albums': { }}
        if (data.rows.length > 0) {
            result['artist'] = {
                'id': artistId,
                'name': data.rows[0]['artistname']
            }
        }
        data.rows.forEach((r) => {
            if (r.albumid in result['albums']) {
                result['albums'][r.albumid].discs.push({ discid: r.discid, volume: r.volume, paid: r.paid })
            } else {
                result['albums'][r.albumid] = { albumid: r.albumid, year: r.year, name: r.name, paid: r.paid, discs: [ { discid: r.discid, volume: r.volume } ] }
            }
        })
        response.status(200).json(result)
    })
})

module.exports = router