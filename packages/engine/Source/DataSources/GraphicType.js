/**
 * An enum identifying the type of graphic.
 *
 * @enum {string}
 */
const GraphicType = {
  /**
   * 点
   *
   * @type {string}
   * @constant
   */
  POINT: "POINT",

  /**
   * 折线
   *
   * @type {string}
   * @constant
   */
  POLYLINE: "POLYLINE",
  /**
   * 曲线折线
   *
   * @type {string}
   * @constant
   */
  CURVE_POLYLINE: "CURVE_POLYLINE",

  /**
   * 多边形
   *
   * @type {string}
   * @constant
   */
  POLYGON: "POLYGON",
  /**
   * 曲线多边形
   *
   * @type {string}
   * @constant
   */
  CURVE_POLYGON: "CURVE_POLYGON",

  /**
   * 矩形
   *
   * @type {string}
   * @constant
   */
  RECTANGLE: "RECTANGLE",

  /**
   * 圆
   *
   * @type {string}
   * @constant
   */
  CIRCLE: "CIRCLE",
};
export default Object.freeze(GraphicType);
