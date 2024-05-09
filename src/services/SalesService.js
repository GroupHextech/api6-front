const API_URL = "http://3.140.192.18:8000"
// const API_URL = "http://127.0.0.1:5000"
const API_URL_PREFIX = "api"

export async function getGender(states, regions, feeling) {
  try {
    let params = getFilterParams(states, regions, feeling);
    const response = await fetch(`${API_URL}/${API_URL_PREFIX}/gender` + params);
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
    const response = await fetch(`${API_URL}/${API_URL_PREFIX}/date` + params);
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
    const response = await fetch(`${API_URL}/${API_URL_PREFIX}/categories` + params);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.list;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getStates(states, regions, feeling) {
  let params = getFilterParams(states, regions, feeling);
  
  try {
    const response = await fetch(`${API_URL}/${API_URL_PREFIX}/state` + params);
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

    const response = await fetch(`${API_URL}/${API_URL_PREFIX}/feeling` + params);
    if (!response.ok) {
      throw new Error('Failed to fetch feeling data');
    }
    const data = await response.json();
    return data.list;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getFeelingByMonth(states, regions, feeling) {
  try {
    let params = getFilterParams(states, regions, feeling);

    const response = await fetch(`${API_URL}/${API_URL_PREFIX}/feeling_by_month` + params);
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
  let params = [];
  
  if (regions?.length) {
    params.push(`region=${regions[0].toLowerCase()}`);
  } else if (states?.length) {
    params.push('' + states.map(state => `state=${state}`).join(`&`));
  }
  
  if (feeling?.length) {
    params.push(`feeling=${feeling}`);
  }

  return '?' + params.join('&');
}