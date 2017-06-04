// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
const eQuakeApp = () => {
    return {
        name: 'eQuakeApp',
        urls: [
            './d/world-110m.json',
            'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson',
        ],
        onReady(err, world, equake) {
            const features = equake.features.filter(d => d.properties.mag>3);
            this.worldCanvas.data({world});
            this.barPlugin.data({features});
            this.dotsCanvas.data({features});
            this.pingsCanvas.data({features});
        },
        onInit() {
            this.register(earthjs.plugins.commonPlugins());
            this.register(earthjs.plugins.pingsCanvas());
            this.register(earthjs.plugins.dotsCanvas());
            this.register(earthjs.plugins.barPlugin());
            this.register(earthjs.plugins.barTooltipPlugin());
            this.commonPlugins.addChecker('showPings:Pings:showPings'.split(':'));
            this.commonPlugins.addChecker('showBars:Bars:showBars'.split(':'));
            this.commonPlugins.addChecker('showDots:Dots:showDots'.split(':'));
            const tt = this.barTooltipPlugin;
            this.barTooltipPlugin.onShow = function(d) {
                const {mag, tsunami, eventtime, place, detail} = d.properties;
                if (!eventtime) {
                    d3.json(detail, function(error, data) {
                        const {eventtime} = data.properties.products.origin[0].properties;
                        d.properties.eventtime = eventtime;
                        tt.show({properties: {mag,tsunami,eventtime,place}});
                    });
                }
                return {properties: {mag,tsunami,eventtime,place}};
            }
        }
    }
}
earthjs.plugins.eQuakeApp = eQuakeApp;