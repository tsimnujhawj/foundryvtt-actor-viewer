const file = require("fs")

const characterFile = file.readFileSync('./data/pcs/elrosro.json', "utf-8", (err, data)=>{
    return data
})
const character = JSON.parse(characterFile)
console.log(character.type)