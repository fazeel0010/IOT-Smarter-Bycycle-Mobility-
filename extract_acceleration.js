// ===========================================
// extract_acceleration.js
//
// Extracts acceleration.
//
// Dashboard Widget:
// Acceleration Gauge
// ===========================================

if (

    msg.payload &&
    msg.payload.acceleration !== undefined

) {

    msg.payload = parseFloat(

        msg.payload.acceleration

    );

    return msg;

}

return null;