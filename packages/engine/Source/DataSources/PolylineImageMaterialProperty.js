import Frozen from "../Core/Frozen.js";
import defined from "../Core/defined.js";
import Event from "../Core/Event.js";
import JulianDate from "../Core/JulianDate.js";
import createPropertyDescriptor from "./createPropertyDescriptor.js";
import Property from "./Property.js";

const defaultImage = undefined;
const defaultImageWidth = 50.0;

/**
 * A {@link MaterialProperty} that maps to polyline image {@link Material} uniforms.
 * @alias PolylineImageMaterialProperty
 * @constructor
 *
 * @param {object} [options] Object with the following properties:
 * @param {Property|string|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} [options.image] A Property specifying the Image, URL, Canvas, or Video.
 * @param {Property|number} [options.imageWidth=50.0] A numeric Property specifying the width of the image in pixels.
 */
function PolylineImageMaterialProperty(options) {
  options = options ?? Frozen.EMPTY_OBJECT;

  this._definitionChanged = new Event();
  this._image = undefined;
  this._imageSubscription = undefined;
  this._imageWidth = undefined;
  this._imageWidthSubscription = undefined;

  this.image = options.image;
  this.imageWidth = options.imageWidth;
}

Object.defineProperties(PolylineImageMaterialProperty.prototype, {
  /**
   * Gets a value indicating if this property is constant.  A property is considered
   * constant if getValue always returns the same result for the current definition.
   * @memberof PolylineImageMaterialProperty.prototype
   * @type {boolean}
   * @readonly
   */
  isConstant: {
    get: function () {
      return (
        Property.isConstant(this._image) &&
        Property.isConstant(this._imageWidth)
      );
    },
  },
  /**
   * Gets the event that is raised whenever the definition of this property changes.
   * The definition is considered to have changed if a call to getValue would return
   * a different result for the same time.
   * @memberof PolylineImageMaterialProperty.prototype
   * @type {Event}
   * @readonly
   */
  definitionChanged: {
    get: function () {
      return this._definitionChanged;
    },
  },
  /**
   * Gets or sets the Property specifying the image.
   * @memberof PolylineImageMaterialProperty.prototype
   * @type {Property|undefined}
   */
  image: createPropertyDescriptor("image"),

  /**
   * Gets or sets the Property specifying the width of the image in pixels.
   * @memberof PolylineImageMaterialProperty.prototype
   * @type {Property|undefined}
   */
  imageWidth: createPropertyDescriptor("imageWidth"),
});

/**
 * Gets the {@link Material} type at the provided time.
 *
 * @param {JulianDate} time The time for which to retrieve the type.
 * @returns {string} The type of material.
 */
PolylineImageMaterialProperty.prototype.getType = function (time) {
  return "PolylineImage";
};

const timeScratch = new JulianDate();

/**
 * Gets the value of the property at the provided time.
 *
 * @param {JulianDate} [time=JulianDate.now()] The time for which to retrieve the value. If omitted, the current system time is used.
 * @param {object} [result] The object to store the value into, if omitted, a new instance is created and returned.
 * @returns {object} The modified result parameter or a new instance if the result parameter was not supplied.
 */
PolylineImageMaterialProperty.prototype.getValue = function (time, result) {
  if (!defined(time)) {
    time = JulianDate.now(timeScratch);
  }
  if (!defined(result)) {
    result = {};
  }
  result.image = Property.getValueOrClonedDefault(
    this._image,
    time,
    defaultImage,
    result.image,
  );
  result.imageWidth = Property.getValueOrClonedDefault(
    this._imageWidth,
    time,
    defaultImageWidth,
    result.imageWidth,
  );
  return result;
};

/**
 * Compares this property to the provided property and returns
 * <code>true</code> if they are equal, <code>false</code> otherwise.
 *
 * @param {Property} [other] The other property.
 * @returns {boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
 */
PolylineImageMaterialProperty.prototype.equals = function (other) {
  return (
    this === other || //
    (other instanceof PolylineImageMaterialProperty &&
      Property.equals(this._image, other._image) &&
      Property.equals(this._imageWidth, other._imageWidth))
  );
};
export default PolylineImageMaterialProperty;
