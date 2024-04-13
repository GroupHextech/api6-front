const urlBack = "http://127.0.0.1:5000"
const csvRoute = "css"


export async function getGender() {
    try {
        const response = await fetch(`${urlBack}/${csvRoute}/gender`);
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
        const response = await fetch(`${urlBack}/${csvRoute}/date`);
        if (!response.ok) {
          throw new Error('Failed to fetch date');
        }
        const data = await response.json();
        return data.list;
      } catch (error) {
        throw new Error(error.message);
      }
}