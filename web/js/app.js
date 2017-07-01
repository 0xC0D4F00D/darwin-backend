var app = window.app = {};

app.init = function () {
    var image = new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
            color: 'rgba(255, 0, 0, 0.9)'
        }),
        stroke: new ol.style.Stroke({ color: 'red', width: 1 })
    });

    var alarmImage = new ol.style.Circle({
        radius: 14,
        // fill: new ol.style.Fill({
        //     color: 'rgba(0, 0, 255, 0.9)'
        // }),
        stroke: new ol.style.Stroke({ color: 'blue', width: 3 })
    });

    var styles = {
        'zone': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'red',
                width: 2,
                lineDash: [10, 5]
            })
        }),

        'user': new ol.style.Style({
            image: image,
            text: new ol.style.Text({
                // textAlign: align,
                // textBaseline: baseline,
                // font: font,
                font: 'bold 16px monospace',
                fill: new ol.style.Fill({ color: '#FF0000' }),
                stroke: new ol.style.Stroke({ color: '#FFFFFF', width: '6' }),
                // offsetX: offsetX,
                offsetY: -20
                // rotation: rotation
            })
        }),

        'alarm': new ol.style.Style({
            image: alarmImage,
            text: new ol.style.Text({
                // textAlign: align,
                // textBaseline: baseline,
                // font: font,
                font: 'bold 16px monospace',
                fill: new ol.style.Fill({ color: '#0000FF' }),
                stroke: new ol.style.Stroke({ color: '#FFFFFF', width: '6' }),
                // offsetX: 10,
                // offsetY: 25
                // rotation: rotation
            })
        })
    };

    var styleFunction = function(feature) {
        var type = feature.get('type');
        var style = styles[type];
        if (type === 'user') {
            style.getText().setText((feature.get('id') + '').substring(0, 5));
        } else
        if (type === 'alarm') {
            console.log('STATUS', feature.get('status'));
            style.getText().setText(feature.get('status') + '');
        }
        return style;
    };

    var vectorLayer = new ol.layer.Vector({
        style: styleFunction
    });

    var center = ol.proj.transform([43.9360589, 56.2965039], 'EPSG:4326', 'EPSG:3857');

    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            vectorLayer
        ],
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        view: new ol.View({
            center: center,
            zoom: 11
        })
    });


    function requestView () {
        $.get('/api/v1/user/view',
            function (data, status) {
                var geoJson = data.result;
                if (geoJson) {
                    var vectorSource = new ol.source.Vector({
                        features: (new ol.format.GeoJSON()).readFeatures(geoJson)
                    });
                    vectorLayer.setSource(vectorSource);
                }
                setTimeout(function () {
                    requestView();
                }, 1000);
            }
        )
    }

    requestView();

};


$(document).ready(function() {
    app.init();
});