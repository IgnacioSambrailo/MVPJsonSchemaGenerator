//Para pruebas
var keys = ["data", "data.id", "data.address", "data.address.state", "data.address.state.id", "data.address.state.name", "data.address.city", "data.address.zipCode", "data.address.country", "data.address.country.id", "data.address.country.name", "data.address.geolocation", "data.address.geolocation.latitude", "data.address.geolocation.longitude", "data.distance", "data.description", "data.estimatedWaitingTime", "data.availableServices", "data.availableServices.id", "data.isOpen", "data.hasDigitalAppointment", "data.branchType", "data.branchType.id", "data.branchType.description", "data.atmsInBranch", "data.atmsInBranch.id", "data.atmsInBranch.number", "data.links", "data.links.id", "data.links.rel", "data.links.href", "data.links.method"];
var mandatory = [true, true, true, true, false, false, false, true, true, true, true, true, true, true, true, true, false, false, true, false, false, false, true, false, false, false, false, true, true, true, true, true];
var types = ["Object[]", "String", "Object", "Object", "String", "String", "String", "String", "Object", "String", "String", "Object", "Number", "Number", "Number", "String", "Number", "Object[]", "String", "Boolean", "Boolean", "Object", "Enum", "String", "Object[]", "Enum", "Number", "Object[]", "String", "String", "String", "Enum"];
var enumValues = ["","","","","","","","","","","","","","","","","","","","","","",["Pepito1","Pepito2"],"","",["prueba","prueba2"],"","","","","",["Pepito","pepito2"]]
var type_of_response = "list"

function zip(keys,mandatory,types,enumValues) {
    const zipArray = []
    for (var i = 0; i < keys.length; i++) {
        var aux = []
        zipArray.push({path:keys[i],required:mandatory[i], type:types[i],enum_value:enumValues[i]})
    } 
    return zipArray
}

var prueba = zip(keys,mandatory,types,enumValues)


// Codigo

function setear_nivel(key, tipos, current_level){
    var propiedades = key.split(".") // Se parte por propiedad 
    var p = ""
    propiedades.forEach(function (propiedad){
        p = p + propiedad
        if (propiedad != propiedades.at(-1)){

            

            switch(tipos[p]){
                case "Object[]":
                    current_level = current_level[propiedad]["items"]["properties"]
                    break;
                case "Object":
                    current_level = current_level[propiedad]["properties"]
                    break;
            }   
        }
        p = p + "."
    })
    return current_level
}

function setear_nivel_mandatorio(key, tipos, current_level){
    var propiedades = key.split(".")
    var prop = ""
    if (propiedades.length >= 2){
        current_level = Numbercurrent_level["items"]["properties"]//Entra en propertires del schema
        for (var i = 0; i<propiedades.length-1;i++){
            prop = prop + propiedades[i]
                switch(tipos[prop]){
                    case "Object[]":
                        current_level = current_level[propiedades[i]]["items"]
                        if(propiedades[i] != propiedades.at(-2)){
                            current_level = Numbercurrent_level["items"]["properties"]
                        }
                        break;
                    case "ObjectStr":
                    current_level = current_level[propiedades[i]]["items"]
                    if(propiedades[i] != propiedades.at(-2)){
                        current_level = Numbercurrent_level["items"]["properties"]
                    }
                    break;
                    case "ObjectNum":
                        current_level = current_level[propiedades[i]]["items"]
                        if(propiedades[i] != propiedades.at(-2)){
                            current_level = Numbercurrent_level["items"]["properties"]
                        }
                        break;
                    case "Object":
                        current_level = current_level[propiedades[i]]
                        if(propiedades[i] != propiedades.at(-2)){
                            current_level = Numbercurrent_level["items"]["properties"]
                        }
                        break;
                }
            prop = prop + "."
        }
    }
    return current_level["required"]
}

function generate_json_schema(starts, paths){

    type_of_response = starts;

    console.log(type_of_response);

    if(type_of_response == "list"){
        var schema = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "array",
            "items": {
                    "type": "object",
                    "properties": {}
                  },
            "required" : []
        }
    }else{
        var schema = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object",
            "properties": {},
            "required" : []
        }
    }

    var tipos = {}
    for (var k = 0; k<paths.length;k++){
        tipos[paths[k]["path"]] = paths[k]["type"]
    }

    // Iteramos sobre cada key y construimos el esquema
    paths.forEach(function(path){
        if(type_of_response == "list"){
            var current_level = setear_nivel(path["path"], tipos, schema["items"]["properties"])
        }else{
            var current_level = setear_nivel(path["path"], tipos, schema["properties"])
        }
        if (path["path"].split(".").length == 1){
            var ultimaProp = path["path"].split(".")[0]
        }else{
            var ultimaProp = path["path"].split(".").at(-1)
        }
        console.log(current_level);     
        switch(tipos[path["path"]].toLowerCase()){
            case "object[]":
                current_level[ultimaProp] = {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": [],
                        "properties": {},
                        "additionalProperties": false
                    }
                }  
                break;
            case "objectnum":
                current_level[ultimaProp] = {
                    "type": "array",
                    "items": {
                        "type": "number",
                        "required": [],
                        "properties": {},
                        "additionalProperties": false
                    }
                }  
                break;
            case "objectstr":
                current_level[ultimaProp] = {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "required": [],
                        "properties": {},
                        "additionalProperties": false
                    }
                }  
                break;
            case "string":
                current_level[ultimaProp] = {
                    "type": path["type"].toLowerCase()
                }
                break;
            case "number":
            current_level[ultimaProp] = {
                "type": path["type"].toLowerCase()
            }
            break;
            case "object":
                current_level[ultimaProp] = {
                    "type":  path["type"].toLowerCase(),
                    "properties": {},
                    "required": [],
                    "additionalProperties": false
                }
                break;
            case "enum":
                current_level[ultimaProp] = {
                    "enum": path["enum_value"]
                }
                break;
            case "boolean":
                current_level[ultimaProp] = {
                    "type": "boolean"
                }
                break;
        }
        if (path["required"]){
            current_level = setear_nivel_mandatorio(path["path"], tipos, schema)
            current_level.push(ultimaProp)
        }
            
    })
    return schema
}


// Ejecución
// schema = generate_json_schema(prueba);
// console.log("Resultado")
// console.log(schema["properties"]["data"]["items"]["properties"])
// console.log(schema["properties"]["data"]["items"]["properties"]["address"]["properties"]["country"])
// console.log(JSON.stringify(schema))