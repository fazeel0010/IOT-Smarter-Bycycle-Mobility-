// ===========================================
// hot_path_acceleration.js
//
// Calculates bicycle acceleration from
// speed changes over time.
//
// Formula:
// Acceleration = ΔSpeed / ΔTime
//
// Also classifies:
// - Normal
// - Harsh Acceleration
// - Harsh Braking
// ===========================================

var currentTimestamp = msg.payload.timestampRegular;
var bikeId = global.get("selectedBike");

// Previous speed values
var previousSpeedBike1 = context.get("previousSpeedBike1") || null;
var previousSpeedBike2 = context.get("previousSpeedBike2") || null;
var previousSpeedBike3 = context.get("previousSpeedBike3") || null;

// Previous timestamps
var previousTimestampBike1 = context.get("previousTimestampBike1") || null;
var previousTimestampBike2 = context.get("previousTimestampBike2") || null;
var previousTimestampBike3 = context.get("previousTimestampBike3") || null;

// Current acceleration values
var accelerationBike1 = context.get("accelerationBike1") || 0;
var accelerationBike2 = context.get("accelerationBike2") || 0;
var accelerationBike3 = context.get("accelerationBike3") || 0;

if (msg.payload.sensor_type === "speed") {

    processBike(
        "bike_1",
        previousSpeedBike1,
        previousTimestampBike1,
        accelerationBike1
    );

    processBike(
        "bike_2",
        previousSpeedBike2,
        previousTimestampBike2,
        accelerationBike2
    );

    processBike(
        "bike_3",
        previousSpeedBike3,
        previousTimestampBike3,
        accelerationBike3
    );

    if (bikeId === "bike_1") {

        msg.payload = createOutput(
            context.get("accelerationBike1")
        );

    }
    else if (bikeId === "bike_2") {

        msg.payload = createOutput(
            context.get("accelerationBike2")
        );

    }
    else if (bikeId === "bike_3") {

        msg.payload = createOutput(
            context.get("accelerationBike3")
        );

    }
    else {

        var averageAcceleration =
            (
                context.get("accelerationBike1") +
                context.get("accelerationBike2") +
                context.get("accelerationBike3")
            ) / 3;

        msg.payload = createOutput(
            averageAcceleration
        );

    }

    return msg;
}


// ===========================================
// Bike Processing
// ===========================================

function processBike(
    bikeName,
    previousSpeed,
    previousTimestamp,
    previousAcceleration
) {

    if (msg.payload.bike_id !== bikeName)
        return;

    var currentSpeed = parseFloat(
        msg.payload.data.speed
    );

    if (
        previousSpeed !== null &&
        previousTimestamp !== null
    ) {

        var deltaSpeed =
            currentSpeed - previousSpeed;

        var deltaTime =
            currentTimestamp - previousTimestamp;

        if (deltaTime !== 0) {

            var acceleration =
                deltaSpeed / deltaTime;

            context.set(
                "acceleration" + capitalize(bikeName),
                acceleration
            );

        }

    }

    context.set(
        "previousSpeed" + capitalize(bikeName),
        currentSpeed
    );

    context.set(
        "previousTimestamp" + capitalize(bikeName),
        currentTimestamp
    );

}


// ===========================================
// Output Object
// ===========================================

function createOutput(acceleration) {

    acceleration = parseFloat(
        acceleration.toFixed(2)
    );

    var status = "Normal";

    if (acceleration >= 2) {

        status = "Harsh Acceleration";

    }
    else if (acceleration <= -2) {

        status = "Harsh Braking";

    }

    return {

        acceleration: acceleration,

        status: status

    };

}


// ===========================================
// Capitalize
// bike_1 -> Bike1
// ===========================================

function capitalize(text) {

    return text
        .replace("_", "")
        .replace(/^./, function (c) {
            return c.toUpperCase();
        });

}