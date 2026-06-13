import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Sparkles, Compass, ChevronDown } from 'lucide-react';

type Theme = 'light' | 'dark' | 'cosmic' | 'blueprint';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('careerpath-theme') as Theme;
    if (saved && ['light', 'dark', 'cosmic', 'blueprint'].includes(saved)) {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    localStorage.setItem('careerpath-theme', theme);
  }, [theme]);

  // Click outside handler to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions = [
    { id: 'light' as Theme, label: 'Light', Icon: Sun, desc: 'Clean slate theme' },
    { id: 'dark' as Theme, label: 'Dark', Icon: Moon, desc: 'Sleek dark theme' },
    { id: 'cosmic' as Theme, label: 'Cosmic', Icon: Sparkles, desc: 'Constellations & space' },
    { id: 'blueprint' as Theme, label: 'Blueprint', Icon: Compass, desc: 'Technical drafting grid' },
  ];

  const CurrentIcon = themeOptions.find(t => t.id === theme)?.Icon || Sun;

  return (
    <div className="theme-select-container" ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        className="theme-select-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select theme"
        title="Change theme"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-1) var(--space-3)',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          fontWeight: 'var(--font-medium)',
          fontSize: 'var(--text-xs)',
          transition: 'all var(--transition-fast)',
          height: '36px',
        }}
      >
        <CurrentIcon style={{ width: 16, height: 16 }} />
        <span style={{ textTransform: 'capitalize' }}>{theme}</span>
        <ChevronDown style={{ width: 14, height: 14, opacity: 0.7, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform var(--transition-fast)' }} />
      </button>

      {isOpen && (
        <div
          className="theme-select-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + var(--space-2))',
            right: 0,
            zIndex: 1000,
            width: '240px',
            backgroundColor: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-2)',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {themeOptions.map((option) => {
            const OptIcon = option.Icon;
            const isSelected = theme === option.id;
            return (
              <button
                key={option.id}
                onClick={() => {
                  setTheme(option.id);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-2) var(--space-3)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--accent-bg)' : 'transparent',
                  color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                  width: '100%',
                }}
                className={`theme-option-item ${isSelected ? 'selected' : ''}`}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--accent)' : 'var(--surface-hover)',
                    color: isSelected ? 'var(--text-inverse)' : 'var(--text-secondary)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <OptIcon style={{ width: 14, height: 14 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>
                    {option.label}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {option.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
