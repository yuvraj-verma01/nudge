import { assetUrl } from './assets';
import type { Action, State } from './engine';
export type MusicSource = 'recent' | 'playlist' | 'taste';
export interface SpotifyTrack { id: string; title: string; artist: string; artworkUrl: string; sourceLabel?: string; externalUrl: string; durationSeconds: number }
export interface SpotifyPlaylist { id: string; name: string; tracks: SpotifyTrack[] }
export interface SpotifyContext { connected: boolean; demoMode: boolean; source: MusicSource; recentTracks: SpotifyTrack[]; playlists: SpotifyPlaylist[] }
export const sampleTracks: SpotifyTrack[] = [
  { id: '0G21yYKMZoHa30cYVi1iA8', title: 'Welcome To The Jungle', artist: "Guns N’ Roses", artworkUrl: assetUrl('artwork/gnr.jpg'), externalUrl: 'https://open.spotify.com/track/0G21yYKMZoHa30cYVi1iA8', durationSeconds: 273 },
  { id: '6GGtHZgBycCgGBUhZo81xe', title: 'Say Yes To Heaven', artist: 'Lana Del Rey', artworkUrl: assetUrl('artwork/lana.jpg'), externalUrl: 'https://open.spotify.com/track/6GGtHZgBycCgGBUhZo81xe', durationSeconds: 209 },
  { id: '0yrCxEoGU4cV3CGr0sc65J', title: 'Nikamma', artist: 'Lifafa', artworkUrl: assetUrl('artwork/lifafa.jpg'), externalUrl: 'https://open.spotify.com/track/0yrCxEoGU4cV3CGr0sc65J', durationSeconds: 212 },
];
export const sampleTrack = sampleTracks[0];
export function selectedTrack(context: SpotifyContext): SpotifyTrack { return sampleTracks[context.source === 'playlist' ? 1 : context.source === 'taste' ? 2 : 0]; }
export const sourceLabels: Record<MusicSource, { label: string; copy: string }> = {
  recent: { label: 'Recently played', copy: 'Something familiar? One you’ve had on repeat recently.' },
  playlist: { label: 'From your Chill playlist', copy: 'Take one song before getting back to things.' },
  taste: { label: 'Based on what you listen to', copy: 'Feels like your kind of reset. Based on music you’ve been listening to lately.' },
};
export function sampleSpotify(connected = true, source: MusicSource = 'recent'): SpotifyContext { return { connected, demoMode: true, source, recentTracks: sampleTracks.map(track => ({ ...track })), playlists: [{ id: 'sample-chill', name: 'Chill', tracks: sampleTracks.slice(1).map(track => ({ ...track })) }] }; }
export function restoreSpotify(value: unknown, defaultConnected: boolean): SpotifyContext {
  const saved = value && typeof value === 'object' ? value as Partial<SpotifyContext> : null;
  // This prototype has no OAuth session: stored content always remains explicitly sample data.
  return sampleSpotify(typeof saved?.connected === 'boolean' ? saved.connected : defaultConnected, saved?.source && ['recent', 'playlist', 'taste'].includes(saved.source) ? saved.source : 'recent');
}
export function musicFor(state: State, action?: Action | null): SpotifyTrack | undefined {
  const track = selectedTrack(state.spotify);
  if (!state.spotify.connected || !action || action.domain !== 'recharge' || action.interest !== 'Music' || action.duration * 60 + .01 < track.durationSeconds) return;
  return { ...track, sourceLabel: sourceLabels[state.spotify.source].label };
}
