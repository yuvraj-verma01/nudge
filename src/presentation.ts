import { Activity, BookOpen, Camera, Film, Footprints, Gamepad2, Music2, Palette, TreePine, Users, Wind } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Action, Interest } from './engine';
export const interestIcons: Record<Interest, LucideIcon> = { Music: Music2, 'Talking to a friend': Users, 'Playing musical instruments': Music2, Reading: BookOpen, 'Watching something': Film, Gaming: Gamepad2, 'Creative hobbies': Palette, 'Going outside': TreePine, 'Quiet / mindfulness': Wind };
export const interestLabel = (interest: Interest) => interest;
export const actionIcons: Record<string, LucideIcon> = { move: Activity, footprints: Footprints, music: Music2, users: Users, book: BookOpen, film: Film, game: Gamepad2, palette: Palette, tree: TreePine, wind: Wind, camera: Camera };
export const actionTitle = (action: Action) => action.title;
export const actionInstruction = (action: Action) => action.description;
