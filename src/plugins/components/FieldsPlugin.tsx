import { useMemo } from "react";
import { observer } from "mobx-react-lite";

import { isUndefined } from "@noli/core";

import type { IInternalTaskPlugin } from "@/types/plugins";
import { subscribe } from "../utils/subscribe";
import Render from "./Render";
import TextField from "./Fields/TextField";
import NumberField from "./Fields/NumberField";

const FieldsPlugin = ({
  pluginInfo: { fields, customDefinitions },
  children,
  ...props
}: Omit<IInternalTaskPlugin, "pluginInfo"> & {
  pluginInfo: Omit<IInternalTaskPlugin["pluginInfo"], "task">;
}) => {
  const definitions = useMemo(
    () => subscribe(fields, customDefinitions),
    [fields, customDefinitions],
  );

  return (
    <Render {...props}>
      {Object.entries(definitions).map(([field, definition], i) => {
        let Field: any | null = null;
        if (definition.type === "text") {
          Field = TextField;
        } else if (definition.type === "number") {
          Field = NumberField;
        }
        if (!Field) return null;
        const props = definition.props ?? {};
        if (isUndefined(props.mt) && i !== 0) props.mt = "8px";
        definition.props = props;
        return <Field key={field} field={field} definition={definition} flexShrink={0} />;
      })}
      {children}
    </Render>
  );
};

export default observer(FieldsPlugin);
