// ===========================================
// extract_speed.js
//
// Extracts the current speed value from the
// Hot Path Speed node.
//
// Dashboard Widget:
// - Speed Gauge
// - Speed Text
// ===========================================

if (msg.payload && msg.payload.speed !== undefined) {

    msg.payload = parseFloat(msg.payload.speed);

    return msg;
}

return null;