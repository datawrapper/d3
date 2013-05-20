
import "transform";
import "object";
import "array";
import "number";
import "string";

d3.interpolate = d3_interpolate;

function d3_interpolate(a, b) {
  var i = d3.interpolators.length, f;
  while (--i >= 0 && !(f = d3.interpolators[i](a, b)));
  return f;
}

function d3_interpolateByName(name) {
  return name == "transform"
      ? d3_interpolateTransform
      : d3_interpolate;
}

d3.interpolators = [
  function(a, b) {
    var t = typeof b;
    return (t === "string" ? d3_interpolateString
        : t === "object" ? (Array.isArray(b) ? d3_interpolateArray : d3_interpolateObject)
        : d3_interpolateNumber)(a, b);
  }
];
