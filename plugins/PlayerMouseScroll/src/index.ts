import { Tracer, type LunaUnload } from "@luna/core";
import { MediaItem, redux, observePromise, PlayState } from "@luna/lib";
import { settings, Settings } from "./Settings";

export const { errSignal, trace } = Tracer("[PlayerMouseScroll]");
export const unloads = new Set<LunaUnload>();
export { Settings };

let playerProgressBar: HTMLDivElement | null = null;
const playerProgressBarClass = "._interactionLayer_ca5d470";

async function handleMouseWheel(event: WheelEvent) {
    if (!playerProgressBar) return;

    const mediaItem = await MediaItem.fromPlaybackContext();
    if (!mediaItem) return;

    const songDuration = mediaItem.duration;
    if (!songDuration) return;
    
    const step = event.shiftKey ? settings.changeByShift : settings.changeBy;
    const currentPlaybackTime = PlayState.playTime;
    let newPlaybackTime = currentPlaybackTime;

    if (event.deltaY < 0) {
        newPlaybackTime = Math.min(songDuration, currentPlaybackTime + step);
    } else {
        newPlaybackTime = Math.max(0, currentPlaybackTime - step);
    }

    // Prevent skipping the song when scrolling to the very end
    if (newPlaybackTime === songDuration)
    {
        newPlaybackTime = songDuration - 1;
        redux.actions["playbackControls/PAUSE"]();
    }

    redux.actions["playbackControls/SEEK"](newPlaybackTime);
    redux.actions["playbackControls/TIME_UPDATE"](newPlaybackTime);
};

observePromise(unloads, playerProgressBarClass).then(async (progressBar) => {
    playerProgressBar = progressBar as HTMLDivElement;
    await playerProgressBar.addEventListener("wheel", handleMouseWheel);
});

unloads.add(async () => {
    if (!playerProgressBar) return;
    await playerProgressBar.removeEventListener("wheel", handleMouseWheel);
});