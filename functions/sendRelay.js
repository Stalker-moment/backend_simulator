const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function sendRelay() {
  try {
    //ambil data paling terakhir
    let latestLog = await prisma.relay.findFirst({
      orderBy: {
        updatedAt: "desc", // Sort by timestamp in descending order
      },
    });

    // Check if a log entry exists
    if (!latestLog) {
      throw new Error("No logs found");
    }

    latestLog = {
      relay1: latestLog.relay1,
      relay2: latestLog.relay2,
      relay3: latestLog.relay3,
      relay4: latestLog.relay4,
      update: latestLog.updatedAt,
    };

    return latestLog; // Return the latest log entry
  } catch (error) {
    console.error("Error fetching latest log:", error);
    throw error;
  }
}

module.exports = sendRelay;
