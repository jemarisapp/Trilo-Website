import { useState, useRef, useEffect } from 'react';
import { TEAM_NAMES, getTeam } from './teams';

interface TeamSearchInputProps {
  value: string;
  onChange: (teamName: string) => void;
  excludeNames: string[];
  placeholder?: string;
}

export const TeamSearchInput = ({
  value,
  onChange,
  excludeNames,
  placeholder = 'Search team...',
}: TeamSearchInputProps) => {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = TEAM_NAMES.filter(
    (name) =>
      name.toLowerCase().includes(query.toLowerCase()) &&
      !excludeNames.includes(name)
  );

  const selectedTeam = getTeam(value);

  // Sync query when value changes externally
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        // Reset query to current value if user didn't select
        setQuery(value);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [value]);

  const handleSelect = (name: string) => {
    onChange(name);
    setQuery(name);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setQuery('');
    setOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#1a1a1a',
          border: `1px solid ${selectedTeam ? selectedTeam.primary : '#333'}`,
          borderRadius: 8,
          overflow: 'hidden',
          transition: 'border-color 0.2s',
        }}
      >
        {selectedTeam && (
          <div
            style={{
              width: 4,
              alignSelf: 'stretch',
              background: selectedTeam.primary,
              flexShrink: 0,
            }}
          />
        )}
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontSize: 13,
            padding: '8px 10px',
            fontFamily: 'inherit',
          }}
        />
        {value && (
          <button
            onClick={handleClear}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              padding: '0 8px',
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            x
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: 8,
            maxHeight: 200,
            overflowY: 'auto',
            zIndex: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        >
          {filtered.map((name) => {
            const team = getTeam(name);
            return (
              <div
                key={name}
                onMouseDown={() => handleSelect(name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: 13,
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = '#2a2a2a';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
              >
                {team && (
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: team.primary,
                      flexShrink: 0,
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  />
                )}
                {name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
