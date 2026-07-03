// ===========================================
// extract_parking_duration.js
//
// Extracts parking duration.
//
// Dashboard Widget:
// Parking Duration
// ===========================================

if (

    msg.payload &&
    msg.payload.parkingDuration !== undefined

) {

    var seconds = parseInt(msg.payload.parkingDuration);

    msg.payload = seconds + " sec";

    return msg;

}

return null;