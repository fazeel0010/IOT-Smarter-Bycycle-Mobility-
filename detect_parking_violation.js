// ===========================================
// detect_parking_violation.js
//
// Detects parking violations using simple
// geofencing.
//
// Conditions:
// 1. Bike must be Parked
// 2. Bike must be outside every parking zone
// ===========================================

if (
    msg.payload.sensor_type !== "position"
) {
    return null;
}

var bikeId = global.get("selectedBike");

// Retrieve latest parking status
var parkingStatus = context.get(
    "parkingStatus_" + msg.payload.bike_id
) || "Moving";


// ===========================================
// Parking Zones
// Radius is in meters
// ===========================================

const parkingZones = [

    {
        name: "Brignole Station",
        lat: 44.4056,
        lon: 8.9463,
        radius: 120
    },

    {
        name: "Porto Antico",
        lat: 44.4105,
        lon: 8.9253,
        radius: 150
    },

    {
        name: "Piazza De Ferrari",
        lat: 44.4072,
        lon: 8.9339,
        radius: 100
    }

];


// ===========================================
// Ignore Moving Bikes
// ===========================================

if (parkingStatus !== "Parked") {

    msg.payload = {

        bike: msg.payload.bike_id,

        violation: false,

        message: "Bike is moving."

    };

    return msg;

}


// ===========================================
// Check Parking Zones
// ===========================================

var insideParkingZone = false;

parkingZones.forEach(zone => {

    var distance = calculateDistance(

        msg.payload.data.latitude,

        msg.payload.data.longitude,

        zone.lat,

        zone.lon

    );

    if (distance <= zone.radius) {

        insideParkingZone = true;

    }

});


// ===========================================
// Build Dashboard Message
// ===========================================

if (insideParkingZone) {

    msg.payload = {

        bike: msg.payload.bike_id,

        violation: false,

        message: "Bike parked correctly."

    };

}
else {

    msg.payload = {

        bike: msg.payload.bike_id,

        violation: true,

        message: "Illegal Parking Detected!"

    };

}

return msg;


// ===========================================
// Haversine Distance
// Returns meters
// ===========================================

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371000;

    const dLat = toRadians(lat2 - lat1);

    const dLon = toRadians(lon2 - lon1);

    const a =

        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(toRadians(lat1)) *

        Math.cos(toRadians(lat2)) *

        Math.sin(dLon / 2) *

        Math.sin(dLon / 2);

    const c =

        2 *

        Math.atan2(

            Math.sqrt(a),

            Math.sqrt(1 - a)

        );

    return R * c;

}

function toRadians(degrees) {

    return degrees * Math.PI / 180;

}