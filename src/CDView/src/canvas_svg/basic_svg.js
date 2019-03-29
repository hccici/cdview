import util from '../util/base_util.js'
var d3 = require('d3');
var selectById = function (id) {
    //画svg
    var d3Id = "#" + id;
    var container = d3.select(d3Id);
    var model=util.getContainerModel(id)
    var height = model.height;
    var width = model.width;
    return{
        draw: function () {
            container.append('svg').attr('width', width).attr('height', height);
        }
    }
}
export default {
    selectById
}