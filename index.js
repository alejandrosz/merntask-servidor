const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors")

const app = express();
conectarDB();

app.use(cors())

app.use(express.json({ extended: true }));

const port = process.env.port || 4000;

app.get("/", (req, res) => {
  res.send("Hola Mundo");
});

app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyectos", require("./routes/proyectos"));
app.use("/api/tareas", require("./routes/tareas"));

app.listen(port, '0.0.0.0', () => {
  console.log(`el servidor esta funcionando en el puerto ${port}`);
});
