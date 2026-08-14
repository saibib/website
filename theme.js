const themeStorageKey = "theme-preference";
const root = document.documentElement;

function getSavedTheme() {
  return localStorage.getItem(themeStorageKey) || "system";
}

function applyTheme(theme) {
  if (theme === "system") {
    root.removeAttribute("data-theme");
    localStorage.removeItem(themeStorageKey);
    return;
  }

  root.dataset.theme = theme;
  localStorage.setItem(themeStorageKey, theme);
}

function addThemeControl() {
  const control = document.createElement("div");
  control.className = "theme-control";
  control.innerHTML = `
    <label for="theme-mode">theme</label>
    <select id="theme-mode" name="theme">
      <option value="system">system</option>
      <option value="light">light</option>
      <option value="dark">dark</option>
    </select>
  `;

  const select = control.querySelector("select");
  select.value = getSavedTheme();
  select.addEventListener("change", () => applyTheme(select.value));
  document.body.append(control);
}

applyTheme(getSavedTheme());
addThemeControl();
