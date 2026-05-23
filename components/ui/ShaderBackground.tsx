"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ShaderBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });

    const w = container.clientWidth  || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    renderer.setSize(w, h);
    renderer.setPixelRatio(1);
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime:       { value: 0 },
        iResolution: { value: new THREE.Vector2(w, h) },
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2  iResolution;

        #define NUM_OCTAVES 2

        float rand(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 u  = fract(p);
          u = u * u * (3.0 - 2.0 * u);
          return mix(
            mix(rand(ip),              rand(ip + vec2(1.0, 0.0)), u.x),
            mix(rand(ip + vec2(0.0,1.0)), rand(ip + vec2(1.0,1.0)), u.x),
            u.y
          );
        }

        float fbm(vec2 x) {
          float v = 0.0;
          float a = 0.3;
          vec2  shift = vec2(100.0);
          mat2  rot   = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x  = rot * x * 2.0 + shift;
            a *= 0.4;
          }
          return v;
        }

        void main() {
          vec2 p = (gl_FragCoord.xy - iResolution.xy * 0.5)
                   / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
          vec2 v;
          vec4 o = vec4(0.0);

          float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

          for (float i = 0.0; i < 20.0; i++) {
            v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5;

            vec4 col = vec4(
              0.05 + 0.15 * sin(i * 0.2 + iTime * 0.4),
              0.10 + 0.25 * cos(i * 0.3 + iTime * 0.5),
              0.40 + 0.30 * sin(i * 0.4 + iTime * 0.3),
              1.0
            );

            float thin = smoothstep(0.0, 1.0, i / 20.0) * 0.6;
            o += col * exp(sin(i * i + iTime * 0.8))
                     / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)))
                     * thin;
          }

          o = tanh(pow(o / 100.0, vec4(1.6)));
          gl_FragColor = o * 1.2;
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh     = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId: number;
    let visible = true;
    const startTime = performance.now();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!visible) return;
      material.uniforms.iTime.value = (performance.now() - startTime) / 1000;
      renderer.render(scene, camera);
    };
    animate();

    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; },
      { rootMargin: "200px" }
    );
    io.observe(container);

    const ro = new ResizeObserver(() => {
      const w2 = container.clientWidth;
      const h2 = container.clientHeight;
      renderer.setSize(w2, h2);
      material.uniforms.iResolution.value.set(w2, h2);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      io.disconnect();
      ro.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0"
      style={{ pointerEvents: "none" }}
    />
  );
}
