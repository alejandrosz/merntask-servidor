const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

exports.crearProyecto = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario.id;
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).send("hubo un error en el servidor");
  }
};

exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id });
    res.json({ proyectos });
    console.log(req.usuario);
  } catch (error) {
    console.log(error);
    res.status(500).send("hubo un error");
  }
};

exports.actualizarProyecto = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { nombre } = req.body;
  const nuevoProyecto = {};

  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }

  try {
    let proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    proyecto = await Proyecto.findOneAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );
    res.json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};

exports.eliminarProyecto = async (req, res) => {
  try {
    let proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    await Proyecto.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Proyecto eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).send("error en el servidor");
  }
};
