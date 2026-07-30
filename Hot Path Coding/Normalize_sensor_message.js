
var p = msg.payload;
if (typeof p === "string") {
    try { p = JSON.parse(p); } catch(e) { node.warn("Invalid JSON"); return null; }
}
if (!p || typeof p !== "object") return null;

p.bike_id = p.bike_id || p.sensor_team || p.sensor_id;
if (!p.bike_id) return null;
p.sensor_type = p.sensor_type || p.type;
p.timestamp = p.timestamp || new Date().toISOString();
p.timestampRegular = Number(p.timestampRegular || Date.now());
p.data = p.data || {};
msg.payload = p;
return msg;
