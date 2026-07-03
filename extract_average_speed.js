// ===========================================
// extract_average_speed.js
//
// Extracts the average speed.
//
// Dashboard Widget:
// Average Speed Text
// ===========================================

if (msg.payload && msg.payload.averageSpeed !== undefined) {

    msg.payload = parseFloat(msg.payload.averageSpeed);

    return msg;
}

return null;