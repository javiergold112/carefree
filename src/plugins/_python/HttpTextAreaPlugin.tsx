import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Textarea } from "@chakra-ui/react";

import type { IPythonHttpTextAreaPlugin } from "@/types/_python";
import { useHttpPython } from "@/hooks/usePython";
import { drawboardPluginFactory } from "@/plugins/utils/factory";
import Render from "@/plugins/components/Render";

const PythonHttpTextAreaPlugin = ({
  pluginInfo: { node, endpoint, identifier, updateInterval, noLoading, textAlign },
  ...props
}: IPythonHttpTextAreaPlugin) => {
  const [value, setValue] = useState("");

  useHttpPython<{ text: string }>({
    node,
    endpoint,
    identifier,
    isInvisible: props.renderInfo.isInvisible ?? false,
    updateInterval,
    onUseHttpPythonSuccess: async (res) => setValue(res.data.text),
    beforeRequest: noLoading ? undefined : async () => setValue("Loading..."),
  });

  return (
    <Render {...props}>
      <Textarea w="100%" h="100%" minH="0px" value={value} textAlign={textAlign} readOnly />
    </Render>
  );
};
drawboardPluginFactory.registerPython(
  "_python.httpTextArea",
  true,
)(observer(PythonHttpTextAreaPlugin));
