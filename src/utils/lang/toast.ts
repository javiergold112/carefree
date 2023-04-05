import type { Lang } from "@noli/core";

export enum Toast_Words {
  "dropping-message" = "dropping-message",
  "uploading-message" = "uploading-message",
  "upload-seccess-message" = "upload-seccess-message",
  "upload-image-error-message" = "upload-image-error-message",
  "upload-image-not-safe-warning-message" = "upload-image-not-safe-warning-message",
  "strange-image-error-message" = "strange-image-error-message",
}

export const toastLangRecords: Record<Lang, Record<Toast_Words, string>> = {
  zh: {
    [Toast_Words["dropping-message"]]: "识别中 🤔",
    [Toast_Words["uploading-message"]]: "上传中，请稍候 😄",
    [Toast_Words["upload-seccess-message"]]: "上传成功！🥳",
    [Toast_Words["upload-image-error-message"]]: "上传图片失败 😫",
    [Toast_Words["upload-image-not-safe-warning-message"]]: "您上传的图片未通过审核 😫",
    [Toast_Words["strange-image-error-message"]]: "图片类型错误，当前仅支持上传 jpg/png 图片 😫",
  },
  en: {
    [Toast_Words["dropping-message"]]: "Detecting 🤔",
    [Toast_Words["uploading-message"]]: "Uploading, please wait for a while 😄",
    [Toast_Words["upload-seccess-message"]]: "Uploaded Successfully! 🥳",
    [Toast_Words["strange-image-error-message"]]: "Only jpg/png images are supported 😫",
    [Toast_Words["upload-image-error-message"]]: "Upload image failed 😫",
    [Toast_Words["upload-image-not-safe-warning-message"]]:
      "The uploaded image failed to pass the audit algorithm 😫",
  },
};
