msg.field = "speed";
msg.title = "Speed";

var a = msg.payload || [];
var field = msg.field || "speed";
var title = msg.title || field;

var pts = a
    .map(x => ({
        x: new Date(x.timestamp),
        y: Number(x[field])
    }))
    .filter(p => Number.isFinite(p.y));

msg.payload = [
    {
        series: [title],
        data: [pts],
        labels: [""]
    }
];

return msg;