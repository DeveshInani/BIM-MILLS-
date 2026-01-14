import React, { useEffect, useRef } from 'react';

const FRAME_COUNT = 80;
const FRAME_PATH = (idx) => `/frames-homepage-background/ezgif-frame-${String(idx).padStart(3, '0')}.jpg`;
const FPS = 12;

export default function Frames3DBackground() {
  const ref = useRef();
  const frameIdx = useRef(1);
  const raf = useRef();

  useEffect(() => {
    let running = true;
    const animate = () => {
      if (!running) return;
      frameIdx.current = frameIdx.current % FRAME_COUNT + 1;
      if (ref.current) {
        ref.current.src = FRAME_PATH(frameIdx.current);
      }
      raf.current = setTimeout(animate, 1000 / FPS);
    };
    animate();
    return () => {
      running = false;
      clearTimeout(raf.current);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <img
        ref={ref}
        src={FRAME_PATH(1)}
        alt="3D Fabric Background"
        style={{ width: '100vw', height: '100vh', objectFit: 'cover', filter: 'brightness(0.95) blur(0.5px)' }}
        draggable={false}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.18) 0%,rgba(0,0,0,0.32) 100%)', zIndex: 1 }} />
    </div>
  );
}
