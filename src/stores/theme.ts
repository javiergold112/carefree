import { computed, makeObservable, observable } from "mobx";

import { ABCStore } from "@noli/business";

type ThemeType = "light" | "dark";
type ThemeStyles = {
  boardBg: string;
  textColor: string;
  dividerColor: string;
};

export const allThemes: Record<ThemeType, ThemeStyles> = {
  light: {
    boardBg: "#f7f7f7",
    textColor: "#333333",
    dividerColor: "#cccccc",
  },
  dark: {
    boardBg: "#242424",
    textColor: "#333333",
    dividerColor: "#cccccc",
  },
};

export interface IThemeStore {
  theme: ThemeType;
}
class ThemeStore extends ABCStore<IThemeStore> implements IThemeStore {
  theme: ThemeType = "light";

  constructor() {
    super();
    makeObservable(this, {
      theme: observable,
      styles: computed,
    });
  }

  get info(): IThemeStore {
    return this;
  }

  get styles(): ThemeStyles {
    return allThemes[this.theme];
  }
}

export const themeStore = new ThemeStore();
export const updateTheme = (theme: ThemeType) => themeStore.updateProperty("theme", theme);
