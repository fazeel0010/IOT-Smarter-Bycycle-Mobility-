var text = String(msg.payload || "").trim();

if (!text) {
    msg.payload = [];
    return msg;
}

var lines = text.split(/\r?\n/);

var cols = [
    "timestamp",
    "bike",
    "battery"
];

var nums = [
    "battery"
];

var selected = global.get("selectedBike") || "all";
var out = [];

for (var i = 0; i < lines.length; i++) {

    var v = lines[i].split(",");

    if (v[0] === "timestamp" || v.length < cols.length) {
        continue;
    }

    var o = {};

    cols.forEach(function (c, j) {
        o[c] = nums.indexOf(c) >= 0 ? Number(v[j]) : v[j];
    });

    if (selected === "all" || o.bike === selected) {
        out.push(o);
    }
}

msg.payload = out;

return msg;