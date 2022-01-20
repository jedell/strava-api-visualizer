let nj = require('numjs');

export const decodePolyline = (str, precision) => {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};

export const degrees_to_radians = (degrees) => {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function lon2tile(lon, zoom) { return ((lon + 180) / 360 * Math.pow(2, zoom)); }
function lat2tile(lat, zoom) { return ((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)); }

export const latlong2coords = (lat, lon, zoom) => {
    return [lat2tile(lat, zoom), lon2tile(lon, zoom)]
}

export const normalize = (x, low, high, min, max) => {
    console.log(x, low, high, min, max)
    console.log((high - low) * (x - min) / (max - min) + low)
    return ((high - low) * (x - min) / (max - min)) + low
}

export const normalizeCoords = (xyz, min, max) => {
    let normalizedXYZ = []
    console.log(xyz)
    for (let i = 0; i < xyz.length; i++) {
        normalizedXYZ.push(normalize(xyz[i], -1, 1, min, max))
    }
    return normalizedXYZ

}

export const latlonTo3D = (lat, lon, alt, rad) => {
    let f = 0;
    let ls = Math.atan((1 - f) ** 2 * Math.tan(lat));

    let x = rad * Math.cos(ls) * Math.cos(lon) + alt //*
    x = rad * Math.cos(lat) * Math.cos(lon);
    let y = rad * Math.cos(ls) * Math.sin(lon) + alt //* 
    y = rad * Math.cos(lat) * Math.sin(lon);
    let z = rad * Math.sin(ls) + alt //* 
    z = rad * Math.sin(lat)

    return [x, y, z]
}

export const scale_array = (arr, min, max) => {
    arr = nj.array(arr)
    console.log(arr)
    let scaled_unit = (max - min) / (nj.max(arr) - nj.min(arr))
    console.log(scaled_unit)
    return nj.power(nj.multiply(nj.add(nj.subtract((nj.multiply(arr, scaled_unit)), nj.min(arr) * scaled_unit), min), 1), 1).tolist()

}

export const scale_array2 = (v, cp, scale) => {
    v = nj.array(v)
    cp = nj.array(cp)
    let v2 = nj.subtract(v, cp)
    let v2_scaled = nj.multiply(v2, scale)
    let v1_sacled = nj.add(v2_scaled, cp)
    return v1_sacled.tolist()
}

export const transform_array = (arr, lat, long) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i][0] -= lat
        arr[i][2] -= long
    }

    return arr

}

export const rotate_x = (arr, a) => {
    arr = nj.array([[arr[0]],[arr[1]],[arr[2]]])

    let rotation = nj.array([
        [1, 0, 0],
        [0, Math.cos(a), -Math.sin(a)],
        [0, Math.sin(a), Math.cos(a)]
    ])
    let rotated = nj.dot(rotation, arr)
    return rotated.reshape(3).tolist()
}

export const rotate_y = (arr, a) => {
    arr = nj.array([[arr[0]],[arr[1]],[arr[2]]])

    let rotation = nj.array([
        [Math.cos(a), 0, Math.sin(a)],
        [0, 1, 0],
        [-Math.sin(a), 0, Math.cos(a)]
    ])
    let rotated = nj.dot(rotation, arr)
    return rotated.reshape(3).tolist()
}

export const rotate_z = (arr, a) => {
    arr = nj.array([[arr[0]],[arr[1]],[arr[2]]])

    let rotation = nj.array([
        [Math.cos(a), -Math.sin(a), 0],
        [Math.sin(a), Math.cos(a), 0],
        [0, 0, 1]
    ])
    let rotated = nj.dot(rotation, arr)
    return rotated.reshape(3).tolist()
}

export const vertexShader = `
uniform sampler2D bumpTexture;
uniform float bumpScale;

varying float vAmount;

varying vec2 vUV;

void main()
{
    vUV = uv;
    vec4 bumpData = texture2D(bumpTexture, uv);

    vAmount = bumpData.r;

    vec3 newPosition = position + normal * bumpScale * vAmount;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

export const fragmentShader = `
varying vec2 vUV;
varying float vAmount;

void main()
{
    gl_FragColor = vec4(0.0, vAmount, 0.0, 1.0);
}
`;
