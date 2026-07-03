// ===========================================
// csv_writer.js
//
// Converts MQTT messages into CSV format.
//
// Output:
// 1 -> speed.csv
// 2 -> battery.csv
// 3 -> position.csv
// 4 -> acceleration.csv
// 5 -> parking.csv
//
// Configure this Function node with
// FIVE outputs.
// ===========================================

var payload = msg.payload;

var timestamp = payload.timestamp;
var bikeId = payload.bike_id;

switch (payload.sensor_type) {

    // ===================================
    // SPEED
    // ===================================

    case "speed":

        return [

            {
                payload:
                    timestamp + "," +
                    bikeId + "," +
                    payload.data.speed
            },

            null,
            null,
            null,
            null

        ];


    // ===================================
    // BATTERY
    // ===================================

    case "battery":

        return [

            null,

            {
                payload:
                    timestamp + "," +
                    bikeId + "," +
                    payload.data.battery + "," +
                    payload.data.health
            },

            null,
            null,
            null

        ];


    // ===================================
    // POSITION
    // ===================================

    case "position":

        return [

            null,
            null,

            {
                payload:
                    timestamp + "," +
                    bikeId + "," +
                    payload.data.latitude + "," +
                    payload.data.longitude
            },

            null,
            null

        ];


    // ===================================
    // ACCELERATION
    // ===================================

    case "acceleration":

        return [

            null,
            null,
            null,

            {
                payload:
                    timestamp + "," +
                    bikeId + "," +
                    payload.data.x + "," +
                    payload.data.y + "," +
                    payload.data.z
            },

            null

        ];


    // ===================================
    // PARKING
    // ===================================

    case "parking":

        return [

            null,
            null,
            null,
            null,

            {
                payload:
                    timestamp + "," +
                    bikeId + "," +
                    payload.data.status
            }

        ];

}

return null;