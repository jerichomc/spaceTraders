const BASE_URL = 'https://api.spacetraders.io/v2';

async function getAgent(){
    const token = localStorage.getItem('agentToken');

    const response = await fetch(`${BASE_URL}/my/agent`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data;
}

export { getAgent };