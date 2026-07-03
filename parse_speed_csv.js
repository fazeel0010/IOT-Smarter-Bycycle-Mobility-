// ===========================================
// parse_speed_csv.js
//
// Reads parsed speed.csv data and filters
// it according to the selected bike.
//
// Input:
// msg.payload = [
//   {
//      timestamp: "...",
//      bike: "bike_1",
//      speed: "18.4"
//   },
//   ...
// ]
//
// Output:
// [
//   {
//      timestamp:"...",
//      bike:"bike_1",
//      speed:18.4
//   }
// ]
// ===========================================

var selectedBike = global.get("selectedBike") || "all";

var records = msg.payload;

if (!Array.isArray(records)) {
    return null;
}

var result = [];

records.forEach(function(record){

    if (
        selectedBike === "all" ||
        record.bike === selectedBike
    ) {

        result.push({

            timestamp: record.timestamp,

            bike: record.bike,

            speed: parseFloat(record.speed)

        });

    }

});

msg.payload = result;

return msg;