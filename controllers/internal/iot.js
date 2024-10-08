const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const mutex = require("async-mutex").Mutex;
const countMutex = new mutex();

dotenv.config();

// Middleware to verify JWT token and check admin role
const authenticateAdmin = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check for admin role
    if (decoded.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check token expiration
    if (decoded.expired < Date.now()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Attach decoded user info to request, including email
    req.user = {
      email: decoded.email,
      role: decoded.role,
      id: decoded.id,
      noReg: decoded.noReg,
    };

    next(); // Proceed to the next middleware/handler
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

async function parseBoolean(value) {
  // Check if the value is a boolean true (1) or false (0)
  if (value === "1" || value === "true") {
    return true;
  } else if (value === "0" || value === "false") {
    return false;
  } else {
    return null;
  }
}

router.get(
  "/ac/data/:voltage/:current/:frequency/:PF/:energy/:power/:watthours/:temp/:hum/:door",
  async (req, res) => {
    const voltage = parseFloat(req.params.voltage);
    const current = parseFloat(req.params.current);
    const frequency = parseFloat(req.params.frequency);
    const PF = parseFloat(req.params.PF);
    const energy = parseFloat(req.params.energy);
    const power = parseFloat(req.params.power);
    const watthours = parseFloat(req.params.watthours);
    const temp = parseFloat(req.params.temp);
    const hum = parseFloat(req.params.hum);
    const door = await parseBoolean(req.params.door);

    try {
      const sensor = await prisma.sensorAC.upsert({
        where: { id: 1 },
        update: {
          voltage: voltage,
          current: current,
          power: power,
          watthours: watthours,
          energy: energy,
          frequency: frequency,
          PF: PF,
          temp: temp,
          hum: hum,
          door: door,
        },
        create: {
          voltage: voltage,
          current: current,
          power: power,
          watthours: watthours,
          energy: energy,
          frequency: frequency,
          PF: PF,
          temp: temp,
          hum: hum,
          door: door,
        },
      });

      const sensorLog = await prisma.logsAC.create({
        data: {
          voltage: voltage,
          current: current,
          power: power,
          watthours: watthours,
          energy: energy,
          frequency: frequency,
          PF: PF,
          temp: temp,
          hum: hum,
          door: door,
        },
      });

      return res.status(200).json({
        message: "Data sensor updated successfully",
        sensor,
      });
    } catch (error) {
      console.error("Error in Prisma operation:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/output/auto", async (req, res) => {
  let value = req.body.value;

  if (value === null) {
    return res.status(400).json({ error: "Invalid value" });
  }

  try {
    //check value before update
    const DataBefore = await prisma.outputAC.findFirst();

    const outputAC = await prisma.outputAC.upsert({
      where: { id: 1 },
      update: {
        Auto: value,
        AC: DataBefore.AC,
        purifier: DataBefore.purifier,
        fan: DataBefore.fan,
        lamp: DataBefore.lamp,
      },
      create: {
        Auto: value,
        AC: DataBefore.AC,
        purifier: DataBefore.purifier,
        fan: DataBefore.fan,
        lamp: DataBefore.lamp,
      },
    });

    return res.status(200).json({
      message: "Data outputAC updated successfully",
      outputAC,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/output/ac", async (req, res) => {
  let value = req.body.value;

  if (value === null) {
    return res.status(400).json({ error: "Invalid value" });
  }

  try {
    //check value before update
    const DataBefore = await prisma.outputAC.findFirst();

    const outputAC = await prisma.outputAC.upsert({
      where: { id: 1 },
      update: {
        Auto: DataBefore.Auto,
        AC: value,
        purifier: DataBefore.purifier,
        fan: DataBefore.fan,
        lamp: DataBefore.lamp,
      },
      create: {
        Auto: DataBefore.Auto,
        AC: value,
        purifier: DataBefore.purifier,
        fan: DataBefore.fan,
        lamp: DataBefore.lamp,
      },
    });

    return res.status(200).json({
      message: "Data outputAC updated successfully",
      outputAC,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/output/purifier", async (req, res) => {
  let value = req.body.value;

  if (value === null) {
    return res.status(400).json({ error: "Invalid value" });
  }

  try {
    //check value before update
    const DataBefore = await prisma.outputAC.findFirst();

    const outputAC = await prisma.outputAC.upsert({
      where: { id: 1 },
      update: {
        Auto: DataBefore.Auto,
        AC: DataBefore.AC,
        purifier: value,
        fan: DataBefore.fan,
        lamp: DataBefore.lamp,
      },
      create: {
        Auto: DataBefore.Auto,
        AC: DataBefore.AC,
        purifier: value,
        fan: DataBefore.fan,
        lamp: DataBefore.lamp,
      },
    });

    return res.status(200).json({
      message: "Data outputAC updated successfully",
      outputAC,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/output/fan", async (req, res) => {
  let value = req.body.value;

  if (value === null) {
    return res.status(400).json({ error: "Invalid value" });
  }

  try {
    //check value before update
    const DataBefore = await prisma.outputAC.findFirst();

    const outputAC = await prisma.outputAC.upsert({
      where: { id: 1 },
      update: {
        Auto: DataBefore.Auto,
        AC: DataBefore.AC,
        purifier: DataBefore.purifier,
        fan: value,
        lamp: DataBefore.lamp,
      },
      create: {
        Auto: DataBefore.Auto,
        AC: DataBefore.AC,
        purifier: DataBefore.purifier,
        fan: value,
        lamp: DataBefore.lamp,
      },
    });

    return res.status(200).json({
      message: "Data outputAC updated successfully",
      outputAC,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/output/lamp", async (req, res) => {
  let value = req.body.value;

  if (value === null) {
    return res.status(400).json({ error: "Invalid value" });
  }

  try {
    //check value before update
    const DataBefore = await prisma.outputAC.findFirst();

    const outputAC = await prisma.outputAC.upsert({
      where: { id: 1 },
      update: {
        Auto: DataBefore.Auto,
        AC: DataBefore.AC,
        purifier: DataBefore.purifier,
        fan: DataBefore.fan,
        lamp: value,
      },
      create: {
        Auto: DataBefore.Auto,
        AC: DataBefore.AC,
        purifier: DataBefore.purifier,
        fan: DataBefore.fan,
        lamp: value,
      },
    });

    return res.status(200).json({
      message: "Data outputAC updated successfully",
      outputAC,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//get data from outputAC (GET)
router.get("/output", async (req, res) => {
  try {
    const outputAC = await prisma.outputAC.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res.status(200).json({
      outputAC,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;