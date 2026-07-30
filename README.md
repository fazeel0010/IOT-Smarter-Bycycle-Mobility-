# Smarter Bicycle Mobility Simulator

## Requirements
- Node.js
- Mosquitto MQTT broker running on `localhost:1883`
- The supplied Node-RED flow imported and deployed

## Install

```bash
npm install
```

## Run

```bash
npm start
```

The simulator publishes to:

```text
bike/sensors
```

It simulates three bicycles and generates:

- GNSS position
- Altitude
- GNSS quality
- Satellite count and HDOP
- Speed
- Battery level
- Acceleration
- Vibration
- Tilt/fall events
- Parking and lock status
- Device health
- Sensor availability

## Optional environment variables

```bash
MQTT_URL=mqtt://localhost:1883
MQTT_TOPIC=bike/sensors
PUBLISH_INTERVAL_MS=2000
```