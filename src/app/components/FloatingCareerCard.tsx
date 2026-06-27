import { useEffect, useRef, useState } from 'react';
import { Sparkles, TrendingUp, DollarSign, IndianRupee } from 'lucide-react';

interface FloatingCareerCardProps {
  title: string;
  baseSalary: number;
  currency?: 'USD' | 'INR' | 'GBP';
  demand: 'High' | 'Critical' | 'Trending';
  style?: React.CSSProperties;
  className?: string;
}

export function FloatingCareerCard({
  title,
  baseSalary,
  currency = 'USD',
  demand,
  style = {},
  className = '',
}: FloatingCareerCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ rX: 0, rY: 0, tX: 0, tY: 0 });
  const [salary, setSalary] = useState(baseSalary);
  const [isSalaryUpdated, setIsSalaryUpdated] = useState(false);

  // Live salary ticking
  useEffect(() => {
    const interval = setInterval(() => {
      // Small random increment (e.g., $1 to $4)
      const increment = Math.floor(Math.random() * 4) + 1;
      setSalary(prev => prev + increment);
      setIsSalaryUpdated(true);

      // Reset green flash animation
      const timeout = setTimeout(() => {
        setIsSalaryUpdated(false);
      }, 500);

      return () => clearTimeout(timeout);
    }, Math.random() * 2000 + 1500); // every 1.5s to 3.5s

    return () => clearInterval(interval);
  }, []);

  // Format currency
  const formatSalary = (val: number) => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(val);
    } else if (currency === 'GBP') {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        maximumFractionDigits: 0,
      }).format(val);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // 3D parallax tilt math
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center (normalized -0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Calculate rotation angles (max tilt ~12 degrees)
    const rX = -mouseY * 12;
    const rY = mouseX * 12;

    // Slight translation parallax
    const tX = mouseX * 8;
    const tY = mouseY * 8;

    setCoords({ rX, rY, tX, tY });
  };

  const handleMouseLeave = () => {
    // Reset to flat
    setCoords({ rX: 0, rY: 0, tX: 0, tY: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`floating-3d-card glassmorphic ${className}`}
      style={{
        ...style,
        transform: `perspective(1000px) rotateX(${coords.rX}deg) rotateY(${coords.rY}deg) translate3d(${coords.tX}px, ${coords.tY}px, 20px)`,
        transition: coords.rX === 0 ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
      }}
    >
      <div className="card-top">
        <span className={`card-badge-glow badge-${demand.toLowerCase()}`}>
          <Sparkles size={10} style={{ marginRight: 4 }} />
          {demand}
        </span>
        <TrendingUp size={14} className="trend-icon" />
      </div>

      <div className="card-content-wrap">
        <h4 className="card-career-title">{title}</h4>
        
        <div className="salary-counter-wrap">
          <span className="salary-label">LIVE GLOBAL SALARY</span>
          <div className={`salary-value ${isSalaryUpdated ? 'salary-grow-flash' : ''}`}>
            {currency === 'INR' ? <IndianRupee size={16} /> : <DollarSign size={16} />}
            <span>{formatSalary(salary).replace('$', '').replace('₹', '')}</span>
          </div>
        </div>
      </div>
      
      <div className="card-footer-glow" />
    </div>
  );
}
