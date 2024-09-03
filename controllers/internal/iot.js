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

router.post("/switch/relay1", async (req, res) => {
  let value = req.body.value;

  if (value === null) {
    return res.status(400).json({ error: "Invalid value" });
  }

  try {
    //check value before update
    const DataBefore = await prisma.relay.findFirst();

    const relay = await prisma.relay.upsert({
      where: { id: 1 },
      update: {
        relay1: value,
        relay2: DataBefore.relay2,
        relay3: DataBefore.relay3,
        relay4: DataBefore.relay4,
      },
      create: {
        relay1: value,
        relay2: DataBefore.relay2,
        relay3: DataBefore.relay3,
        relay4: DataBefore.relay4,
      },
    });

    return res.status(200).json({
      message: "Data relay updated successfully",
      relay,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/switch/relay2", async (req, res) => {
  let value = req.body.value;

  if (value === null) {
    return res.status(400).json({ error: "Invalid value" });
  }

  try {
    //check value before update
    const DataBefore = await prisma.relay.findFirst();

    const relay = await prisma.relay.upsert({
      where: { id: 1 },
      update: {
        relay1: DataBefore.relay1,
        relay2: value,
        relay3: DataBefore.relay3,
        relay4: DataBefore.relay4,
      },
      create: {
        relay1: DataBefore.relay1,
        relay2: value,
        relay3: DataBefore.relay3,
        relay4: DataBefore.relay4,
      },
    });

    return res.status(200).json({
      message: "Data relay updated successfully",
      relay,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/switch/relay3", async (req, res) => {
  let value = req.body.value;

  if (value === null) {
    return res.status(400).json({ error: "Invalid value" });
  }

  try {
    //check value before update
    const DataBefore = await prisma.relay.findFirst();

    const relay = await prisma.relay.upsert({
      where: { id: 1 },
      update: {
        relay1: DataBefore.relay1,
        relay2: DataBefore.relay2,
        relay3: value,
        relay4: DataBefore.relay4,
      },
      create: {
        relay1: DataBefore.relay1,
        relay2: DataBefore.relay2,
        relay3: value,
        relay4: DataBefore.relay4,
      },
    });

    return res.status(200).json({
      message: "Data relay updated successfully",
      relay,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/switch/relay4", async (req, res) => {
  let value = req.body.value;

  if (value === null) {
    return res.status(400).json({ error: "Invalid value" });
  }

  try {
    //check value before update
    const DataBefore = await prisma.relay.findFirst();

    const relay = await prisma.relay.upsert({
      where: { id: 1 },
      update: {
        relay1: DataBefore.relay1,
        relay2: DataBefore.relay2,
        relay3: DataBefore.relay3,
        relay4: value,
      },
      create: {
        relay1: DataBefore.relay1,
        relay2: DataBefore.relay2,
        relay3: DataBefore.relay3,
        relay4: value,
      },
    });

    return res.status(200).json({
      message: "Data relay updated successfully",
      relay,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//get data from relay (GET)
router.get("/relay", async (req, res) => {
  try {
    const relay = await prisma.relay.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res.status(200).json({
      relay,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
