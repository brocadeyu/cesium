
uniform sampler2D image;
in float v_polylineAngle;
mat2 rotate(float rad) {
  float c = cos(rad);
  float s = sin(rad);
  return mat2(
      c, s,
      -s, c
  );
}
czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);

   vec2 st = materialInput.st;
 vec2 pos = rotate(v_polylineAngle) * gl_FragCoord.xy;
  float s = pos.x / (70.0 * czm_pixelRatio);
//    s = s-czm_frameNumber*0.01;//增加运动效果
    float t = st.t;
    vec4 colorImage = texture(image, vec2(fract(s), t));
    material.diffuse = colorImage.rgb;
    material.alpha = colorImage.a;
    return material;
}
