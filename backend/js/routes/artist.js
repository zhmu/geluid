const db = require('../db')
const router = require('express').Router()

router.get('/', (request, response) => {
    db.query('SELECT artistid,name FROM artist', [], (error, results) => {
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
