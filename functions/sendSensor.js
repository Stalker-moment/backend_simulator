const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function sendCount() {
  try {
    //ambil data paling terakhir
    let latestLog = await prisma.logs.findFirst({
      orderBy: {
        timestamp: 'desc', // Sort by timestamp in descending order
      },
    });

    // Check if a log entry exists
    if (!latestLog) {
      throw new Error('No logs found');
    }

    //calculate output before send
    const timefactor = 3;

    const dataVoltage1powerUp = latestLog.voltage1 * timefactor;
    const dataCurrent1PowerUp = latestLog.current1 * timefactor;

    // Limit to 2 decimal places
    latestLog.voltage1 = dataVoltage1powerUp.toFixed(2);
    latestLog.current1 = dataCurrent1PowerUp.toFixed(2);

    latestLog = {
        voltage1: dataVoltage1powerUp,
        voltage2: latestLog.voltage2,
        voltage3: latestLog.voltage3,
        current1: dataCurrent1PowerUp,
        current2: latestLog.current2,
        current3: latestLog.current3,
        power1: latestLog.power1,
        power2: latestLog.power2,
        power3: latestLog.power3,
        energy1: latestLog.energy1,
        energy2: latestLog.energy2,
        energy3: latestLog.energy3,
        frequency1: latestLog.frequency1,
        frequency2: latestLog.frequency2,
        frequency3: latestLog.frequency3,
        PF1: latestLog.PF1,
        PF2: latestLog.PF2,
        PF3: latestLog.PF3,
        timestamp: latestLog.timestamp
    };

    return latestLog; // Return the latest log entry
  } catch (error) {
    console.error("Error fetching latest log:", error);
    throw error;
  }
}

module.exports = sendCount;