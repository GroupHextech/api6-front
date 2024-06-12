const API_URL = "http://127.0.0.1:5000"

export async function uploadCsvFile(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/api/csv`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Não foi possível fazer o upload do arquivo.');
        }
        const data = await response.json();

    } catch (error) {
        throw new Error(error.message);
    }
}