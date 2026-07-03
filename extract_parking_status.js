// ===========================================
// extract_parking_status.js
//
// Extracts current parking status.
//
// Dashboard Widget:
// Parking Status Text
// ===========================================

if (msg.payload && msg.payload.status !== undefined) {

    msg.payload = msg.payload.status;

    return msg;

}

return null;