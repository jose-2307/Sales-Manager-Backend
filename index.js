const express = require("express");
const cors = require("cors");
const routerApi = require("./routes");
const {logErrors, errorHandler, boomErrorHandler, ormErrorHandler} = require("./middlewares/error.handler");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json()); //obtenemos los datos en formato json

const whitelist = ["http://localhost:5173"]; //permitimos que el frontend se conecte
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("No permitido"));
    }
  }
}
app.use(cors(options)); //controlamos el acceso

require("./utils/auth");

routerApi(app);

//middlewares
app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port,() => {
  console.log(`Escuchando en el puerto ${port}`);
})
