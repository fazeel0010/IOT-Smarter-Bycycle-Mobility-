// ===========================================
// hot_path_battery.js
//
// Processes battery sensor data.
//
// Features:
// - Current Battery
// - Average Battery (Last 10 Readings)
// - Battery Health
// - Low Battery Detection
// - Combined Battery Statistics
// ===========================================

var bikeId = global.get("selectedBike");

if (msg.payload.sensor_type === "battery") {

    // ===========================================
    // Individual Bike
    // ===========================================

    if (msg.payload.bike_id === bikeId && bikeId !== "all") {

        const battery = parseFloat(msg.payload.data.battery);
        const health = msg.payload.data.health;

        var averageBattery = calculateAverage(battery);

        var status = "Normal";

        if (battery <= 20) {
            status = "Low Battery";
        }

        msg.payload = {

            status: status,

            battery: battery,

            health: health,

            averageBattery: averageBattery

        };

        return msg;
    }

    // ===========================================
    // All Bikes
    // ===========================================

    else if (bikeId === "all") {

        let batteryBike1 = context.get("batteryBike1") || 0;
        let batteryBike2 = context.get("batteryBike2") || 0;
        let batteryBike3 = context.get("batteryBike3") || 0;

        if (msg.payload.bike_id === "bike_1") {

            batteryBike1 = parseFloat(msg.payload.data.battery);
            context.set("batteryBike1", batteryBike1);

        }

        if (msg.payload.bike_id === "bike_2") {

            batteryBike2 = parseFloat(msg.payload.data.battery);
            context.set("batteryBike2", batteryBike2);

        }

        if (msg.payload.bike_id === "bike_3") {

            batteryBike3 = parseFloat(msg.payload.data.battery);
            context.set("batteryBike3", batteryBike3);

        }

        var battery = (
            (batteryBike1 + batteryBike2 + batteryBike3) / 3
        ).toFixed(2);

        var averageBattery = calculateAverage(battery);

        var status = "Normal";

        if (battery <= 20) {
            status = "Low Battery";
        }

        msg.payload = {

            status: status,

            battery: battery,

            averageBattery: averageBattery,

            bike1: batteryBike1,

            bike2: batteryBike2,

            bike3: batteryBike3

        };

        return msg;
    }
}



// ===========================================
// Moving Average
// ===========================================

function calculateAverage(battery) {

    var values = context.get("batteryValues") || [];
    var sum = context.get("batterySum") || 0;

    var value = parseFloat(battery);

    if (!isNaN(value)) {

        values.push(value);

        sum += value;

        if (values.length > 10) {

            var removedValue = values.shift();

            sum -= removedValue;

        }

        var average = (
            sum / values.length
        ).toFixed(2);

        context.set("batteryValues", values);

        context.set("batterySum", sum);

        return average;
    }

    return 0;
}