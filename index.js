const express = require('express');
const app = express();
const db = require("./utils/db");
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3');
const config = require('./config');

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static('./public'));

app.use(
    require('body-parser').json()
);

app.get("/image/:id", (req, res) => {
    db.getImgById(req.params.id).then(results => {
        res.json(results);
    }).catch(err => console.log('error in db.getImgById: ', err.message));
});

app.get("/images", (req, res) => {
    db.getImgs()
        .then(results => {
            res.json(results);
        }).catch(err => console.log('error in db.getImgs: ', err.message));
});

app.get("/images/:lastId", (req, res) => {
    db.getMoreImages(req.params.lastId)
        .then(results => {
            res.json(results);
        }).catch(err => console.log('error in getImg/:lastId: ', err.message));
});

app.get("/getComments/:id", (req, res) => {
    db.getCommentsById(req.params.id)
        .then(comments => {
            res.json(comments.rows);
        }).catch(err => console.log('error in db getCommentsById: ', err.message));
});

app.post("/postComment", (req, res) => {
    console.log('req.body: ', req.body);
    const {imageId, username, comment} = req.body;
    console.log('comment: ', comment);
    console.log('image_id: ', imageId);
    console.log('username: ', username);
    db.postComment(imageId, username, comment)
        .then(result =>
            res.json({ success: true })
        ).catch(err => console.log(err) );
});

app.get("/deleteImage/:id", (req, res) => {
    const imageId = req.params.id;
    console.log('deleted image_id: ', imageId);
    db.deleteComments(imageId)
        .then(() => {
            db.deleteImage(imageId).then(() => {
                res.json({
                    deleted: true
                });
            });
        });
    db.deleteImage(imageId)
        .then(result =>
            res.json({ success: true })
        ).catch(err => console.log('error deleteImg', err) );
});

app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    // If nothing went wrong the file is already in the uploads directory
    const { username, title, description } = req.body;
    const url = config.s3Url + req.file.filename;
    db.addImg(url, username, title, description);
    if (req.file) {
        res.json({
            success: true,
            url: url,
            username: username,
            title: title,
            description: description,
            //id: res.rows[0].id
        });
    } else {
        res.json({
            success: false
        });
    }
});

//the server's job now with frameworks is to give our framwork (in this case Vue)
//the data it needs to render on screen

//with Multi Page Application's (MPA's) the server's job is to figure out what should be rendered on screen.

//in SPA's (Single Page Application) the server's job is to give / post data whenever the framwork asks it to.
// Otherwise the framework is responseislbe
//for figuring out what should be shown on screen

app.listen(process.env.PORT || 8080, () => console.log('Listening!'));
