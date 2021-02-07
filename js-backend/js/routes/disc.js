const db = require('../db')
const router = require('express').Router()

router.get('/:id', (request, response) => {
    const discId = parseInt(request.params.id)
    db.query('SELECT ar.artistid,ar.name AS artistname,al.albumid,al.name AS albumname,tr.trackid,tr.num,tr.length,tr.title,EXISTS(SELECT NULL FROM paragraph p WHERE p.trackid=tr.trackid) AS have_lyrics,f.fileid FROM track tr,disc d,album al,artist ar,file f WHERE tr.discid=$1 AND d.discid=tr.discid AND d.albumid=al.albumid AND ar.artistid=al.artistid AND f.trackid=tr.trackid AND filetype=$2', [discId, 'mp3'], (err, data) => {
        if (err) throw err
        results = { 'artist': null, 'album': null, 'tracks': [ ]}
        if (data.rows.length > 0) {
          results['artist'] = {
            'id': data.rows[0]['artistid'],
            'name': data.rows[0]['artistname']
          }
          results['album'] = {
            'id': data.rows[0]['albumid'],
            'name': data.rows[0]['albumname']
          }
        }
        data.rows.forEach(function(row) {
          delete row['artistid']
          delete row['artistname']
          delete row['albumid']
          delete row['albumname']
          results['tracks'].push(row)
        })
        response.status(200).json(results)
    })
})

router.get('/:id/enqueue', (request, response) => {
    const discId = parseInt(request.params.id)
    db.query('SELECT t.num,f.fileid FROM track t, file f WHERE t.discid=$1 AND t.trackid=f.trackid AND f.filetype=$2', [discId, 'mp3'], (err, data) => {
        if (err) throw err
        let result = { }
        data.rows.forEach((r) => {
            result[r.num] = { fileid: r.fileid }
        })
        response.status(200).json(result)
    })
})

module.exports = router
