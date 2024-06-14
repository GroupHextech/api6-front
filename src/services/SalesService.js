// const API_URL = "http://3.140.192.18:8000"
// const API_URL = "http://127.0.0.1:5000"
const API_URL = "https://api6.nossoscursos.com.br"
const API_URL_PREFIX = "api"
const API_USERS_PREFIX = "users"

export async function getTopWords(states, regions, feeling) {
  try {     
    let params = getFilterParams(states, regions, feeling);
 
    const response = await fetch(`${API_URL}/${API_URL_PREFIX}/word-frequency` + params);

    if (!response.ok) {
      throw new Error('Failed to fetch top words');
    }
    const data = await response.json();

    const formattedData = Object.keys(data).map(key => ({
      value: key,
      count: data[key]
    }));
    
    return formattedData;

  } catch (error) {
    throw new Error(error.message);
  }
}



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

    console.log("DATA: ", data);

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

export async function handleRestore(selectedDate) {
  try {
    const year = selectedDate.format("YYYY");
    const month = selectedDate.format("MM");
    const day = selectedDate.format("DD");
    
    // Construção da URL do API endpoint com a data selecionada
    const url = `${API_URL}/${API_USERS_PREFIX}/restore?year=${year}&month=${month}&day=${day}`;

    const response = await fetch(url, {
      method: "GET", // Use GET for retrieving backup data
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to restore backup for date ${day}/${month}/${year}`);
    }

    const data = await response.json();
    console.log("Restore response:", data.document);
  } catch (error) {
    console.error("Error restoring backup", error);
  }
}