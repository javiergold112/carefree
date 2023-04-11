import { useToast } from "@chakra-ui/toast";

import { INodePack, Lang, Matrix2D, Matrix2DFields, safeCall } from "@noli/core";
import {
  BoardStore,
  safeClearExecuterStack,
  translate,
  useGlobalTransform,
  useSafeExecute,
} from "@noli/business";

import { toast } from "@/utils/toast";
import { Toast_Words } from "@/lang/toast";
import { Requests } from "@/requests/actions";
import { IProjectsStore, useCurrentProject } from "@/stores/projects";

export async function saveProject(
  t: ReturnType<typeof useToast>,
  lang: Lang,
  onSuccess: () => Promise<void>,
): Promise<void> {
  const data = useCurrentProject();
  const graphInfo = BoardStore.graph.toJsonInfo();
  const globalTransform = useGlobalTransform().globalTransform.fields;
  toast(t, "info", translate(Toast_Words["uploading-project-message"], lang));

  return safeCall(
    async () => {
      const res = await Requests.postJson<{
        success: boolean;
        message: string;
      }>("_python", "/save_project", { graphInfo, globalTransform, ...data });
      if (!res.success) {
        toast(
          t,
          "warning",
          `${translate(Toast_Words["save-project-error-message"], lang)} - ${res.message}`,
        );
        throw Error;
      }
    },
    {
      success: onSuccess,
      failed: async () => void 0,
    },
  );
}

interface ILoadedProject extends IProjectsStore {
  graphInfo: INodePack[];
  globalTransform: Matrix2DFields;
}
export async function loadProject(
  t: ReturnType<typeof useToast>,
  lang: Lang,
  uid: string,
  onSuccess: () => Promise<void>,
): Promise<void> {
  toast(t, "info", translate(Toast_Words["loading-project-message"], lang));

  return safeCall(
    async () =>
      Requests.get<ILoadedProject>("_python", `/get_project/${uid}`).then(
        ({ graphInfo, globalTransform }) =>
          useSafeExecute("replaceGraph", null, true, {
            success: async () => {
              BoardStore.board.setGlobalTransform(new Matrix2D(globalTransform), true);
              safeClearExecuterStack();
              onSuccess();
            },
            failed: async () => void 0,
          })({ json: JSON.stringify(graphInfo), apiInfos: {} }),
      ),
    {
      success: async () => void 0,
      failed: async () => void 0,
    },
  );
}

interface IProjectItem {
  uid: string;
  name: string;
}
export async function fetchAllProjects(): Promise<IProjectItem[] | undefined> {
  return safeCall(async () => Requests.get<IProjectItem[]>("_python", "/all_projects"), {
    success: async () => void 0,
    failed: async () => void 0,
  });
}
