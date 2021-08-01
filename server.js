const express = require("express");
const app = express();
const path = require('path');
const port = 3000;

app.use(express.static(path.join(__dirname, 'app/public/styles')));

// Config
app.set('view engine', 'pug');
app.set('views', 'app/views');


// Routes
require('./app/routes/routes')(app);
  
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})