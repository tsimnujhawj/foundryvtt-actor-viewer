const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

module.exports = function(app) {
    // default options
    app.use(fileUpload());

    app.post('/upload', function(req, res) {
      let actorFile;
      let uploadPath;

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }

      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      actorFile = req.files.actorFile;
      uploadPath = path.resolve('data/upload/') + actorFile.name;

      // Use the mv() method to place the file somewhere on your server
      actorFile.mv(uploadPath, function(err) {
        if (err) {
          return res.status(500).send(err);
        } else {
          fs.readFile(uploadPath, 'utf8', (err, data) => {
            character = JSON.parse(data)
            abilities = [
              { name: "Acrobatics", attr: "Dex"},
              { name: "Animal Handling", attr: "Wis"},
              { name: "Arcana", attr: "Int"},
              { name: "Athletics", attr: "Str"},
              { name: "Deception", attr: "Cha"},
              { name: "History", attr: "Int"},
              { name: "Insight", attr: "Wis"},
              { name: "Intimidation", attr: "Cha"},
              { name: "Investigation", attr: "Int"},
              { name: "Medicine", attr: "Wis"},
              { name: "Nature", attr: "Int"},
              { name: "Perception", attr: "Wis"},
              { name: "Performance", attr: "Cha"},
              { name: "Persuasion", attr: "Cha"},
              { name: "Religion", attr: "Int"},
              { name: "Sleight of Hand", attr: "Dex"},
              { name: "Stealth", attr: "Dex"},
              { name: "Survival", attr: "Wis"},
            ]
            characterObj = {
              name: character.name

            }
            res.render('character', { title: 'Testing!', message: 'Hey there!', character: character, abilities: abilities });
          })
        }

    });
  });
};