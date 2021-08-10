const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const skills = [
  { code: 'acr', name: "Acrobatics", attr: "dex"},
  { code: 'ani', name: "Animal Handling", attr: "wis"},
  { code: 'arc', name: "Arcana", attr: "int"},
  { code: 'ath', name: "Athletics", attr: "str"},
  { code: 'dec', name: "Deception", attr: "cha"},
  { code: 'his', name: "History", attr: "int"},
  { code: 'ins', name: "Insight", attr: "wis"},
  { code: 'itm', name: "Intimidation", attr: "cha"},
  { code: 'inv', name: "Investigation", attr: "int"},
  { code: 'med', name: "Medicine", attr: "wis"},
  { code: 'nat', name: "Nature", attr: "int"},
  { code: 'prc', name: "Perception", attr: "wis"},
  { code: 'prf', name: "Performance", attr: "cha"},
  { code: 'per', name: "Persuasion", attr: "cha"},
  { code: 'rel', name: "Religion", attr: "int"},
  { code: 'slt', name: "Sleight of Hand", attr: "dex"},
  { code: 'ste', name: "Stealth", attr: "dex"},
  { code: 'sur', name: "Survival", attr: "wis"},
]

const abilities = [
  {name: "Strength", attr: 'str'},
  {name: "Dexterity", attr: 'dex'},
  {name: "Constitution", attr: 'con'},
  {name: "Wisdom", attr: 'wis'},
  {name: "Intelligence", attr: 'int'},
  {name: "Charisma", attr: 'cha'}
]

const proficiencyBonus = [
  {level: 0, bonus: 1},
  {level: 1, bonus: 2},
  {level: 2, bonus: 2},
  {level: 3, bonus: 2},
  {level: 4, bonus: 2},
  {level: 5, bonus: 3},
  {level: 6, bonus: 3},
  {level: 7, bonus: 3},
  {level: 8, bonus: 3},
  {level: 9, bonus: 3},
  {level: 10, bonus: 4},
  {level: 11, bonus: 4},
  {level: 12, bonus: 4},
  {level: 13, bonus: 4},
  {level: 14, bonus: 5},
  {level: 15, bonus: 5},
  {level: 16, bonus: 5},
  {level: 17, bonus: 6},
  {level: 18, bonus: 6},
  {level: 19, bonus: 6},
  {level: 20, bonus: 6}
]

const abilityScoreModifiers = [
  {score: 1, mod: '−5'},
  {score: 2, mod: '−4'},
  {score: 3, mod: '−4'},
  {score: 4, mod: '−3'},
  {score: 5, mod: '−3'},
  {score: 6, mod: '−2'},
  {score: 7, mod: '−2'},
  {score: 8, mod: '−1'},
  {score: 9, mod: '−1'},
  {score: 10, mod: '+0'},
  {score: 11, mod: '+0'},
  {score: 12, mod: '+1'},
  {score: 13, mod: '+1'},
  {score: 14, mod: '+2'},
  {score: 15, mod: '+2'},
  {score: 16, mod: '+3'},
  {score: 17, mod: '+3'},
  {score: 18, mod: '+4'},
  {score: 19, mod: '+4'},
  {score: 20, mod: '+5'},
  {score: 21, mod: '+5'},
  {score: 22, mod: '+6'},
  {score: 23, mod: '+6'},
  {score: 24, mod: '+7'},
  {score: 25, mod: '+7'},
  {score: 26, mod: '+8'},
  {score: 27, mod: '+8'},
  {score: 28, mod: '+9'},
  {score: 29, mod: '+9'},
  {score: 30, mod: '+10'}
]

const currency = ["cp", "sp", "ep", "gp", "pp"]

const typesOfItems = [
  'class',
  'feat',
  'equipment',
  'tool',
  'loot',
  'weapon',
  'consumable',
  'spell'
]


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
              totalLevel: getTotalLevel(getClasses(character.items)),
              classes: getClasses(character.items),
              weapons: getWeapons(character.items),
              features: getFeatures(character.items),
              items: getItems(character.items),
              spells: getSpells(character.items),
              initiative: getAbilityScoreModifier(character.data.abilities.dex.value),
              armorClass: getArmorClass(getAbilityScoreModifier(character.data.abilities.dex.value)),
              passivePerception: getPassivePerception(
                getAbilityScoreModifier(character.data.abilities.wis.value),
                getProficienyBonus(getTotalLevel(getClasses(character.items))),
                isProficient(character.data.abilities.wis)
              ),
              weaponCount: getCount(getWeapons(character.items)),
              classCount: getCount(getClasses(character.items)),
              featureCount: getCount(getFeatures(character.items)),
              trait: stripHtml(character.data.details.trait),
              ideal: stripHtml(character.data.details.ideal),
              bond: stripHtml(character.data.details.bond),
              flaw: stripHtml(character.data.details.flaw)
            }
            res.render('characterStandard', {
              title: character.name,
              character: character,
              characterObj: characterObj,
              skills: skills,
              abilities: abilities,
              currency: currency,
              proficiencyBonus: proficiencyBonus,
              abilityScoreModifiers: abilityScoreModifiers
            });
          })
        }

    });
  });

  function getArmorClass(dexMod){
    let ac = 10;
    ac = ac+dexMod;
    return ac;
  }

  function getPassivePerception(wisMod, profMod, prof){
    let passivePerception = 10;
    if (prof) {
      passivePerception = passivePerception+wisMod+profMod
      return passivePerception
    } else {
      passivePerception = passivePerception+wisMod
      return passivePerception
    }
  }

  function isProficient(ability){
    if (ability.proficient > 0) {
      return true
    } else {
      return false
    }
  }

  function getProficienyBonus(totalLevel){
    let mod = 0;
    proficiencyBonus.filter(obj=>{
      if (obj.level === totalLevel) {
        mod = obj.bonus
      }
    })
    return parseFloat(mod)
  }

  function getAbilityScoreModifier(abilityScore){
    let mod;
    abilityScoreModifiers.filter(obj=> {
      if (obj.score === abilityScore) {
        mod = obj.mod
      }
    })
    return parseFloat(mod)
  }

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
          description: stripHtml(item.data.description.value),
          type: item.type
        })
      }
    })
    return features;
  }

  function getItems(itemList){
    const itemTypes = ['loot', 'consumable', 'equipment', 'tool']
    let items = [];
    itemList.forEach(item=>{
      if (itemTypes.includes(item.type)) {
        items.push({
          name: item.name,
          description: stripHtml(item.data.description.value),
          type: item.type
        })
      }
    })
    return items;
  }

  function getSpells(itemList){
    let spells = [];
    itemList.forEach(item=>{
      if (item.type === 'spell') {
        spells.push({
          name: item.name,
          description: stripHtml(item.data.description.value),
          type: item.type
        })
      }
    })
    return spells;
  }

  function findTypesOfItems(itemList){
    const typesOfItems = []
    itemList.forEach(item=>{
      if (!typesOfItems.includes(item.type)) {
        typesOfItems.push(item.type)
      }
    })
    return typesOfItems;
  }

  function getClasses(itemList){
    let charClass = [];
    itemList.forEach(item=>{
      if (item.type === "class") {
        charClass.push({
          name: item.name,
          subclass: item.data.subclass,
          level: item.data.levels,
          hitDice: item.data.hitDice,
          type: item.type,
        })
      }
    })
    return charClass;
  }

  function getTotalLevel(itemList){
    let totalLevel = 0;
    itemList.forEach(item=>{
      totalLevel = totalLevel+item.level
    })
    return totalLevel;
  }

  function stripHtml(string){
    return string.replace(/(<([^>]+)>)/gi, "").replaceAll('[[/r', '').replaceAll(']]', '')
  }
};