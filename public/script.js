document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fileInput = document.querySelector('input[type="file"]');
    const resultText = document.getElementById('resultText');

    if (fileInput.files.length === 0) {
        resultText.value = 'Please select a file';
        return;
    }

    const formData = new FormData();
    formData.append('psd', fileInput.files[0]);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            resultText.value = JSON.stringify(data.files, null, 2);
        } else {
            const error = await response.text();
            resultText.value = `Error: ${error}`;
        }
    } catch (error) {
        resultText.value = `Error: ${error.message}`;
    }
});
