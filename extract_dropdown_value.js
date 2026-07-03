// ===========================================
// extract_dropdown_value.js
// Stores the selected bike globally so that
// all Hot Path and Cold Path functions can
// access the current selection.
// ===========================================

var bikeId = msg.payload;

// Save selected bike globally
global.set("selectedBike", bikeId);

// Pass the message forward
return msg;