import type { TextareaProps } from "@chakra-ui/react";

import type { Dictionary, INode, Matrix2DFields } from "@carefree0910/core";

import type { IMetaInjections } from "@/stores/meta";
import type { IElapsedTimes, IMeta, IPythonResults } from "./meta";
import type { PythonPlugins, IMakePlugin, IPlugin, IPluginInfo } from "./plugins";
import type { IDefinitions } from "./fields";
import type { IStr } from "./misc";

// general

interface IPythonPluginInfo extends IPluginInfo, IPythonSocketIntervals {
  name?: IStr;
  identifier: string;
  noErrorToast?: boolean;
}
export interface IPythonPlugin extends IPlugin {
  pluginInfo: IPythonPluginInfo;
}
interface IPythonCallbacks {
  getExtraRequestData?: () => Dictionary<any>;
}
export interface IUsePythonInfo extends IPythonPluginInfo, IPythonCallbacks {
  isInvisible: boolean;
  needExportNodeData: boolean;
}
export interface INodeData {
  type?: INode["type"];
  // transform info
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  z?: number;
  transform?: Matrix2DFields;
  // text info
  text?: string;
  // image info
  src?: string;
  // meta
  meta?: IMeta;
  // children, in case this is a `Group`
  children?: INodeData[];
}

// plugin

export interface IPythonPluginGroup extends IPythonPlugin {
  pluginInfo: IPythonPluginInfo & {
    header?: IStr;
    plugins: IMakePlugin<PythonPlugins>[];
  };
}

export interface IUseOnPythonPluginMessage {
  id: string;
  pluginInfo: IPythonPluginInfo & IPythonPluginWithSubmitPluginInfo;
  onIntermediate?: OnPythonPluginMessage;
  onFinished: OnPythonPluginMessage;
}
export type OnPythonPluginMessage = (message: IPythonPluginMessage) => void;
export interface IPythonSocketPluginWithSubmit
  extends Omit<IPythonPlugin, "id" | "pluginInfo">,
    Omit<IPythonSocketCallbacks<IPythonResults>, "getMessage" | "onMessage">,
    IUseOnPythonPluginMessage {
  id: string;
  buttonText: string;
  getInjections?: () => IMetaInjections;
}

interface IPythonPluginWithSubmitPluginInfo {
  closeOnSubmit?: boolean;
  toastOnSubmit?: boolean;
  toastMessageOnSubmit?: IStr;
}
export interface IPythonFieldsPlugin extends IPythonPlugin {
  pluginInfo: IPythonPluginInfo &
    IPythonPluginWithSubmitPluginInfo & {
      header?: IStr;
      definitions: IDefinitions;
      numColumns?: number;
    };
}
export interface IPythonWorkflowPlugin extends IPythonPlugin {
  pluginInfo: Omit<IPythonFieldsPlugin["pluginInfo"], "definitions">;
}
export interface IPythonTextAreaPlugin extends IPythonPlugin {
  pluginInfo: IPythonPluginInfo & {
    textAlign?: TextareaProps["textAlign"];
  };
}
export interface IPythonQAPlugin extends IPythonPlugin {
  pluginInfo: IPythonPluginInfo & {
    initialText: IStr;
  };
}
export interface IPythonChatPlugin extends IPythonPlugin {
  pluginInfo: IPythonPluginInfo & {
    initialText: IStr;
  };
}

// web

export interface IPythonSocketRequest {
  hash: string;
  userId: string;
  userJson?: string;
  baseURL: string;
  identifier: string;
  nodeData: INodeData;
  nodeDataList: INodeData[];
  extraData: Dictionary<any>;
  isInternal?: boolean;
}
export type IPythonOnSocketMessage<R> = (data: IPythonSocketMessage<R>) => Promise<
  | {
      newMessage?: () => Promise<IPythonSocketRequest>;
      /**
       * message generated by `newMessage` will be sent after `newMessageInterval` ms
       *
       * > if `newMessageInterval` is not provided, default `interval` (which is 1000)
       * will be used, which means the message will be sent after 1000ms by default.
       * > if you want to send the new message immediately, you can set it to 0.
       */
      newMessageInterval?: number;
    }
  | undefined
>;
export type IPythonOnPluginMessage = IPythonOnSocketMessage<IPythonResults>;
export interface IPythonSocketIntervals {
  // if set, will retry in `retryInterval` ms when exception occurred
  retryInterval?: number;
  // if set, will re-send message every `updateInterval` ms
  updateInterval?: number;
}
export interface IPythonSocketCallbacks<R> extends IPythonCallbacks, IPythonSocketIntervals {
  getMessage: () => Promise<IPythonSocketRequest>;
  onMessage: IPythonOnSocketMessage<R>;
  onSocketError?: (err: any) => void;
}

export type PythonSocketStatus = "pending" | "working" | "finished" | "exception" | "interrupted";
interface IPythonSocketIntermediate {
  imageList?: string[]; // intermediate images, if any
  textList?: string[]; // intermediate texts, if any
}
export interface IPythonSocketResponse<R> {
  progress?: number; // progress of current task, should be within [0, 1]
  intermediate?: IPythonSocketIntermediate;
  final?: R;
  injections?: IMetaInjections;
  elapsedTimes?: IElapsedTimes;
}
export interface IPythonSocketMessage<R> {
  hash: string;
  status: PythonSocketStatus;
  total: number;
  pending: number;
  message: string;
  data: IPythonSocketResponse<R>;
}
export interface IPythonPluginMessage extends IPythonSocketMessage<IPythonResults> {}
export interface IUseSocketPython<R>
  extends IUsePythonInfo,
    Omit<IPythonSocketCallbacks<R>, "getMessage"> {
  hash?: string;
}
