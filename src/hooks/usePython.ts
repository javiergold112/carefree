import { useCallback, useEffect, useMemo } from "react";

import { Logger } from "@noli/core";

import type { IPythonHttpResponse, IUseHttpPython, IUsePythonInfo } from "@/types/_python";
import { Requests } from "@/requests/actions";

export function useDeps(
  { node, endpoint, identifier, updateInterval, isInvisible }: IUsePythonInfo,
  getDeps?: (deps: IUsePythonInfo) => any[],
) {
  return useMemo(
    () =>
      getDeps
        ? getDeps({ node, endpoint, identifier, updateInterval, isInvisible })
        : [node, endpoint, identifier, updateInterval, isInvisible],
    [node, endpoint, identifier, updateInterval, isInvisible],
  );
}

export function useHttpPython<R>({
  node,
  endpoint,
  identifier,
  isInvisible,
  updateInterval,
  onSuccess,
  beforeRequest,
  onHttpError,
  getDeps,
}: IUseHttpPython<R>) {
  const deps = useDeps({ node, endpoint, identifier, updateInterval, isInvisible }, getDeps);
  const requestFn = useCallback(() => {
    if (isInvisible) return Promise.resolve();
    const preprocess = beforeRequest ? beforeRequest() : Promise.resolve();
    return preprocess
      .then(() =>
        Requests.postJson<IPythonHttpResponse<R>>("_python", endpoint, {
          node: node?.toJsonPack(),
          identifier,
        }).then((res) => {
          if (res.success) onSuccess(res);
          else throw Error(res.message);
        }),
      )
      .catch((err) => {
        if (onHttpError) onHttpError(err);
        else Logger.error(err);
      });
  }, deps);

  useEffect(() => {
    let timer: any;
    let shouldIgnore = false; // IMPORTANT!
    function requestWithTimeout() {
      if (isInvisible || shouldIgnore) return;
      requestFn().then(() => (timer = setTimeout(requestWithTimeout, updateInterval)));
    }
    if (!updateInterval) requestFn();
    else requestWithTimeout();

    return () => {
      shouldIgnore = true;
      clearTimeout(timer);
    };
  }, deps);
}
