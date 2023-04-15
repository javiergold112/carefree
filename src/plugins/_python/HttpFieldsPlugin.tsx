import { useMemo, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { CloseIcon } from "@chakra-ui/icons";
import { Flex, Spacer, useToast } from "@chakra-ui/react";

import { Dictionary, getRandomHash } from "@noli/core";
import { langStore, translate } from "@noli/business";

import type { IMeta, IPythonHttpFieldsResponse } from "@/schema/meta";
import type { IPythonHttpFieldsPlugin, IPythonResponse } from "@/schema/_python";
import { UI_Words } from "@/lang/ui";
import { Toast_Words } from "@/lang/toast";
import { toast } from "@/utils/toast";
import { stripHashFromIdentifier, titleCaseWord } from "@/utils/misc";
import { importMeta } from "@/actions/importMeta";
import { getMetaField } from "@/stores/meta";
import { drawboardPluginFactory } from "@/plugins/utils/factory";
import { CFHeading } from "@/components/CFHeading";
import PythonHttpPluginWithSubmit from "./HttpPluginWithSubmit";
import { useDefinitions } from "../components/Fields";
import { floatingControlEvent } from "../components/Floating";

const PythonHttpFieldsPlugin = ({ pluginInfo, ...props }: IPythonHttpFieldsPlugin) => {
  const t = useToast();
  const lang = langStore.tgt;
  const definitions = pluginInfo.definitions;
  const getExtraRequestData = useMemo(
    () => () => {
      const data: Dictionary<any> = {};
      Object.keys(definitions).forEach((field) => {
        data[field] = getMetaField(field);
      });
      return data;
    },
    [definitions],
  );
  const pureIdentifier = useMemo(
    () => stripHashFromIdentifier(pluginInfo.identifier),
    [pluginInfo.identifier],
  );
  const currentMeta = useMemo(() => {
    const node = pluginInfo.node;
    let currentMeta: IMeta | undefined;
    if (node && node.type !== "group") {
      currentMeta = node.params.meta as IMeta;
    }
    return currentMeta;
  }, [pluginInfo.node]);
  const id = useMemo(
    () => `${pureIdentifier.replaceAll(".", "_")}_${getRandomHash()}`,
    [pureIdentifier],
  );
  const emitClose = useCallback(() => floatingControlEvent.emit({ id, expand: false }), [id]);

  async function onUseHttpPythonSuccess({
    data: { _duration, ...response },
  }: IPythonResponse<IPythonHttpFieldsResponse>) {
    importMeta({
      t,
      lang,
      type: "python.httpFields",
      metaData: {
        identifier: pureIdentifier,
        parameters: getExtraRequestData(),
        response,
        duration: _duration,
        from: currentMeta,
      },
    });
  }
  async function onUseHttpPythonError(err: any) {
    toast(t, "error", `${translate(Toast_Words["submit-task-error-message"], lang)} - ${err}`);
  }

  const header = pluginInfo.header ?? titleCaseWord(pureIdentifier);
  return (
    <PythonHttpPluginWithSubmit
      id={id}
      buttonText={translate(UI_Words["submit-task"], lang)}
      getExtraRequestData={getExtraRequestData}
      onUseHttpPythonSuccess={onUseHttpPythonSuccess}
      onUseHttpPythonError={onUseHttpPythonError}
      pluginInfo={pluginInfo}
      {...props}>
      <Flex>
        <CFHeading>{header}</CFHeading>
        <Spacer />
        <CloseIcon w="12px" cursor="pointer" onClick={emitClose} />
      </Flex>
      {Object.keys(definitions).length > 0 && (
        <Flex p="12px" gap="12px" flexWrap="wrap" alignItems="center" justifyContent="space-around">
          {useDefinitions(definitions, pluginInfo.numColumns)}
        </Flex>
      )}
    </PythonHttpPluginWithSubmit>
  );
};

const _ = observer(PythonHttpFieldsPlugin);
drawboardPluginFactory.registerPython("_python.httpFields", true)(_);
export default _;
