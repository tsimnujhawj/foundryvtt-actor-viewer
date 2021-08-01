const path = require('path')

module.exports = function(app){
    app.get('/', (req, res) => {
        res.sendFile(path.resolve('index.html'));
    })

    require(path.resolve('app/uploader/uploader'))(app);
}