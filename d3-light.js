[].map||(Array.prototype.map=function(a,t){for(var c=this,b=c.length,d=[],e=0;e<b;)e in c&&(d[e]=a.call(t,c[e],e++,c));d.lengh=b;return d});
[].filter||(Array.prototype.filter=function(a,b,c,d,e){c=this;d=[];for(e in c)~~e+''==e&&e>=0&&a.call(b,c[e],+e,c)&&d.push(c[e]);return d})
var d3 = (function(){
  var d3 = {version: "3.1.7"}; // semver
d3.range = function(start, stop, step) {
  if (arguments.length < 3) {
    step = 1;
    if (arguments.length < 2) {
      stop = start;
      start = 0;
    }
  }
  if ((stop - start) / step === Infinity) throw new Error("infinite range");
  var range = [],
       k = d3_range_integerScale(Math.abs(step)),
       i = -1,
       j;
  start *= k, stop *= k, step *= k;
  if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k);
  else while ((j = start + step * ++i) < stop) range.push(j / k);
  return range;
};
function d3_range_integerScale(x) {
  var k = 1;
  while (x * k % 1) k *= 10;
  return k;
}
// Copies a variable number of methods from source to target.
d3.rebind = function(target, source) {
  var i = 1, n = arguments.length, method;
  while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
  return target;
};
// Method is assumed to be a standard D3 getter-setter:
// If passed with no arguments, gets the value.
// If passed with arguments, sets the value and returns the target.
function d3_rebind(target, source, method) {
  return function() {
    var value = method.apply(source, arguments);
    return value === source ? target : value;
  };
}
var d3_document = document,
    d3_window = window;
var d3_nsPrefix = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: "http://www.w3.org/1999/xhtml",
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
d3.ns = {
  prefix: d3_nsPrefix,
  qualify: function(name) {
    var i = name.indexOf(":"),
        prefix = name;
    if (i >= 0) {
      prefix = name.substring(0, i);
      name = name.substring(i + 1);
    }
    return d3_nsPrefix.hasOwnProperty(prefix)
        ? {space: d3_nsPrefix[prefix], local: name}
        : name;
  }
};
d3.transform = function(string) {
  var g = d3_document.createElementNS(d3.ns.prefix.svg, "g");
  return (d3.transform = function(string) {
    if (string != null) {
      g.setAttribute("transform", string);
      var t = g.transform.baseVal.consolidate();
    }
    return new d3_transform(t ? t.matrix : d3_transformIdentity);
  })(string);
};
// Compute x-scale and normalize the first row.
// Compute shear and make second row orthogonal to first.
// Compute y-scale and normalize the second row.
// Finally, compute the rotation.
function d3_transform(m) {
  var r0 = [m.a, m.b],
      r1 = [m.c, m.d],
      kx = d3_transformNormalize(r0),
      kz = d3_transformDot(r0, r1),
      ky = d3_transformNormalize(d3_transformCombine(r1, r0, -kz)) || 0;
  if (r0[0] * r1[1] < r1[0] * r0[1]) {
    r0[0] *= -1;
    r0[1] *= -1;
    kx *= -1;
    kz *= -1;
  }
  this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d3_degrees;
  this.translate = [m.e, m.f];
  this.scale = [kx, ky];
  this.skew = ky ? Math.atan2(kz, ky) * d3_degrees : 0;
};
d3_transform.prototype.toString = function() {
  return "translate(" + this.translate
      + ")rotate(" + this.rotate
      + ")skewX(" + this.skew
      + ")scale(" + this.scale
      + ")";
};
function d3_transformDot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
function d3_transformNormalize(a) {
  var k = Math.sqrt(d3_transformDot(a, a));
  if (k) {
    a[0] /= k;
    a[1] /= k;
  }
  return k;
}
function d3_transformCombine(a, b, k) {
  a[0] += k * b[0];
  a[1] += k * b[1];
  return a;
}
var d3_transformIdentity = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
// import "../color/color";
// import "../color/hcl";
// import "../color/hsl";
// import "../color/lab";
// import "../color/rgb";
d3.interpolate = function(a, b) {
  var i = d3.interpolators.length, f;
  while (--i >= 0 && !(f = d3.interpolators[i](a, b)));
  return f;
};
d3.interpolateNumber = function(a, b) {
  b -= a;
  return function(t) { return a + b * t; };
};
d3.interpolateRound = function(a, b) {
  b -= a;
  return function(t) { return Math.round(a + b * t); };
};
d3.interpolateString = function(a, b) {
  var m, // current match
      i, // current index
      j, // current index (for coalescing)
      s0 = 0, // start index of current string prefix
      s1 = 0, // end index of current string prefix
      s = [], // string constants and placeholders
      q = [], // number interpolators
      n, // q.length
      o;
  // Reset our regular expression!
  d3_interpolate_number.lastIndex = 0;
  // Find all numbers in b.
  for (i = 0; m = d3_interpolate_number.exec(b); ++i) {
    if (m.index) s.push(b.substring(s0, s1 = m.index));
    q.push({i: s.length, x: m[0]});
    s.push(null);
    s0 = d3_interpolate_number.lastIndex;
  }
  if (s0 < b.length) s.push(b.substring(s0));
  // Find all numbers in a.
  for (i = 0, n = q.length; (m = d3_interpolate_number.exec(a)) && i < n; ++i) {
    o = q[i];
    if (o.x == m[0]) { // The numbers match, so coalesce.
      if (o.i) {
        if (s[o.i + 1] == null) { // This match is followed by another number.
          s[o.i - 1] += o.x;
          s.splice(o.i, 1);
          for (j = i + 1; j < n; ++j) q[j].i--;
        } else { // This match is followed by a string, so coalesce twice.
          s[o.i - 1] += o.x + s[o.i + 1];
          s.splice(o.i, 2);
          for (j = i + 1; j < n; ++j) q[j].i -= 2;
        }
      } else {
          if (s[o.i + 1] == null) { // This match is followed by another number.
          s[o.i] = o.x;
        } else { // This match is followed by a string, so coalesce twice.
          s[o.i] = o.x + s[o.i + 1];
          s.splice(o.i + 1, 1);
          for (j = i + 1; j < n; ++j) q[j].i--;
        }
      }
      q.splice(i, 1);
      n--;
      i--;
    } else {
      o.x = d3.interpolateNumber(parseFloat(m[0]), parseFloat(o.x));
    }
  }
  // Remove any numbers in b not found in a.
  while (i < n) {
    o = q.pop();
    if (s[o.i + 1] == null) { // This match is followed by another number.
      s[o.i] = o.x;
    } else { // This match is followed by a string, so coalesce twice.
      s[o.i] = o.x + s[o.i + 1];
      s.splice(o.i + 1, 1);
    }
    n--;
  }
  // Special optimization for only a single match.
  if (s.length === 1) {
    return s[0] == null ? q[0].x : function() { return b; };
  }
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return function(t) {
    for (i = 0; i < n; ++i) s[(o = q[i]).i] = o.x(t);
    return s.join("");
  };
};
d3.interpolateTransform = function(a, b) {
  var s = [], // string constants and placeholders
      q = [], // number interpolators
      n,
      A = d3.transform(a),
      B = d3.transform(b),
      ta = A.translate,
      tb = B.translate,
      ra = A.rotate,
      rb = B.rotate,
      wa = A.skew,
      wb = B.skew,
      ka = A.scale,
      kb = B.scale;
  if (ta[0] != tb[0] || ta[1] != tb[1]) {
    s.push("translate(", null, ",", null, ")");
    q.push({i: 1, x: d3.interpolateNumber(ta[0], tb[0])}, {i: 3, x: d3.interpolateNumber(ta[1], tb[1])});
  } else if (tb[0] || tb[1]) {
    s.push("translate(" + tb + ")");
  } else {
    s.push("");
  }
  if (ra != rb) {
    if (ra - rb > 180) rb += 360; else if (rb - ra > 180) ra += 360; // shortest path
    q.push({i: s.push(s.pop() + "rotate(", null, ")") - 2, x: d3.interpolateNumber(ra, rb)});
  } else if (rb) {
    s.push(s.pop() + "rotate(" + rb + ")");
  }
  if (wa != wb) {
    q.push({i: s.push(s.pop() + "skewX(", null, ")") - 2, x: d3.interpolateNumber(wa, wb)});
  } else if (wb) {
    s.push(s.pop() + "skewX(" + wb + ")");
  }
  if (ka[0] != kb[0] || ka[1] != kb[1]) {
    n = s.push(s.pop() + "scale(", null, ",", null, ")");
    q.push({i: n - 4, x: d3.interpolateNumber(ka[0], kb[0])}, {i: n - 2, x: d3.interpolateNumber(ka[1], kb[1])});
  } else if (kb[0] != 1 || kb[1] != 1) {
    s.push(s.pop() + "scale(" + kb + ")");
  }
  n = q.length;
  return function(t) {
    var i = -1, o;
    while (++i < n) s[(o = q[i]).i] = o.x(t);
    return s.join("");
  };
};
d3.interpolateArray = function(a, b) {
  var x = [],
      c = [],
      na = a.length,
      nb = b.length,
      n0 = Math.min(a.length, b.length),
      i;
  for (i = 0; i < n0; ++i) x.push(d3.interpolate(a[i], b[i]));
  for (; i < na; ++i) c[i] = a[i];
  for (; i < nb; ++i) c[i] = b[i];
  return function(t) {
    for (i = 0; i < n0; ++i) c[i] = x[i](t);
    return c;
  };
};
d3.interpolateObject = function(a, b) {
  var i = {},
      c = {},
      k;
  for (k in a) {
    if (k in b) {
      i[k] = d3_interpolateByName(k)(a[k], b[k]);
    } else {
      c[k] = a[k];
    }
  }
  for (k in b) {
    if (!(k in a)) {
      c[k] = b[k];
    }
  }
  return function(t) {
    for (k in i) c[k] = i[k](t);
    return c;
  };
};
var d3_interpolate_number = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
function d3_interpolateByName(name) {
  return name == "transform"
      ? d3.interpolateTransform
      : d3.interpolate;
}
d3.interpolators = [
  d3.interpolateObject,
  function(a, b) { return Array.isArray(b) && d3.interpolateArray(a, b); },
  function(a, b) { return (typeof a === "string" || typeof b === "string") && d3.interpolateString(a + "", b + ""); },
  function(a, b) { return (typeof b === "string" ? d3_rgb_names.has(b) || /^(#|rgb\(|hsl\()/.test(b) : b instanceof d3_Color) && d3.interpolateRgb(a, b); },
  function(a, b) { return !isNaN(a = +a) && !isNaN(b = +b) && d3.interpolateNumber(a, b); }
];
d3.interpolateRound = d3_interpolateRound;
function d3_interpolateRound(a, b) {
  b -= a;
  return function(t) { return Math.round(a + b * t); };
}
function d3_uninterpolateNumber(a, b) {
  b = b - (a = +a) ? 1 / (b - a) : 0;
  return function(x) { return (x - a) * b; };
}
function d3_uninterpolateClamp(a, b) {
  b = b - (a = +a) ? 1 / (b - a) : 0;
  return function(x) { return Math.max(0, Math.min(1, (x - a) * b)); };
}
function d3_class(ctor, properties) {
  try {
    for (var key in properties) {
      Object.defineProperty(ctor.prototype, key, {
        value: properties[key],
        enumerable: false
      });
    }
  } catch (e) {
    ctor.prototype = properties;
  }
}
d3.map = function(object) {
  var map = new d3_Map;
  for (var key in object) map.set(key, object[key]);
  return map;
};
function d3_Map() {}
d3_class(d3_Map, {
  has: function(key) {
    return d3_map_prefix + key in this;
  },
  get: function(key) {
    return this[d3_map_prefix + key];
  },
  set: function(key, value) {
    return this[d3_map_prefix + key] = value;
  },
  remove: function(key) {
    key = d3_map_prefix + key;
    return key in this && delete this[key];
  },
  keys: function() {
    var keys = [];
    this.forEach(function(key) { keys.push(key); });
    return keys;
  },
  values: function() {
    var values = [];
    this.forEach(function(key, value) { values.push(value); });
    return values;
  },
  entries: function() {
    var entries = [];
    this.forEach(function(key, value) { entries.push({key: key, value: value}); });
    return entries;
  },
  forEach: function(f) {
    for (var key in this) {
      if (key.charCodeAt(0) === d3_map_prefixCode) {
        f.call(this, key.substring(1), this[key]);
      }
    }
  }
});
var d3_map_prefix = "\0", // prevent collision with built-ins
    d3_map_prefixCode = d3_map_prefix.charCodeAt(0);
function d3_identity(d) {
  return d;
}
var d3_format_decimalPoint = ".",
    d3_format_thousandsSeparator = ",",
    d3_format_grouping = [3, 3];
var d3_formatPrefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"].map(d3_formatPrefix);
d3.formatPrefix = function(value, precision) {
  var i = 0;
  if (value) {
    if (value < 0) value *= -1;
    if (precision) value = d3.round(value, d3_format_precision(value, precision));
    i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
    i = Math.max(-24, Math.min(24, Math.floor((i <= 0 ? i + 1 : i - 1) / 3) * 3));
  }
  return d3_formatPrefixes[8 + i / 3];
};
function d3_formatPrefix(d, i) {
  var k = Math.pow(10, Math.abs(8 - i) * 3);
  return {
    scale: i > 8 ? function(d) { return d / k; } : function(d) { return d * k; },
    symbol: d
  };
}
d3.round = function(x, n) {
  return n
      ? Math.round(x * (n = Math.pow(10, n))) / n
      : Math.round(x);
};
d3.format = function(specifier) {
  var match = d3_format_re.exec(specifier),
      fill = match[1] || " ",
      align = match[2] || ">",
      sign = match[3] || "",
      basePrefix = match[4] || "",
      zfill = match[5],
      width = +match[6],
      comma = match[7],
      precision = match[8],
      type = match[9],
      scale = 1,
      suffix = "",
      integer = false;
  if (precision) precision = +precision.substring(1);
  if (zfill || fill === "0" && align === "=") {
    zfill = fill = "0";
    align = "=";
    if (comma) width -= Math.floor((width - 1) / 4);
  }
  switch (type) {
    case "n": comma = true; type = "g"; break;
    case "%": scale = 100; suffix = "%"; type = "f"; break;
    case "p": scale = 100; suffix = "%"; type = "r"; break;
    case "b":
    case "o":
    case "x":
    case "X": if (basePrefix) basePrefix = "0" + type.toLowerCase();
    case "c":
    case "d": integer = true; precision = 0; break;
    case "s": scale = -1; type = "r"; break;
  }
  if (basePrefix === "#") basePrefix = "";
  // If no precision is specified for r, fallback to general notation.
  if (type == "r" && !precision) type = "g";
  // Ensure that the requested precision is in the supported range.
  if (precision != null) {
    if (type == "g") precision = Math.max(1, Math.min(21, precision));
    else if (type == "e" || type == "f") precision = Math.max(0, Math.min(20, precision));
  }
  type = d3_format_types.get(type) || d3_format_typeDefault;
  var zcomma = zfill && comma;
  return function(value) {
    // Return the empty string for floats formatted as ints.
    if (integer && (value % 1)) return "";
    // Convert negative to positive, and record the sign prefix.
    var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, "-") : sign;
    // Apply the scale, computing it from the value's exponent for si format.
    if (scale < 0) {
      var prefix = d3.formatPrefix(value, precision);
      value = prefix.scale(value);
      suffix = prefix.symbol;
    } else {
      value *= scale;
    }
    // Convert to the desired precision.
    value = type(value, precision);
     // If the fill character is not "0", grouping is applied before padding.
    if (!zfill && comma) value = d3_format_group(value);
    var length = basePrefix.length + value.length + (zcomma ? 0 : negative.length),
        padding = length < width ? new Array(length = width - length + 1).join(fill) : "";
    // If the fill character is "0", grouping is applied after padding.
    if (zcomma) value = d3_format_group(padding + value);
    if (d3_format_decimalPoint) value.replace(".", d3_format_decimalPoint);
    negative += basePrefix;
    return (align === "<" ? negative + value + padding
          : align === ">" ? padding + negative + value
          : align === "^" ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length)
          : negative + (zcomma ? value : padding + value)) + suffix;
  };
};
// [[fill]align][sign][#][0][width][,][.precision][type]
var d3_format_re = /(?:([^{])?([<>=^]))?([+\- ])?(#)?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i;
var d3_format_types = d3.map({
  b: function(x) { return x.toString(2); },
  c: function(x) { return String.fromCharCode(x); },
  o: function(x) { return x.toString(8); },
  x: function(x) { return x.toString(16); },
  X: function(x) { return x.toString(16).toUpperCase(); },
  g: function(x, p) { return x.toPrecision(p); },
  e: function(x, p) { return x.toExponential(p); },
  f: function(x, p) { return x.toFixed(p); },
  r: function(x, p) { return (x = d3.round(x, d3_format_precision(x, p))).toFixed(Math.max(0, Math.min(20, d3_format_precision(x * (1 + 1e-15), p)))); }
});
function d3_format_precision(x, p) {
  return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);
}
function d3_format_typeDefault(x) {
  return x + "";
}
// Apply comma grouping for thousands.
var d3_format_group = d3_identity;
if (d3_format_grouping) {
  var d3_format_groupingLength = d3_format_grouping.length;
  d3_format_group = function(value) {
    var i = value.lastIndexOf("."),
        f = i >= 0 ? "." + value.substring(i + 1) : (i = value.length, ""),
        t = [],
        j = 0,
        g = d3_format_grouping[0];
    while (i > 0 && g > 0) {
      t.push(value.substring(i -= g, i + g));
      g = d3_format_grouping[j = (j + 1) % d3_format_groupingLength];
    }
    return t.reverse().join(d3_format_thousandsSeparator || "") + f;
  };
}
function d3_scale_bilinear(domain, range, uninterpolate, interpolate) {
  var u = uninterpolate(domain[0], domain[1]),
      i = interpolate(range[0], range[1]);
  return function(x) {
    return i(u(x));
  };
}
function d3_scale_nice(domain, nice) {
  var i0 = 0,
      i1 = domain.length - 1,
      x0 = domain[i0],
      x1 = domain[i1],
      dx;
  if (x1 < x0) {
    dx = i0, i0 = i1, i1 = dx;
    dx = x0, x0 = x1, x1 = dx;
  }
  if (nice = nice(x1 - x0)) {
    domain[i0] = nice.floor(x0);
    domain[i1] = nice.ceil(x1);
  }
  return domain;
}
d3.bisector = function(f) {
  return {
    left: function(a, x, lo, hi) {
      if (arguments.length < 3) lo = 0;
      if (arguments.length < 4) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (f.call(a, a[mid], mid) < x) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (arguments.length < 3) lo = 0;
      if (arguments.length < 4) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (x < f.call(a, a[mid], mid)) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
};
var d3_bisector = d3.bisector(function(d) { return d; });
d3.bisectLeft = d3_bisector.left;
d3.bisect = d3.bisectRight = d3_bisector.right;
function d3_scale_polylinear(domain, range, uninterpolate, interpolate) {
  var u = [],
      i = [],
      j = 0,
      k = Math.min(domain.length, range.length) - 1;
  // Handle descending domains.
  if (domain[k] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }
  while (++j <= k) {
    u.push(uninterpolate(domain[j - 1], domain[j]));
    i.push(interpolate(range[j - 1], range[j]));
  }
  return function(x) {
    var j = d3.bisect(domain, x, 1, k) - 1;
    return i[j](u[j](x));
  };
}
d3.scale = {};
function d3_scaleExtent(domain) {
  var start = domain[0], stop = domain[domain.length - 1];
  return start < stop ? [start, stop] : [stop, start];
}
function d3_scaleRange(scale) {
  return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
}
d3.scale.linear = function() {
  return d3_scale_linear([0, 1], [0, 1], d3_interpolate, false);
};
function d3_scale_linear(domain, range, interpolate, clamp) {
  var output,
      input;
  function rescale() {
    var linear = Math.min(domain.length, range.length) > 2 ? d3_scale_polylinear : d3_scale_bilinear,
        uninterpolate = clamp ? d3_uninterpolateClamp : d3_uninterpolateNumber;
    output = linear(domain, range, uninterpolate, interpolate);
    input = linear(range, domain, uninterpolate, d3_interpolate);
    return scale;
  }
  function scale(x) {
    return output(x);
  }
  // Note: requires range is coercible to number!
  scale.invert = function(y) {
    return input(y);
  };
  scale.domain = function(x) {
    if (!arguments.length) return domain;
    domain = x.map(Number);
    return rescale();
  };
  scale.range = function(x) {
    if (!arguments.length) return range;
    range = x;
    return rescale();
  };
  scale.rangeRound = function(x) {
    return scale.range(x).interpolate(d3_interpolateRound);
  };
  scale.clamp = function(x) {
    if (!arguments.length) return clamp;
    clamp = x;
    return rescale();
  };
  scale.interpolate = function(x) {
    if (!arguments.length) return interpolate;
    interpolate = x;
    return rescale();
  };
  scale.ticks = function(m) {
    return d3_scale_linearTicks(domain, m);
  };
  scale.tickFormat = function(m, format) {
    return d3_scale_linearTickFormat(domain, m, format);
  };
  scale.nice = function() {
    d3_scale_nice(domain, d3_scale_linearNice);
    return rescale();
  };
  scale.copy = function() {
    return d3_scale_linear(domain, range, interpolate, clamp);
  };
  return rescale();
}
function d3_scale_linearRebind(scale, linear) {
  return d3.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp");
}
function d3_scale_linearNice(dx) {
  dx = Math.pow(10, Math.round(Math.log(dx) / Math.LN10) - 1);
  return dx && {
    floor: function(x) { return Math.floor(x / dx) * dx; },
    ceil: function(x) { return Math.ceil(x / dx) * dx; }
  };
}
function d3_scale_linearTickRange(domain, m) {
  var extent = d3_scaleExtent(domain),
      span = extent[1] - extent[0],
      step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)),
      err = m / span * step;
  // Filter ticks to get closer to the desired count.
  if (err <= .15) step *= 10;
  else if (err <= .35) step *= 5;
  else if (err <= .75) step *= 2;
  // Round start and stop values to step interval.
  extent[0] = Math.ceil(extent[0] / step) * step;
  extent[1] = Math.floor(extent[1] / step) * step + step * .5; // inclusive
  extent[2] = step;
  return extent;
}
function d3_scale_linearTicks(domain, m) {
  return d3.range.apply(d3, d3_scale_linearTickRange(domain, m));
}
function d3_scale_linearTickFormat(domain, m, format) {
  var precision = -Math.floor(Math.log(d3_scale_linearTickRange(domain, m)[2]) / Math.LN10 + .01);
  return d3.format(format
      ? format.replace(d3_format_re, function(a, b, c, d, e, f, g, h, i, j) { return [b, c, d, e, f, g, h, i || "." + (precision - (j === "%") * 2), j].join(""); })
      : ",." + precision + "f");
}
function d3_true() {
  return true;
}
d3.time = {};
var d3_time = Date,
    d3_time_daySymbols = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function d3_time_utc() {
  this._ = new Date(arguments.length > 1
      ? Date.UTC.apply(this, arguments)
      : arguments[0]);
}
d3_time_utc.prototype = {
  getDate: function() { return this._.getUTCDate(); },
  getDay: function() { return this._.getUTCDay(); },
  getFullYear: function() { return this._.getUTCFullYear(); },
  getHours: function() { return this._.getUTCHours(); },
  getMilliseconds: function() { return this._.getUTCMilliseconds(); },
  getMinutes: function() { return this._.getUTCMinutes(); },
  getMonth: function() { return this._.getUTCMonth(); },
  getSeconds: function() { return this._.getUTCSeconds(); },
  getTime: function() { return this._.getTime(); },
  getTimezoneOffset: function() { return 0; },
  valueOf: function() { return this._.valueOf(); },
  setDate: function() { d3_time_prototype.setUTCDate.apply(this._, arguments); },
  setDay: function() { d3_time_prototype.setUTCDay.apply(this._, arguments); },
  setFullYear: function() { d3_time_prototype.setUTCFullYear.apply(this._, arguments); },
  setHours: function() { d3_time_prototype.setUTCHours.apply(this._, arguments); },
  setMilliseconds: function() { d3_time_prototype.setUTCMilliseconds.apply(this._, arguments); },
  setMinutes: function() { d3_time_prototype.setUTCMinutes.apply(this._, arguments); },
  setMonth: function() { d3_time_prototype.setUTCMonth.apply(this._, arguments); },
  setSeconds: function() { d3_time_prototype.setUTCSeconds.apply(this._, arguments); },
  setTime: function() { d3_time_prototype.setTime.apply(this._, arguments); }
};
var d3_time_prototype = Date.prototype;
function d3_time_interval(local, step, number) {
  function round(date) {
    var d0 = local(date), d1 = offset(d0, 1);
    return date - d0 < d1 - date ? d0 : d1;
  }
  function ceil(date) {
    step(date = local(new d3_time(date - 1)), 1);
    return date;
  }
  function offset(date, k) {
    step(date = new d3_time(+date), k);
    return date;
  }
  function range(t0, t1, dt) {
    var time = ceil(t0), times = [];
    if (dt > 1) {
      while (time < t1) {
        if (!(number(time) % dt)) times.push(new Date(+time));
        step(time, 1);
      }
    } else {
      while (time < t1) times.push(new Date(+time)), step(time, 1);
    }
    return times;
  }
  function range_utc(t0, t1, dt) {
    try {
      d3_time = d3_time_utc;
      var utc = new d3_time_utc();
      utc._ = t0;
      return range(utc, t1, dt);
    } finally {
      d3_time = Date;
    }
  }
  local.floor = local;
  local.round = round;
  local.ceil = ceil;
  local.offset = offset;
  local.range = range;
  var utc = local.utc = d3_time_interval_utc(local);
  utc.floor = utc;
  utc.round = d3_time_interval_utc(round);
  utc.ceil = d3_time_interval_utc(ceil);
  utc.offset = d3_time_interval_utc(offset);
  utc.range = range_utc;
  return local;
}
function d3_time_interval_utc(method) {
  return function(date, k) {
    try {
      d3_time = d3_time_utc;
      var utc = new d3_time_utc();
      utc._ = date;
      return method(utc, k)._;
    } finally {
      d3_time = Date;
    }
  };
}
d3.time.year = d3_time_interval(function(date) {
  date = d3.time.day(date);
  date.setMonth(0, 1);
  return date;
}, function(date, offset) {
  date.setFullYear(date.getFullYear() + offset);
}, function(date) {
  return date.getFullYear();
});
d3.time.years = d3.time.year.range;
d3.time.years.utc = d3.time.year.utc.range;
d3.time.day = d3_time_interval(function(date) {
  var day = new d3_time(1970, 0);
  day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  return day;
}, function(date, offset) {
  date.setDate(date.getDate() + offset);
}, function(date) {
  return date.getDate() - 1;
});
d3.time.days = d3.time.day.range;
d3.time.days.utc = d3.time.day.utc.range;
d3.time.dayOfYear = function(date) {
  var year = d3.time.year(date);
  return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);
};
d3.requote = function(s) {
  return s.replace(d3_requote_re, "\\$&");
};
var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
// The date and time format (%c), date format (%x) and time format (%X).
var d3_time_formatDateTime = "%a %e %b %X %Y",
    d3_time_formatDate = "%d.%m.%Y",
    d3_time_formatTime = "%H:%M:%S";
// The weekday and month names.
var d3_time_days = Globalize.culture(__locale).calendar.days.names,
    d3_time_dayAbbreviations = Globalize.culture(__locale).calendar.days.namesAbbr,
    d3_time_months = Globalize.culture(__locale).calendar.months.names,
    d3_time_monthAbbreviations = Globalize.culture(__locale).calendar.months.namesAbbr;
d3_time_daySymbols.forEach(function(day, i) {
  day = day.toLowerCase();
  i = 7 - i;
  var interval = d3.time[day] = d3_time_interval(function(date) {
    (date = d3.time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);
    return date;
  }, function(date, offset) {
    date.setDate(date.getDate() + Math.floor(offset) * 7);
  }, function(date) {
    var day = d3.time.year(date).getDay();
    return Math.floor((d3.time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);
  });
  d3.time[day + "s"] = interval.range;
  d3.time[day + "s"].utc = interval.utc.range;
  d3.time[day + "OfYear"] = function(date) {
    var day = d3.time.year(date).getDay();
    return Math.floor((d3.time.dayOfYear(date) + (day + i) % 7) / 7);
  };
});
d3.time.week = d3.time.sunday;
d3.time.weeks = d3.time.sunday.range;
d3.time.weeks.utc = d3.time.sunday.utc.range;
d3.time.weekOfYear = d3.time.sundayOfYear;
d3.time.format = function(template) {
  var n = template.length;
  function format(date) {
    var string = [],
        i = -1,
        j = 0,
        c,
        p,
        f;
    while (++i < n) {
      if (template.charCodeAt(i) === 37) {
        string.push(template.substring(j, i));
        if ((p = d3_time_formatPads[c = template.charAt(++i)]) != null) c = template.charAt(++i);
        if (f = d3_time_formats[c]) c = f(date, p == null ? (c === "e" ? " " : "0") : p);
        string.push(c);
        j = i + 1;
      }
    }
    string.push(template.substring(j, i));
    return string.join("");
  }
  format.parse = function(string) {
    var d = {y: 1900, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0},
        i = d3_time_parse(d, template, string, 0);
    if (i != string.length) return null;
    // The am-pm flag is 0 for AM, and 1 for PM.
    if ("p" in d) d.H = d.H % 12 + d.p * 12;
    var date = new d3_time();
    date.setFullYear(d.y, d.m, d.d);
    date.setHours(d.H, d.M, d.S, d.L);
    return date;
  };
  format.toString = function() {
    return template;
  };
  return format;
};
function d3_time_parse(date, template, string, j) {
  var c,
      p,
      i = 0,
      n = template.length,
      m = string.length;
  while (i < n) {
    if (j >= m) return -1;
    c = template.charCodeAt(i++);
    if (c === 37) {
      p = d3_time_parsers[template.charAt(i++)];
      if (!p || ((j = p(date, string, j)) < 0)) return -1;
    } else if (c != string.charCodeAt(j++)) {
      return -1;
    }
  }
  return j;
}
function d3_time_formatRe(names) {
  return new RegExp("^(?:" + names.map(d3.requote).join("|") + ")", "i");
}
function d3_time_formatLookup(names) {
  var map = new d3_Map, i = -1, n = names.length;
  while (++i < n) map.set(names[i].toLowerCase(), i);
  return map;
}
function d3_time_formatPad(value, fill, width) {
  value += "";
  var length = value.length;
  return length < width ? new Array(width - length + 1).join(fill) + value : value;
}
var d3_time_dayRe = d3_time_formatRe(d3_time_days),
    d3_time_dayAbbrevRe = d3_time_formatRe(d3_time_dayAbbreviations),
    d3_time_monthRe = d3_time_formatRe(d3_time_months),
    d3_time_monthLookup = d3_time_formatLookup(d3_time_months),
    d3_time_monthAbbrevRe = d3_time_formatRe(d3_time_monthAbbreviations),
    d3_time_monthAbbrevLookup = d3_time_formatLookup(d3_time_monthAbbreviations);
var d3_time_formatPads = {
  "-": "",
  "_": " ",
  "0": "0"
};
var d3_time_formats = {
  a: function(d) { return d3_time_dayAbbreviations[d.getDay()]; },
  A: function(d) { return d3_time_days[d.getDay()]; },
  b: function(d) { return d3_time_monthAbbreviations[d.getMonth()]; },
  B: function(d) { return d3_time_months[d.getMonth()]; },
  c: d3.time.format(d3_time_formatDateTime),
  d: function(d, p) { return d3_time_formatPad(d.getDate(), p, 2); },
  e: function(d, p) { return d3_time_formatPad(d.getDate(), p, 2); },
  H: function(d, p) { return d3_time_formatPad(d.getHours(), p, 2); },
  I: function(d, p) { return d3_time_formatPad(d.getHours() % 12 || 12, p, 2); },
  j: function(d, p) { return d3_time_formatPad(1 + d3.time.dayOfYear(d), p, 3); },
  L: function(d, p) { return d3_time_formatPad(d.getMilliseconds(), p, 3); },
  m: function(d, p) { return d3_time_formatPad(d.getMonth() + 1, p, 2); },
  M: function(d, p) { return d3_time_formatPad(d.getMinutes(), p, 2); },
  p: function(d) { return d.getHours() >= 12 ? "PM" : "AM"; },
  S: function(d, p) { return d3_time_formatPad(d.getSeconds(), p, 2); },
  U: function(d, p) { return d3_time_formatPad(d3.time.sundayOfYear(d), p, 2); },
  w: function(d) { return d.getDay(); },
  W: function(d, p) { return d3_time_formatPad(d3.time.mondayOfYear(d), p, 2); },
  x: d3.time.format(d3_time_formatDate),
  X: d3.time.format(d3_time_formatTime),
  y: function(d, p) { return d3_time_formatPad(d.getFullYear() % 100, p, 2); },
  Y: function(d, p) { return d3_time_formatPad(d.getFullYear() % 10000, p, 4); },
  Z: d3_time_zone,
  "%": function() { return "%"; }
};
var d3_time_parsers = {
  a: d3_time_parseWeekdayAbbrev,
  A: d3_time_parseWeekday,
  b: d3_time_parseMonthAbbrev,
  B: d3_time_parseMonth,
  c: d3_time_parseLocaleFull,
  d: d3_time_parseDay,
  e: d3_time_parseDay,
  H: d3_time_parseHour24,
  I: d3_time_parseHour24,
  // j: function(d, s, i) { /*TODO day of year [001,366] */ return i; },
  L: d3_time_parseMilliseconds,
  m: d3_time_parseMonthNumber,
  M: d3_time_parseMinutes,
  p: d3_time_parseAmPm,
  S: d3_time_parseSeconds,
  // U: function(d, s, i) { /*TODO week number (sunday) [00,53] */ return i; },
  // w: function(d, s, i) { /*TODO weekday [0,6] */ return i; },
  // W: function(d, s, i) { /*TODO week number (monday) [00,53] */ return i; },
  x: d3_time_parseLocaleDate,
  X: d3_time_parseLocaleTime,
  y: d3_time_parseYear,
  Y: d3_time_parseFullYear
  // ,
  // Z: function(d, s, i) { /*TODO time zone */ return i; },
  // "%": function(d, s, i) { /*TODO literal % */ return i; }
};
// Note: weekday is validated, but does not set the date.
function d3_time_parseWeekdayAbbrev(date, string, i) {
  d3_time_dayAbbrevRe.lastIndex = 0;
  var n = d3_time_dayAbbrevRe.exec(string.substring(i));
  return n ? i += n[0].length : -1;
}
// Note: weekday is validated, but does not set the date.
function d3_time_parseWeekday(date, string, i) {
  d3_time_dayRe.lastIndex = 0;
  var n = d3_time_dayRe.exec(string.substring(i));
  return n ? i += n[0].length : -1;
}
function d3_time_parseMonthAbbrev(date, string, i) {
  d3_time_monthAbbrevRe.lastIndex = 0;
  var n = d3_time_monthAbbrevRe.exec(string.substring(i));
  return n ? (date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()), i += n[0].length) : -1;
}
function d3_time_parseMonth(date, string, i) {
  d3_time_monthRe.lastIndex = 0;
  var n = d3_time_monthRe.exec(string.substring(i));
  return n ? (date.m = d3_time_monthLookup.get(n[0].toLowerCase()), i += n[0].length) : -1;
}
function d3_time_parseLocaleFull(date, string, i) {
  return d3_time_parse(date, d3_time_formats.c.toString(), string, i);
}
function d3_time_parseLocaleDate(date, string, i) {
  return d3_time_parse(date, d3_time_formats.x.toString(), string, i);
}
function d3_time_parseLocaleTime(date, string, i) {
  return d3_time_parse(date, d3_time_formats.X.toString(), string, i);
}
function d3_time_parseFullYear(date, string, i) {
  d3_time_numberRe.lastIndex = 0;
  var n = d3_time_numberRe.exec(string.substring(i, i + 4));
  return n ? (date.y = +n[0], i += n[0].length) : -1;
}
function d3_time_parseYear(date, string, i) {
  d3_time_numberRe.lastIndex = 0;
  var n = d3_time_numberRe.exec(string.substring(i, i + 2));
  return n ? (date.y = d3_time_expandYear(+n[0]), i += n[0].length) : -1;
}
function d3_time_expandYear(d) {
  return d + (d > 68 ? 1900 : 2000);
}
function d3_time_parseMonthNumber(date, string, i) {
  d3_time_numberRe.lastIndex = 0;
  var n = d3_time_numberRe.exec(string.substring(i, i + 2));
  return n ? (date.m = n[0] - 1, i += n[0].length) : -1;
}
function d3_time_parseDay(date, string, i) {
  d3_time_numberRe.lastIndex = 0;
  var n = d3_time_numberRe.exec(string.substring(i, i + 2));
  return n ? (date.d = +n[0], i += n[0].length) : -1;
}
// Note: we don't validate that the hour is in the range [0,23] or [1,12].
function d3_time_parseHour24(date, string, i) {
  d3_time_numberRe.lastIndex = 0;
  var n = d3_time_numberRe.exec(string.substring(i, i + 2));
  return n ? (date.H = +n[0], i += n[0].length) : -1;
}
function d3_time_parseMinutes(date, string, i) {
  d3_time_numberRe.lastIndex = 0;
  var n = d3_time_numberRe.exec(string.substring(i, i + 2));
  return n ? (date.M = +n[0], i += n[0].length) : -1;
}
function d3_time_parseSeconds(date, string, i) {
  d3_time_numberRe.lastIndex = 0;
  var n = d3_time_numberRe.exec(string.substring(i, i + 2));
  return n ? (date.S = +n[0], i += n[0].length) : -1;
}
function d3_time_parseMilliseconds(date, string, i) {
  d3_time_numberRe.lastIndex = 0;
  var n = d3_time_numberRe.exec(string.substring(i, i + 3));
  return n ? (date.L = +n[0], i += n[0].length) : -1;
}
// Note: we don't look at the next directive.
var d3_time_numberRe = /^\s*\d+/;
function d3_time_parseAmPm(date, string, i) {
  var n = d3_time_amPmLookup.get(string.substring(i, i += 2).toLowerCase());
  return n == null ? -1 : (date.p = n, i);
}
var d3_time_amPmLookup = d3.map({
  am: 0,
  pm: 1
});
// TODO table of time zone offset names?
function d3_time_zone(d) {
  var z = d.getTimezoneOffset(),
      zs = z > 0 ? "-" : "+",
      zh = ~~(Math.abs(z) / 60),
      zm = Math.abs(z) % 60;
  return zs + d3_time_formatPad(zh, "0", 2) + d3_time_formatPad(zm, "0", 2);
}
d3.time.hour = d3_time_interval(function(date) {
  var timezone = date.getTimezoneOffset() / 60;
  return new d3_time((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);
}, function(date, offset) {
  date.setTime(date.getTime() + Math.floor(offset) * 36e5); // DST breaks setHours
}, function(date) {
  return date.getHours();
});
d3.time.hours = d3.time.hour.range;
d3.time.hours.utc = d3.time.hour.utc.range;
d3.time.minute = d3_time_interval(function(date) {
  return new d3_time(Math.floor(date / 6e4) * 6e4);
}, function(date, offset) {
  date.setTime(date.getTime() + Math.floor(offset) * 6e4); // DST breaks setMinutes
}, function(date) {
  return date.getMinutes();
});
d3.time.minutes = d3.time.minute.range;
d3.time.minutes.utc = d3.time.minute.utc.range;
d3.time.month = d3_time_interval(function(date) {
  date = d3.time.day(date);
  date.setDate(1);
  return date;
}, function(date, offset) {
  date.setMonth(date.getMonth() + offset);
}, function(date) {
  return date.getMonth();
});
d3.time.months = d3.time.month.range;
d3.time.months.utc = d3.time.month.utc.range;
d3.time.second = d3_time_interval(function(date) {
  return new d3_time(Math.floor(date / 1e3) * 1e3);
}, function(date, offset) {
  date.setTime(date.getTime() + Math.floor(offset) * 1e3); // DST breaks setSeconds
}, function(date) {
  return date.getSeconds();
});
d3.time.seconds = d3.time.second.range;
d3.time.seconds.utc = d3.time.second.utc.range;
function d3_time_scale(linear, methods, format) {
  function scale(x) {
    return linear(x);
  }
  scale.invert = function(x) {
    return d3_time_scaleDate(linear.invert(x));
  };
  scale.domain = function(x) {
    if (!arguments.length) return linear.domain().map(d3_time_scaleDate);
    linear.domain(x);
    return scale;
  };
  scale.nice = function(m) {
    return scale.domain(d3_scale_nice(scale.domain(), function() { return m; }));
  };
  scale.ticks = function(m, k) {
    var extent = d3_scaleExtent(scale.domain());
    if (typeof m !== "function") {
      var span = extent[1] - extent[0],
          target = span / m,
          i = d3.bisect(d3_time_scaleSteps, target);
      if (i == d3_time_scaleSteps.length) return methods.year(extent, m);
      if (!i) return linear.ticks(m).map(d3_time_scaleDate);
      if (Math.log(target / d3_time_scaleSteps[i - 1]) < Math.log(d3_time_scaleSteps[i] / target)) --i;
      m = methods[i];
      k = m[1];
      m = m[0].range;
    }
    return m(extent[0], new Date(+extent[1] + 1), k); // inclusive upper bound
  };
  scale.tickFormat = function() {
    return format;
  };
  scale.copy = function() {
    return d3_time_scale(linear.copy(), methods, format);
  };
  return d3_scale_linearRebind(scale, linear);
}
function d3_time_scaleDate(t) {
  return new Date(t);
}
function d3_time_scaleFormat(formats) {
  return function(date) {
    var i = formats.length - 1, f = formats[i];
    while (!f[1](date)) f = formats[--i];
    return f[0](date);
  };
}
function d3_time_scaleSetYear(y) {
  var d = new Date(y, 0, 1);
  d.setFullYear(y); // Y2K fail
  return d;
}
function d3_time_scaleGetYear(d) {
  var y = d.getFullYear(),
      d0 = d3_time_scaleSetYear(y),
      d1 = d3_time_scaleSetYear(y + 1);
  return y + (d - d0) / (d1 - d0);
}
var d3_time_scaleSteps = [
  1e3,    // 1-second
  5e3,    // 5-second
  15e3,   // 15-second
  3e4,    // 30-second
  6e4,    // 1-minute
  3e5,    // 5-minute
  9e5,    // 15-minute
  18e5,   // 30-minute
  36e5,   // 1-hour
  108e5,  // 3-hour
  216e5,  // 6-hour
  432e5,  // 12-hour
  864e5,  // 1-day
  1728e5, // 2-day
  6048e5, // 1-week
  2592e6, // 1-month
  7776e6, // 3-month
  31536e6 // 1-year
];
var d3_time_scaleLocalMethods = [
  [d3.time.second, 1],
  [d3.time.second, 5],
  [d3.time.second, 15],
  [d3.time.second, 30],
  [d3.time.minute, 1],
  [d3.time.minute, 5],
  [d3.time.minute, 15],
  [d3.time.minute, 30],
  [d3.time.hour, 1],
  [d3.time.hour, 3],
  [d3.time.hour, 6],
  [d3.time.hour, 12],
  [d3.time.day, 1],
  [d3.time.day, 2],
  [d3.time.week, 1],
  [d3.time.month, 1],
  [d3.time.month, 3],
  [d3.time.year, 1]
];
var d3_time_scaleLocalFormats = [
  [d3.time.format("%Y"), d3_true],
  [d3.time.format("%B"), function(d) { return d.getMonth(); }],
  [d3.time.format("%b %d"), function(d) { return d.getDate() != 1; }],
  [d3.time.format("%a %d"), function(d) { return d.getDay() && d.getDate() != 1; }],
  [d3.time.format("%I %p"), function(d) { return d.getHours(); }],
  [d3.time.format("%I:%M"), function(d) { return d.getMinutes(); }],
  [d3.time.format(":%S"), function(d) { return d.getSeconds(); }],
  [d3.time.format(".%L"), function(d) { return d.getMilliseconds(); }]
];
var d3_time_scaleLinear = d3.scale.linear(),
    d3_time_scaleLocalFormat = d3_time_scaleFormat(d3_time_scaleLocalFormats);
d3_time_scaleLocalMethods.year = function(extent, m) {
  return d3_time_scaleLinear.domain(extent.map(d3_time_scaleGetYear)).ticks(m).map(d3_time_scaleSetYear);
};
d3.time.scale = function() {
  return d3_time_scale(d3.scale.linear(), d3_time_scaleLocalMethods, d3_time_scaleLocalFormat);
};
function d3_number(x) {
  return x != null && !isNaN(x);
}
d3.ascending = function(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};
// R-7 per <http://en.wikipedia.org/wiki/Quantile>
d3.quantile = function(values, p) {
  var H = (values.length - 1) * p + 1,
      h = Math.floor(H),
      v = +values[h - 1],
      e = H - h;
  return e ? v + e * (values[h] - v) : v;
};
d3.median = function(array, f) {
  if (arguments.length > 1) array = array.map(f);
  array = array.filter(d3_number);
  return array.length ? d3.quantile(array.sort(d3.ascending), .5) : undefined;
};
  return d3;
})();
