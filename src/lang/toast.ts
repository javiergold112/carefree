import type { Lang } from "@noli/core";

export enum Toast_Words {
  "dropping-message" = "dropping-message",
  "uploading-image-message" = "uploading-image-message",
  "upload-image-success-message" = "upload-image-success-message",
  "upload-image-error-message" = "upload-image-error-message",
  "strange-image-error-message" = "strange-image-error-message",
  "generate-image-success-message" = "generate-image-success-message",
  "generate-image-error-message" = "generate-image-error-message",
  "post-python-http-fields-plugin-error-message" = "post-python-http-fields-plugin-error-message",
  "uploading-project-message" = "uploading-project-message",
  "save-project-success-message" = "save-project-success-message",
  "save-project-error-message" = "save-project-error-message",
  "loading-project-message" = "loading-project-message",
  "load-project-success-message" = "load-project-success-message",
  "please-select-project-message" = "please-select-project-message",
}

export const toastLangRecords: Record<Lang, Record<Toast_Words, string>> = {
  zh: {
    [Toast_Words["dropping-message"]]: "识别中 🤔",
    [Toast_Words["uploading-image-message"]]: "上传中，请稍候 😄",
    [Toast_Words["upload-image-success-message"]]: "上传图片成功！🥳",
    [Toast_Words["upload-image-error-message"]]: "上传图片失败 😫",
    [Toast_Words["strange-image-error-message"]]: "图片类型错误，当前仅支持上传 jpg/png 图片 😫",
    [Toast_Words["generate-image-success-message"]]: "生成图片成功！🥳",
    [Toast_Words["generate-image-error-message"]]: "生成图片失败 😫",
    [Toast_Words["post-python-http-fields-plugin-error-message"]]: "请求 Python 服务时失败 😫",
    [Toast_Words["uploading-project-message"]]: "保存项目中，请稍候 😄",
    [Toast_Words["save-project-success-message"]]: "保存项目成功！🥳",
    [Toast_Words["save-project-error-message"]]: "保存项目失败 😫",
    [Toast_Words["loading-project-message"]]: "加载项目中，请稍候 😄",
    [Toast_Words["load-project-success-message"]]: "加载项目成功！🥳",
    [Toast_Words["please-select-project-message"]]: "请先选择想要加载的项目 😫",
  },
  en: {
    [Toast_Words["dropping-message"]]: "Detecting 🤔",
    [Toast_Words["uploading-image-message"]]: "Uploading, please wait for a while 😄",
    [Toast_Words["upload-image-success-message"]]: "Upload image successfully! 🥳",
    [Toast_Words["upload-image-error-message"]]: "Upload image failed 😫",
    [Toast_Words["strange-image-error-message"]]: "Only jpg/png images are supported 😫",
    [Toast_Words["generate-image-success-message"]]: "Generate image successfully! 🥳",
    [Toast_Words["generate-image-error-message"]]: "Generate image failed 😫",
    [Toast_Words["post-python-http-fields-plugin-error-message"]]:
      "Request Python service failed 😫",
    [Toast_Words["uploading-project-message"]]: "Saving 😄",
    [Toast_Words["save-project-success-message"]]: "Save project successfully! 🥳",
    [Toast_Words["save-project-error-message"]]: "Save project failed 😫",
    [Toast_Words["loading-project-message"]]: "Loading 😄",
    [Toast_Words["load-project-success-message"]]: "Load project successfully! 🥳",
    [Toast_Words["please-select-project-message"]]: "Please select a project first 😫",
  },
};
