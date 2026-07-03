// ===========================================
// prepare_for_gps_map.js
//
// Converts GPS messages into the format
// required by the Node-RED WorldMap node.
// ===========================================

if (

    msg.payload &&
    Array.isArray(msg.payload)

) {

    msg.payload = msg.payload.map(function (item) {

        return {

            name: item.name,

            lat: item.lat,

            lon: item.lon,

            icon: "fa-bicycle",

            layer: "Bicycles",

            tooltip: item.name,

            deleted: item.deleted || false

        };

    });

    return msg;

}

return null;