import { ref, watchEffect } from "vue";
import store from "@/store";

function useDataThemeChange() {
  const theme = ref("light");

  const setTheme = (value) => {
    theme.value = value;
    document.body.setAttribute("data-theme", value);
    document.documentElement.classList.toggle("dark", value === "dark");
    store.commit("UPDATE_USER_SETUP", {
      key: "appearance",
      value,
    });
  };

  const toggleTheme = () => {
    setTheme(theme.value === "light" ? "dark" : "light");
  };

  const initTheme = () => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  };

  initTheme(store.state.settings.appearance);

  const updateTheme = () => {
    initTheme();
  };

  // 监听系统主题变化
  watchEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateTheme);
    return () => {
      mediaQuery.removeEventListener("change", updateTheme);
    };
  });

  return {
    theme,
    setTheme,
    toggleTheme,
  };
}

export { useDataThemeChange };
