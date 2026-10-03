import { ExternalLink, Music } from 'lucide-react';
import type { SpotifyTrack } from './spotify';
import './music.css';
export function MusicCard({ track, focused = false }: { track: SpotifyTrack; focused?: boolean }) {
  return <div className={`music-card${focused ? ' music-focused' : ''}`}>
    <img src={track.artworkUrl} alt={`${track.title} cover artwork`} width={focused ? 144 : 64} height={focused ? 144 : 64} />
    <div className="music-content">{!focused && <p className="music-source">{track.sourceLabel}</p>}<h3>{track.title}</h3><p className="music-artist">{track.artist}</p><p className="spotify-indicator"><Music size={12} aria-hidden="true" />Spotify · Demo connection</p></div>
    <a className="music-link" href={track.externalUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${track.title} in Spotify`}>Open in Spotify<ExternalLink size={14} aria-hidden="true" /></a>
  </div>;
}
