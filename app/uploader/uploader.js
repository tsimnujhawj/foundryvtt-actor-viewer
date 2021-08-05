const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const abilities =  [
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

const currency = ["cp", "sp", "ep", "gp", "pp"]

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
            const character = JSON.parse(data)
            const characterObj = {
              name: character.name,
              classes: getClasses(character.items),
              weapons: getWeapons(character.items),
              features: getFeatures(character.items),
              weaponCount: getCount(getWeapons(character.items)),
              classCount: getCount(getClasses(character.items)),
              featureCount: getCount(getFeatures(character.items))
            }
            res.render('character', {
              title: character.name,
              character: character,
              characterObj: characterObj,
              abilities: abilities,
              currency: currency
            });
          })
        }

    });
  });

  function getCount(list){
    let count = [];
    for (let i = 0; i < list.length; i++) {
      count.push(i)
    }
    return count;
  }

  function getWeapons(itemList){
    let weapons = [];
    itemList.forEach(item=>{
      if (item.type === "weapon") {
        weapons.push(item)
      }
    })
    return weapons;
  }

  function getFeatures(itemList){
    let features = [];
    itemList.forEach(item=>{
      if (item.type === "feat") {
        features.push({
          name: item.name.replace(',', ''),
          description: stripHtml(item.data.description.value)
        })
      }
    })
    return features;
  }

  function getClasses(itemList){
    let charClass = [];
    itemList.forEach(item=>{
      if (item.type === "class") {
        charClass.push({
          name: item.name,
          subclass: item.data.subclass,
          level: item.data.levels,
          hitDice: item.data.hitDice
        })
      }
    })
    return charClass;
  }

  function stripHtml(string){
    return string.replace(/(<([^>]+)>)/gi, "")
  }
};