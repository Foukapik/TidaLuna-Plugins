import { Tracer, type LunaUnload } from "@luna/core";
import { redux, observePromise } from "@luna/lib";
import { settings, Settings } from "./Settings";

export const { errSignal, trace } = Tracer("[HorizontalVolumeSlider]");
export const unloads = new Set<LunaUnload>();
export { Settings };

let volumeText: HTMLSpanElement | null = null;
let volumeSlider: HTMLInputElement | null = null;
let defaultSliderStyle: HTMLStyleElement | null = null;
let customSliderStyles: HTMLStyleElement | null = null;

const volumeTextClass = "_toggleButton_809eee8";
const volumeContainerId = "._sliderContainer_15490c0";
const volumeLabel = "Volume";

function updateSliderVolume(slider: HTMLInputElement, volume: number): void {
    slider.value = volume.toString();
    slider.style.setProperty("--volume-percentage", `${volume}%`);
    if (volumeText) {
        volumeText.textContent = `${volume}`;
    }
};

// Create the horizontal volume slider
function createVolumeSlider(): HTMLInputElement {
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "100";
    slider.step = "1";
    slider.classList.add("horizontal-volume-slider");
    slider.setAttribute("aria-label", volumeLabel);
    slider.setAttribute("title", volumeLabel);

    slider.style.width = "86px";
    slider.style.gridColumn = "span 2";
    slider.style.appearance = "none";
    slider.style.cursor = "pointer";
    slider.style.height = "24px";
    slider.style.outline = "none";

    // Create styles for the slider thumb and track
    customSliderStyles = document.createElement("style");
    customSliderStyles.textContent = `
        .horizontal-volume-slider {
            background: transparent;
            border-radius: 2px;
            overflow: visible;
        }
        .horizontal-volume-slider::-webkit-slider-runnable-track {
            height: 4px;
            border-radius: 2px;
            background: linear-gradient(to right, white var(--volume-percentage), rgba(255, 255, 255, 0.3) var(--volume-percentage));
        }
        .horizontal-volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 3px;
            height: 12px;
            background: white;
            border-radius: 1px;
            cursor: pointer;
            margin-top: -4px;
        }
    `;
    document.head.appendChild(customSliderStyles);

    // Get initial state and setup volume handling
    const initialState = redux.store.getState().playbackControls;
    const initialVolume = initialState.muted ? 0 : initialState.volume;
    updateSliderVolume(slider, initialVolume);

    // Handle slider input
    slider.addEventListener("input", (e) => {
        const volume = parseInt((e.target as HTMLInputElement).value);
        updateSliderVolume(slider, volume);
        redux.actions["playbackControls/SET_VOLUME"]({ volume });
    });

    return slider;
};

observePromise(unloads, volumeContainerId).then((volumeContainer) => {
    if (volumeSlider) return;

    volumeSlider = createVolumeSlider();
    ToggleMouseWheelControl(settings.enableMouseWheel);
    
    // Volume text display element
    volumeText = document.createElement('span');
    volumeText.classList.add(volumeTextClass);
    volumeText.style.minWidth = '36px';
    volumeText.textContent = `${volumeSlider.value}`;
    ToggleVolumeTextVisibility(settings.showVolumeText);

    (volumeContainer as HTMLDivElement).after(volumeText);
    (volumeContainer as HTMLDivElement).after(volumeSlider);

    // Hide the default volume slider when hovering
    defaultSliderStyle = document.createElement("style");
    defaultSliderStyle.textContent = `
        ._nativeRange_9da520a { 
            display: none !important; 
        }
    `;
    document.head.appendChild(defaultSliderStyle);

    // Update slider when volume changes from other sources (keyboard shortcuts, mute)
    redux.intercept("playbackControls/SET_VOLUME", unloads, ({ volume }) => {
        if (!volumeSlider) return;
        if (volumeSlider.value !== volume.toString()) {
            updateSliderVolume(volumeSlider, volume);
        }
	});
});

// Remove the slider and restore default behavior on unload
unloads.add(() => {
    volumeSlider?.remove();
    volumeText?.remove();
    defaultSliderStyle?.remove();
    customSliderStyles?.remove();
    volumeSlider = null;
    volumeText = null;
    defaultSliderStyle = null;
    customSliderStyles = null;
});

function handleMouseWheel(event: WheelEvent) {
    if (!volumeSlider) return;
    const step = 10;
    const currentVolume = parseInt(volumeSlider.value);
    let newVolume = currentVolume;

    if (event.deltaY < 0) {
        newVolume = Math.min(100, currentVolume + step);
    } else {
        newVolume = Math.max(0, currentVolume - step);
    }

    if (newVolume !== currentVolume) {
        updateSliderVolume(volumeSlider, newVolume);
        redux.actions["playbackControls/SET_VOLUME"]({ volume: newVolume });
    }
};

//// Settings related functions 
export function ToggleVolumeTextVisibility(checked?: boolean) {
    if (!volumeText) return;
    checked ? volumeText.style.removeProperty("display") : volumeText.style.display = "none";
};

export function ToggleMouseWheelControl(checked?: boolean) {
    if (!volumeSlider) return;
    if (checked) {
        volumeSlider.addEventListener("wheel", handleMouseWheel);
    } else {
        volumeSlider.removeEventListener("wheel", handleMouseWheel);
    }
};