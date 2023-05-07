document
  .getElementById("uploadForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const fileInput = document.querySelector('input[type="file"]');
    const languageSelect = document.querySelector('select[name="language"]');
    const loader = document.getElementById("loader");

    if (fileInput.files.length === 0) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("psd", fileInput.files[0]);
    formData.append("language", languageSelect.value);

    loader.classList.remove("hidden");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      loader.classList.add("hidden");

      if (response.ok) {
        const data = await response.blob();
        const blob = new Blob([data], {
          type: "application/octet-stream",
        });

        const url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.classList.remove("hidden");
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      loader.classList.add("hidden");
      alert(`Error: ${error.message}`);
    }
  });
