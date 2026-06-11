(function () {
  const DEFAULT_ICON_CLASS = "text-green-light";
  const BASE_ICON_CLASSES = "fa fa-fw fa-temperature-three-quarters";

  async function getCpuTemp() {
    try {
      const response = await fetch("/admin/custom/cputemp.json", {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Unable to fetch CPU temperature");
      }

      return await response.json();
    } catch (error) {
      return null;
    }
  }

  function ensureTempLine() {
    let tempLine = document.getElementById("temperature");

    if (tempLine) {
      return tempLine;
    }

    const memoryLine = document.getElementById("memory");

    if (!memoryLine) {
      return null;
    }

    memoryLine.insertAdjacentHTML(
      "afterend",
      '<br/><span id="temperature"><i id="temperature-icon" class="' +
        BASE_ICON_CLASSES +
        " " +
        DEFAULT_ICON_CLASS +
        '"></i>&nbsp;&nbsp;Temp: <span id="temperature-value">Loading...</span></span>'
    );

    return document.getElementById("temperature");
  }

  function setIcon(temp) {
    const icon = document.getElementById("temperature-icon");

    if (!icon) {
      return;
    }

    const iconClass = temp && temp.icon_class ? temp.icon_class : DEFAULT_ICON_CLASS;
    icon.className = BASE_ICON_CLASSES + " " + iconClass;

    if (temp && temp.status) {
      icon.title = "CPU temperature status: " + temp.status;
    }
  }

  async function updateTempLine() {
    const tempLine = ensureTempLine();

    if (!tempLine) {
      return;
    }

    const value = document.getElementById("temperature-value");
    const temp = await getCpuTemp();

    if (!value) {
      return;
    }

    if (!temp || temp.error) {
      value.textContent = "Unavailable";
      setIcon({
        status: "unavailable",
        icon_class: "text-gray"
      });
      return;
    }

    value.textContent = `${temp.fahrenheit}°F / ${temp.celsius}°C`;
    setIcon(temp);
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateTempLine();
    setInterval(updateTempLine, 30000);
  });
})();
