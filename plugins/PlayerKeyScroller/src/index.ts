import { Tracer, type LunaUnload } from "@luna/core";
import { MediaItem, redux, observePromise, PlayState } from "@luna/lib";
import { settings, Settings } from "./Settings";

export const { errSignal, trace } = Tracer("[PlayerKeyScroller]");
export const unloads = new Set<LunaUnload>();
export { Settings };

let initialized = false;

async function handleKeyDown(event: KeyboardEvent) {
    if (!event.shiftKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    const mediaItem = await MediaItem.fromPlaybackContext();
    if (!mediaItem) return;

    const songDuration = mediaItem.duration;
    if (!songDuration) return;

    const step = settings.changeBy;
    const currentPlaybackTime = PlayState.playTime;
    let newPlaybackTime = currentPlaybackTime;

    if (event.key === 'ArrowRight') {
        newPlaybackTime = Math.min(songDuration, currentPlaybackTime + step);
    } else {
        newPlaybackTime = Math.max(0, currentPlaybackTime - step);
    }

    // Prevent skipping the song when jumping to the very end
    if (newPlaybackTime === songDuration) {
        newPlaybackTime = songDuration - 1;
        redux.actions["playbackControls/PAUSE"]();
    }

    redux.actions["playbackControls/SEEK"](newPlaybackTime);
    redux.actions["playbackControls/TIME_UPDATE"](newPlaybackTime);
};

function initializeKeyboardControls() {
    if (initialized) return;
    document.addEventListener('keydown', handleKeyDown);
    initialized = true;
}

observePromise(unloads, "body").then(() => {
    initializeKeyboardControls();
});

unloads.add(() => {
    document.removeEventListener('keydown', handleKeyDown);
    initialized = false;
});