let mongoose = require( 'mongoose' );
let uuid = require( 'uuid' );

mongoose.Promise = global.Promise;

let bookmarks = mongoose.Schema({
    id: uuid.v4(),
    titulo: String,
    descripcion: String,
    url: String
});

let bookmark = ('bookmarksdb', bookmarks);

let bookmarkController = {
    update: function(id, updatedBookmark) {
        return bookmark.findOneAndUpdate(id, updatedBookmark)
            .then(ub => {
                return ub;
            })
            .catch(error => {
                throw Error(error);
            })
    }
}

module.exports = {
    bookmarkController
};