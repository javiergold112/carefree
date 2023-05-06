import type { Lang } from "@carefree0910/core";

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
  "adding-project-message" = "adding-project-message",
  "add-project-success-message" = "add-project-success-message",
  "save-project-success-message" = "save-project-success-message",
  "save-project-error-message" = "save-project-error-message",
  "loading-project-message" = "loading-project-message",
  "load-project-success-message" = "load-project-success-message",
  "load-project-error-message" = "load-project-error-message",
  "please-select-project-message" = "please-select-project-message",
  "please-select-project-to-delete-message" = "please-select-project-to-delete-message",
  "already-selected-project-message" = "already-selected-project-message",
  "cannot-delete-auto-save-project-message" = "cannot-delete-auto-save-project-message",
  "downloading-project-message" = "downloading-project-message",
  "importing-local-project-message" = "importing-local-project-message",
  "import-local-project-success-message" = "import-local-project-success-message",
  "import-local-project-error-message" = "import-local-project-error-message",
  "delete-project-success-message" = "delete-project-success-message",
  "delete-project-error-message" = "delete-project-error-message",
  "add-text-success-message" = "add-text-success-message",
  "add-text-error-message" = "add-text-error-message",
  "add-blank-success-message" = "add-blank-success-message",
  "add-blank-error-message" = "add-blank-error-message",
  "auto-arrange-no-need-message" = "auto-arrange-no-need-message",
  "submit-task-busy-message" = "submit-task-busy-message",
  "submit-task-success-message" = "submit-task-success-message",
  "submit-task-error-message" = "submit-task-error-message",
  "submit-task-interrupted-message" = "submit-task-interrupted-message",
  "submit-task-finished-message" = "submit-task-finished-message",
  "downloading-nodes-message" = "downloading-nodes-message",
  "export-blob-error-message" = "export-blob-error-message",
  "enter-brush-mode-message" = "enter-brush-mode-message",
  "exit-brush-mode-message" = "exit-brush-mode-message",
  "nsfw-image-detected-warning-message" = "nsfw-image-detected-warning-message",
  "no-overlapped-node-message" = "no-overlapped-node-message",
  "returned-empty-text-message" = "returned-empty-text-message",
}

export const toastLangRecords: Record<Lang, Record<Toast_Words, string>> = {
  zh: {
    [Toast_Words["dropping-message"]]: "识别中",
    [Toast_Words["uploading-image-message"]]: "上传中，请稍候",
    [Toast_Words["upload-image-success-message"]]: "上传图片成功",
    [Toast_Words["upload-image-error-message"]]: "上传图片失败",
    [Toast_Words["strange-image-error-message"]]: "图片类型错误，当前仅支持上传 jpg/png 图片",
    [Toast_Words["generate-image-success-message"]]: "生成图片成功",
    [Toast_Words["generate-image-error-message"]]: "生成图片失败",
    [Toast_Words["post-python-http-fields-plugin-error-message"]]: "请求 Python 服务时失败",
    [Toast_Words["uploading-project-message"]]: "保存项目中",
    [Toast_Words["adding-project-message"]]: "新建项目中",
    [Toast_Words["add-project-success-message"]]: "新建项目成功",
    [Toast_Words["save-project-success-message"]]: "保存项目成功",
    [Toast_Words["save-project-error-message"]]: "保存项目失败",
    [Toast_Words["loading-project-message"]]: "加载项目中，请稍候",
    [Toast_Words["load-project-success-message"]]: "加载项目成功",
    [Toast_Words["load-project-error-message"]]: "加载项目失败",
    [Toast_Words["please-select-project-message"]]: "请先选择想要加载的项目",
    [Toast_Words["please-select-project-to-delete-message"]]: "请先选择想要删除的项目",
    [Toast_Words["already-selected-project-message"]]: "要加载的项目是当前的项目，无需重复加载",
    [Toast_Words["cannot-delete-auto-save-project-message"]]: "不能删除「自动保存」项目",
    [Toast_Words["downloading-project-message"]]: "下载项目中",
    [Toast_Words["importing-local-project-message"]]: "导入中",
    [Toast_Words["import-local-project-success-message"]]: "导入成功",
    [Toast_Words["import-local-project-error-message"]]: "导入失败",
    [Toast_Words["delete-project-success-message"]]: "删除项目成功",
    [Toast_Words["delete-project-error-message"]]: "删除项目失败",
    [Toast_Words["add-text-success-message"]]: "添加文字成功",
    [Toast_Words["add-text-error-message"]]: "添加文字时出了些问题",
    [Toast_Words["add-blank-success-message"]]: "添加空白画布成功",
    [Toast_Words["add-blank-error-message"]]: "添加空白画布时出了些问题",
    [Toast_Words["auto-arrange-no-need-message"]]: "当前节点无需整理",
    [Toast_Words["submit-task-busy-message"]]: "当前任务正在执行中，请稍候...",
    [Toast_Words["submit-task-success-message"]]: "任务提交成功",
    [Toast_Words["submit-task-error-message"]]: "执行任务时出了些问题",
    [Toast_Words["submit-task-interrupted-message"]]: "任务执行被中断",
    [Toast_Words["submit-task-finished-message"]]: "任务已执行完成",
    [Toast_Words["downloading-nodes-message"]]: "下载中",
    [Toast_Words["export-blob-error-message"]]: "导出节点时出了些问题",
    [Toast_Words["enter-brush-mode-message"]]: "已进入涂鸦模式",
    [Toast_Words["exit-brush-mode-message"]]: "已退出涂鸦模式",
    [Toast_Words["nsfw-image-detected-warning-message"]]: "检测到图片中可能包含敏感内容",
    [Toast_Words["no-overlapped-node-message"]]: "当前空白画布上没有内容",
    [Toast_Words["returned-empty-text-message"]]: "返回的文本内容为空",
  },
  en: {
    [Toast_Words["dropping-message"]]: "Detecting",
    [Toast_Words["uploading-image-message"]]: "Uploading, please wait for a while",
    [Toast_Words["upload-image-success-message"]]: "Image uploaded successfully!",
    [Toast_Words["upload-image-error-message"]]: "Upload image failed",
    [Toast_Words["strange-image-error-message"]]: "Only jpg/png images are supported",
    [Toast_Words["generate-image-success-message"]]: "Image generated successfully!",
    [Toast_Words["generate-image-error-message"]]: "Generate image failed",
    [Toast_Words["post-python-http-fields-plugin-error-message"]]: "Request Python service failed",
    [Toast_Words["uploading-project-message"]]: "Saving",
    [Toast_Words["adding-project-message"]]: "Creating new project",
    [Toast_Words["add-project-success-message"]]: "Project created successfully!",
    [Toast_Words["save-project-success-message"]]: "Project saved successfully!",
    [Toast_Words["save-project-error-message"]]: "Save project failed",
    [Toast_Words["loading-project-message"]]: "Loading",
    [Toast_Words["load-project-success-message"]]: "Project loaded successfully!",
    [Toast_Words["load-project-error-message"]]: "Load project failed",
    [Toast_Words["please-select-project-message"]]: "Please select a project first",
    [Toast_Words["please-select-project-to-delete-message"]]: "Please select a project to delete",
    [Toast_Words["already-selected-project-message"]]:
      "The project you want to load is the current project, no need to load again",
    [Toast_Words["cannot-delete-auto-save-project-message"]]: "Cannot delete 'Auto Save' project",
    [Toast_Words["downloading-project-message"]]: "Downloading",
    [Toast_Words["importing-local-project-message"]]: "Importing",
    [Toast_Words["import-local-project-success-message"]]: "Imported successfully!",
    [Toast_Words["import-local-project-error-message"]]: "Import failed",
    [Toast_Words["delete-project-success-message"]]: "Project deleted successfully!",
    [Toast_Words["delete-project-error-message"]]: "Delete project failed",
    [Toast_Words["add-text-success-message"]]: "Text added successfully",
    [Toast_Words["add-text-error-message"]]: "Something is wrong when adding Text Node",
    [Toast_Words["add-blank-success-message"]]: "Blank Canvas added successfully",
    [Toast_Words["add-blank-error-message"]]: "Something is wrong when adding Blank Canvas",
    [Toast_Words["auto-arrange-no-need-message"]]: "There is no need to arrange the Nodes",
    [Toast_Words["submit-task-busy-message"]]:
      "Current task is being executed, please wait for a while...",
    [Toast_Words["submit-task-success-message"]]: "Task submitted successfully!",
    [Toast_Words["submit-task-error-message"]]: "Something is wrong when executing the task",
    [Toast_Words["submit-task-interrupted-message"]]: "Task submission is interrupted",
    [Toast_Words["submit-task-finished-message"]]: "Task has been executed successfully",
    [Toast_Words["downloading-nodes-message"]]: "Downloading",
    [Toast_Words["export-blob-error-message"]]: "Something is wrong when exporting Node",
    [Toast_Words["enter-brush-mode-message"]]: "Entered sketch mode",
    [Toast_Words["exit-brush-mode-message"]]: "Exited sketch mode",
    [Toast_Words["nsfw-image-detected-warning-message"]]: "NSFW image detected",
    [Toast_Words["no-overlapped-node-message"]]: "Cannot detect anything on current Blank Canvas",
    [Toast_Words["returned-empty-text-message"]]: "Returned text is empty",
  },
};
