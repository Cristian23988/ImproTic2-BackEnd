const Usuario= require("../models/user");
exports.getUsers = (req, res) => {
    Usuario.find().then((UserResult) => {
      res.status(200).json(UserResult)
    })
};
exports.getUser = (req, res) => {
  const email=req.userData.email;
  Usuario.findOne({email_usu:email}).then((user) => {
    if(user){
      if(user.estado_activo){
        res.status(200).json(user)
      }else{
        res.status(500).json(user)
      }      
    }else{
      const newUser=new Usuario({
        nombre_usu:req.userData.name,
        apellido_usu:"Apellido",
        tipo_documento_usu:"Cedula",
        identificacion_usu:111111,
        email_usu:req.userData.email,
        rol_usu:"Vendedor",
        estado_activo:false,
      });
      newUser.save().then((user)=>{
        res.status(200).json(user);
      })
    }
    //res.status(200).json(user)
  })
};
exports.ValidarAdmin = (req, res) => {
  const email = req.userData.email;
  Usuario.findOne({ email_usu: email }).then((user) => {
    if (user.rol_usu === "Admin") {
      res.status(200).json(true);
    } else {
      res.status(401).json(false);
    }
  });
};
exports.addUser=(req,res)=>{
    const userAdd = new Usuario({
        nombre_usu:req.body.nombre_usu,
        apellido_usu:req.body.apellido_usu,
        tipo_documento_usu:req.body.tipo_documento_usu,
        identificacion_usu:req.body.identificacion_usu,
        rol_usu:req.body.rol_usu,
        email_usu:req.body.email_usu,
        estado_activo:req.body.estado_activo
                
    });
     //metodo para guardar los nuevos usuarios
     userAdd.save().then((usercreado=>{
    console.log(usercreado)
    res.status(201).json("Creado exitosamente");
    }));
}
//Buscar pot id
exports.getUserId=(req, res)=>{
    Usuario.findById(req.params.id).then((UserResult)=>{
      console.log(UserResult);
      if(UserResult){
         res.status(200).json(UserResult);
      }else{
        res.status(404).json("Usuario no encontrado")
      }
    })
  }


  //Metodo para buscar un usuario por un valor
  exports.getIdentificacion=(req, res) => {
    Usuario.find({identificacion_usu:true}).then((UserResult) => {
      res.status(200).json(UserResult);
    });
  }
  exports.deleteUsu = (req, res) => {
    const id = req.params.id;
  
    Usuario.deleteOne({ _id: id }).then((UserResult) => {
      res.status(200).json("El Ususario se eliminó satisfactoriamente.");
    });
  };
  
  //método actualizar
  exports.editUsu = (req, res) => {
  
    const usuUpd = new Usuario({
      _id: req.body._id,
      nombre_usu:req.body.nombre_usu,
      apellido_usu:req.body.apellido_usu,
      tipo_documento_usu:req.body.tipo_documento_usu,
      identificacion_usu:req.body.identificacion_usu,
      rol_usu:req.body.rol_usu,
      email_usu:req.body.email_usu,
      estado_activo:req.body.estado_activo,
    });
  
    Usuario.findByIdAndUpdate(req.body._id, usuUpd).then((UserResult) => {
      if (UserResult) {
        res.status(200).json(UserResult);
      } else {
        res.status(404).json("Usuario no encontrado");
      }
    });
  };
  