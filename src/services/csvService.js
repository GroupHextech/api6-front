const API_URL = "http://127.0.0.1:5000"

export async function uploadCsvFile(file, callback) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/csv`, {
        method: 'POST',
        body: formData,
    });

    callback(response);
}