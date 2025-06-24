import defined from "./defined.js";

/**
 * 创建一个继承函数，用于简化类的继承操作
 *
 * @param {Function} ChildClass - 子类构造函数
 * @param {Function} ParentClass - 父类构造函数
 * @param {Object} [properties] - 要添加到子类原型上的属性（可选）
 * @returns {Function} 返回子类构造函数
 *
 * @example
 * // 基本继承 - 不添加额外属性
 * function Animal(name) {
 *   this.name = name;
 * }
 * Animal.prototype.speak = function() {
 *   console.log(this.name + ' makes a sound');
 * };
 *
 * function Dog(name) {
 *   Animal.call(this, name);
 * }
 * inherit(Dog, Animal);
 *
 * // 手动添加属性
 * Dog.prototype.speak = function() {
 *   console.log(this.name + ' barks');
 * };
 *
 * // 或者一次性添加多个属性
 * inherit(Dog, Animal, {
 *   speak: function() {
 *     console.log(this.name + ' barks');
 *   },
 *   fetch: function() {
 *     console.log(this.name + ' fetches the ball');
 *   }
 * });
 */
function inherit(ChildClass, ParentClass, properties) {
  // 检查参数
  if (!defined(ChildClass) || typeof ChildClass !== "function") {
    throw new Error("ChildClass must be a function");
  }
  if (!defined(ParentClass) || typeof ParentClass !== "function") {
    throw new Error("ParentClass must be a function");
  }

  // 设置原型继承
  if (defined(Object.create)) {
    ChildClass.prototype = Object.create(ParentClass.prototype);
  } else {
    // 兼容旧浏览器
    const TempClass = function () {};
    TempClass.prototype = ParentClass.prototype;
    ChildClass.prototype = new TempClass();
  }

  // 设置构造函数
  ChildClass.prototype.constructor = ChildClass;

  // 如果提供了properties参数，则添加到原型
  if (defined(properties) && typeof properties === "object") {
    for (const key in properties) {
      if (properties.hasOwnProperty(key)) {
        ChildClass.prototype[key] = properties[key];
      }
    }
  }

  return ChildClass;
}

/**
 * 创建一个继承函数，支持调用父类构造函数
 *
 * @param {Function} ChildClass - 子类构造函数
 * @param {Function} ParentClass - 父类构造函数
 * @param {Object} [properties] - 要添加到子类原型上的属性（可选）
 * @returns {Function} 返回子类构造函数
 *
 * @example
 * // 基本继承 - 只设置父类引用
 * function Vehicle(brand) {
 *   this.brand = brand;
 * }
 *
 * function Car(brand, model) {
 *   Vehicle.call(this, brand);
 *   this.model = model;
 * }
 * inheritWithSuper(Car, Vehicle);
 *
 * // 手动添加方法
 * Car.prototype.start = function() {
 *   console.log(this.brand + ' ' + this.model + ' car starts');
 * };
 *
 * // 或者一次性添加
 * inheritWithSuper(Car, Vehicle, {
 *   start: function() {
 *     console.log(this.brand + ' ' + this.model + ' car starts');
 *   }
 * });
 */
function inheritWithSuper(ChildClass, ParentClass, properties) {
  // 先进行基本继承
  inherit(ChildClass, ParentClass, properties);

  // 添加父类引用，方便调用父类方法
  ChildClass.super_ = ParentClass;

  return ChildClass;
}

export default inherit;
export { inheritWithSuper };
