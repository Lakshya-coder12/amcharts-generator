async function loadConfig() {
  const statusEl = document.getElementById('status');
  try {
    const res = await fetch('/config');
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
  const statusEl = document.getElementById('status');
  const config = await loadConfig();
  if (!config) return;

  const root = am5.Root.new('chartdiv');
  root.setThemes([am5themes_Animated.new(root)]);

  // Optional: set date formatter fields if config uses DateAxis
  try {
    root.dateFormatter.setAll({ dateFields: ['valueX'] });
  } catch (_) {}

  try {
    const parser = am5plugins_json.JsonParser.new(root);
    await parser.parse(config, { parent: root.container });
  } catch (e) {
    statusEl.textContent += '\nRender error: ' + e.message;
  }
});