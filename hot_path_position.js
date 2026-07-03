// ===========================================
// hot_path_position.js
//
// Handles the real-time GPS markers shown
// on the Node-RED WorldMap.
//
// Supports:
// - Bike 1
// - Bike 2
// - Bike 3
// - All Bikes
// ===========================================

// Retrieve selected bike
var bikeId = global.get("selectedBike");

// Previously selected bike
var previousBikeId = context.get("previousBikeId");

var deletePayloads = [];
var updatePayload = null;


// ===========================================
// Helper Function
// ===========================================

function addDeletePayload(name) {

    deletePayloads.push({
        name: name,
        deleted: true
    });
}


// ===========================================
// Process GPS Messages
// ===========================================

if (msg.payload.sensor_type === "position") {

    //------------------------------------------
    // Switched from ALL to one bike
    //------------------------------------------

    if (previousBikeId === "all" && bikeId !== "all") {

        ["bike_1", "bike_2", "bike_3"].forEach(function (bike) {

            if (bike !== bikeId) {
                addDeletePayload(bike);
            }

        });

    }


    //------------------------------------------
    // Display ALL Bikes
    //------------------------------------------

    if (bikeId === "all") {

        updatePayload = {

            name: msg.payload.bike_id,

            lat: msg.payload.data.latitude,

            lon: msg.payload.data.longitude

        };

    }

    //------------------------------------------
    // Display Single Bike
    //------------------------------------------

    else if (msg.payload.bike_id === bikeId) {

        updatePayload = {

            name: bikeId,

            lat: msg.payload.data.latitude,

            lon: msg.payload.data.longitude

        };
    }

}


// ===========================================
// Switched Bike
// ===========================================

if (previousBikeId !== "all" && previousBikeId !== bikeId && bikeId !== "all") {

    addDeletePayload(previousBikeId);
}


// ===========================================
// Save Current Bike
// ===========================================

context.set("previousBikeId", bikeId);


// ===========================================
// Build Output
// ===========================================

msg.payload = deletePayloads;

if (updatePayload) {
    msg.payload.push(updatePayload);
}

return msg;