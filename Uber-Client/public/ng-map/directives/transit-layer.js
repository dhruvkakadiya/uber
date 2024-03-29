/**
 * @ngdoc directive
 * @name transit-layer
 * @param Attr2MapOptions {service} convert html attribute to Gogole map api options
 * @description
 *   Requires:  map directive
 *   Restrict To:  Element
 *
 * @example
 * Example:
 *
 *  <map zoom="13" center="34.04924594193164, -118.24104309082031">
 *    <transit-layer></transit-layer>
 *  </map>
 */
(function () {
  "use strict";

  angular.module("ngMap").directive("transitLayer", [
    "Attr2MapOptions",
    function (Attr2MapOptions) {
      var parser = Attr2MapOptions;

      var getLayer = function (options, events) {
        var layer = new google.maps.TransitLayer(options);
        for (var eventName in events) {
          google.maps.event.addListener(layer, eventName, events[eventName]);
        }
        return layer;
      };

      return {
        restrict: "E",
        require: ["?^map", "?^ngMap"],

        link: function (scope, element, attrs, mapController) {
          mapController = mapController[0] || mapController[1];

          var orgAttrs = parser.orgAttributes(element);
          var filtered = parser.filter(attrs);
          var options = parser.getOptions(filtered);
          var events = parser.getEvents(scope, filtered);
          console.log("transit-layer options", options, "events", events);

          var layer = getLayer(options, events);
          mapController.addObject("transitLayers", layer);
          mapController.observeAttrSetObj(orgAttrs, attrs, layer); //observers
          element.bind("$destroy", function () {
            mapController.deleteObject("transitLayers", layer);
          });
        },
      }; // return
    },
  ]);
})();
