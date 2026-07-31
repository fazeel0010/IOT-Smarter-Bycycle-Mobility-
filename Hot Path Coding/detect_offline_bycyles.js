var states = flow.get("bikeStates") || {};
var selected = global.get("selectedBike") || "all";
var now = Date.now(),
    offline = [];

Object.keys(states).forEach(function (k) {
    if (now - Number(states[k].lastSeen || 0) > 15000) {
        offline.push(k);
    }
});

if (!offline.length) {
    return null;
}

if (selected === "all" || offline.indexOf(selected) >= 0) {
    msg.payload = "Connectivity alert: " + offline.join(", ") + " offline";
    return msg;
}

return null;