import ScreenSpaceEventHandler from "../Core/ScreenSpaceEventHandler.js";
import CallbackProperty from "./CallbackProperty.js";
import defined from "../Core/defined.js";
import ScreenSpaceEventType from "../Core/ScreenSpaceEventType.js";
import Cartesian3 from "../Core/Cartesian3.js";
import Cartographic from "../Core/Cartographic.js";
import CesiumMath from "../Core/Math.js";
import Color from "../Core/Color.js";
import PolylineGraphics from "./PolylineGraphics.js";
import PointGraphics from "./PointGraphics.js";
import ConstantProperty from "./ConstantProperty.js";
import * as turf from "@turf/turf";
import GraphicType from "./GraphicType.js";
import Entity from "./Entity.js";
import inherit from "../Core/inherit.js";

async function drawPolyline(polylineGraphics, viewer) {
  return new Promise((resolve) => {
    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    const positions = [];
    let pointerPosition = null;

    const callback = () => {
      const result = pointerPosition
        ? [...positions, pointerPosition]
        : positions;
      return result;
    };

    polylineGraphics.positions = new CallbackProperty(callback, false);

    const onLeftClick = (movement) => {
      console.log("onLeftClick", movement);
      const screenPosition = movement.position;
      const position = viewer.scene.camera.pickEllipsoid(
        screenPosition,
        viewer.scene.globe.ellipsoid,
      );

      if (defined(position)) {
        positions.push(position);
      }
    };

    const onDoubleClick = (movement) => {
      console.log("onDoubleClick", movement);
      // 移除倒数第一个点（如果数组长度大于1）
      if (positions.length > 1) {
        positions.pop();
        positions.pop();
      }
      // 完成绘制，不触发相机跟踪
      handler.destroy();
      resolve();
    };

    const onMouseMove = (movement) => {
      const screenPosition = movement.startPosition;
      if (!defined(screenPosition)) {
        return;
      }
      const position = viewer.scene.camera.pickEllipsoid(
        screenPosition,
        viewer.scene.globe.ellipsoid,
      );
      if (!defined(position)) {
        return;
      }
      pointerPosition = position;
    };

    handler.setInputAction(onLeftClick, ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(
      onDoubleClick,
      ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    );
    handler.setInputAction(onMouseMove, ScreenSpaceEventType.MOUSE_MOVE);
  });
}

async function drawCurvePolyline(graphic, viewer) {
  const polylineGraphics = graphic.polyline;
  return new Promise((resolve) => {
    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    const positions = [];
    let pointerPosition = null;
    // let cachePositions = [];
    const callback = () => {
      const result = pointerPosition
        ? [...positions, pointerPosition]
        : positions;
      // if (!cachePositions.length || cachePositions.length !== result.length) {
      //   console.log("更新缓存", cachePositions.length, result.length);

      //   cachePositions = computeBezierCurvePoints(result);
      // }
      // return cachePositions;
      // console.log("result", result);

      const lonlat = result.map((position) => {
        const cartographic = Cartographic.fromCartesian(position);
        return [
          CesiumMath.toDegrees(cartographic.longitude),
          CesiumMath.toDegrees(cartographic.latitude),
        ];
      });
      if (lonlat.length > 1) {
        const line = turf.lineString(lonlat);
        const curved = turf.bezierSpline(line);
        // console.log("curved", curved);

        const position = curved.geometry.coordinates.map((_) => {
          return Cartesian3.fromDegreesArray(_);
        });
        // return position;
        // console.log("position", position);
        return position.flat();
      }

      // const curvePositions = computeBezierCurvePoints(result);
      // console.log("curvePositions", curvePositions);
      // return [];

      return result;
    };
    polylineGraphics.positions = new CallbackProperty(callback, false);
    // polylineGraphics.material = new PolylineDashMaterialProperty({
    //   color: Color.YELLOW,
    // });
    const onLeftClick = (movement) => {
      console.log("onLeftClick", movement);
      const screenPosition = movement.position;
      const position = viewer.scene.camera.pickEllipsoid(
        screenPosition,
        viewer.scene.globe.ellipsoid,
      );

      if (defined(position)) {
        positions.push(position);
        const entity = new Entity({
          position: position,
          point: {
            pixelSize: 8,
            color: Color.RED,
            outlineColor: Color.YELLOW,
            outlineWidth: 1,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });
        entity.parent = graphic;
        viewer.entities.add(entity);
      }
    };

    const onDoubleClick = (movement) => {
      console.log("onDoubleClick", movement);
      // 移除倒数第一个点（如果数组长度大于1）
      if (positions.length > 1) {
        positions.pop();
        positions.pop();
      }
      // 完成绘制，不触发相机跟踪
      handler.destroy();
      resolve();
    };

    const onMouseMove = (movement) => {
      const screenPosition = movement.startPosition;
      if (!defined(screenPosition)) {
        return;
      }
      const position = viewer.scene.camera.pickEllipsoid(
        screenPosition,
        viewer.scene.globe.ellipsoid,
      );
      if (!defined(position)) {
        return;
      }
      pointerPosition = position;
    };

    handler.setInputAction(onLeftClick, ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(
      onDoubleClick,
      ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    );
    handler.setInputAction(onMouseMove, ScreenSpaceEventType.MOUSE_MOVE);
  });
}

async function drawPoint(pointEntity, viewer) {
  return new Promise((resolve) => {
    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    const onLeftClick = (movement) => {
      const screenPosition = movement.position;
      const position = viewer.scene.camera.pickEllipsoid(
        screenPosition,
        viewer.scene.globe.ellipsoid,
      );
      if (defined(position)) {
        pointEntity.position = new ConstantProperty(position);
        handler.destroy();
        resolve();
      }
    };

    handler.setInputAction(onLeftClick, ScreenSpaceEventType.LEFT_CLICK);
  });
}
/**
 * 可绘制Entity类
 * @param {object} options
 * @param {GraphicType} options.type - 绘制类型
 * @param {object} options.style - The style of the graphic.
 * @constructor
 */
function Graphic(options) {
  options = options || {};
  if (!defined(options.type)) {
    throw new Error("type is required");
  }
  Entity.call(this);
  this._type = options.type;
  if (this._type === GraphicType.POINT) {
    this.point = new PointGraphics({
      show: true,
      pixelSize: 8,
      color: Color.RED,
      outlineColor: Color.YELLOW,
      outlineWidth: 1,
    });
  }
  if (this._type === GraphicType.POLYLINE) {
    this.polyline = new PolylineGraphics({
      // show: true,
      width: 3,
      // material: new Color(1.0, 1.0, 1.0, 1.0),
      // clampToGround: true,
      // zIndex: 1000,
      // granularity: CesiumMath.RADIANS_PER_DEGREE,
      // arcType: ArcType.GEODESIC,
      // shadows: ShadowMode.DISABLED,
      // positions: Cartesian3.fromDegreesArray([120, 40, 100, 40]),
    });
  }
  if (this._type === GraphicType.CURVE_POLYLINE) {
    this.polyline = new PolylineGraphics({
      // show: true,
      width: 15,
      material: options.style.material,
    });
  }
}
// 使用继承函数简化继承操作 - 不添加额外属性
inherit(Graphic, Entity);

Graphic.prototype.startDraw = async function (viewer) {
  if (this._type === GraphicType.POLYLINE) {
    await drawPolyline(this.polyline, viewer);
  }
  if (this._type === GraphicType.POINT) {
    await drawPoint(this, viewer);
  }
  if (this._type === GraphicType.CURVE_POLYLINE) {
    await drawCurvePolyline(this, viewer);
  }
};
Graphic.prototype.stopDraw = function (options) {
  if (this._type === GraphicType.POLYLINE) {
    this._polylineGraphics.stopDraw(options);
  }
};
Object.defineProperty(Graphic.prototype, "type", {
  get: function () {
    return this._type;
  },
});

export default Graphic;
