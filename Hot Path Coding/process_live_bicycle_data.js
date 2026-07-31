var p = msg.payload;
var bike = p.bike_id;
var selected = global.get("selectedBike") || "all";
var states = flow.get("bikeStates") || {};

var s = states[bike] || {
    speed: 0,
    battery: 100,
    latitude: null,
    longitude: null,
    altitude: 0,
    acceleration: 0,
    parkingStatus: "Moving",
    locked: false,
    tripCount: 0,
    totalDistanceKm: 0,
    lastSeen: 0,
    lastLat: null,
    lastLon: null,
    parkingSince: null,
    gnssQuality: "Unknown",
    satellites: 0,
    hdop: null,
    deviceHealth: "Healthy",
    sensors: {
        position: false,
        speed: false,
        battery: false,
        acceleration: false,
        parking: false
    }
};

function rad(v) {
    return v * Math.PI / 180;
}

function hav(lat1, lon1, lat2, lon2) {
    var R = 6371000;
    var dLat = rad(lat2 - lat1);
    var dLon = rad(lon2 - lon1);

    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(lat1)) *
            Math.cos(rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function inZone(lat, lon, z) {
    return hav(lat, lon, z.lat, z.lon) <= z.radius;
}

var parkingZones = [
    {
        name: "Brignole Station",
        lat: 44.4067,
        lon: 8.9473,
        radius: 180
    },
    {
        name: "Piazza De Ferrari",
        lat: 44.4072,
        lon: 8.9339,
        radius: 180
    },
    {
        name: "Porto Antico",
        lat: 44.4103,
        lon: 8.9266,
        radius: 220
    }
];

var restrictedZones = [
    {
        name: "Restricted pedestrian zone",
        lat: 44.4084,
        lon: 8.9322,
        radius: 90
    }
];

s.lastSeen = Date.now();

var alerts = [];
var wasMoving = s.speed > 2;

if (p.sensor_type === "position") {
    var lat = Number(p.data.latitude);
    var lon = Number(p.data.longitude);

    if (!isNaN(lat) && !isNaN(lon)) {
        if (s.lastLat !== null && s.lastLon !== null) {
            var step = hav(s.lastLat, s.lastLon, lat, lon);

            if (step < 1000) {
                s.totalDistanceKm += step / 1000;
            }

            if (s.locked && step > 20) {
                alerts.push("Possible theft or unauthorized movement: " + bike);
            }
        }

        s.latitude = lat;
        s.longitude = lon;
        s.lastLat = lat;
        s.lastLon = lon;
    }

    s.altitude = Number(p.data.altitude || s.altitude || 0);
    s.gnssQuality =
        p.data.gnss_quality ||
        p.data.gnssQuality ||
        s.gnssQuality;

    s.satellites = Number(
        p.data.satellites || s.satellites || 0
    );

    s.hdop =
        p.data.hdop !== undefined
            ? Number(p.data.hdop)
            : s.hdop;

    s.sensors.position = true;

    if (Number(p.data.tilt_angle || 0) > 60) {
        alerts.push(
            "Possible fall or incorrect parking: " + bike
        );
    }

    restrictedZones.forEach(function (z) {
        if (inZone(lat, lon, z)) {
            alerts.push(bike + " entered " + z.name);
        }
    });
}

if (p.sensor_type === "speed") {
    s.speed = Number(p.data.speed || 0);
    s.sensors.speed = true;

    if (!wasMoving && s.speed > 2) {
        s.tripCount += 1;
    }

    if (s.speed > 35) {
        alerts.push("Dangerous speed detected: " + bike);
    }
}

if (p.sensor_type === "battery") {
    s.battery = Number(
        p.data.battery !== undefined
            ? p.data.battery
            : p.data.level
    );

    s.sensors.battery = true;

    if (s.battery <= 20) {
        alerts.push(
            "Low battery: " +
                bike +
                " (" +
                s.battery +
                "%)"
        );
    }
}

if (p.sensor_type === "acceleration") {
    var a = p.data.acceleration;

    if (a === undefined && p.data.x !== undefined) {
        var x = Number(p.data.x || 0);
        var y = Number(p.data.y || 0);
        var z = Number(p.data.z || 0);

        a = Math.sqrt(x * x + y * y + z * z);
    }

    s.acceleration = Number(a || 0);
    s.sensors.acceleration = true;

    if (Number(p.data.x || s.acceleration) >= 2.5) {
        alerts.push("Harsh acceleration: " + bike);
    }

    if (Number(p.data.x || 0) <= -2.5) {
        alerts.push("Harsh braking: " + bike);
    }

    if (Number(p.data.vibration || 0) > 8) {
        alerts.push("Abnormal vibration: " + bike);
    }
}

if (p.sensor_type === "parking") {
    s.parkingStatus =
        p.data.status ||
        p.data.parking_status ||
        "Moving";

    s.locked = Boolean(p.data.locked);
    s.sensors.parking = true;

    if (
        String(s.parkingStatus).toLowerCase() === "parked"
    ) {
        if (!s.parkingSince) {
            s.parkingSince = Date.now();
        }

        if (s.latitude !== null) {
            var authorized = parkingZones.some(function (z) {
                return inZone(
                    s.latitude,
                    s.longitude,
                    z
                );
            });

            if (!authorized) {
                alerts.push(
                    "Parking violation outside authorized zone: " +
                        bike
                );
            }
        }
    } else {
        s.parkingSince = null;
    }
}

if (p.sensor_type === "device_status") {
    s.deviceHealth =
        p.data.device_health ||
        p.data.health ||
        s.deviceHealth;

    if (p.data.sensor_availability) {
        s.sensors = Object.assign(
            s.sensors,
            p.data.sensor_availability
        );
    }

    if (s.deviceHealth !== "Healthy") {
        alerts.push(
            "Device health warning: " + bike
        );
    }
}

states[bike] = s;
flow.set("bikeStates", states);

var visible =
    selected === "all" || selected === bike;

var speedOut = null;
var batteryOut = null;
var mapOut = null;
var statusOut = null;
var alertOut = null;
var distanceOut = null;
var accelOut = null;
var parkingOut = null;

if (selected === "all") {
    var keys = Object.keys(states);
    var count = keys.length || 1;

    var sp = 0;
    var bt = 0;
    var dist = 0;
    var acc = 0;

    keys.forEach(function (k) {
        sp += Number(states[k].speed || 0);
        bt += Number(states[k].battery || 0);
        dist += Number(
            states[k].totalDistanceKm || 0
        );
        acc += Number(
            states[k].acceleration || 0
        );
    });

    speedOut = {
        payload: (sp / count).toFixed(2)
    };

    batteryOut = {
        payload: (bt / count).toFixed(1)
    };

    distanceOut = {
        payload: dist.toFixed(2)
    };

    accelOut = {
        payload: (acc / count).toFixed(2)
    };

} else if (visible) {

    speedOut = {
        payload: s.speed
    };

    batteryOut = {
        payload: s.battery
    };

    distanceOut = {
        payload: s.totalDistanceKm.toFixed(2)
    };

    accelOut = {
        payload: s.acceleration.toFixed(2)
    };
}

if (
    visible &&
    p.sensor_type === "position" &&
    s.latitude !== null
) {
    mapOut = {
        payload: {
            name: bike,
            lat: s.latitude,
            lon: s.longitude,
            icon: "bicycle",
            layer: "Bicycles",
            popup:
                "<b>" +
                bike +
                "</b><br>Speed: " +
                s.speed +
                " km/h<br>Battery: " +
                s.battery +
                "%<br>Altitude: " +
                s.altitude +
                " m"
        }
    };
}

if (visible) {
    var parkingDuration = s.parkingSince
        ? Math.floor(
              (Date.now() - s.parkingSince) / 1000
          )
        : 0;

    statusOut = {
        payload: {
            bike:
                selected === "all"
                    ? "Fleet"
                    : bike,
            connectivity: "Online",
            lastSeen: new Date(
                s.lastSeen
            ).toLocaleString(),
            gnssQuality: s.gnssQuality,
            satellites: s.satellites,
            hdop: s.hdop,
            altitude: s.altitude,
            deviceHealth: s.deviceHealth,
            sensors: s.sensors,
            trips: s.tripCount,
            parkingDuration: parkingDuration
        }
    };

    parkingOut = {
        payload: s.parkingStatus
    };
}

if (alerts.length) {
    alertOut = {
        payload: alerts.join(" | ")
    };
}

return [
    speedOut,
    batteryOut,
    mapOut,
    statusOut,
    alertOut,
    distanceOut,
    accelOut,
    parkingOut
];