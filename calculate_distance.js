// ===========================================
// calculate_distance.js
//
// Calculates the total distance travelled
// by each bike using the Haversine Formula.
//
// Supports:
// - Bike 1
// - Bike 2
// - Bike 3
// - All Bikes
// ===========================================

var bikeId = global.get("selectedBike");

// -------------------------------
// Bike 1
// -------------------------------

var totalDistanceBike1 = context.get("totalDistanceBike1") || 0;
var latArrayBike1 = context.get("latArrayBike1") || [];
var lonArrayBike1 = context.get("lonArrayBike1") || [];

// -------------------------------
// Bike 2
// -------------------------------

var totalDistanceBike2 = context.get("totalDistanceBike2") || 0;
var latArrayBike2 = context.get("latArrayBike2") || [];
var lonArrayBike2 = context.get("lonArrayBike2") || [];

// -------------------------------
// Bike 3
// -------------------------------

var totalDistanceBike3 = context.get("totalDistanceBike3") || 0;
var latArrayBike3 = context.get("latArrayBike3") || [];
var lonArrayBike3 = context.get("lonArrayBike3") || [];


// ===========================================
// Process GPS Messages
// ===========================================

if (msg.payload.sensor_type === "position") {

    //----------------------------------------
    // Bike 1
    //----------------------------------------

    if (msg.payload.bike_id === "bike_1") {

        updateBike(
            msg.payload.data.latitude,
            msg.payload.data.longitude,
            latArrayBike1,
            lonArrayBike1
        );

        if (latArrayBike1.length === 2) {

            totalDistanceBike1 += haversineDistance(

                latArrayBike1[0],
                lonArrayBike1[0],

                latArrayBike1[1],
                lonArrayBike1[1]

            );

        }

        context.set("latArrayBike1", latArrayBike1);
        context.set("lonArrayBike1", lonArrayBike1);
        context.set("totalDistanceBike1", totalDistanceBike1);

    }

    //----------------------------------------
    // Bike 2
    //----------------------------------------

    if (msg.payload.bike_id === "bike_2") {

        updateBike(
            msg.payload.data.latitude,
            msg.payload.data.longitude,
            latArrayBike2,
            lonArrayBike2
        );

        if (latArrayBike2.length === 2) {

            totalDistanceBike2 += haversineDistance(

                latArrayBike2[0],
                lonArrayBike2[0],

                latArrayBike2[1],
                lonArrayBike2[1]

            );

        }

        context.set("latArrayBike2", latArrayBike2);
        context.set("lonArrayBike2", lonArrayBike2);
        context.set("totalDistanceBike2", totalDistanceBike2);

    }

    //----------------------------------------
    // Bike 3
    //----------------------------------------

    if (msg.payload.bike_id === "bike_3") {

        updateBike(
            msg.payload.data.latitude,
            msg.payload.data.longitude,
            latArrayBike3,
            lonArrayBike3
        );

        if (latArrayBike3.length === 2) {

            totalDistanceBike3 += haversineDistance(

                latArrayBike3[0],
                lonArrayBike3[0],

                latArrayBike3[1],
                lonArrayBike3[1]

            );

        }

        context.set("latArrayBike3", latArrayBike3);
        context.set("lonArrayBike3", lonArrayBike3);
        context.set("totalDistanceBike3", totalDistanceBike3);

    }


    //----------------------------------------
    // Dashboard Output
    //----------------------------------------

    if (bikeId === "bike_1") {

        msg.payload = (totalDistanceBike1 / 1000).toFixed(2);

    }
    else if (bikeId === "bike_2") {

        msg.payload = (totalDistanceBike2 / 1000).toFixed(2);

    }
    else if (bikeId === "bike_3") {

        msg.payload = (totalDistanceBike3 / 1000).toFixed(2);

    }
    else {

        msg.payload = (

            (

                totalDistanceBike1 +
                totalDistanceBike2 +
                totalDistanceBike3

            ) / 1000

        ).toFixed(2);

    }

    return msg;

}



// ===========================================
// Store last two GPS points
// ===========================================

function updateBike(lat, lon, latArray, lonArray) {

    latArray.push(lat);

    if (latArray.length > 2) {

        latArray.shift();

    }

    lonArray.push(lon);

    if (lonArray.length > 2) {

        lonArray.shift();

    }

}



// ===========================================
// Haversine Formula
// ===========================================

function haversineDistance(lat1, lon1, lat2, lon2) {

    var R = 6371000;

    var phi1 = toRadians(lat1);
    var phi2 = toRadians(lat2);

    var deltaPhi = toRadians(lat2 - lat1);
    var deltaLambda = toRadians(lon2 - lon1);

    var a =

        Math.sin(deltaPhi / 2) *
        Math.sin(deltaPhi / 2) +

        Math.cos(phi1) *
        Math.cos(phi2) *

        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);

    var c =

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