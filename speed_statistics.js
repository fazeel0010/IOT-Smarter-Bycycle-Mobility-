// ===========================================
// speed_statistics.js
//
// Calculates statistics from historical
// speed data.
//
// Input:
// [
//   {
//      timestamp,
//      bike,
//      speed
//   }
// ]
//
// Output:
// {
//    averageSpeed,
//    maximumSpeed,
//    minimumSpeed,
//    standardDeviation,
//    totalSamples,
//    estimatedRideTime
// }
// ===========================================

var records = msg.payload;

if (!Array.isArray(records) || records.length === 0) {

    msg.payload = {

        averageSpeed: 0,
        maximumSpeed: 0,
        minimumSpeed: 0,
        standardDeviation: 0,
        totalSamples: 0,
        estimatedRideTime: "0 min"

    };

    return msg;

}

// -------------------------------------------
// Extract Speeds
// -------------------------------------------

var speeds = records.map(function (record) {

    return parseFloat(record.speed);

});

// -------------------------------------------
// Average
// -------------------------------------------

var sum = speeds.reduce(function (total, speed) {

    return total + speed;

}, 0);

var averageSpeed = sum / speeds.length;

// -------------------------------------------
// Maximum
// -------------------------------------------

var maximumSpeed = Math.max(...speeds);

// -------------------------------------------
// Minimum
// -------------------------------------------

var minimumSpeed = Math.min(...speeds);

// -------------------------------------------
// Standard Deviation
// -------------------------------------------

var variance = speeds.reduce(function (total, speed) {

    return total + Math.pow(speed - averageSpeed, 2);

}, 0);

variance /= speeds.length;

var standardDeviation = Math.sqrt(variance);

// -------------------------------------------
// Ride Time
//
// Simulator publishes every 5 seconds
// -------------------------------------------

var totalSeconds = records.length * 5;

var rideMinutes = Math.floor(totalSeconds / 60);

var rideSeconds = totalSeconds % 60;

// -------------------------------------------
// Dashboard Output
// -------------------------------------------

msg.payload = {

    averageSpeed: averageSpeed.toFixed(2),

    maximumSpeed: maximumSpeed.toFixed(2),

    minimumSpeed: minimumSpeed.toFixed(2),

    standardDeviation: standardDeviation.toFixed(2),

    totalSamples: records.length,

    estimatedRideTime:
        rideMinutes +
        " min " +
        rideSeconds +
        " sec"

};

return msg;