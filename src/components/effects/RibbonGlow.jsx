import React, { useRef, useEffect } from 'react';

/**
 * RibbonGlow (OriginKit)
 * A full-bleed WebGL2 background that stacks 84 warped, folded layers into ribbons of light,
 * which swirl around the pointer and are dragged along by its motion.
 */
export function RibbonGlow({
  className = '',
  colors = ['#ea580c', '#84cc16', '#0d9488', '#a855f7'],
  speed = 1.0,
  opacity = 0.85,
  interactive = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let mouse = { x: width * 0.5, y: height * 0.5, targetX: width * 0.5, targetY: height * 0.5 };

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // 84 folded warped ribbons fragment shader
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform float u_opacity;

      // Hex to RGB conversion done in JS, passed via color uniforms or procedural
      vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.08, 0.35, 0.67);
        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
        vec2 m = (u_mouse * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);

        // Distance & swirl from mouse pointer
        vec2 d = uv - m;
        float dist = length(d);
        float angle = atan(d.y, d.x);
        
        // Swirl warp around pointer
        float swirl = exp(-dist * 2.2) * 1.5;
        uv += vec2(cos(angle + u_time * 0.5), sin(angle + u_time * 0.5)) * swirl;

        vec3 finalColor = vec3(0.0);
        vec2 uv0 = uv;

        // 84 stacked folded ribbon filament slices
        const int LAYERS = 84;
        for (int i = 0; i < LAYERS; i++) {
          float fi = float(i) / float(LAYERS);
          float offset = fi * 6.28318;
          
          // Folded warping wave formula
          float wave = sin(uv.y * 3.5 + u_time * 0.8 + offset) * 0.35;
          wave += cos(uv.x * 2.8 - u_time * 0.6 + offset * 1.5) * 0.25;

          float filament = abs(uv.x - wave - (fi - 0.5) * 1.6);
          filament = 0.0035 / (filament + 0.004);

          vec3 col = palette(fi + u_time * 0.05 + dist * 0.2);
          // Boost vibrant highlights on hover swirl
          col *= 1.0 + exp(-dist * 3.0) * 0.8;

          finalColor += col * filament * (1.0 / float(LAYERS)) * 8.5;
        }

        // Soft vignette
        float vig = 1.0 - smoothstep(0.7, 1.6, length(uv0));
        finalColor *= vig * u_opacity;

        gl_FragColor = vec4(finalColor, u_opacity * clamp(length(finalColor), 0.0, 1.0));
      }
    `;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('RibbonGlow shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('RibbonGlow program link error:', gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, 'position');
    const resUniform = gl.getUniformLocation(program, 'u_resolution');
    const mouseUniform = gl.getUniformLocation(program, 'u_mouse');
    const timeUniform = gl.getUniformLocation(program, 'u_time');
    const opacityUniform = gl.getUniformLocation(program, 'u_opacity');

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      gl.viewport(0, 0, width, height);
    };

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = height - (e.clientY - rect.top);
    };

    window.addEventListener('resize', handleResize);
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    handleResize();

    let startTime = performance.now();

    const render = () => {
      const now = performance.now();
      const elapsed = ((now - startTime) / 1000) * speed;

      // Inertia smoothing for pointer
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      gl.useProgram(program);
      gl.enableVertexAttribArray(posAttr);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resUniform, width, height);
      gl.uniform2f(mouseUniform, mouse.x, mouse.y);
      gl.uniform1f(timeUniform, elapsed);
      gl.uniform1f(opacityUniform, opacity);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // Additive luminous glow

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [speed, opacity, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

export default RibbonGlow;
