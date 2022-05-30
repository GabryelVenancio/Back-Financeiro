// Importando o modulo mongoose e reverenciando na constante mongoose
const mongoose = require("mongoose");

// Construindo um esquema de dados que representa o campos de dados pra cadastrar os usuários
const schema_user = new mongoose.Schema({
    fullname:{type:String, require:true},
    email:{type:String, require:true, unique:true},
    phone:{type:String},
    user:{type:String, require:true, unique:true},
    password:{type:String,require:true}
});

// Exportando o modelo de dado do usuario para que ele fique visivel 
module.exports = mongoose.model("Users",schema_user);