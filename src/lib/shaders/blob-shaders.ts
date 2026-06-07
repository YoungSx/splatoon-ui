export const blobVertexShader = `
precision highp float;

attribute vec2 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float u_time;
uniform float u_wobbleAmount;

varying vec2 v_uv;
varying vec3 v_position;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  v_uv = uv;
  
  // Calculate noise based on angle and time
  // Position is around (0,0), radius ~0.5
  float angle = atan(position.y, position.x);
  float radius = length(position);
  
  // Create an organic wobbly shape
  // Base splat shape
  float baseShape = snoise(vec2(cos(angle) * 1.5, sin(angle) * 1.5));
  
  // Time-based wobble
  float timeWobble = snoise(vec2(cos(angle) * 2.0 + u_time * 0.5, sin(angle) * 2.0 + u_time * 0.5));
  
  // Combine shape and wobble
  float distortion = (baseShape * 0.15) + (timeWobble * 0.1 * u_wobbleAmount);
  
  vec2 newPosition = position + normalize(position) * distortion;
  
  v_position = vec3(newPosition, 0.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
}
`

export const blobFragmentShader = `
precision highp float;

uniform vec3 u_color;
varying vec2 v_uv;
varying vec3 v_position;

void main() {
  // Simple solid color for the blob, edge antialiasing could be added here
  // but since we are deforming geometry, we rely on WebGL MSAA or alpha blending if we used SDFs.
  // We will render it as solid colored triangles.
  gl_FragColor = vec4(u_color, 1.0);
}
`
