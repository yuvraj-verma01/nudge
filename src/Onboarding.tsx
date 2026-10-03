import { useEffect, useRef, useState } from 'react';
import { Activity, ArrowLeft, ArrowRight, CalendarDays, Check, Heart, Leaf, Link2, X } from 'lucide-react';
import { movementInterests, rechargeInterests } from './engine';
import type { Interest, MovementInterest } from './engine';
import { interestIcons } from './presentation';
import { NudgeMark } from './Illustrations';
import './flow-polish.css';
export type OnboardingData = { name: string; goals: string[]; interests: Interest[]; movementPreferences: MovementInterest[]; calendar: boolean; movement: boolean; mode: 'sample' | 'personal' };
const goals = ['Move regularly', 'Break up sitting', 'Feel more energised', 'Unwind', 'Make time for what I enjoy', 'Stay connected'];
const goalAliases: Record<string, string> = { 'Feel more physically awake': 'Feel more energised', 'Make time for things I enjoy': 'Make time for what I enjoy' };
type Draft = OnboardingData & { step: number };
export function Onboarding({ onComplete, initialData, onExit }: { onComplete: (data: OnboardingData) => void; initialData?: OnboardingData; onExit?: () => void }) {
  const [draft, setDraft] = useState<Draft>(() => {
    const fallback: Draft = { name: '', goals: [], interests: [], movementPreferences: [], calendar: false, movement: false, ...initialData, step: 0, mode: 'personal' };
    try {
      const saved = JSON.parse(localStorage.getItem('mosaic-setup-v3') || 'null');
      return saved && [0, 1, 2, 3].includes(saved.step) ? {
        ...fallback, step: saved.step,
        name: typeof saved.name === 'string' ? saved.name.slice(0, 24) : fallback.name,
        goals: Array.isArray(saved.goals) ? [...new Set<string>(saved.goals.filter((goal: unknown): goal is string => typeof goal === 'string').map((goal: string) => goalAliases[goal] || goal).filter((goal: string) => goals.includes(goal)))] : fallback.goals,
        interests: Array.isArray(saved.interests) ? [...new Set<Interest>(saved.interests.filter((interest: Interest) => rechargeInterests.includes(interest)))] : fallback.interests,
        movementPreferences: Array.isArray(saved.movementPreferences) ? [...new Set<MovementInterest>(saved.movementPreferences.filter((movement: MovementInterest) => movementInterests.includes(movement)))] : fallback.movementPreferences,
        calendar: typeof saved.calendar === 'boolean' ? saved.calendar : fallback.calendar,
        movement: typeof saved.movement === 'boolean' ? saved.movement : fallback.movement,
      } : fallback;
    } catch { return fallback; }
  });
  const heading = useRef<HTMLHeadingElement>(null);
  const scroller = useRef<HTMLElement>(null);
  useEffect(() => { try { localStorage.setItem('mosaic-setup-v3', JSON.stringify(draft)); } catch { /* Optional storage. */ } }, [draft]);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); scroller.current?.scrollTo({ top: 0 }); }, [draft.step]);
  const finish = (mode: 'sample' | 'personal') => { try { localStorage.removeItem('mosaic-setup-v3'); } catch { /* Optional storage. */ } onComplete({ ...draft, mode }); };
  const toggle = <T extends string,>(items: T[], item: T) => items.includes(item) ? items.filter(value => value !== item) : [...items, item];
  return <main className={`onboarding setup-${draft.step}`} ref={scroller} aria-label="Welcome to Nudge">
    <header className="setup-header"><span className="brand"><NudgeMark />Nudge</span><div className="setup-header-controls">{draft.step > 0 && <span className="setup-count" aria-label={`Setup step ${draft.step} of 3`}>{draft.step} / 3</span>}{onExit && <button className="icon-button" aria-label="Close introduction" onClick={onExit}><X size={21} aria-hidden="true" /></button>}</div></header>
    {draft.step > 0 && <div className="setup-progress" aria-hidden="true">{[1, 2, 3].map(step => <i key={step} className={draft.step >= step ? 'filled' : ''} />)}</div>}
    <div className="setup-content moment-enter" key={draft.step}>
      {draft.step === 0 && <>
        <p className="eyebrow">A LITTLE CARE, IN REAL LIFE</p>
        <h1 className="welcome-title" tabIndex={-1} ref={heading}>Care for your body.<br /><span>Make room for your mind.</span></h1>
        <p className="setup-copy">Small actions for your body and mind, fitted around your actual day.</p>
        <div className="welcome-art" aria-hidden="true"><div className="art-body"><Activity size={42} strokeWidth={1.2} /><span>Move</span></div><div className="art-mind"><Leaf size={42} strokeWidth={1.2} /><span>Recharge</span></div><span className="art-join"><NudgeMark small /></span></div>
      </>}
      {draft.step === 1 && <>
        <p className="eyebrow">YOUR INTENTIONS</p><h1 ref={heading} tabIndex={-1}>What would you like more of?</h1><p className="setup-copy">Choose what matters to you.</p>
        <div className="goal-list">{goals.map((goal, index) => <button key={goal} aria-pressed={draft.goals.includes(goal)} onClick={() => setDraft({ ...draft, goals: toggle(draft.goals, goal) })}>{index < 3 ? <Activity size={20} /> : <Heart size={20} />}<span>{goal}</span><span className="choice-check">{draft.goals.includes(goal) && <Check size={15} />}</span></button>)}</div>
        <label className="field-label">Your first name <span className="optional">Optional</span><input autoComplete="given-name" maxLength={24} placeholder="What should we call you?" value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} /></label>
      </>}
      {draft.step === 2 && <>
        <p className="eyebrow">YOUR KIND OF CARE</p><h1 ref={heading} tabIndex={-1}>What actually works for you?</h1><p className="setup-copy">Choose the activities you enjoy.</p>
        <fieldset className="choices-field"><legend>Movement you don’t mind</legend><div className="choice-grid">{movementInterests.map(item => <button key={item} aria-pressed={draft.movementPreferences.includes(item)} onClick={() => setDraft({ ...draft, movementPreferences: toggle(draft.movementPreferences, item) })}><Activity size={18} /><span>{item}</span>{draft.movementPreferences.includes(item) && <Check size={14} />}</button>)}</div></fieldset>
        <fieldset className="choices-field"><legend>What helps you recharge</legend><div className="choice-grid">{rechargeInterests.map(item => { const Icon = interestIcons[item]; return <button key={item} aria-pressed={draft.interests.includes(item)} onClick={() => setDraft({ ...draft, interests: toggle(draft.interests, item) })}><Icon size={18} /><span>{item}</span>{draft.interests.includes(item) && <Check size={14} />}</button>; })}</div></fieldset>
      </>}
      {draft.step === 3 && <>
        <p className="eyebrow">YOUR DAY, IN CONTEXT</p><h1 ref={heading} tabIndex={-1}>Give Nudge more context.</h1><p className="setup-copy">Find a small action that fits your day. Both connections are optional.</p>
        {[{ key: 'calendar' as const, title: 'Calendar', Icon: CalendarDays, copy: 'Meetings, focus time and free gaps help Nudge choose a better moment.', inputs: ['Meetings', 'Free gaps', 'Focus time'] }, { key: 'movement' as const, title: 'Health data', Icon: Activity, copy: 'Sleep, steps and recent movement help Nudge understand how your day is going.', inputs: ['Sleep', 'Steps', 'Activity'] }].map(({ key, title, Icon, copy, inputs }) => <article className="connection setup-connection" key={key}><span className="section-icon"><Icon size={22} /></span><h2>{title}<span className="connection-status">Sample data</span></h2><p>{copy}</p><ul className="connection-inputs" aria-label={`${title} context`}>{inputs.map(input => <li key={input}>{input}</li>)}</ul><button className={draft[key] ? 'secondary' : 'primary'} onClick={() => setDraft({ ...draft, [key]: !draft[key] })} aria-pressed={draft[key]}>{draft[key] ? <><Check size={17} />Sample connected</> : <><Link2 size={17} />Use sample {key === 'calendar' ? 'calendar' : 'health data'}</>}</button></article>)}
        <p className="source-note">Try sample connections here. Your actual calendar and health data stay untouched.</p>
        <div className="navigation-intro"><strong>Your three places</strong><p><b>Today</b> for a small action. <b>Rhythm</b> for what works. <b>You</b> for preferences and control.</p></div>
      </>}
    </div>
    <footer className="setup-footer">{draft.step === 0 ? <><button className="primary" onClick={() => finish('sample')}>Try sample day<ArrowRight size={18} /></button><button className="secondary" onClick={() => setDraft({ ...draft, step: 1 })}>Set up Nudge</button><p className="source-note">A sample day. One small action. See how Nudge adapts.</p></> : <><button className="primary" onClick={() => draft.step === 3 ? finish('personal') : setDraft({ ...draft, step: draft.step + 1 })}>{draft.step === 3 ? 'Start my day' : 'Continue'}<ArrowRight size={18} /></button><div className="setup-footer-row"><button className="plain" onClick={() => setDraft({ ...draft, step: draft.step - 1 })}><ArrowLeft size={16} />Back</button>{draft.step < 3 && <button className="plain" onClick={() => setDraft({ ...draft, step: draft.step + 1 })}>Skip for now</button>}</div></>}</footer>
  </main>;
}
