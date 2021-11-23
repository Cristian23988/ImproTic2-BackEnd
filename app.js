var express = require("express");
var mongoose = require("mongoose");
const cors = require("cors");
var app = express();
require("dotenv").config();

const productsRoutes = require("./routes/products");
const categoriaRoutes = require("./routes/categoria");
const ventasRoutes = require("./routes/ventas");
const UsuarioRoutes = require('./routes/users');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
//coneccion a la db mongo
mongoose
    .connect(
        process.env.MONGODB_CONNECT
        ).then(() => {
            console.log("Estamos conectados")
        });

app.use("/api/Usuarios", UsuarioRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categoria", categoriaRoutes);
app.use("/api/ventas", ventasRoutes);
module.exports = app;