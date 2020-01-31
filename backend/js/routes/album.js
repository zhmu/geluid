const db = require('../db')
const router = require('express').Router()

router.get('/:id', (request, response) => {
    const albumId = parseInt(request.params.id)
    db.query('SELECT ar.name AS artistname,ar.artistid,al.name AS albumname,al.year,d.discid,d.volume,d.title AS dtitle,t.trackid,t.num,t.length,t.title AS ttitle,EXISTS(SELECT NULL FROM paragraph p WHERE p.trackid=t.trackid) AS lyrics FROM album al,disc d,track t,artist ar WHERE al.albumid=$1 AND al.artistid=ar.artistid AND al.albumid=d.albumid AND t.discid=d.discid', [albumId], (err, data) => {
        if (err) throw err
        let result = { 'artist': null, 'album': { 'discs': { } } }
        if (data.rows.length > 0) {
            result['artist'] = {
                'id': data.rows[0]['artistid'],
                'name': data.rows[0]['artistname']
            }
            result['album'] = {
                'id': albumId,
                'name': data.rows[0]['albumname'],
                'discs': { }
            }
        }
        data.rows.forEach((r) => {
            if (r.discid in result['album']['discs']) {
                result['album']['discs'][r.discid].tracks.push({ trackid: r.trackid, num: r.num, length: r.length, title: r.ttitle, lyrics: r.lyrics })
            } else {
                result['album']['discs'][r.discid] = { discid: r.discid, volume: r.volume, title: r.dtitle, tracks: [ { trackid: r.trackid, num: r.num, length: r.length, title: r.ttitle, lyrics: r.lyrics } ] }
            }
        })
        response.status(200).json(result)
    })
})

module.exports = router
