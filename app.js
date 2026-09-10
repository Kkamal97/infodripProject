document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileName');
    const fileDetails = document.getElementById('fileDetails');
    const uploadForm = document.getElementById('uploadForm');
    const uploadBtn = document.getElementById('uploadBtn');
    const statusDiv = document.getElementById('status');

    // Display selected file name
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = fileInput.files[0].name;
            fileDetails.style.display = 'block';
        } else {
            fileDetails.style.display = 'none';
        }
    });

    // Handle form submission
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (fileInput.files.length === 0) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';
        statusDiv.style.display = 'none';

        // Sends HTTP POST request containing file data to host
        fetch('/api/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            statusDiv.style.display = 'block';
            if (response.ok) {
                statusDiv.className = 'status-box success';
                statusDiv.textContent = 'Upload payload sent successfully (HTTP 200/OK). Netskope did not interrupt this POST request.';
            } else {
                statusDiv.className = 'status-box error';
                statusDiv.textContent = `Server responded with HTTP ${response.status}. Request passed outbound client check.`;
            }
        })
        .catch(error => {
            statusDiv.style.display = 'block';
            statusDiv.className = 'status-box error';
            statusDiv.textContent = `Upload failed/blocked: ${error.message}. Netskope or network policy may have dropped the payload.`;
        })
        .finally(() => {
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload File';
        });
    });
});
