import { makeObservable, observable } from "mobx";

import { Dictionary, getRandomHash, shallowCopy } from "@carefree0910/core";
import { ABCStore } from "@carefree0910/business";

import type { IPythonResults } from "@/schema/meta";
import type { IPythonSocketMessage } from "@/schema/_python";
import { stripHashFromIdentifier } from "@/utils/misc";

interface IDs {
  id: string;
  pureIdentifier: string;
}
export interface IPluginsStore {
  ids: Dictionary<IDs>;
  hashes: Dictionary<string>;
  messages: Dictionary<IPythonSocketMessage<IPythonResults>>;
}
class PluginsStore extends ABCStore<IPluginsStore> implements IPluginsStore {
  ids: Dictionary<IDs> = {};
  hashes: Dictionary<string> = {};
  messages: Dictionary<IPythonSocketMessage<IPythonResults>> = {};

  constructor() {
    super();
    makeObservable(this, {
      ids: observable,
      hashes: observable,
      messages: observable,
    });
  }

  get info(): IPluginsStore {
    return this;
  }
}

const pluginsStore = new PluginsStore();
// ids
export const getPluginIds = (identifier: string): IDs => {
  const pureIdentifier = stripHashFromIdentifier(identifier).replaceAll(".", "_");
  if (!pluginsStore.ids[pureIdentifier]) {
    const ids = shallowCopy(pluginsStore.ids);
    ids[pureIdentifier] = { id: `${pureIdentifier}_${getRandomHash()}`, pureIdentifier };
    pluginsStore.updateProperty("ids", ids);
  }
  return pluginsStore.ids[pureIdentifier];
};
// hashes
export const getPluginHash = (id: string): string => {
  if (!pluginsStore.hashes[id]) {
    const hashes = shallowCopy(pluginsStore.hashes);
    hashes[id] = getRandomHash().toString();
    pluginsStore.updateProperty("hashes", hashes);
  }
  return pluginsStore.hashes[id];
};
// messages
export const getPluginMessage = (id: string) => pluginsStore.messages[id];
export const updatePluginMessage = (id: string, message: IPythonSocketMessage<IPythonResults>) => {
  const messages = shallowCopy(pluginsStore.messages);
  messages[id] = message;
  pluginsStore.updateProperty("messages", messages);
};
export const removePluginMessage = (id: string) => {
  const messages = shallowCopy(pluginsStore.messages);
  delete messages[id];
  pluginsStore.updateProperty("messages", messages);
};
