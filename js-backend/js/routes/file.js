const db = require('../db')
const fs = require('fs')
const router = require('express').Router()

router.get('/:id/mp3', (request, response) => {
    const fileId = parseInt(request.params.id)
    db.query('SELECT path FROM file WHERE trackid=$1 AND filetype=$2', [fileId, 'mp3'], (err, data) => {
        if (err) throw err
        if (data.rows.length != 1) {
            response.status(404).send('Not found')
            return
        }
        const path = data.rows[0].path
        fs.stat(path,  (err, st) => {
            if (err) throw err

            // TODO write logging

            response.writeHead(200, {
                'Content-Type': 'audio/mpeg',
                'Content-Length': st.size
            })
            const stream = fs.createReadStream(path)
            stream.pipe(response)
        })
    })
})

module.exports = router
