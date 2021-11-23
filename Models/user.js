const mongoose = require("mongoose");
const usuario=mongoose.Schema({
    nombre_usu:{type: String, required: false},
    apellido_usu:{type:String ,required:false},
    tipo_documento_usu:{type:String ,required:false},
    identificacion_usu:{type:Number ,required:false},
    rol_usu:{type:String ,required:false},
    email_usu:{type:String ,required:true},
    estado_activo:{type:Boolean ,required:true}
    
})
//exportamos el modelo
module.exports=mongoose.model("usuarios",usuario)