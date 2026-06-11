(function () {
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
      '<br/><span id="temperature"><i class="fa fa-fw fa-temperature-three-quarters text-green-light"></i>&nbsp;&nbsp;Temp: <span id="temperature-value">Loading...</span></span>'
    );

    return document.getElementById("temperature");
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
      return;
    }

    value.textContent = `${temp.fahrenheit}°F / ${temp.celsius}°C`;
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateTempLine();
    setInterval(updateTempLine, 30000);
  });
})();
