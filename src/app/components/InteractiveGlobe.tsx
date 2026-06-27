import { useEffect, useRef, useState } from 'react';

interface Hotspot {
  lat: number;
  lon: number;
  name: string;
  role: string;
  salary: string;
  x3d: number;
  y3d: number;
  z3d: number;
  screenX?: number;
  screenY?: number;
  visible?: boolean;
}

export function InteractiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Sphere details
  const radius = 130;
  const dotCount = 400; // Number of grid points

  // Interactive rotation state
  const rotationY = useRef(0);
  const rotationX = useRef(0.2); // slight tilt
  const isDragging = useRef(false);
  const startMousePos = useRef({ x: 0, y: 0 });
  const startRotation = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0.005, y: 0 }); // auto rotation speed

  // Define Hotspots
  const initialHotspots: Hotspot[] = [
    { lat: 12.97, lon: 77.59, name: 'Bangalore, IN', role: 'AI Research Lead', salary: '₹45,00,000 / yr', x3d: 0, y3d: 0, z3d: 0 },
    { lat: 37.77, lon: -122.41, name: 'San Francisco, US', role: 'Staff LLM Engineer', salary: '$240,000 / yr', x3d: 0, y3d: 0, z3d: 0 },
    { lat: 51.50, lon: -0.12, name: 'London, UK', role: 'Senior ML Researcher', salary: '£125,000 / yr', x3d: 0, y3d: 0, z3d: 0 },
    { lat: 35.67, lon: 139.65, name: 'Tokyo, JP', role: 'Robotics Scientist', salary: '¥19,500,000 / yr', x3d: 0, y3d: 0, z3d: 0 },
    { lat: -33.86, lon: 151.20, name: 'Sydney, AU', role: 'Cloud Solutions Architect', salary: 'A$175,000 / yr', x3d: 0, y3d: 0, z3d: 0 }
  ];

  // Precalculate 3D spherical positions for hotspots
  const hotspotsRef = useRef<Hotspot[]>(
    initialHotspots.map(h => {
      // lat and lon to radians
      const phi = (90 - h.lat) * (Math.PI / 180);
      const theta = (h.lon + 180) * (Math.PI / 180);

      // spherical coordinates
      const x = -(radius * Math.sin(phi) * Math.sin(theta));
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.cos(theta);

      return { ...h, x3d: x, y3d: y, z3d: z };
    })
  );

  // Precalculate 3D sphere grid points
  const sphereGridRef = useRef<{ x: number; y: number; z: number }[]>([]);
  useEffect(() => {
    const points = [];
    const phiIncrement = Math.PI * (3 - Math.sqrt(5)); // golden angle in radians

    for (let i = 0; i < dotCount; i++) {
      const y = 1 - (i / (dotCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y

      const theta = phiIncrement * i; // golden angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({
        x: x * radius,
        y: y * radius,
        z: z * radius
      });
    }
    sphereGridRef.current = points;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let width = canvas.width;
    let height = canvas.height;
    let isVisible = true;

    // Retina-ready Canvas sizing
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Intersection observer
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0 });
    observer.observe(canvas);

    // Mouse handlers for dragging
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startMousePos.current = { x: e.clientX, y: e.clientY };
      startRotation.current = { x: rotationX.current, y: rotationY.current };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - startMousePos.current.x;
        const deltaY = e.clientY - startMousePos.current.y;
        
        rotationY.current = startRotation.current.y + deltaX * 0.007;
        rotationX.current = Math.max(
          -Math.PI / 2.5,
          Math.min(Math.PI / 2.5, startRotation.current.x - deltaY * 0.007)
        );

        velocity.current = {
          x: deltaX * 0.0002,
          y: -deltaY * 0.0002
        };
      } else {
        // Hover detection on screen hotspots
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let found: Hotspot | null = null;
        hotspotsRef.current.forEach(h => {
          if (h.visible && h.screenX && h.screenY) {
            const dx = mouseX - h.screenX;
            const dy = mouseY - h.screenY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 12) {
              found = h;
            }
          }
        });

        if (found) {
          setHoveredHotspot(found);
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          const scrollX = window.scrollX || document.documentElement.scrollLeft;
          setTooltipPos({
            x: rect.left + found.screenX! + scrollX,
            y: rect.top + found.screenY! + scrollY - 10
          });
        } else {
          setHoveredHotspot(null);
        }
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Main Draw Function
    const render = () => {
      if (!isVisible) {
        animFrame = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Rotations
      const cosY = Math.cos(rotationY.current);
      const sinY = Math.sin(rotationY.current);
      const cosX = Math.cos(rotationX.current);
      const sinX = Math.sin(rotationX.current);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw shadow glow backdrop
      const radialGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.6, centerX, centerY, radius * 1.3);
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#0F766E';
      
      radialGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
      radialGlow.addColorStop(1, 'rgba(15, 118, 110, 0.02)');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Project grid points
      const projectedGrid = sphereGridRef.current.map(p => {
        // Rotate around Y
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.x * sinY + p.z * cosY;

        // Rotate around X
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;

        return { x: x1, y: y2, z: z2 };
      });

      // Sort points by Z for correct depth sorting (back to front)
      // We will split rendering into back points, equator rings, front points
      const accentRgb = accentColor.startsWith('#') 
        ? hexToRgb(accentColor) 
        : { r: 15, g: 118, b: 110 };

      // Render back points (Z < 0)
      ctx.fillStyle = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.12)`;
      projectedGrid.forEach(p => {
        if (p.z < -20) {
          ctx.beginPath();
          ctx.arc(centerX + p.x, centerY - p.y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Render front points (Z >= -20) with outline glow circles
      ctx.fillStyle = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.55)`;
      projectedGrid.forEach(p => {
        if (p.z >= -20) {
          // calculate depth opacity
          const alpha = 0.25 + (p.z / radius) * 0.45;
          ctx.fillStyle = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(centerX + p.x, centerY - p.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Render Hotspots
      hotspotsRef.current.forEach(h => {
        // Rotate around Y
        let x1 = h.x3d * cosY - h.z3d * sinY;
        let z1 = h.x3d * sinY + h.z3d * cosY;

        // Rotate around X
        let y2 = h.y3d * cosX - z1 * sinX;
        let z2 = h.y3d * sinX + z1 * cosX;

        // Store screen projection coordinates
        h.screenX = centerX + x1;
        h.screenY = centerY - y2;
        h.visible = z2 > -10; // only visible if towards the front

        if (h.visible) {
          const depthAlpha = 0.3 + (z2 / radius) * 0.7;

          // Hotspot glow pulse ring
          const time = Date.now() * 0.003;
          const pulseRadius = 5 + Math.sin(time) * 3;

          ctx.strokeStyle = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, ${depthAlpha * 0.4})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(h.screenX, h.screenY, pulseRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Hotspot inner solid dot
          ctx.fillStyle = accentColor;
          ctx.shadowBlur = 8;
          ctx.shadowColor = accentColor;
          ctx.beginPath();
          ctx.arc(h.screenX, h.screenY, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset shadow
        }
      });

      // Sphere Outline Ring (Halo)
      ctx.strokeStyle = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.15)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Inertial/Auto rotation tick
      if (!isDragging.current) {
        rotationY.current += velocity.current.x;
        rotationX.current = Math.max(
          -Math.PI / 3,
          Math.min(Math.PI / 3, rotationX.current + velocity.current.y)
        );

        // Apply friction
        velocity.current.x *= 0.98;
        velocity.current.y *= 0.98;

        // Re-inject baseline auto rotation speed
        if (Math.abs(velocity.current.x) < 0.002) {
          velocity.current.x = 0.0012; // slow constant rotation
        }
      }

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animFrame);
      observer.disconnect();
    };
  }, []);

  // Hex to RGB parser helper
  function hexToRgb(hex: string) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 15, g: 118, b: 110 };
  }

  return (
    <div ref={containerRef} className="globe-container">
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          display: 'block'
        }}
      />
      {hoveredHotspot && (
        <div
          className="globe-tooltip glassmorphic"
          style={{
            position: 'absolute',
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 100,
            padding: '12px 16px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            fontSize: 'var(--text-xs)',
            transition: 'opacity 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 2 }}>
            {hoveredHotspot.name}
          </div>
          <div style={{ color: 'var(--accent)', fontWeight: 'var(--font-semibold)', marginBottom: 4 }}>
            {hoveredHotspot.role}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            Live Salary: <span style={{ color: 'var(--success)', fontWeight: 'var(--font-bold)' }}>{hoveredHotspot.salary}</span>
          </div>
        </div>
      )}
    </div>
  );
}
