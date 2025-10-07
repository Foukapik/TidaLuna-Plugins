import React from "react";

import { ReactiveStore } from "@luna/core";
import { LunaSettings, LunaNumberSetting } from "@luna/ui";

export const settings = await ReactiveStore.getPluginStorage("HorizontalVolumeSlider", {
	changeBy: 10,
	changeByShift: 5
});

export const Settings = () => {
	const [changeBy, setChangeBy] = React.useState(settings.changeBy);
	const [changeByShift, setChangeByShift] = React.useState(settings.changeByShift);

	return (
		<LunaSettings>
			<LunaNumberSetting
				title="Change by"
				desc="Seconds to rewind/fast-forward by (default: 10)"
				value={changeBy}
				min={1}
				max={60}
				onNumber={(num) => setChangeBy((settings.changeBy = num))}
			/>
			<LunaNumberSetting
				title="Change by shift"
				desc="Seconds to rewind/fast-forward by when SHIFT is held (default: 5)"
				value={changeByShift}
				min={1}
				max={60}
				onNumber={(num) => setChangeByShift((settings.changeByShift = num))}
			/>
		</LunaSettings>
	);
};
