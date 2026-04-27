export function applyCurvedWorldMaterial(material, options = {}) {
  const {
    curveStrength = 0.0019,
    lateralStrength = 0.00022,
    curveStart = 14.0
  } = options;

  material.userData.curvedWorld = { curveStrength, lateralStrength, curveStart };

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uCurveStrength = { value: curveStrength };
    shader.uniforms.uCurveLateralStrength = { value: lateralStrength };
    shader.uniforms.uCurveStart = { value: curveStart };

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
       uniform float uCurveStrength;
       uniform float uCurveLateralStrength;
       uniform float uCurveStart;`
    );

    shader.vertexShader = shader.vertexShader.replace(
      '#include <project_vertex>',
      `vec4 mvPosition = vec4( transformed, 1.0 );
       #ifdef USE_BATCHING
         mvPosition = batchingMatrix * mvPosition;
       #endif
       #ifdef USE_INSTANCING
         mvPosition = instanceMatrix * mvPosition;
       #endif
       mvPosition = modelViewMatrix * mvPosition;
       float curveDistance = max(0.0, -mvPosition.z - uCurveStart);
       float curveAmount = curveDistance * curveDistance * uCurveStrength;
       mvPosition.y -= curveAmount;
       mvPosition.x += sign(mvPosition.x) * curveDistance * curveDistance * uCurveLateralStrength;
       gl_Position = projectionMatrix * mvPosition;`
    );
  };

  material.needsUpdate = true;
  return material;
}

export function applyCurvedWorldToObject(root, options = {}) {
  root.traverse((object) => {
    if (!object.isMesh) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.filter(Boolean).forEach((material) => applyCurvedWorldMaterial(material, options));
  });
}
