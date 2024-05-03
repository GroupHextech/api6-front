const API_URL = "http://3.140.192.18:8000"
// const API_URL = "http://127.0.0.1:5000"

export async function getGender(states, regions) {
  try {
    let params = getStateRegionParams(states, regions);
    const response = await fetch(`${API_URL}/review/gender` + params);
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
    const response = await fetch(`${API_URL}/review/date`);
    if (!response.ok) {
      throw new Error('Failed to fetch date');
    }
    const data = await response.json();
    return data.list;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getCategories(states, regions) {
  try {
    let params = getStateRegionParams(states, regions);
    const response = await fetch(`${API_URL}/review/categories` + params);
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
    const response = await fetch(`${API_URL}/review/state`);
    if (!response.ok) {
      throw new Error('Failed to fetch states');
    }
    const data = await response.json();
    return data.list;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getFeeling(states, regions) {
  try {
    let params = getStateRegionParams(states, regions);

    const response = await fetch(`${API_URL}/review/feeling` + params);
    if (!response.ok) {
      throw new Error('Failed to fetch feeling data');
    }
    const data = await response.json();
    return data.list;
  } catch (error) {
    throw new Error(error.message);
  }
}

function getStateRegionParams(states, regions) {
  let params = '';
  
  if (regions?.length) {
    params = `?region=${regions[0].toLowerCase()}`;
  } else if (states?.length) {
    params = '?' + states.map(state => `state=${state}`).join(`&`);
  }

  return params;
}