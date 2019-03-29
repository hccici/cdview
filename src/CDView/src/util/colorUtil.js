let mapColors = [
    {stroke: '#13e8e8', fill: '#135777', fill_opacity: '0.6'}
];
let pieColors = [
    '#16a8f8', '#13e8e8', '#61b8b9', '#c1e2af', '#0a72ef',
    '#135777', '#1c375b'
];
let radarColors = [
    '#16a8f8', '#13e8e8', '#61b8b9', '#a1e2c1', '#0a72ef',
    '#135777', '#1c375b'
];
let publicColors = [
    '#16a8f8', '#13e8e8', '#61b8b9', '#89a693', '#0a72ef',
    '#135777', '#1c375b'
];
let addLinearGradient = function (svg) {
    let color = [
        ['#172d4b', '#13ffff'],
        ['#172d4b', '#15cccc'],
        ['#172d4b', '#169c9c'],
        ['#172d4b', '#156868'],
        ['#172d4b', '#123939'],
    ];
    for (let i = 0; i < 5; i++) {
        let defs = svg.append("defs");
        let linearGradient = defs.append("linearGradient")
            .attr("id", "linearColor" + i)
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");
        linearGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", color[i][1]);
        linearGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", color[i][0]);
    }
};
let linearGradientId = [
    'linearColor0',
    'linearColor1',
    'linearColor2',
    'linearColor3',
    'linearColor4',
];
export default {
    mapColors,
    pieColors,
    addLinearGradient,
    linearGradientId,
    radarColors,
    publicColors
}