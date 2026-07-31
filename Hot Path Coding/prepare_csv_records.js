var p = msg.payload,
    b = p.bike_id,
    t = p.timestamp,
    d = p.data || {};

var base = "C:/Users/timkn/Downloads/IOT Course/bicycle_simulator_complete/historical_data/";

function out(file, header, row) {
    return {
        filename: base + file,
        payload: header + "\n" + row
    };
}

switch (p.sensor_type) {

    case "speed":
        return [
            out(
                "speed_data.csv",
                "timestamp,bike,speed",
                `${t},${b},${Number(d.speed || 0)}`
            ),
            null,
            null,
            null,
            null
        ];

    case "battery":
        return [
            null,
            out(
                "battery_data.csv",
                "timestamp,bike,battery",
                `${t},${b},${Number(d.battery !== undefined ? d.battery : d.level || 0)}`
            ),
            null,
            null,
            null
        ];

    case "position":
        return [
            null,
            null,
            out(
                "gps_data.csv",
                "timestamp,bike,latitude,longitude,altitude,gnss_quality,satellites,hdop",
                `${t},${b},${d.latitude},${d.longitude},${Number(d.altitude || 0)},${d.gnss_quality || d.gnssQuality || "Unknown"},${Number(d.satellites || 0)},${d.hdop !== undefined ? d.hdop : ""}`
            ),
            null,
            null
        ];

    case "acceleration":
        return [
            null,
            null,
            null,
            out(
                "acceleration_data.csv",
                "timestamp,bike,x,y,z,vibration,tilt_angle",
                `${t},${b},${Number(d.x || 0)},${Number(d.y || 0)},${Number(d.z || 0)},${Number(d.vibration || 0)},${Number(d.tilt_angle || 0)}`
            ),
            null
        ];

    case "parking":
        return [
            null,
            null,
            null,
            null,
            out(
                "parking_data.csv",
                "timestamp,bike,status,locked",
                `${t},${b},${d.status || d.parking_status || "Moving"},${Boolean(d.locked)}`
            )
        ];

    default:
        return null;
}