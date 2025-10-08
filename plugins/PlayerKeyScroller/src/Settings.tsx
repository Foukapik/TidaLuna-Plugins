import React from "react";

import { ReactiveStore } from "@luna/core";
import { LunaSettings, LunaNumberSetting } from "@luna/ui";

export const settings = await ReactiveStore.getPluginStorage("PlayerKeyScroller", {
	changeBy: 10
});

export const Settings = () => {
	const [changeBy, setChangeBy] = React.useState(settings.changeBy);

	return (
		<LunaSettings>
			<LunaNumberSetting
				title="Change by"
				desc="Seconds to rewind/fast-forward by when (default: 10)"
				value={changeBy}
				min={1}
				max={60}
				onNumber={(num: number) => setChangeBy((settings.changeBy = num))}
			/>
		</LunaSettings>
	);
};
