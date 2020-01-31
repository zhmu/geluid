const db = require('../db')
const router = require('express').Router()

router.get('/:id/lyrics', (request, response) => {
    const trackId = parseInt(request.params.id)
    db.query('SELECT p.ordernum AS porder,l.ordernum AS lorder,p.header,l.content FROM paragraph p LEFT JOIN line l ON l.paragraphid=p.paragraphid WHERE p.trackid=$1', [trackId], (err, data) => {
        if (err) throw err
        let lyrics = [ ]
        data.rows.forEach((r) => {
            const key = r.porder - 1
            if (lyrics[key] == null) {
                lyrics[key] = { header: r.header, lines: [ ] }
            }
            lyrics[key].lines[r.lorder - 1] = r.content
        })
        var result = { 'lyrics': lyrics }
        response.status(200).json(result)
    })
})

router.get('/:id/enqueue', (request, response) => {
    const trackId = parseInt(request.params.id)
    db.query('SELECT f.fileid FROM file f WHERE f.trackid=$1 AND f.filetype=$2', [trackId, 'mp3'], (err, data) => {
        if (err) throw err
        response.status(200).json(data.rows)
    })
})

module.exports = router
