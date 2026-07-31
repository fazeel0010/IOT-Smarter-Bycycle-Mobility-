var a = msg.payload || [];

if (!Array.isArray(a)) {
    msg.payload = {
        average: "N/A",
        maximum: "N/A",
        minimum: "N/A",
        samples: 0,
        tripDuration: "N/A",
        error: "msg.payload is not an array"
    };

    return msg;
}

var values = [];

for (var i = 0; i < a.length; i++) {
    var speed = Number(a[i].speed);

    if (isFinite(speed)) {
        values.push(speed);
    }
}

if (values.length === 0) {
    msg.payload = {
        average: "N/A",
        maximum: "N/A",
        minimum: "N/A",
        samples: 0,
        tripDuration: "N/A"
    };

    return msg;
}

var total = 0;

for (var j = 0; j < values.length; j++) {
    total += values[j];
}

var average = total / values.length;
var maximum = Math.max.apply(null, values);
var minimum = Math.min.apply(null, values);

var duration = 0;

if (a.length > 1) {
    var firstTime = new Date(a[0].timestamp).getTime();
    var lastTime = new Date(a[a.length - 1].timestamp).getTime();

    if (!isNaN(firstTime) && !isNaN(lastTime)) {
        duration = (lastTime - firstTime) / 60000;
    }
}

msg.payload = {
    average: average.toFixed(2),
    maximum: maximum.toFixed(2),
    minimum: minimum.toFixed(2),
    samples: values.length,
    tripDuration: duration.toFixed(1)
};

return msg;