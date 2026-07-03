// ===========================================
// parse_battery_csv.js
//
// Reads battery.csv and filters records
// according to the selected bike.
//
// Input:
// [
//   {
//      timestamp,
//      bike,
//      battery,
//      health
//   }
// ]
//
// Output:
// [
//   {
//      timestamp,
//      bike,
//      battery,
//      health
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

            battery: parseFloat(record.battery),

            health: record.health

        });

    }

});

msg.payload = result;

return msg;