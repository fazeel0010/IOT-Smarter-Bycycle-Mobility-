// ===========================================
// extract_average_battery.js
//
// Extracts average battery percentage.
//
// Dashboard Widget:
// Average Battery
// ===========================================

if (msg.payload && msg.payload.averageBattery !== undefined) {

    msg.payload = parseFloat(msg.payload.averageBattery);

    return msg;

}

return null;