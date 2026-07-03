// ===========================================
// hot_path_speed.js
// Processes real-time bicycle speed data.
// Calculates:
// - Current Speed
// - Average Speed (Last 10 Values)
// - Ride Status
// - Combined Values for All Bikes
// ===========================================

var bikeId = global.get("selectedBike");

if (msg.payload.sensor_type === "speed") {

    // -----------------------------
    // Individual Bike Processing
    // -----------------------------
    if (msg.payload.bike_id === bikeId && bikeId !== "all") {

        const speed = parseFloat(msg.payload.data.speed);

        var averageSpeed = calculateAverage(speed);

        var rideStatus = "";

        if (speed <= 5) {

            rideStatus = "Stopped";

        } else if (speed > 5 && speed <= 15) {

            rideStatus = "Slow Ride";

        } else if (speed > 15 && speed <= 25) {

            rideStatus = "Normal Ride";

        } else {

            rideStatus = "Fast Ride";

        }

        msg.payload = {

            status: rideStatus,

            speed: speed,

            averageSpeed: averageSpeed

        };

        // Store for other flows if needed
        flow.set("bikeSpeedData", msg.payload);

        return msg;
    }

    // -----------------------------
    // Combined Bike Processing
    // -----------------------------
    else if (bikeId === "all") {

        let speedBike1 = context.get("speedBike1") || 0;
        let speedBike2 = context.get("speedBike2") || 0;
        let speedBike3 = context.get("speedBike3") || 0;

        if (msg.payload.bike_id === "bike_1") {

            speedBike1 = parseFloat(msg.payload.data.speed);
            context.set("speedBike1", speedBike1);

        }

        if (msg.payload.bike_id === "bike_2") {

            speedBike2 = parseFloat(msg.payload.data.speed);
            context.set("speedBike2", speedBike2);

        }

        if (msg.payload.bike_id === "bike_3") {

            speedBike3 = parseFloat(msg.payload.data.speed);
            context.set("speedBike3", speedBike3);

        }

        var speed = ((speedBike1 + speedBike2 + speedBike3) / 3).toFixed(2);

        var averageSpeed = calculateAverage(speed);

        msg.payload = {

            status: "Combined Bikes",

            speed: speed,

            averageSpeed: averageSpeed,

            bike1: speedBike1,

            bike2: speedBike2,

            bike3: speedBike3

        };

        return msg;
    }

}


// ===========================================
// Moving Average (Last 10 Readings)
// ===========================================

function calculateAverage(speed) {

    var values = context.get("values") || [];
    var sum = context.get("sum") || 0;

    var value = parseFloat(speed);

    if (!isNaN(value)) {

        values.push(value);

        sum += value;

        if (values.length > 10) {

            var removedValue = values.shift();

            sum -= removedValue;
        }

        var averageSpeed = (sum / values.length).toFixed(2);

        context.set("values", values);

        context.set("sum", sum);

        return averageSpeed;
    }

    return 0;
}