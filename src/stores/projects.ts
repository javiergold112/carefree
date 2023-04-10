import { v4 as uuidv4 } from "uuid";
import { makeObservable, observable, runInAction } from "mobx";

import { ABCStore } from "@noli/business";

import { formatTime } from "@/utils/misc";

export interface IProjectsStore {
  uid: string;
  name: string;
  createTime: number;
  updateTime: number;
}
type IPartialProjectsStore = Partial<IProjectsStore>;
class ProjectsStore extends ABCStore<IPartialProjectsStore> implements IPartialProjectsStore {
  uid?: string;
  name?: string;
  createTime?: number;
  updateTime?: number;

  constructor() {
    super();
    makeObservable(this, {
      uid: observable,
      name: observable,
    });
  }

  get info(): IPartialProjectsStore {
    return this;
  }
}

const projectsStore = new ProjectsStore();
export const setUid = (uid: string) => projectsStore.updateProperty("uid", uid);
export const setName = (name: string) => projectsStore.updateProperty("name", name);
export const useCurrentProject = () => {
  const time = new Date().getTime();
  if (projectsStore.uid) {
    projectsStore.updateProperty("updateTime", time / 1000);
  } else {
    runInAction(() => {
      projectsStore.uid = uuidv4();
      projectsStore.name = `Project ${formatTime(time, "YYYY-MM-DD HH:mm").slice(2)}`;
      projectsStore.createTime = time / 1000;
      projectsStore.updateTime = time / 1000;
    });
  }
  return {
    uid: projectsStore.uid,
    name: projectsStore.name,
    createTime: projectsStore.createTime,
    updateTime: projectsStore.updateTime,
  };
};
