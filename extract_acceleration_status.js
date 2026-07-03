// ===========================================
// extract_acceleration_status.js
//
// Extracts acceleration status.
//
// Dashboard Widget:
// Dangerous Riding Indicator
// ===========================================

if (

    msg.payload &&
    msg.payload.status !== undefined

) {

    msg.payload = msg.payload.status;

    return msg;

}

return null;