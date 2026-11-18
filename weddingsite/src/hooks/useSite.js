import { useEffect, useState } from 'react';
import { getSite } from '../lib/api';
import fallback from '../data/invitation.config.json';

// Returns the live config from MySQL; renders instantly with the bundled JSON, then swaps in the server copy.
export function useSite() {
  const [site, setSite] = useState({ ...fallback, memory: { enabled: false, canUpload: false, folderUrl: '' } });
  useEffect(() => {
    let alive = true;
    getSite().then(s => { if (alive) { setSite(s); if (s.couple) document.title = `${s.couple.first} & ${s.couple.second} · Wedding Invitation`; } });
    return () => { alive = false; };
  }, []);
  return site;
}
