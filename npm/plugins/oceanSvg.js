export default function () {
    var color = {
        0:['rgba(221, 221, 255, 0.6)', 'rgba(153, 170, 187,0.8)'],
        1:['rgba(159, 240, 232, 0.6)', 'rgba(  5, 242, 219,0.8)'],
        2:['rgba(152, 234, 242, 0.6)', 'rgba(  5, 219, 242,0.8)'],
        3:['rgba(114, 162, 181, 0.6)', 'rgba(  4, 138, 191,0.8)'],
        4:['rgba( 96, 123, 148, 0.6)', 'rgba( 10,  93, 166,0.8)'],
        5:['rgba( 87, 102, 131, 0.6)', 'rgba(  8,  52, 140,0.8)']};
    var _ = {svg:null, q: null, scale: 0, oceanColor: 0};
    var $ = {};

    function init() {
        var __ = this._;
        this._.options.showOcean = true;
        Object.defineProperty(__.options, 'oceanColor', {
            get: function () { return _.oceanColor; },
            set: function (x) {
                _.oceanColor = x;
            }
        });
        _.svg = __.svg;
    }

    function create() {
        _.svg.selectAll('#ocean,.ocean').remove();
        if (this._.options.showOcean) {
            var c = _.oceanColor;
            var ocean_fill = this.$slc.defs.append('radialGradient')
            .attr('id', 'ocean')
            .attr('cx', '75%')
            .attr('cy', '25%');
            if (typeof(c)==='number') {
                c = color[c];
                ocean_fill.append('stop')
                .attr('offset', '5%')
                .attr('stop-color', c[0]);
            } else if (typeof(c)==='string') {
                c = [c, c];
            }
            ocean_fill.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', c[1]);
            $.ocean = _.svg.append('g').attr('class','ocean').append('circle')
            .attr('cx',this._.center[0]).attr('cy', this._.center[1])
            .attr('class', 'noclicks');
            resize.call(this);
        }
    }

    function resize() {
        if ($.ocean && this._.options.showOcean) {
            $.ocean.attr('r', this._.proj.scale()+_.scale);
        }
    }

    return {
        name: 'oceanSvg',
        onInit: function onInit() {
            init.call(this);
        },
        onCreate: function onCreate() {
            create.call(this);
        },
        onResize: function onResize() {
            resize.call(this);
        },
        selectAll: function selectAll(q) {
            if (q) {
                _.q = q;
                _.svg = d3.selectAll(q);
            }
            return _.svg;
        },
        scale: function scale(sz) {
            if (sz) {
                _.scale = sz;
                resize.call(this);
            } else {
                return _.scale;
            }
        },
        recreate: function recreate() {
            create.call(this);
        },
        $ocean: function $ocean() {return $.ocean;},
    }
}