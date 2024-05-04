const API_URL = "http://3.140.192.18:8000"
// const API_URL = "http://127.0.0.1:5000"

export async function getGender(states, regions, feeling) {
  try {
    let params = getFilterParams(states, regions, feeling);
    const response = await fetch(`${API_URL}/api/gender` + params);
    if (!response.ok) {
      throw new Error('Failed to fetch gender');
    }
    const data = await response.json();
    return data.list;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getSales(states, regions, feeling) {
  try {
    let params = getFilterParams(states, regions, feeling);
    const response = await fetch(`${API_URL}/api/date` + params);
    if (!response.ok) {
      throw new Error('Failed to fetch date');
    }
    const data = await response.json();
    return data.list;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getCategories(states, regions, feeling) {
  try {
    let params = getFilterParams(states, regions, feeling);
    const response = await fetch(`${API_URL}/api/categories` + params);
    // CONSOLE LOG>>>>>>>>
    console.log(response);
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
    const response = await fetch(`${API_URL}/api/state`);
    if (!response.ok) {
      throw new Error('Failed to fetch states');
    }
    const data = await response.json();
    return data.list;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getFeeling(states, regions, feeling) {
  try {
    let params = getFilterParams(states, regions, feeling);

    const response = await fetch(`${API_URL}/api/feeling` + params);
    if (!response.ok) {
      throw new Error('Failed to fetch feeling data');
    }
    const data = await response.json();
    return data.list;
  } catch (error) {
    throw new Error(error.message);
  }
}

function getFilterParams(states, regions, feeling) {
  let params = '';
  
  if (regions?.length) {
    params = `?region=${regions[0].toLowerCase()}`;
  } else if (states?.length) {
    params = '?' + states.map(state => `state=${state}`).join(`&`);
  }

  // Add the feeling parameter if it's provided
  if (feeling) {
    params += (params ? '&' : '?') + `feeling=${feeling}`;
  }

  return params;
}