import React, { useEffect, useRef, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════════
   3D RUBIK'S CUBE COMPONENT
   Full 27-cubie interactive system with rotation inertia, scramble, and auto-solve
   ═══════════════════════════════════════════════════════════════════════════════ */

export function RubiksCube() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [statusText, setStatusText] = useState('Initializing...');
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const sceneEl = sceneRef.current;
    const wrapperEl = wrapperRef.current;
    const viewportEl = viewportRef.current;

    if (!sceneEl || !wrapperEl || !viewportEl) return;

    const CUBIE_PX = 66;
    const HALF_PX = 33;
    const STEP_PX = 66;

    const FC = {
      front: { bg: '#009B48', cls: 'fc-green' },
      back: { bg: '#0051A2', cls: 'fc-blue' },
      right: { bg: '#C41E3A', cls: 'fc-red' },
      left: { bg: '#FF5800', cls: 'fc-orange' },
      top: { bg: '#FFFFFF', cls: 'fc-white' },
      bottom: { bg: '#FFD500', cls: 'fc-yellow' },
      inner: { bg: '#111111', cls: 'fc-inner' },
    };

    const FACE_DEFS = [
      { key: 'front', t: `translateZ(${HALF_PX}px)` },
      { key: 'back', t: `rotateY(180deg) translateZ(${HALF_PX}px)` },
      { key: 'right', t: `rotateY(90deg) translateZ(${HALF_PX}px)` },
      { key: 'left', t: `rotateY(-90deg) translateZ(${HALF_PX}px)` },
      { key: 'top', t: `rotateX(90deg) translateZ(${HALF_PX}px)` },
      { key: 'bottom', t: `rotateX(-90deg) translateZ(${HALF_PX}px)` },
    ];

    interface Cubie {
      el: HTMLDivElement;
      m: DOMMatrix;
    }

    const cubies: Cubie[] = [];

    function makeCubie(lx: number, ly: number, lz: number): Cubie {
      const el = document.createElement('div');
      el.className = 'cubie';

      FACE_DEFS.forEach((fd) => {
        let fc = FC.inner;
        if (fd.key === 'front' && lz === 1) fc = FC.front;
        if (fd.key === 'back' && lz === -1) fc = FC.back;
        if (fd.key === 'right' && lx === 1) fc = FC.right;
        if (fd.key === 'left' && lx === -1) fc = FC.left;
        if (fd.key === 'top' && ly === 1) fc = FC.top;
        if (fd.key === 'bottom' && ly === -1) fc = FC.bottom;

        const face = document.createElement('div');
        face.className = 'cubie-face ' + fc.cls;
        face.style.transform = fd.t + (fc === FC.inner ? ' scale(0.98)' : '');
        if (fc !== FC.inner) {
          face.style.backgroundColor = fc.bg;
          face.innerHTML = '<div class="gloss"></div><div class="shine"></div>';
        } else {
          face.style.backgroundColor = '#111';
        }
        el.appendChild(face);
      });

      const m = new DOMMatrix().translate(lx * STEP_PX, -ly * STEP_PX, lz * STEP_PX);
      el.style.transform = m.toString();
      return { el, m };
    }

    function buildCube() {
      if (!sceneEl) return;
      sceneEl.innerHTML = '';
      cubies.length = 0;
      for (let y = 1; y >= -1; y--) {
        for (let x = -1; x <= 1; x++) {
          for (let z = 1; z >= -1; z--) {
            const c = makeCubie(x, y, z);
            sceneEl.appendChild(c.el);
            cubies.push(c);
          }
        }
      }
    }

    function snap(m: DOMMatrix) {
      m.m41 = Math.round(m.m41 / STEP_PX) * STEP_PX;
      m.m42 = Math.round(m.m42 / STEP_PX) * STEP_PX;
      m.m43 = Math.round(m.m43 / STEP_PX) * STEP_PX;

      const keys: Array<'m11' | 'm12' | 'm13' | 'm21' | 'm22' | 'm23' | 'm31' | 'm32' | 'm33'> = [
        'm11', 'm12', 'm13', 'm21', 'm22', 'm23', 'm31', 'm32', 'm33'
      ];
      keys.forEach((f) => {
        if (Math.abs(m[f]) < 0.1) m[f] = 0;
        else m[f] = Math.sign(m[f]);
      });
    }

    function rotateLayer(axis: 'x' | 'y' | 'z', slice: number, angle: number, ms: number) {
      return new Promise<void>((resolve) => {
        const layer = cubies.filter((c) => {
          const x = Math.round(c.m.m41 / STEP_PX);
          const y = Math.round(-c.m.m42 / STEP_PX);
          const z = Math.round(c.m.m43 / STEP_PX);
          const val = axis === 'x' ? x : axis === 'y' ? y : z;
          return val === slice;
        });

        if (layer.length === 0) {
          resolve();
          return;
        }

        const pivot = document.createElement('div');
        pivot.style.cssText = 'position:absolute;width:0;height:0;transform-style:preserve-3d;';
        sceneEl.appendChild(pivot);
        layer.forEach((c) => pivot.appendChild(c.el));

        void pivot.getBoundingClientRect();

        if (ms > 0) {
          pivot.style.transition = `transform ${ms}ms cubic-bezier(0.34, 1.25, 0.64, 1)`;
        }
        pivot.style.transform =
          axis === 'y'
            ? `rotateY(${angle}deg)`
            : axis === 'x'
            ? `rotateX(${angle}deg)`
            : `rotateZ(${angle}deg)`;

        setTimeout(() => {
          const rotStr =
            axis === 'y'
              ? `rotateY(${angle}deg)`
              : axis === 'x'
              ? `rotateX(${angle}deg)`
              : `rotateZ(${angle}deg)`;
          const rotM = new DOMMatrix(rotStr);

          layer.forEach((c) => {
            c.m = rotM.multiply(c.m);
            snap(c.m);
            sceneEl.appendChild(c.el);
            c.el.style.transition = 'none';
            c.el.style.transform = c.m.toString();
            void c.el.offsetHeight;
          });

          pivot.remove();
          resolve();
        }, ms + 40);
      });
    }

    interface Move {
      axis: 'x' | 'y' | 'z';
      slice: number;
      angle: number;
    }

    const MOVES: Move[] = [
      { axis: 'y', slice: 1, angle: 90 },
      { axis: 'y', slice: 1, angle: -90 },
      { axis: 'y', slice: 0, angle: 90 },
      { axis: 'y', slice: 0, angle: -90 },
      { axis: 'y', slice: -1, angle: 90 },
      { axis: 'y', slice: -1, angle: -90 },
      { axis: 'x', slice: 1, angle: 90 },
      { axis: 'x', slice: 1, angle: -90 },
      { axis: 'x', slice: 0, angle: 90 },
      { axis: 'x', slice: 0, angle: -90 },
      { axis: 'x', slice: -1, angle: 90 },
      { axis: 'x', slice: -1, angle: -90 },
      { axis: 'z', slice: 1, angle: 90 },
      { axis: 'z', slice: 1, angle: -90 },
      { axis: 'z', slice: -1, angle: 90 },
      { axis: 'z', slice: -1, angle: -90 },
    ];

    let history: Move[] = [];
    let busy = false;
    let manualMode = false;
    let manualTimer: ReturnType<typeof setTimeout>;

    function sleep(ms: number) {
      return new Promise((r) => setTimeout(r, ms));
    }

    async function scramble(n = 14, ms = 185) {
      if (busy) return;
      busy = true;
      setIsDisabled(true);
      setStatusText('Scrambling...');
      history = [];

      for (let i = 0; i < n; i++) {
        let m: Move;
        do {
          m = MOVES[Math.floor(Math.random() * MOVES.length)];
        } while (
          history.length &&
          history[history.length - 1].axis === m.axis &&
          history[history.length - 1].slice === m.slice
        );
        history.push(m);
        await rotateLayer(m.axis, m.slice, m.angle, ms);
        await sleep(18);
      }
      busy = false;
      setIsDisabled(false);
      setStatusText('Scrambled — ready to solve');
    }

    async function solve(ms = 340) {
      if (busy || !history.length) return;
      busy = true;
      setIsDisabled(true);
      setStatusText('Solving...');

      const moves = [...history].reverse().map((m) => ({ ...m, angle: -m.angle }));
      for (const m of moves) {
        await rotateLayer(m.axis, m.slice, m.angle, ms);
        await sleep(28);
      }
      history = [];
      busy = false;
      setIsDisabled(false);
      setStatusText('Solved! ✓');
    }

    async function triggerAutoSequence() {
      if (busy) return;
      await sleep(400);
      await scramble(10, 160);
      await sleep(450);
      await solve(300);
    }

    // Initialize clean cube
    buildCube();

    // Trigger visible scramble & solve animation when scrolled into view
    let hasAutoScrambled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAutoScrambled && !busy) {
            hasAutoScrambled = true;
            triggerAutoSequence();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    // Button event listeners
    const btnScramble = document.getElementById('rc-btnScramble');
    const btnSolve = document.getElementById('rc-btnSolve');

    const handleScrambleClick = () => {
      if (history.length > 0) return;
      manualMode = true;
      clearTimeout(manualTimer);
      manualTimer = setTimeout(() => {
        manualMode = false;
      }, 15000);
      scramble(14, 200);
    };

    const handleSolveClick = () => {
      manualMode = true;
      clearTimeout(manualTimer);
      manualTimer = setTimeout(() => {
        manualMode = false;
      }, 15000);
      solve(380);
    };

    btnScramble?.addEventListener('click', handleScrambleClick);
    btnSolve?.addEventListener('click', handleSolveClick);

    // Drag inertia logic
    let rotX = -22;
    let rotY = 45;
    let velX = 0;
    let velY = 0;
    let dragging = false;
    let lx2 = 0;
    let ly2 = 0;
    let lastDx = 0;
    let lastDy = 0;
    let animFrameId: number;

    function applyRot() {
      if (sceneEl) {
        sceneEl.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }
    }

    function animRot() {
      if (!dragging) {
        velY *= 0.92;
        velX *= 0.92;
        if (!manualMode && !busy) {
          velY += (0.25 - velY) * 0.025;
          velX += (0 - velX) * 0.025;
        }
        rotY += velY;
        rotX += velX;
        rotX = Math.max(-65, Math.min(65, rotX));
      }
      applyRot();
      animFrameId = requestAnimationFrame(animRot);
    }

    animRot();

    // Mouse Drag listeners
    const handleMouseDown = (e: MouseEvent) => {
      dragging = true;
      lx2 = e.clientX;
      ly2 = e.clientY;
      velX = 0;
      velY = 0;
      lastDx = 0;
      lastDy = 0;
      manualMode = true;
      clearTimeout(manualTimer);
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      lastDx = (e.clientX - lx2) * 0.45;
      lastDy = (e.clientY - ly2) * 0.45;
      rotY += lastDx;
      rotX -= lastDy;
      rotX = Math.max(-65, Math.min(65, rotX));
      lx2 = e.clientX;
      ly2 = e.clientY;
    };

    const handleMouseUp = () => {
      if (!dragging) return;
      dragging = false;
      velY = lastDx * 0.85;
      velX = -lastDy * 0.85;
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      manualTimer = setTimeout(() => {
        manualMode = false;
      }, 8000);
    };

    // Touch Drag listeners
    const handleTouchStart = (e: TouchEvent) => {
      dragging = true;
      lx2 = e.touches[0].clientX;
      ly2 = e.touches[0].clientY;
      velX = 0;
      velY = 0;
      lastDx = 0;
      lastDy = 0;
      manualMode = true;
      clearTimeout(manualTimer);
      
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchend', handleTouchEnd);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      lastDx = (e.touches[0].clientX - lx2) * 0.45;
      lastDy = (e.touches[0].clientY - ly2) * 0.45;
      rotY += lastDx;
      rotX -= lastDy;
      rotX = Math.max(-65, Math.min(65, rotX));
      lx2 = e.touches[0].clientX;
      ly2 = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      dragging = false;
      velY = lastDx * 0.85;
      velX = -lastDy * 0.85;
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      manualTimer = setTimeout(() => {
        manualMode = false;
      }, 8000);
    };

    viewportEl.addEventListener('mousedown', handleMouseDown);
    viewportEl.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animFrameId);
      clearTimeout(manualTimer);
      btnScramble?.removeEventListener('click', handleScrambleClick);
      btnSolve?.removeEventListener('click', handleSolveClick);
      viewportEl.removeEventListener('mousedown', handleMouseDown);
      viewportEl.removeEventListener('touchstart', handleTouchStart);
      
      // Clean up dynamic listeners if unmounted while dragging
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Dynamic Style Injection for Rubik's Cube 3D Cubies */}
      <style>{`
        .rubiks-cube-root {
          --red: #FF5800;
          --blue: #0051A2;
          --yellow: #FFD500;
          --green: #009B48;
          --orange: #C41E3A;
          --text: #1e293b;
          --dim: #64748b;
        }

        .cube-wrapper {
          position: relative;
          z-index: 2;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: opacity 0.4s ease;
        }

        .cube-aura {
          display: none;
        }

        .cube-viewport {
          width: 220px;
          height: 220px;
          perspective: 960px;
          perspective-origin: 50% 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        #cubeScene {
          width: 0;
          height: 0;
          transform-style: preserve-3d;
          transform: rotateX(-22deg) rotateY(45deg);
          cursor: grab;
          will-change: transform;
        }

        #cubeScene:active { cursor: grabbing; }

        .cubie {
          position: absolute;
          width: 66px;
          height: 66px;
          margin: -33px 0 0 -33px;
          transform-style: preserve-3d;
        }

        .cubie-face {
          position: absolute;
          width: 66px;
          height: 66px;
          border-radius: 9px;
          border: 3px solid #050505;
          backface-visibility: visible;
        }

        .gloss {
          position: absolute;
          inset: 0;
          border-radius: 6px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.27) 0%, transparent 52%);
          pointer-events: none;
          z-index: 1;
        }

        .shine {
          display: none;
        }

        .fc-red    { background: var(--red); box-shadow: 0 0 12px var(--red); }
        .fc-orange { background: var(--orange); box-shadow: 0 0 12px var(--orange); }
        .fc-blue   { background: rgba(0,81,162,1); box-shadow: 0 0 12px rgba(0,81,162,.55); }
        .fc-green  { background: rgba(0,155,72,1); box-shadow: 0 0 12px rgba(0,155,72,.55); }
        .fc-yellow { background: rgba(255,213,0,1) !important; box-shadow: 0 0 12px rgba(255,213,0,.55); }
        .fc-white  { background: rgba(255,255,255,1) !important; box-shadow: 0 0 8px rgba(255,255,255,.3); }
        .fc-inner  { background: transparent !important; box-shadow: none !important; border-color: transparent !important; opacity: 0; }

        .cube-ui { text-align: center; margin-top: 50px; padding-top: 10px; }

        .cube-status {
          font-family: monospace;
          font-weight: 700;
          font-size: 0.82rem;
          color: #f05a28;
          letter-spacing: 1px;
          margin-bottom: 14px;
          min-height: 1.2em;
          text-shadow: 0 0 10px rgba(240, 90, 40, 0.3);
        }

        .cube-btns { display: flex; gap: 10px; justify-content: center; margin-bottom: 12px; }

        .cbtn {
          padding: 8px 18px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.8);
          color: #334155;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.78rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .cbtn:hover:not(:disabled) { border-color: #f05a28; color: #f05a28; background: #ffffff; }
        .cbtn.cbtn-solve { border-color: rgba(240, 90, 40, 0.4); color: #f05a28; }
        .cbtn.cbtn-solve:hover:not(:disabled) { border-color: #f05a28; color: #ffffff; background: #f05a28; }
        .cbtn:disabled { opacity: 0.35; cursor: not-allowed; }

        .cube-hint { font-size: 0.75rem; color: #64748b; letter-spacing: 0.4px; margin-top: 6px; }
      `}</style>

      {/* 3D Rubik's Cube Wrapper */}
      <div className="rubiks-cube-root">
        <div className="cube-wrapper" ref={wrapperRef}>
          <div className="cube-aura" />
          <div className="cube-viewport" ref={viewportRef}>
            <div id="cubeScene" ref={sceneRef} />
          </div>
          <div className="cube-ui">
            <div className="cube-status">{statusText}</div>
            <div className="cube-btns">
              <button className="cbtn" id="rc-btnScramble" disabled={isDisabled}>
                Scramble
              </button>
              <button className="cbtn cbtn-solve" id="rc-btnSolve" disabled={isDisabled}>
                Solve
              </button>
            </div>
            <div className="cube-hint">Drag to rotate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
