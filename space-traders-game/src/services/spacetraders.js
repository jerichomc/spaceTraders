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

async function getContracts(){
    const token = localStorage.getItem('agentToken');

    const response = await fetch(`${BASE_URL}/my/contracts`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data;
}

async function acceptContract(contractId){
    const token = localStorage.getItem('agentToken');

    const response = await fetch(`${BASE_URL}/my/contracts/${contractId}/accept`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    });
    const data = await response.json();
    return data;
}

async function getShipyards(systemSymbol){
    const token = localStorage.getItem('agentToken');

    const response = await fetch(`${BASE_URL}/systems/${systemSymbol}/waypoints?traits=SHIPYARD`, {
        method: 'GET',
        headers: {
            
            Authorization: `Bearer ${token}`,
        }
    });
    const data = await response.json();
    return data;
}

async function selectShipyard(systemSymbol, waypointSymbol){
    const token = localStorage.getItem('agentToken');

    const response = await fetch(`${BASE_URL}/systems/${systemSymbol}/waypoints/${waypointSymbol}/shipyard`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    const data = await response.json();
    return data;
}

async function purchaseShip(shipType, waypointSymbol) {
    const token = localStorage.getItem('agentToken');

    const response = await fetch(`${BASE_URL}/my/ships`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            shipType,
            waypointSymbol
        })
    });
    const data = await response.json();
    return data;
}

export { getAgent, getContracts, acceptContract, getShipyards, selectShipyard , purchaseShip };