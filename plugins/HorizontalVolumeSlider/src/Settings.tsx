import React from "react";

import { ReactiveStore } from "@luna/core";
import { LunaSettings, LunaSwitchSetting, LunaNumberSetting } from "@luna/ui";
import { ToggleVolumeTextVisibility, ToggleMouseWheelControl } from ".";

export const settings = await ReactiveStore.getPluginStorage("HorizontalVolumeSlider", {
	showVolumeText: true,
	enableMouseWheel: true,
	changeBy: 10,
	changeByShift: 1,
});

export const Settings = () => {
	const [showVolumeText, setShowVolumeText] = React.useState(settings.showVolumeText);
	const [enableMouseWheel, setEnableMouseWheel] = React.useState(settings.enableMouseWheel);
	const [changeBy, setChangeBy] = React.useState(settings.changeBy);
	const [changeByShift, setChangeByShift] = React.useState(settings.changeByShift);

	return (
		<LunaSettings>
			<LunaSwitchSetting
				title="Display volume text"
				desc="Shows the current volume as a text next to the slider"
				checked={showVolumeText}
				onChange={(e: unknown, checked: boolean) => {
					setShowVolumeText(settings.showVolumeText = checked);
					ToggleVolumeTextVisibility(checked);
				}}
			/>
			<LunaSwitchSetting
				title="Enable mouse wheel control"
				desc="Allows changing volume by scrolling on the slider"
				checked={enableMouseWheel}
				onChange={(e: unknown, checked: boolean) => {
					setEnableMouseWheel(settings.enableMouseWheel = checked);
					ToggleMouseWheelControl(checked);
				}}
			/>
			<LunaNumberSetting
				title="Change by"
				desc="Percent to change volume by (default: 10)"
				value={changeBy}
				min={0}
				max={100}
				onNumber={(num) => setChangeBy((settings.changeBy = num))}
			/>
			<LunaNumberSetting
				title="Change by shift"
				desc="Percent to change volume by when SHIFT is held (default: 1)"
				value={changeByShift}
				onNumber={(num) => setChangeByShift((settings.changeByShift = num))}
			/>
		</LunaSettings>
	);
};
