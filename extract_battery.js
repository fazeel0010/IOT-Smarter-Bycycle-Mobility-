// ===========================================
// extract_battery.js
//
// Extracts the current battery percentage
// from the Hot Path Battery node.
//
// Dashboard Widget:
// - Battery Gauge
// - Battery Text
// ===========================================

if (msg.payload && msg.payload.battery !== undefined) {

    msg.payload = parseFloat(msg.payload.battery);

    return msg;

}

return null;