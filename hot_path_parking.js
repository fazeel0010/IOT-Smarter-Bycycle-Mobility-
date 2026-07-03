// ===========================================
// hot_path_parking.js
//
// Processes bicycle parking data.
//
// Features:
// - Current Parking Status
// - Parking Duration
// - Parking Alert
// - Combined Statistics
// ===========================================

var bikeId = global.get("selectedBike");

if (msg.payload.sensor_type === "parking") {

    //------------------------------------------------
    // Individual Bike
    //------------------------------------------------

    if (msg.payload.bike_id === bikeId && bikeId !== "all") {

        var status = msg.payload.data.status;

        var duration = calculateParkingDuration(
            bikeId,
            status,
            msg.payload.timestampRegular
        );

        msg.payload = {

            status: status,

            parkingDuration: duration,

            alert: duration >= 300 ? "Long Parking" : "Normal"

        };
        return msg;
    }

    //------------------------------------------------
    // All Bikes
    //------------------------------------------------

    else if (bikeId === "all") {

        updateBikeStatus(msg.payload.bike_id, msg.payload.data.status);

        msg.payload = {

            bike1: context.get("parkingStatusBike1") || "Unknown",

            bike2: context.get("parkingStatusBike2") || "Unknown",

            bike3: context.get("parkingStatusBike3") || "Unknown"

        };
        return msg;
    }
}



// ===========================================
// Calculate Parking Duration
// ===========================================

function calculateParkingDuration(bike, status, timestamp) {

    var startTime = context.get("parkingStart_" + bike);

    if (status === "Parked") {

        if (!startTime) {

            startTime = timestamp;

            context.set("parkingStart_" + bike, startTime);
        }
        return timestamp - startTime;
    }

    // Bike is moving
    context.set("parkingStart_" + bike, null);

    return 0;
}



// ===========================================
// Store Parking Status
// ===========================================

// function updateBikeStatus(bike, status) {

//     if (bike === "bike_1") {

//         context.set("parkingStatusBike1", status
//         );
//     }

//     if (bike === "bike_2") {

//         context.set("parkingStatusBike2", status
//         );
//     }

//     if (bike === "bike_3") {

//         context.set("parkingStatusBike3", status
//         );
//     }

// }


function updateBikeStatus(bike, status) {

    context.set("parkingStatus_" + bike, status);

    if (bike === "bike_1") {
        context.set("parkingStatusBike1", status);
    }

    if (bike === "bike_2") {
        context.set("parkingStatusBike2", status);
    }

    if (bike === "bike_3") {
        context.set("parkingStatusBike3", status);
    }
}