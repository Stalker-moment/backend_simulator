const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch sensor logs filtered by a specific date or return all logs for the current day.
 * Convert timestamp into a string field in HH:MM:SS format.
 * Add indexCurrent and indexPressure based on thresholds.
 * @param {String|null} filterDate - The date to filter logs by in YYYY-MM-DD format. If null, fetch logs for the current day.
 * @returns {Promise<Array>} - A promise that resolves to an array of logs with formatted time, sensor data, and indexes.
 */
async function sendSensorLogs(filterDate = null) {
  try {
    let sensorLogs;

    // Check if filterDate is provided and is a string
    if (filterDate && typeof filterDate === 'string') {
      const [year, month, day] = filterDate.split("-").map(Number);
      const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
      const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

      sensorLogs = await prisma.logs.findMany({
        where: {
          timestamp: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: 15 // Take the last 15 logs
      });
    } else {
      // Default to the current day
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
      const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

      sensorLogs = await prisma.logs.findMany({
        where: {
          timestamp: {
            gte: startOfToday,
            lte: endOfToday
          }
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: 15 // Take the last 15 logs
      });
    }

    // Format the timestamp into HH:MM:SS DD/MM/YYYY
    sensorLogs.forEach((log) => {
      const timestamp = new Date(log.timestamp);
      log.timestamp = timestamp.toLocaleTimeString() + " " + timestamp.toLocaleDateString();
    });

    const timefactor = 3;

    //times 2 value voltage1 and power1
    sensorLogs.forEach((log) => {
      log.voltage1 = log.voltage1 * timefactor;
      log.current1 = log.current1 * timefactor;

      //membatasi 2 angka di belakang koma
      log.voltage1 = log.voltage1.toFixed(2);
      log.current1 = log.current1.toFixed(2);
    });

    return sensorLogs;
  } catch (error) {
    console.error("Error fetching sensorLogs:", error);
    throw error;
  }
}

module.exports = sendSensorLogs;