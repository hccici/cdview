function generateRandomData(min, max) {
    let range = max - min;
    let d = min + Math.random() * range;
    d = Math.round(d * 100) / 100;
    return d;
}

