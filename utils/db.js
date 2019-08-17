var spicedPg = require('spiced-pg');

let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg('postgres:postgres:postgres@localhost:5432/images');
}

exports.getImgs = function getImgs() {
    return db.query(
        `SELECT * FROM images
        ORDER BY id DESC
        LIMIT 6
            `);
};

exports.getImgById = function getImgById(id) {
    return db.query(
        `SELECT * FROM images
        WHERE id = $1
            `,[id]);
};

exports.addImg = function addImg(url, username, title, description) {
    return db.query(
        `INSERT INTO images (url, username, title, description)
         VALUES ($1, $2, $3, $4)
         RETURNING id;`,
        [url, username, title, description]
    );
};

exports.postComment = function postComment(image_id, username, comment) {
    return db.query(
        `INSERT INTO comments (image_id, username, comment)
        VALUES ($1, $2, $3)
        `,
        [image_id, username, comment]
    );
};

exports.getCommentsById = function getCommentsById(image_id) {
    return db.query(
        `SELECT * FROM comments
        WHERE image_id = $1
        ORDER BY created_at DESC
    `,
        [image_id]
    );
};

exports.getMoreImages = (startId, offset) => db.query(
    `SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3
        OFFSET $2`,
    [startId, offset]
).then(
    ({rows}) => rows
);

exports.deleteImage = function deleteImage(id) {
    return db.query(
        `DELETE FROM images WHERE id = $1`,
        [id]
    );
};

exports.deleteComments = function deleteComments(image_id) {
    return db.query(
        `
        DELETE FROM comments WHERE image_id = $1`,
        [image_id]
    );
};
