document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileName');
    const fileDetails = document.getElementById('fileDetails');
    const uploadForm = document.getElementById('uploadForm');
    const uploadBtn = document.getElementById('uploadBtn');
    const statusDiv = document.getElementById('status');

    // Ensure uploadForm exists before attaching listener
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!fileInput || fileInput.files.length === 0) {
                alert('Please select a file first.');
                return;
            }

            const formData = new FormData();
            formData.append('file', fileInput.files[0]);

            if (uploadBtn) {
                uploadBtn.disabled = true;
                uploadBtn.textContent = 'Uploading...';
            }
            if (statusDiv) {
                statusDiv.style.display = 'none';
            }

            // Sends HTTP POST request containing file data to host
            fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (statusDiv) statusDiv.style.display = 'block';
                
                // HTTP 200 (Success) or HTTP 404 (Endpoint missing, but payload went through)
                if (response.ok) {
                    if (statusDiv) {
                        statusDiv.className = 'status-box success';
                        statusDiv.textContent = 'Upload payload sent successfully (HTTP 200/OK). Netskope did not interrupt this POST request.';
                    }
                } else {
                    if (statusDiv) {
                        statusDiv.className = 'status-box success';
                        statusDiv.textContent = `Server responded with HTTP ${response.status}. The file payload successfully passed through Netskope to infodrip.in!`;
                    }
                }
            })
            .catch(error => {
                if (statusDiv) {
                    statusDiv.style.display = 'block';
                    statusDiv.className = 'status-box error';
                    statusDiv.textContent = `Upload failed/blocked: ${error.message}. Netskope or network policy dropped the payload.`;
                }
            })
            .finally(() => {
                if (uploadBtn) {
                    uploadBtn.disabled = false;
                    uploadBtn.textContent = 'Upload File';
                }
            });
        });
    }

    // Display selected file name
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                if (fileNameDisplay) fileNameDisplay.textContent = fileInput.files[0].name;
                if (fileDetails) fileDetails.style.display = 'block';
            } else {
                if (fileDetails) fileDetails.style.display = 'none';
            }
        });
    }
});
