const API_URL = "http://3.140.192.18:8000"

export async function getGender() {
    try {
        const response = await fetch(`${API_URL}/css/gender`);
        if (!response.ok) {
          throw new Error('Failed to fetch gender');
        }
        const data = await response.json();
        return data.list;
      } catch (error) {
        throw new Error(error.message);
      }
}

export async function getSales() {
    try {
        const response = await fetch(`${API_URL}/css/date`);
        if (!response.ok) {
          throw new Error('Failed to fetch date');
        }
        const data = await response.json();
        return data.list;
      } catch (error) {
        throw new Error(error.message);
      }
}

export async function getCategories() {
    try {
        const response = await fetch(`${API_URL}/css/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        return data.list;
      } catch (error) {
        throw new Error(error.message);
      }
}