import type { BoxProps } from "@chakra-ui/react";

export const IS_PROD = import.meta.env.PROD;

export const BOARD_CONTAINER_ID = "board.container";

function makeCubicBezier(second: number) {
  return `${second}s cubic-bezier(.08,.52,.52,1)`;
}
function makeVisiblilityTransition(second: number) {
  const cubic_bezier = makeCubicBezier(second);
  return `opacity ${cubic_bezier}, visibility ${cubic_bezier}`;
}
interface IMakeVisibilityTransitionProps {
  visible: boolean;
  second?: number;
  opacity?: BoxProps["opacity"];
  extraTransitions?: string;
}
export function makeVisibilityTransitionProps({
  visible,
  second,
  opacity,
  extraTransitions,
}: IMakeVisibilityTransitionProps): {
  visibility: BoxProps["visibility"];
  transition: BoxProps["transition"];
  opacity: BoxProps["opacity"];
} {
  second ??= 0.3;
  opacity ??= 1.0;
  const baseTransition = makeVisiblilityTransition(second);
  const transition = !!extraTransitions ? `${baseTransition}, ${extraTransitions}` : baseTransition;
  return { visibility: visible ? "visible" : "hidden", transition, opacity: visible ? opacity : 0 };
}
export const BG_TRANSITION = "background-color 0.3s ease-in-out";
const expand_cubic_bezier = makeCubicBezier(0.3);
export const EXPAND_TRANSITION = `height ${expand_cubic_bezier}, transform ${expand_cubic_bezier}, margin-top ${expand_cubic_bezier}`;

export const DEFAULT_PLUGIN_SETTINGS = {
  iconW: 48,
  iconH: 48,
  pivot: "bottom",
  follow: false,
  bgOpacity: 0.5,
  expandOpacity: 0.94117647,
  offsetX: 8,
  offsetY: 8,
  expandOffsetX: 8,
  expandOffsetY: 8,
};

export const IMAGE_PLACEHOLDER =
  "https://user-images.githubusercontent.com/15677328/236621223-e3b508b9-5a60-471c-8630-470b7e6e8cde.svg";
export const NSFW_IMAGE_PLACEHOLDER =
  "https://user-images.githubusercontent.com/15677328/235883103-9a3941c0-d5d9-4064-9e28-ba0f07f6921f.svg";
export const DEFAULT_FONT_SIZE = 64;
