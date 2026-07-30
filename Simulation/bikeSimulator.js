const mqtt = require("mqtt");
const coordinates = require("./coordinates");

const MQTT_URL ="mqtt://localhost:1883";
const MQTT_TOPIC =  "bike/sensors";
const PUBLISH_INTERVAL_MS = 3000;

const client = mqtt.connect(MQTT_URL);

// creates 3 bikes 
const bikes = {
  bike_1: createBikeState(0, 100),
  bike_2: createBikeState(6, 82),
  bike_3: createBikeState(12, 65)
};

function createBikeState(routeIndex, battery) {
  return {
    routeIndex,
    battery,
    speed: randomBetween(8, 18),
    previousSpeed: 0,
    parkingTicks: 0,
    parked: false,
    locked: false,
    tripTicks: 0,
    online: true
  };
}

function randomBetween(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

// publish the data to MQTT broker
function publish(payload) {
  client.publish(MQTT_TOPIC, JSON.stringify(payload), { qos: 0 }, (error) => {
    if (error) {
      console.error("Publish error:", error.message);
    }
  });
}

function baseMessage(bikeId, sensorType, data) {
  return {
    timestamp: new Date().toISOString(),
    timestampRegular: Date.now(),
    bike_id: bikeId,
    sensor_type: sensorType,
    data
  };
}

// Simulate bike movement and sensor data on each interval
function simulateBike(bikeId, state) {
  // const currentPoint = coordinates[state.routeIndex];

  // Periodically park a bicycle for demonstration.
  if (!state.parked && Math.random() < 0.03) {
    state.parked = true;
    state.locked = Math.random() > 0.2;
    state.parkingTicks = 0;
  }

  if (state.parked) {
    state.speed = 0;
    state.parkingTicks += 1;

    // Resume after roughly 20–40 seconds.
    if (state.parkingTicks > 10 && Math.random() < 0.15) {
      state.parked = false;
      state.locked = false;
      state.parkingTicks = 0;
      state.speed = randomBetween(7, 14);
    }
  } else {
    state.previousSpeed = state.speed;
    state.speed = Math.max(0, Math.min(42, state.speed + randomBetween(-3.2, 3.5)));
    state.routeIndex = (state.routeIndex + 1) % coordinates.length;
    state.tripTicks += 1;
  }

  // Battery drain.
  state.battery = Math.max(0, Number((state.battery - randomBetween(0.03, 0.12)).toFixed(2)));

  const point = coordinates[state.routeIndex];
  const acceleration = Number(((state.speed - state.previousSpeed) / (PUBLISH_INTERVAL_MS / 1000)).toFixed(2));

  // Demo-friendly random events.
  const harshEvent = Math.random() < 0.05;
  const tiltEvent = Math.random() < 0.025;
  const vibrationEvent = Math.random() < 0.04;
  const gnssOptions = ["Excellent", "Good", "Fair"];

  const x = harshEvent
    ? (Math.random() > 0.5 ? randomBetween(2.6, 4.2) : randomBetween(-4.2, -2.6))
    : acceleration;

  publish(baseMessage(bikeId, "position", {
    latitude: point.latitude,
    longitude: point.longitude,
    altitude: point.altitude,
    gnss_quality: gnssOptions[Math.floor(Math.random() * gnssOptions.length)],
    satellites: Math.floor(randomBetween(7, 14)),
    hdop: randomBetween(0.6, 1.8),
    tilt_angle: tiltEvent ? randomBetween(65, 88) : randomBetween(0, 15)
  }));

  publish(baseMessage(bikeId, "speed", {
    speed: Number(state.speed.toFixed(2))
  }));

  publish(baseMessage(bikeId, "battery", {
    battery: Number(state.battery.toFixed(1))
  }));

  publish(baseMessage(bikeId, "acceleration", {
    x,
    y: randomBetween(-0.8, 0.8),
    z: randomBetween(0.7, 1.3),
    acceleration,
    vibration: vibrationEvent ? randomBetween(8.5, 12) : randomBetween(0.5, 4.5),
    tilt_angle: tiltEvent ? randomBetween(65, 88) : randomBetween(0, 15)
  }));

  publish(baseMessage(bikeId, "parking", {
    status: state.parked ? "Parked" : "Moving",
    locked: state.locked
  }));

  publish(baseMessage(bikeId, "device_status", {
    connectivity: state.online ? "Online" : "Offline",
    device_health: state.battery <= 10 ? "Critical" : state.battery <= 20 ? "Warning" : "Healthy",
    sensor_availability: {
      position: true,
      speed: true,
      battery: true,
      acceleration: true,
      parking: true
    }
  }));

  console.log(
    `${bikeId} | speed=${state.speed.toFixed(1)} km/h | battery=${state.battery.toFixed(1)}% | ${state.parked ? "Parked" : "Moving"}`
  );
}

client.on("connect", () => {
  console.log(`Connected to ${MQTT_URL}`);
  console.log(`Publishing bicycle data to topic: ${MQTT_TOPIC}`);
  console.log(`Interval: ${PUBLISH_INTERVAL_MS} ms`);

  setInterval(() => {
    Object.entries(bikes).forEach(([bikeId, state]) => {
      simulateBike(bikeId, state);
    });
  }, PUBLISH_INTERVAL_MS);
});

client.on("error", (error) => {
  console.error("MQTT connection error:", error.message);
});

process.on("SIGINT", () => {
  console.log("\nStopping bicycle simulator...");
  client.end(true, () => process.exit(0));
});