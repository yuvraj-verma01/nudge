export function NudgeMark({ small = false }: { small?: boolean }) {
  return <span className={`mosaic-mark ${small ? 'small' : ''}`} aria-hidden="true"><i /><i /><i /><i /></span>;
}

export function MoodFace({ mood, selected = false }: { mood: string; selected?: boolean }) {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={`mood-face ${selected ? 'selected' : ''}`}><circle cx="16" cy="16" r="13" fill="currentColor" fillOpacity=".09" stroke="currentColor" strokeWidth="1.3" />
    {mood === 'Tired' ? <><path d="m8 12 5 2m6 0 5-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><ellipse cx="16" cy="22" rx="2.2" ry="3" stroke="currentColor" strokeWidth="1.3" /></> : <>
      {mood === 'Stressed' || mood === 'Overwhelmed' ? <path d="m8 10 5 2m6 0 5-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /> : null}
      <circle cx="11" cy="14" r="1.1" fill="currentColor" /><circle cx="21" cy="14" r="1.1" fill="currentColor" />
      {mood === 'Good' ? <path d="M11 20c3 4 7 4 10 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /> : mood === 'Fine' ? <path d="M12 22h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /> : mood === 'Stressed' ? <path d="M12 23c2-3 6-3 8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /> : <path d="m10 23 3-2 3 2 3-2 3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
    </>}
  </svg>;
}
