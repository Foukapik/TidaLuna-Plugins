import React from "react";

import { ReactiveStore } from "@luna/core";
import { LunaSettings, LunaSwitchSetting } from "@luna/ui";
import { ToggleVolumeTextVisibility } from ".";

export const settings = await ReactiveStore.getPluginStorage("HorizontalVolumeSlider", {
	showVolumeText: true,
});

export const Settings = () => {
	const [showVolumeText, setShowVolumeText] = React.useState(settings.showVolumeText);

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
		</LunaSettings>
	);
};
