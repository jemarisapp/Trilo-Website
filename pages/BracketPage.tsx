import React, { useState } from 'react';
import { BracketTool } from '../src/components/BracketTool';
import { BracketImageUpload } from '../src/components/BracketImageUpload';
import { saveToStorage, emptyPicks } from '../src/components/bracketUtils';
import { SeedAssignments } from '../src/components/bracket.types';

export const BracketPage: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  // Incrementing this key forces BracketTool to remount and re-read from localStorage
  const [mountKey, setMountKey] = useState(0);

  const handleSeedsDetected = (seeds: SeedAssignments) => {
    // Persist seeds to localStorage so BracketTool picks them up on remount
    saveToStorage(seeds, emptyPicks());
    setShowUpload(false);
    // Remount BracketTool so it reads fresh state from localStorage
    setMountKey((k) => k + 1);
  };

  return (
    <div style={{ width: '100%', padding: 0, margin: 0, paddingTop: '72px' }}>
      {/* Main bracket tool — key forces remount when seeds are applied from image */}
      <BracketTool key={mountKey} onScanImage={() => setShowUpload(true)} />

      {/* Upload modal */}
      {showUpload && (
        <BracketImageUpload
          onSeedsDetected={handleSeedsDetected}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  );
};

