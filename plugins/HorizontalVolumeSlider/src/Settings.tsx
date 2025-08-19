import React from "react";

import { ReactiveStore } from "@luna/core";
import { LunaSettings, LunaSwitchSetting } from "@luna/ui";
import { ToggleVolumeTextVisibility, ToggleMouseWheelControl } from ".";

export const settings = await ReactiveStore.getPluginStorage("HorizontalVolumeSlider", {
	showVolumeText: true,
	enableMouseWheel: true,
});

export const Settings = () => {
	const [showVolumeText, setShowVolumeText] = React.useState(settings.showVolumeText);
	const [enableMouseWheel, setEnableMouseWheel] = React.useState(settings.enableMouseWheel);

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
		</LunaSettings>
	);
};
