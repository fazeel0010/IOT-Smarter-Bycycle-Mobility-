var bike = msg.payload || "all";
global.set("selectedBike", bike);
msg.payload = bike === "all" ? "All bicycles" : bike.replace("_", " ").toUpperCase();
return msg;