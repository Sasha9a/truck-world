mp.Vector3.Distance = function (a, b) {
	return Math.abs(
		Math.sqrt(Math.pow((b.x - a.x),2) + Math.pow((b.y - a.y),2) + Math.pow((b.z - a.z),2))
	).toFixed(1);
}