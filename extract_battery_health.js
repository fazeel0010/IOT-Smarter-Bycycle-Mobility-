// ===========================================
// extract_battery_health.js
//
// Extracts battery health.
//
// Dashboard Widget:
// Battery Health Text
// ===========================================

if (msg.payload && msg.payload.health !== undefined) {

    msg.payload = msg.payload.health;

    return msg;

}

return null;