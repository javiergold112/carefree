import type { AvailablePlugins, IPluginProps } from "@/types/plugins";

import { Logger } from "@noli/core";
import { useSelecting } from "@noli/business";

import { isInvisible } from "@/stores/plugins";
import { pluginFactory } from "./utils/factory";
import { getNodeFilter } from "./utils/renderFilters";

// these lines are needed to make sure the plugins are registered
export * from "./MetaPlugin";
export * from "./Txt2ImgSDPlugin";
export * from "./SettingsPlugin";

export function makePlugin<T extends AvailablePlugins>(
  type: T,
  { requireNode, ...props }: Omit<IPluginProps[T], "node"> & { requireNode?: boolean },
) {
  if (props.follow && props.nodeConstraint === "none") {
    Logger.warn("cannot use `follow` with `targetNodeType` set to `none`");
    return null;
  }
  if (isInvisible(type)) return null;
  const Plugin = pluginFactory.get(type);
  if (!Plugin) {
    Logger.warn(`Plugin '${type}' not found`);
    return null;
  }
  let node = null;
  if (requireNode) {
    const info = useSelecting("raw");
    if (!getNodeFilter(props.nodeConstraint)(info)) return null;
    node = info.displayNode;
  }
  return <Plugin node={node} {...props} />;
}
