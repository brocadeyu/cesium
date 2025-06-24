import Event from "../Core/Event.js";
import PrimitiveCollection from "../Scene/PrimitiveCollection.js";
import ScreenSpaceEventHandler from "../Core/ScreenSpaceEventHandler.js";
import ScreenSpaceEventType from "../Core/ScreenSpaceEventType.js";
import Graphic from "./Graphic.js";

/**
 * A {@link DataSource} which processes the Graphic Layer.
 *
 * @alias GraphicLayer
 * @constructor
 *
 * @example
 * const viewer = new Cesium.Viewer('cesiumContainer');
 * const graphicLayer = new Cesium.GraphicLayer(viewer);
 * const graphic = await graphicLayer.startDraw({
 *   type: Cesium.GraphicType.POINT,
 * });
 * console.log(graphic);
 *
 */
function GraphicLayer(viewer) {
  this._changed = new Event();
  this._error = new Event();
  this._loading = new Event();
  this._primitiveCollection = new PrimitiveCollection();
  this._isDrawing = false;
  this._viewer = viewer;

  this._screenSpaceEventHandler = new ScreenSpaceEventHandler(
    viewer.scene.canvas,
  );

  // 禁用双击时的相机跟踪行为
  this._disableDoubleClickTracking();
}

/**
 * 禁用双击时的相机跟踪行为
 * @private
 */
GraphicLayer.prototype._disableDoubleClickTracking = function () {
  const viewer = this._viewer;

  // 方法1: 移除默认的双击事件处理
  viewer.screenSpaceEventHandler.removeInputAction(
    ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
  );

  // // 方法2: 或者添加自定义的双击处理，阻止跟踪
  // viewer.screenSpaceEventHandler.setInputAction(function (movement) {
  //   // 阻止默认的双击跟踪行为
  //   const pickedObject = viewer.scene.pick(movement.position);
  //   if (defined(pickedObject) && pickedObject.id) {
  //     // 如果有选中的实体，清除跟踪状态
  //     viewer.trackedEntity = undefined;
  //   }
  // }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
};

/**
 * Start drawing the graphic layer.
 * @param {object} options - The options for the graphic layer.
 * @param {GraphicType} options.type - The type of graphic.
 * @param {object} options.style - The style of the graphic.
 * @returns {Promise<Graphic>} - A promise that resolves when the drawing is started.
 */
GraphicLayer.prototype.startDraw = async function (options) {
  if (this._isDrawing) {
    return;
  }
  this._isDrawing = true;
  this._viewer.canvas.style.cursor = "crosshair";
  console.log("this._viewer.canvas", this._viewer.canvas);

  this._changed.raiseEvent(this);
  const graphic = new Graphic({
    type: options.type,
    style: options.style,
  });
  // 添加到 viewer 的 entities 中
  this._viewer.entities.add(graphic);
  // 开始绘制
  await graphic.startDraw(this._viewer);
  this._isDrawing = false;
  this._viewer.canvas.style.cursor = "default";
  return graphic;
};

/**
 * Stop drawing the graphic layer.
 * @returns {void}
 */
GraphicLayer.prototype.stopDraw = function () {
  this._isDrawing = false;
  this._changed.raiseEvent(this);
};

export default GraphicLayer;
