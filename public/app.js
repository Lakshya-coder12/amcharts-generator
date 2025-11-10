async function loadConfig() {
  const statusEl = document.getElementById('status');
  try {
    const res = await fetch('http://localhost:3000/config');
    if (!res.ok) {
      const txt = await res.text();
      statusEl.textContent = `No config found (HTTP ${res.status}).\n${txt}`;
      return null;
    }
    const cfg = await res.json();
    statusEl.textContent = 'Loaded config:\n' + JSON.stringify(cfg, null, 2);
    return cfg;
  } catch (e) {
    statusEl.textContent = 'Failed to load config: ' + e.message;
    return null;
  }
}

am5.ready(async function () {
  const config = await loadConfig();
  if (!config) return;
  const root = am5.Root.new('chartdiv');
  root.setThemes([am5themes_Animated.new(root)]);
  try {
    const jsonParser = am5plugins_json.Json.new(root);
    jsonParser.parse(config);
  } catch (e) {
    const statusEl = document.getElementById('status');
    statusEl.textContent += '\nRender error: ' + e.message;
  }
});