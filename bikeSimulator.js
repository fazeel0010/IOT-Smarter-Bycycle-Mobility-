const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost");
const route = require("./coordinates");

let bike1Index = 0;
let bike2Index = 5;
let bike3Index = 10;

// ----------------------
// Helper Functions
// ----------------------

function getBatteryDrain(currentBattery) {
    const drain = (Math.random() * 0.4) + 0.1;
    return Math.max(5, parseFloat((currentBattery - drain).toFixed(1)));
}

let batteryBike1 = 100;
let batteryBike2 = 100;
let batteryBike3 = 100;

const bikes = [
    {
        bike: 1,
        sensors: [
            {
                bike_id: "bike_1",
                sensor_type: "position",
                sensor_id: "gps_001",
                data: () => {

                    const current = route[bike1Index];

                    bike1Index = (bike1Index + 1) % route.length;

                    return {
                        latitude: current.latitude,
                        longitude: current.longitude
                    };
                }
            },
            {
                bike_id: "bike_1",
                sensor_type: "speed",
                sensor_id: "speed_001",
                data: () => ({
                    speed: parseFloat((12 + Math.random() * 5).toFixed(1))
                })
            },
            {
                bike_id: "bike_1",
                sensor_type: "acceleration",
                sensor_id: "imu_001",
                data: () => ({
                    x: parseFloat(((Math.random() - 0.5) * 2).toFixed(2)),
                    y: parseFloat(((Math.random() - 0.5) * 2).toFixed(2)),
                    z: parseFloat(((Math.random() - 0.5) * 2).toFixed(2))
                })
            },
            {
                bike_id: "bike_1",
                sensor_type: "battery",
                sensor_id: "battery_001",
                data: () => {

                    batteryBike1 = getBatteryDrain(batteryBike1);

                    return {
                        battery: batteryBike1,
                        health: batteryBike1 > 20 ? "Good" : "Low"
                    };
                }
            },
            {
                bike_id: "bike_1",
                sensor_type: "parking",
                sensor_id: "parking_001",
                data: () => ({
                    status: Math.random() > 0.8 ? "Parked" : "Moving"
                })
            }
        ]
    },

    {
        bike: 2,
        sensors: [
            {
                bike_id: "bike_2",
                sensor_type: "position",
                sensor_id: "gps_001",
                data: () => {

                    const current = route[bike2Index];

                    bike2Index = (bike2Index + 2) % route.length;

                    return {
                        latitude: current.latitude,
                        longitude: current.longitude
                    };
                }
            },
            {
                bike_id: "bike_2",
                sensor_type: "speed",
                sensor_id: "speed_001",
                data: () => ({
                    speed: parseFloat((18 + Math.random() * 6).toFixed(1))
                })
            },
            {
                bike_id: "bike_2",
                sensor_type: "acceleration",
                sensor_id: "imu_001",
                data: () => ({
                    x: parseFloat(((Math.random() - 0.5) * 3).toFixed(2)),
                    y: parseFloat(((Math.random() - 0.5) * 3).toFixed(2)),
                    z: parseFloat(((Math.random() - 0.5) * 3).toFixed(2))
                })
            },
            {
                bike_id: "bike_2",
                sensor_type: "battery",
                sensor_id: "battery_001",
                data: () => {

                    batteryBike2 = getBatteryDrain(batteryBike2);

                    return {
                        battery: batteryBike2,
                        health: batteryBike2 > 20 ? "Good" : "Low"
                    };
                }
            },
            {
                bike_id: "bike_2",
                sensor_type: "parking",
                sensor_id: "parking_001",
                data: () => ({
                    status: Math.random() > 0.9 ? "Parked" : "Moving"
                })
            }
        ]
    },

    {
        bike: 3,
        sensors: [
            {
                bike_id: "bike_3",
                sensor_type: "position",
                sensor_id: "gps_001",
                data: () => {

                    const current = route[bike3Index];

                    bike3Index = (bike3Index + 3) % route.length;

                    return {
                        latitude: current.latitude,
                        longitude: current.longitude
                    };
                }
            },
            {
                bike_id: "bike_3",
                sensor_type: "speed",
                sensor_id: "speed_001",
                data: () => ({
                    speed: parseFloat((25 + Math.random() * 8).toFixed(1))
                })
            },
            {
                bike_id: "bike_3",
                sensor_type: "acceleration",
                sensor_id: "imu_001",
                data: () => ({
                    x: parseFloat(((Math.random() - 0.5) * 4).toFixed(2)),
                    y: parseFloat(((Math.random() - 0.5) * 4).toFixed(2)),
                    z: parseFloat(((Math.random() - 0.5) * 4).toFixed(2))
                })
            },
            {
                bike_id: "bike_3",
                sensor_type: "battery",
                sensor_id: "battery_001",
                data: () => {

                    batteryBike3 = getBatteryDrain(batteryBike3);

                    return {
                        battery: batteryBike3,
                        health: batteryBike3 > 20 ? "Good" : "Low"
                    };
                }
            },
            {
                bike_id: "bike_3",
                sensor_type: "parking",
                sensor_id: "parking_001",
                data: () => ({
                    status: Math.random() > 0.95 ? "Parked" : "Moving"
                })
            }
        ]
    }
];

// ----------------------
// MQTT Connection
// ----------------------

client.on("connect", () => {

    console.log("Connected to MQTT Broker");

    setInterval(() => {

        bikes.forEach(bikeSensors => {

            const sensorData = bikeSensors.sensors.map(sensor => ({

                ...sensor,

                data: sensor.data(),

                timestamp: new Date().toISOString(),

                timestampRegular: Math.floor(Date.now() / 1000),

                bike: bikeSensors.bike

            }));

            sensorData.forEach(data => {

                client.publish(
                    "bike/sensors",
                    JSON.stringify(data)
                );

            });

        });

    }, 5000);

});

client.on("error", err => {

    console.error(err);

    client.end();

});

client.on("close", () => {

    console.log("MQTT Connection Closed");

});