// Generated by https://quicktype.io

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
function toCharacter(json) {
    return cast(JSON.parse(json), r("Character"));
}

function characterToJson(value) {
    return JSON.stringify(uncast(value, r("Character")), null, 2);
}

function invalidValue(typ, val) {
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ) {
    if (typ.jsonToJS === undefined) {
        var map = {};
        typ.props.forEach((p) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ) {
    if (typ.jsToJSON === undefined) {
        var map = {};
        typ.props.forEach((p) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val, typ, getProps) {
    function transformPrimitive(typ, val) {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val);
    }

    function transformUnion(typs, val) {
        // val must validate against one typ in typs
        var l = typs.length;
        for (var i = 0; i < l; i++) {
            var typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases, val) {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ, val) {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformObject(props, additional, val) {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        var result = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    return transformPrimitive(typ, val);
}

function cast(val, typ) {
    return transform(val, typ, jsonToJSProps);
}

function uncast(val, typ) {
    return transform(val, typ, jsToJSONProps);
}

function a(typ) {
    return { arrayItems: typ };
}

function u(...typs) {
    return { unionMembers: typs };
}

function o(props, additional) {
    return { props, additional };
}

function m(additional) {
    return { props: [], additional };
}

function r(name) {
    return { ref: name };
}

const typeMap = {
    "Character": o([
        { json: "name", js: "name", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "img", js: "img", typ: "" },
        { json: "data", js: "data", typ: r("CharacterData") },
        { json: "token", js: "token", typ: r("Token") },
        { json: "items", js: "items", typ: a(r("Item")) },
        { json: "effects", js: "effects", typ: a("any") },
        { json: "sort", js: "sort", typ: 0 },
        { json: "flags", js: "flags", typ: r("CharacterFlags") },
    ], false),
    "CharacterData": o([
        { json: "abilities", js: "abilities", typ: r("DataAbilities") },
        { json: "attributes", js: "attributes", typ: r("PurpleAttributes") },
        { json: "details", js: "details", typ: r("Details") },
        { json: "traits", js: "traits", typ: r("Traits") },
        { json: "currency", js: "currency", typ: r("Currency") },
        { json: "skills", js: "skills", typ: m(r("Skill")) },
        { json: "spells", js: "spells", typ: r("Spells") },
        { json: "bonuses", js: "bonuses", typ: r("Bonuses") },
        { json: "resources", js: "resources", typ: r("Resources") },
    ], false),
    "DataAbilities": o([
        { json: "str", js: "str", typ: r("Cha") },
        { json: "dex", js: "dex", typ: r("Cha") },
        { json: "con", js: "con", typ: r("Cha") },
        { json: "int", js: "int", typ: r("Cha") },
        { json: "wis", js: "wis", typ: r("Cha") },
        { json: "cha", js: "cha", typ: r("Cha") },
    ], false),
    "Cha": o([
        { json: "value", js: "value", typ: 0 },
        { json: "proficient", js: "proficient", typ: 0 },
        { json: "min", js: "min", typ: 0 },
        { json: "mod", js: "mod", typ: 0 },
    ], false),
    "PurpleAttributes": o([
        { json: "ac", js: "ac", typ: r("AC") },
        { json: "hp", js: "hp", typ: r("AttributesHP") },
        { json: "init", js: "init", typ: r("Init") },
        { json: "movement", js: "movement", typ: r("Movement") },
        { json: "senses", js: "senses", typ: r("Senses") },
        { json: "spellcasting", js: "spellcasting", typ: r("SpellcastingEnum") },
        { json: "death", js: "death", typ: r("Death") },
        { json: "exhaustion", js: "exhaustion", typ: 0 },
        { json: "inspiration", js: "inspiration", typ: true },
        { json: "encumbrance", js: "encumbrance", typ: r("Encumbrance") },
        { json: "hd", js: "hd", typ: 0 },
        { json: "prof", js: "prof", typ: 0 },
        { json: "spelldc", js: "spelldc", typ: 0 },
    ], false),
    "AC": o([
        { json: "flat", js: "flat", typ: 0 },
        { json: "calc", js: "calc", typ: "" },
        { json: "formula", js: "formula", typ: "" },
        { json: "type", js: "type", typ: r("ACType") },
        { json: "label", js: "label", typ: "" },
    ], false),
    "Death": o([
        { json: "success", js: "success", typ: 0 },
        { json: "failure", js: "failure", typ: 0 },
    ], false),
    "Encumbrance": o([
        { json: "value", js: "value", typ: u(0, null) },
        { json: "max", js: "max", typ: u(0, null) },
    ], false),
    "AttributesHP": o([
        { json: "value", js: "value", typ: 0 },
        { json: "min", js: "min", typ: 0 },
        { json: "max", js: "max", typ: 0 },
        { json: "temp", js: "temp", typ: null },
        { json: "tempmax", js: "tempmax", typ: null },
    ], false),
    "Init": o([
        { json: "value", js: "value", typ: 0 },
        { json: "bonus", js: "bonus", typ: 0 },
        { json: "mod", js: "mod", typ: 0 },
    ], false),
    "Movement": o([
        { json: "burrow", js: "burrow", typ: 0 },
        { json: "climb", js: "climb", typ: 0 },
        { json: "fly", js: "fly", typ: 0 },
        { json: "swim", js: "swim", typ: 0 },
        { json: "walk", js: "walk", typ: 0 },
        { json: "units", js: "units", typ: r("MovementUnits") },
        { json: "hover", js: "hover", typ: true },
    ], false),
    "Senses": o([
        { json: "darkvision", js: "darkvision", typ: 0 },
        { json: "blindsight", js: "blindsight", typ: 0 },
        { json: "tremorsense", js: "tremorsense", typ: 0 },
        { json: "truesight", js: "truesight", typ: 0 },
        { json: "units", js: "units", typ: r("MovementUnits") },
        { json: "special", js: "special", typ: "" },
    ], false),
    "Bonuses": o([
        { json: "mwak", js: "mwak", typ: r("Msak") },
        { json: "rwak", js: "rwak", typ: r("Msak") },
        { json: "msak", js: "msak", typ: r("Msak") },
        { json: "rsak", js: "rsak", typ: r("Msak") },
        { json: "abilities", js: "abilities", typ: r("BonusesAbilities") },
        { json: "spell", js: "spell", typ: r("SpellClass") },
    ], false),
    "BonusesAbilities": o([
        { json: "check", js: "check", typ: "" },
        { json: "save", js: "save", typ: "" },
        { json: "skill", js: "skill", typ: "" },
    ], false),
    "Msak": o([
        { json: "attack", js: "attack", typ: "" },
        { json: "damage", js: "damage", typ: "" },
    ], false),
    "SpellClass": o([
        { json: "dc", js: "dc", typ: 0 },
    ], false),
    "Currency": o([
        { json: "pp", js: "pp", typ: 0 },
        { json: "gp", js: "gp", typ: 0 },
        { json: "ep", js: "ep", typ: 0 },
        { json: "sp", js: "sp", typ: 0 },
        { json: "cp", js: "cp", typ: 0 },
    ], false),
    "Details": o([
        { json: "biography", js: "biography", typ: r("Biography") },
        { json: "alignment", js: "alignment", typ: "" },
        { json: "race", js: "race", typ: "" },
        { json: "background", js: "background", typ: "" },
        { json: "originalClass", js: "originalClass", typ: "" },
        { json: "xp", js: "xp", typ: r("XP") },
        { json: "appearance", js: "appearance", typ: "" },
        { json: "trait", js: "trait", typ: "" },
        { json: "ideal", js: "ideal", typ: "" },
        { json: "bond", js: "bond", typ: "" },
        { json: "flaw", js: "flaw", typ: "" },
        { json: "attunedItemsMax", js: "attunedItemsMax", typ: "" },
        { json: "attunedItemsCount", js: "attunedItemsCount", typ: 0 },
        { json: "maxPreparedSpells", js: "maxPreparedSpells", typ: null },
        { json: "notes1name", js: "notes1name", typ: "" },
        { json: "notes2name", js: "notes2name", typ: "" },
        { json: "notes3name", js: "notes3name", typ: "" },
        { json: "notes4name", js: "notes4name", typ: "" },
    ], false),
    "Biography": o([
        { json: "value", js: "value", typ: "" },
        { json: "public", js: "public", typ: "" },
    ], false),
    "XP": o([
        { json: "value", js: "value", typ: 0 },
        { json: "min", js: "min", typ: 0 },
        { json: "max", js: "max", typ: 0 },
    ], false),
    "Resources": o([
        { json: "primary", js: "primary", typ: r("Ary") },
        { json: "secondary", js: "secondary", typ: r("Ary") },
        { json: "tertiary", js: "tertiary", typ: r("Ary") },
    ], false),
    "Ary": o([
        { json: "value", js: "value", typ: 0 },
        { json: "max", js: "max", typ: 0 },
        { json: "sr", js: "sr", typ: true },
        { json: "lr", js: "lr", typ: true },
        { json: "label", js: "label", typ: "" },
    ], false),
    "Skill": o([
        { json: "value", js: "value", typ: 3.14 },
        { json: "ability", js: "ability", typ: "" },
        { json: "type", js: "type", typ: r("ACType") },
        { json: "label", js: "label", typ: "" },
        { json: "mod", js: "mod", typ: 0 },
        { json: "bonus", js: "bonus", typ: 0 },
    ], false),
    "Spells": o([
        { json: "spell1", js: "spell1", typ: r("PurpleSpell") },
        { json: "spell2", js: "spell2", typ: r("PurpleSpell") },
        { json: "spell3", js: "spell3", typ: r("PurpleSpell") },
        { json: "spell4", js: "spell4", typ: r("PurpleSpell") },
        { json: "spell5", js: "spell5", typ: r("PurpleSpell") },
        { json: "spell6", js: "spell6", typ: r("PurpleSpell") },
        { json: "spell7", js: "spell7", typ: r("PurpleSpell") },
        { json: "spell8", js: "spell8", typ: r("PurpleSpell") },
        { json: "spell9", js: "spell9", typ: r("PurpleSpell") },
        { json: "pact", js: "pact", typ: r("Pact") },
        { json: "spell0", js: "spell0", typ: r("Encumbrance") },
    ], false),
    "Pact": o([
        { json: "value", js: "value", typ: 0 },
        { json: "override", js: "override", typ: null },
    ], false),
    "PurpleSpell": o([
        { json: "value", js: "value", typ: 0 },
        { json: "override", js: "override", typ: null },
        { json: "max", js: "max", typ: 0 },
    ], false),
    "Traits": o([
        { json: "size", js: "size", typ: "" },
        { json: "di", js: "di", typ: r("ArmorProf") },
        { json: "dr", js: "dr", typ: r("ArmorProf") },
        { json: "dv", js: "dv", typ: r("ArmorProf") },
        { json: "ci", js: "ci", typ: r("ArmorProf") },
        { json: "languages", js: "languages", typ: r("ArmorProf") },
        { json: "weaponProf", js: "weaponProf", typ: r("ArmorProf") },
        { json: "armorProf", js: "armorProf", typ: r("ArmorProf") },
        { json: "toolProf", js: "toolProf", typ: r("ArmorProf") },
        { json: "senses", js: "senses", typ: r("Senses") },
    ], false),
    "ArmorProf": o([
        { json: "value", js: "value", typ: a("") },
        { json: "custom", js: "custom", typ: "" },
    ], false),
    "CharacterFlags": o([
        { json: "ddbimporter", js: "ddbimporter", typ: r("PurpleDdbimporter") },
        { json: "dnd5e", js: "dnd5e", typ: r("Dnd5E") },
        { json: "skill-customization-5e", js: "skill-customization-5e", typ: r("SkillCustomization5_E") },
        { json: "exportSource", js: "exportSource", typ: r("ExportSource") },
    ], false),
    "PurpleDdbimporter": o([
        { json: "dndbeyond", js: "dndbeyond", typ: r("PurpleDndbeyond") },
        { json: "inPlaceUpdateAvailable", js: "inPlaceUpdateAvailable", typ: true },
        { json: "syncItemReady", js: "syncItemReady", typ: true },
        { json: "syncActionReady", js: "syncActionReady", typ: true },
    ], false),
    "PurpleDndbeyond": o([
        { json: "url", js: "url", typ: "" },
        { json: "apiEndpointUrl", js: "apiEndpointUrl", typ: "" },
        { json: "characterId", js: "characterId", typ: "" },
        { json: "totalLevels", js: "totalLevels", typ: 0 },
        { json: "proficiencies", js: "proficiencies", typ: a(r("Proficiency")) },
        { json: "roUrl", js: "roUrl", typ: "" },
        { json: "characterValues", js: "characterValues", typ: a("any") },
        { json: "templateStrings", js: "templateStrings", typ: a(r("TemplateString")) },
    ], false),
    "Proficiency": o([
        { json: "name", js: "name", typ: "" },
    ], false),
    "TemplateString": o([
        { json: "componentId", js: "componentId", typ: u(0, null) },
        { json: "componentTypeId", js: "componentTypeId", typ: u(0, null) },
        { json: "damageTypeId", js: "damageTypeId", typ: u(0, null) },
        { json: "text", js: "text", typ: "" },
        { json: "resultString", js: "resultString", typ: r("ResultString") },
        { json: "definitions", js: "definitions", typ: a(r("Definition")) },
        { json: "id", js: "id", typ: u(undefined, u(0, "")) },
        { json: "entityTypeId", js: "entityTypeId", typ: u(undefined, "") },
    ], false),
    "Definition": o([
        { json: "parsed", js: "parsed", typ: r("ResultString") },
        { json: "match", js: "match", typ: "" },
        { json: "replacePattern", js: "replacePattern", typ: r("SkillCustomization5_E") },
        { json: "type", js: "type", typ: "" },
        { json: "subType", js: "subType", typ: u(null, "") },
    ], false),
    "SkillCustomization5_E": o([
    ], false),
    "Dnd5E": o([
        { json: "powerfulBuild", js: "powerfulBuild", typ: true },
        { json: "savageAttacks", js: "savageAttacks", typ: true },
        { json: "elvenAccuracy", js: "elvenAccuracy", typ: true },
        { json: "halflingLucky", js: "halflingLucky", typ: true },
        { json: "initiativeAdv", js: "initiativeAdv", typ: true },
        { json: "initiativeAlert", js: "initiativeAlert", typ: true },
        { json: "jackOfAllTrades", js: "jackOfAllTrades", typ: true },
        { json: "weaponCriticalThreshold", js: "weaponCriticalThreshold", typ: 0 },
        { json: "observantFeat", js: "observantFeat", typ: true },
        { json: "remarkableAthlete", js: "remarkableAthlete", typ: true },
        { json: "reliableTalent", js: "reliableTalent", typ: true },
        { json: "diamondSoul", js: "diamondSoul", typ: true },
        { json: "meleeCriticalDamageDice", js: "meleeCriticalDamageDice", typ: 0 },
        { json: "initiativeHalfProf", js: "initiativeHalfProf", typ: true },
    ], false),
    "ExportSource": o([
        { json: "world", js: "world", typ: "" },
        { json: "system", js: "system", typ: "" },
        { json: "coreVersion", js: "coreVersion", typ: "" },
        { json: "systemVersion", js: "systemVersion", typ: "" },
    ], false),
    "Item": o([
        { json: "_id", js: "_id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "data", js: "data", typ: r("ItemData") },
        { json: "sort", js: "sort", typ: 0 },
        { json: "flags", js: "flags", typ: r("ItemFlags") },
        { json: "img", js: "img", typ: "" },
        { json: "effects", js: "effects", typ: a("any") },
        { json: "folder", js: "folder", typ: null },
        { json: "permission", js: "permission", typ: r("Permission") },
    ], false),
    "ItemData": o([
        { json: "description", js: "description", typ: r("Description") },
        { json: "source", js: "source", typ: u(null, "") },
        { json: "levels", js: "levels", typ: u(undefined, 0) },
        { json: "subclass", js: "subclass", typ: u(undefined, "") },
        { json: "hitDice", js: "hitDice", typ: u(undefined, "") },
        { json: "hitDiceUsed", js: "hitDiceUsed", typ: u(undefined, 0) },
        { json: "saves", js: "saves", typ: u(undefined, a("any")) },
        { json: "skills", js: "skills", typ: u(undefined, r("Skills")) },
        { json: "spellcasting", js: "spellcasting", typ: u(undefined, r("SpellcastingClass")) },
        { json: "activation", js: "activation", typ: u(undefined, r("Activation")) },
        { json: "duration", js: "duration", typ: u(undefined, r("Duration")) },
        { json: "target", js: "target", typ: u(undefined, r("Target")) },
        { json: "range", js: "range", typ: u(undefined, r("Range")) },
        { json: "uses", js: "uses", typ: u(undefined, r("Uses")) },
        { json: "consume", js: "consume", typ: u(undefined, r("Consume")) },
        { json: "ability", js: "ability", typ: u(undefined, u(a(""), r("AbilityEnum"), null)) },
        { json: "actionType", js: "actionType", typ: u(undefined, u(null, "")) },
        { json: "attackBonus", js: "attackBonus", typ: u(undefined, u(0, "")) },
        { json: "chatFlavor", js: "chatFlavor", typ: u(undefined, "") },
        { json: "critical", js: "critical", typ: u(undefined, null) },
        { json: "damage", js: "damage", typ: u(undefined, r("DataDamage")) },
        { json: "formula", js: "formula", typ: u(undefined, "") },
        { json: "save", js: "save", typ: u(undefined, r("Save")) },
        { json: "requirements", js: "requirements", typ: u(undefined, "") },
        { json: "recharge", js: "recharge", typ: u(undefined, r("Recharge")) },
        { json: "quantity", js: "quantity", typ: u(undefined, 0) },
        { json: "weight", js: "weight", typ: u(undefined, 3.14) },
        { json: "price", js: "price", typ: u(undefined, 3.14) },
        { json: "attunement", js: "attunement", typ: u(undefined, 0) },
        { json: "equipped", js: "equipped", typ: u(undefined, true) },
        { json: "rarity", js: "rarity", typ: u(undefined, r("Rarity")) },
        { json: "identified", js: "identified", typ: u(undefined, true) },
        { json: "armor", js: "armor", typ: u(undefined, r("Armor")) },
        { json: "hp", js: "hp", typ: u(undefined, r("DataHP")) },
        { json: "weaponType", js: "weaponType", typ: u(undefined, "") },
        { json: "properties", js: "properties", typ: u(undefined, m(true)) },
        { json: "proficient", js: "proficient", typ: u(undefined, u(true, 0)) },
        { json: "speed", js: "speed", typ: u(undefined, r("Speed")) },
        { json: "strength", js: "strength", typ: u(undefined, 0) },
        { json: "stealth", js: "stealth", typ: u(undefined, true) },
        { json: "capacity", js: "capacity", typ: u(undefined, r("Capacity")) },
        { json: "currency", js: "currency", typ: u(undefined, r("Currency")) },
        { json: "consumableType", js: "consumableType", typ: u(undefined, "") },
        { json: "toolType", js: "toolType", typ: u(undefined, "") },
        { json: "level", js: "level", typ: u(undefined, u(0, "")) },
        { json: "school", js: "school", typ: u(undefined, "") },
        { json: "components", js: "components", typ: u(undefined, r("Components")) },
        { json: "materials", js: "materials", typ: u(undefined, r("Materials")) },
        { json: "preparation", js: "preparation", typ: u(undefined, r("Preparation")) },
        { json: "scaling", js: "scaling", typ: u(undefined, r("ScalingClass")) },
        { json: "attributes", js: "attributes", typ: u(undefined, r("FluffyAttributes")) },
        { json: "consumes", js: "consumes", typ: u(undefined, r("Consumes")) },
        { json: "charges", js: "charges", typ: u(undefined, r("Charges")) },
        { json: "autoUse", js: "autoUse", typ: u(undefined, r("Auto")) },
        { json: "autoDestroy", js: "autoDestroy", typ: u(undefined, r("Auto")) },
    ], false),
    "Activation": o([
        { json: "type", js: "type", typ: r("ActivationType") },
        { json: "cost", js: "cost", typ: 0 },
        { json: "condition", js: "condition", typ: "" },
    ], false),
    "Armor": o([
        { json: "value", js: "value", typ: 0 },
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "dex", js: "dex", typ: u(undefined, u(0, null)) },
    ], false),
    "FluffyAttributes": o([
        { json: "spelldc", js: "spelldc", typ: 0 },
    ], false),
    "Auto": o([
        { json: "value", js: "value", typ: true },
        { json: "_deprecated", js: "_deprecated", typ: true },
    ], false),
    "Capacity": o([
        { json: "type", js: "type", typ: "" },
        { json: "value", js: "value", typ: 0 },
        { json: "weightless", js: "weightless", typ: true },
    ], false),
    "Charges": o([
        { json: "value", js: "value", typ: 0 },
        { json: "max", js: "max", typ: 0 },
        { json: "_deprecated", js: "_deprecated", typ: true },
    ], false),
    "Components": o([
        { json: "value", js: "value", typ: "" },
        { json: "vocal", js: "vocal", typ: true },
        { json: "somatic", js: "somatic", typ: true },
        { json: "material", js: "material", typ: true },
        { json: "ritual", js: "ritual", typ: true },
        { json: "concentration", js: "concentration", typ: true },
    ], false),
    "Consume": o([
        { json: "type", js: "type", typ: r("ConsumeType") },
        { json: "target", js: "target", typ: u(null, "") },
        { json: "amount", js: "amount", typ: null },
        { json: "value", js: "value", typ: u(undefined, "") },
        { json: "_deprecated", js: "_deprecated", typ: u(undefined, true) },
    ], false),
    "Consumes": o([
        { json: "type", js: "type", typ: "" },
        { json: "target", js: "target", typ: null },
        { json: "amount", js: "amount", typ: null },
    ], false),
    "DataDamage": o([
        { json: "parts", js: "parts", typ: a(a(u(null, ""))) },
        { json: "versatile", js: "versatile", typ: r("Versatile") },
        { json: "value", js: "value", typ: u(undefined, "") },
    ], false),
    "Description": o([
        { json: "value", js: "value", typ: "" },
        { json: "chat", js: "chat", typ: "" },
        { json: "unidentified", js: "unidentified", typ: u(true, r("UnidentifiedEnum")) },
    ], false),
    "Duration": o([
        { json: "value", js: "value", typ: u(0, null, "") },
        { json: "units", js: "units", typ: r("DurationUnits") },
    ], false),
    "DataHP": o([
        { json: "value", js: "value", typ: 0 },
        { json: "max", js: "max", typ: 0 },
        { json: "dt", js: "dt", typ: null },
        { json: "conditions", js: "conditions", typ: "" },
    ], false),
    "Materials": o([
        { json: "value", js: "value", typ: "" },
        { json: "consumed", js: "consumed", typ: true },
        { json: "cost", js: "cost", typ: 0 },
        { json: "supply", js: "supply", typ: 0 },
    ], false),
    "Preparation": o([
        { json: "mode", js: "mode", typ: r("PreparationMode") },
        { json: "prepared", js: "prepared", typ: true },
    ], false),
    "Range": o([
        { json: "value", js: "value", typ: u(0, null) },
        { json: "long", js: "long", typ: u(0, null, "") },
        { json: "units", js: "units", typ: r("MovementUnits") },
    ], false),
    "Recharge": o([
        { json: "value", js: "value", typ: null },
        { json: "charged", js: "charged", typ: true },
    ], false),
    "Save": o([
        { json: "ability", js: "ability", typ: r("SpellcastingEnum") },
        { json: "dc", js: "dc", typ: null },
        { json: "scaling", js: "scaling", typ: r("ScalingEnum") },
    ], false),
    "ScalingClass": o([
        { json: "mode", js: "mode", typ: r("ScalingMode") },
        { json: "formula", js: "formula", typ: u(r("FormulaEnum"), 0, null) },
    ], false),
    "Skills": o([
        { json: "number", js: "number", typ: 0 },
        { json: "choices", js: "choices", typ: a("") },
        { json: "value", js: "value", typ: a("") },
    ], false),
    "Speed": o([
        { json: "value", js: "value", typ: null },
        { json: "conditions", js: "conditions", typ: "" },
    ], false),
    "SpellcastingClass": o([
        { json: "progression", js: "progression", typ: "" },
        { json: "ability", js: "ability", typ: "" },
    ], false),
    "Target": o([
        { json: "value", js: "value", typ: u(0, null) },
        { json: "width", js: "width", typ: null },
        { json: "units", js: "units", typ: u(r("MovementUnits"), null) },
        { json: "type", js: "type", typ: u(r("TargetType"), null) },
    ], false),
    "Uses": o([
        { json: "value", js: "value", typ: u(0, null) },
        { json: "max", js: "max", typ: u(0, "") },
        { json: "per", js: "per", typ: u(null, "") },
        { json: "autoDestroy", js: "autoDestroy", typ: u(undefined, true) },
        { json: "autoUse", js: "autoUse", typ: u(undefined, true) },
    ], false),
    "ItemFlags": o([
        { json: "ddbimporter", js: "ddbimporter", typ: u(undefined, r("FluffyDdbimporter")) },
        { json: "betterRolls5e", js: "betterRolls5e", typ: u(undefined, r("BetterRolls5E")) },
        { json: "magicitems", js: "magicitems", typ: u(undefined, r("Magicitems")) },
        { json: "core", js: "core", typ: u(undefined, r("Core")) },
        { json: "exportSource", js: "exportSource", typ: u(undefined, r("ExportSource")) },
    ], false),
    "BetterRolls5E": o([
        { json: "critRange", js: "critRange", typ: r("Crit") },
        { json: "critDamage", js: "critDamage", typ: u(undefined, r("Crit")) },
        { json: "quickDesc", js: "quickDesc", typ: r("Quick") },
        { json: "quickAttack", js: "quickAttack", typ: u(undefined, r("Quick")) },
        { json: "quickSave", js: "quickSave", typ: u(undefined, r("Quick")) },
        { json: "quickDamage", js: "quickDamage", typ: u(undefined, r("QuickDamage")) },
        { json: "quickProperties", js: "quickProperties", typ: r("Quick") },
        { json: "quickCharges", js: "quickCharges", typ: u(undefined, r("QuickCharges")) },
        { json: "quickTemplate", js: "quickTemplate", typ: u(undefined, r("Quick")) },
        { json: "quickOther", js: "quickOther", typ: u(undefined, r("Quick")) },
        { json: "quickFlavor", js: "quickFlavor", typ: r("Quick") },
        { json: "quickPrompt", js: "quickPrompt", typ: r("Quick") },
        { json: "quickVersatile", js: "quickVersatile", typ: u(undefined, r("Quick")) },
        { json: "quickCheck", js: "quickCheck", typ: u(undefined, r("Quick")) },
    ], false),
    "Crit": o([
        { json: "type", js: "type", typ: r("CritDamageType") },
        { json: "value", js: "value", typ: u(null, "") },
    ], false),
    "Quick": o([
        { json: "type", js: "type", typ: r("PurpleType") },
        { json: "value", js: "value", typ: true },
        { json: "altValue", js: "altValue", typ: true },
        { json: "context", js: "context", typ: u(undefined, "") },
    ], false),
    "QuickCharges": o([
        { json: "type", js: "type", typ: r("PurpleType") },
        { json: "value", js: "value", typ: r("QuickChargesAltValue") },
        { json: "altValue", js: "altValue", typ: r("QuickChargesAltValue") },
    ], false),
    "QuickChargesAltValue": o([
        { json: "use", js: "use", typ: true },
        { json: "resource", js: "resource", typ: true },
        { json: "charge", js: "charge", typ: u(undefined, true) },
        { json: "quantity", js: "quantity", typ: u(undefined, true) },
    ], false),
    "QuickDamage": o([
        { json: "type", js: "type", typ: r("QuickDamageType") },
        { json: "value", js: "value", typ: u(a(true), r("AltValueAltValue")) },
        { json: "altValue", js: "altValue", typ: u(a(true), r("AltValueAltValue")) },
        { json: "context", js: "context", typ: u(a("any"), r("ContextClass")) },
    ], false),
    "AltValueAltValue": o([
        { json: "0", js: "0", typ: true },
    ], false),
    "ContextClass": o([
        { json: "0", js: "0", typ: "" },
    ], false),
    "Core": o([
        { json: "sheetClass", js: "sheetClass", typ: u(undefined, "") },
        { json: "sourceId", js: "sourceId", typ: "" },
    ], false),
    "FluffyDdbimporter": o([
        { json: "id", js: "id", typ: u(undefined, u(0, "")) },
        { json: "definitionId", js: "definitionId", typ: u(undefined, 0) },
        { json: "entityTypeId", js: "entityTypeId", typ: u(undefined, u(0, "")) },
        { json: "dndbeyond", js: "dndbeyond", typ: u(undefined, r("FluffyDndbeyond")) },
        { json: "action", js: "action", typ: u(undefined, true) },
        { json: "componentId", js: "componentId", typ: u(undefined, 0) },
        { json: "componentTypeId", js: "componentTypeId", typ: u(undefined, 0) },
        { json: "definitionEntityTypeId", js: "definitionEntityTypeId", typ: u(undefined, 0) },
        { json: "originalName", js: "originalName", typ: u(undefined, "") },
        { json: "sources", js: "sources", typ: u(undefined, a(r("Source"))) },
        { json: "tags", js: "tags", typ: u(undefined, a("")) },
    ], false),
    "FluffyDndbeyond": o([
        { json: "displayOrder", js: "displayOrder", typ: u(undefined, 0) },
        { json: "requiredLevel", js: "requiredLevel", typ: u(undefined, 0) },
        { json: "class", js: "class", typ: u(undefined, r("Class")) },
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "filterType", js: "filterType", typ: u(undefined, "") },
        { json: "tags", js: "tags", typ: u(undefined, a("")) },
        { json: "sources", js: "sources", typ: u(undefined, a("any")) },
        { json: "damage", js: "damage", typ: u(undefined, r("DndbeyondDamage")) },
        { json: "classFeatures", js: "classFeatures", typ: u(undefined, a("any")) },
        { json: "lookup", js: "lookup", typ: u(undefined, r("Lookup")) },
        { json: "level", js: "level", typ: u(undefined, 0) },
        { json: "characterClassId", js: "characterClassId", typ: u(undefined, 0) },
        { json: "spellLevel", js: "spellLevel", typ: u(undefined, 0) },
        { json: "ability", js: "ability", typ: u(undefined, r("SpellcastingEnum")) },
        { json: "mod", js: "mod", typ: u(undefined, 0) },
        { json: "dc", js: "dc", typ: u(undefined, 0) },
        { json: "cantripBoost", js: "cantripBoost", typ: u(undefined, true) },
        { json: "overrideDC", js: "overrideDC", typ: u(undefined, true) },
        { json: "id", js: "id", typ: u(undefined, 0) },
        { json: "entityTypeId", js: "entityTypeId", typ: u(undefined, 0) },
    ], false),
    "DndbeyondDamage": o([
        { json: "parts", js: "parts", typ: a("any") },
    ], false),
    "Source": o([
        { json: "sourceId", js: "sourceId", typ: 0 },
        { json: "pageNumber", js: "pageNumber", typ: u(0, null) },
        { json: "sourceType", js: "sourceType", typ: 0 },
    ], false),
    "Magicitems": o([
        { json: "enabled", js: "enabled", typ: true },
        { json: "equipped", js: "equipped", typ: u(undefined, true) },
        { json: "attuned", js: "attuned", typ: u(undefined, true) },
        { json: "charges", js: "charges", typ: u(undefined, "") },
        { json: "chargeType", js: "chargeType", typ: u(undefined, "") },
        { json: "destroy", js: "destroy", typ: u(undefined, true) },
        { json: "destroyFlavorText", js: "destroyFlavorText", typ: u(undefined, "") },
        { json: "rechargeable", js: "rechargeable", typ: u(undefined, true) },
        { json: "recharge", js: "recharge", typ: u(undefined, "") },
        { json: "rechargeType", js: "rechargeType", typ: u(undefined, "") },
        { json: "rechargeUnit", js: "rechargeUnit", typ: u(undefined, "") },
        { json: "sorting", js: "sorting", typ: u(undefined, "") },
    ], false),
    "Permission": o([
        { json: "default", js: "default", typ: 0 },
    ], false),
    "Token": o([
        { json: "flags", js: "flags", typ: r("SkillCustomization5_E") },
        { json: "name", js: "name", typ: "" },
        { json: "displayName", js: "displayName", typ: 0 },
        { json: "img", js: "img", typ: "" },
        { json: "tint", js: "tint", typ: null },
        { json: "width", js: "width", typ: 0 },
        { json: "height", js: "height", typ: 0 },
        { json: "scale", js: "scale", typ: 0 },
        { json: "mirrorX", js: "mirrorX", typ: true },
        { json: "mirrorY", js: "mirrorY", typ: true },
        { json: "lockRotation", js: "lockRotation", typ: true },
        { json: "rotation", js: "rotation", typ: 0 },
        { json: "vision", js: "vision", typ: true },
        { json: "dimSight", js: "dimSight", typ: 0 },
        { json: "brightSight", js: "brightSight", typ: 0 },
        { json: "dimLight", js: "dimLight", typ: 0 },
        { json: "brightLight", js: "brightLight", typ: 0 },
        { json: "sightAngle", js: "sightAngle", typ: 0 },
        { json: "lightAngle", js: "lightAngle", typ: 0 },
        { json: "lightColor", js: "lightColor", typ: null },
        { json: "lightAlpha", js: "lightAlpha", typ: 0 },
        { json: "lightAnimation", js: "lightAnimation", typ: r("LightAnimation") },
        { json: "actorId", js: "actorId", typ: "" },
        { json: "actorLink", js: "actorLink", typ: true },
        { json: "disposition", js: "disposition", typ: 0 },
        { json: "displayBars", js: "displayBars", typ: 0 },
        { json: "bar1", js: "bar1", typ: r("Bar") },
        { json: "bar2", js: "bar2", typ: r("Bar") },
        { json: "randomImg", js: "randomImg", typ: true },
        { json: "alpha", js: "alpha", typ: 0 },
    ], false),
    "Bar": o([
        { json: "attribute", js: "attribute", typ: "" },
    ], false),
    "LightAnimation": o([
        { json: "speed", js: "speed", typ: 0 },
        { json: "intensity", js: "intensity", typ: 0 },
    ], false),
    "ACType": [
        "Number",
    ],
    "MovementUnits": [
        "",
        "ft.",
        "self",
        "touch",
        "ft",
    ],
    "SpellcastingEnum": [
        "cha",
        "",
        "wis",
    ],
    "ResultString": [
        "",
        "+14",
        "+25",
        "+3",
        "+4",
    ],
    "AbilityEnum": [
        "dex",
        "",
        "str",
    ],
    "ActivationType": [
        "action",
        "bonus",
        "",
        "minute",
        "special",
    ],
    "ConsumeType": [
        "attribute",
        "",
    ],
    "Versatile": [
        "",
        "1d10 + @mod +1",
        "1d8 + @mod",
    ],
    "UnidentifiedEnum": [
        "Dagger",
        "",
        "Gear",
        "Heavy Armor",
        "Lance",
        "Shield",
        "Spear",
    ],
    "DurationUnits": [
        "",
        "hour",
        "inst",
        "minute",
        "round",
    ],
    "PreparationMode": [
        "always",
        "prepared",
    ],
    "Rarity": [
        "common",
        "",
        "rare",
        "uncommon",
    ],
    "ScalingEnum": [
        "spell",
    ],
    "FormulaEnum": [
        "",
        "1d6",
        "1d8",
    ],
    "ScalingMode": [
        "level",
        "none",
    ],
    "TargetType": [
        "creature",
        "",
        "self",
        "sphere",
    ],
    "CritDamageType": [
        "String",
    ],
    "PurpleType": [
        "Boolean",
    ],
    "QuickDamageType": [
        "Array",
    ],
    "Class": [
        "Paladin",
        "Paladin : Oath of Devotion",
    ],
    "Lookup": [
        "classSpell",
    ],
};

module.exports = {
    "characterToJson": characterToJson,
    "toCharacter": toCharacter,
};