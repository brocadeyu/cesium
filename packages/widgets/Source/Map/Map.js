import Viewer from "../Viewer/Viewer";

/**
 * A base widget for building applications.  It composites all of the standard Cesium widgets into one reusable package.
 * The widget can always be extended by using mixins, which add functionality useful for a variety of applications.
 *
 * @alias Map
 * @class
 * @exports Map
 * @constructor
 * @param {Object} options
 * @returns {Map}
 */
function Map(options) {
  this._viewer = new Viewer(options);
  return this;
}
Object.defineProperties(Map.prototype, {
  viewer: {
    get: function () {
      return this._viewer;
    },
  },
});

export default Map;
