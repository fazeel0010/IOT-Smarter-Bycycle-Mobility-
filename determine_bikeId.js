// ===========================================
// determine_bikeId.js
// Displays the currently selected bike
// on the Node-RED dashboard.
// ===========================================

var bikeId = global.get("selectedBike");

if (bikeId === "bike_1") {

    msg.payload = "Bike 1";

}
else if (bikeId === "bike_2") {

    msg.payload = "Bike 2";

}
else if (bikeId === "bike_3") {

    msg.payload = "Bike 3";

}
else if (bikeId === "all") {

    msg.payload = "All Bikes";

}
else {

    msg.payload = "No Bike Selected";

}

return msg;