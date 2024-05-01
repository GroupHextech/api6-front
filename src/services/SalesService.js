const API_URL = "http://3.140.192.18:8000"
// const API_URL = "http://127.0.0.1:5000/"

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

export async function getCategories(states) {
  try {
      let apiUrl = `${API_URL}/css/categories`;

      // Adicionar parâmetros de consulta se forem fornecidos
      if (states) {
          apiUrl += "?";

          if (states && states.length > 0) {
              apiUrl += `&state=${states.join('&state=')}`;
          }
      }

      const response = await fetch(apiUrl);
      if (!response.ok) {
          throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      return data.list;
  } catch (error) {
      throw new Error(error.message);
  }
}

export async function getStates() {
    try {
        const response = await fetch(`${API_URL}/css/state`);
        if (!response.ok) {
          throw new Error('Failed to fetch states');
        }
        const data = await response.json();
        return data.list;
      } catch (error) {
        throw new Error(error.message);
      }
}