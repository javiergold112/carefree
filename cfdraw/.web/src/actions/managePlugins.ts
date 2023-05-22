import { runInAction } from "mobx";

import type { ReactPlugins } from "@/schema/plugins";
import { reactPluginSettings } from "@/_settings";
import { usePythonPluginSettings } from "@/stores/settings";
import {
  setPluginExpanded,
  usePluginsExpanded,
  setReactPluginVisible,
  setPythonPluginVisible,
  usePluginIds,
} from "@/stores/pluginsInfo";

interface IExcepts {
  exceptReactPlugins?: ReactPlugins[];
  exceptIdentifiers?: string[];
}

function setAllPluginVisible(visible: boolean, opt?: IExcepts) {
  opt ??= {};
  runInAction(() => {
    reactPluginSettings.forEach(({ type }) => {
      if (opt?.exceptReactPlugins?.includes(type)) return;
      if (!["settings", "undo", "redo"].includes(type)) {
        setReactPluginVisible(type, visible);
      }
    });
    usePythonPluginSettings().forEach(({ props }) => {
      const identifier = props.pluginInfo.identifier;
      if (opt?.exceptIdentifiers?.includes(identifier)) return;
      setPythonPluginVisible(identifier, visible);
    });
  });
}

export function collapseAllPlugins(opt?: IExcepts) {
  runInAction(() => {
    Object.keys(usePluginsExpanded()).forEach((id) => {
      if (
        opt?.exceptReactPlugins &&
        opt.exceptReactPlugins.some((type) => usePluginIds(type).id === id)
      ) {
        return;
      }
      if (
        opt?.exceptIdentifiers &&
        opt.exceptIdentifiers.some((identifier) => usePluginIds(identifier).id === id)
      ) {
        return;
      }
      setPluginExpanded(id, false);
    });
  });
}
export function hideAllPlugins(opt?: IExcepts) {
  // collapse all plugins first
  collapseAllPlugins(opt);
  // then hide all plugins
  setAllPluginVisible(false, opt);
}
export function showAllPlugins() {
  setAllPluginVisible(true);
}
