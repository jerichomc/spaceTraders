import { useState } from 'react';
import {
  getAgent,
  getContracts,
  acceptContract,
  getShipyards,
  selectShipyard,
  purchaseShip,
  getShips,
} from '../services/spacetraders.js';

function Dashboard() {
  const [token, setToken] = useState('');
  const [agentData, setAgentData] = useState(null);
  const [contractsData, setContractsData] = useState(null);
  const [shipyardsData, setShipyardsData] = useState(null);
  const [selectedShipyard, setSelectedShipyard] = useState(null);
  const [shipsData, setShipsData] = useState(null);

  const systemSymbol = agentData
    ? agentData.headquarters.split('-').slice(0, 2).join('-')
    : '';

  function handleSaveToken() {
    localStorage.setItem('agentToken', token);
    alert('Token Saved!');
  }

  async function handleLoadAgent() {
    try {
      const data = await getAgent();

      if (data.error) {
        alert(`Error: ${data.error.message}`);
        return;
      }

      setAgentData(data.data);
      console.log('Agent Data:', data.data);
    } catch (error) {
      console.error('Error fetching agent data:', error);
      alert('Failed to load agent data. Please check your token and try again.');
    }
  }

  async function handleLoadContracts() {
    try {
      const data = await getContracts();

      if (data.error) {
        alert(`Error: ${data.error.message}`);
        return;
      }

      setContractsData(data.data);
    } catch (error) {
      console.error('Error fetching contracts data:', error);
      alert('Failed to load contracts data. Please check your token and try again.');
    }
  }

  async function handleAcceptContract(contractId) {
    try {
      const data = await acceptContract(contractId);

      if (data.error) {
        alert(`Error: ${data.error.message}`);
        return;
      }

      alert('Contract accepted successfully!');
      handleLoadAgent();
      handleLoadContracts();
    } catch (error) {
      console.error('Error accepting contract:', error);
      alert('Failed to accept contract. Please check your token and try again.');
    }
  }

  async function handleLoadShipyards(systemSymbol) {
    try {
      const data = await getShipyards(systemSymbol);

      if (data.error) {
        alert(`Error: ${data.error.message}`);
        return;
      }

      setShipyardsData(data.data);
      setSelectedShipyard(null);
    } catch (error) {
      console.error('Error fetching shipyards data:', error);
      alert('Failed to load shipyards data. Please check your token and try again.');
    }
  }

  async function handleSelectShipyard(systemSymbol, waypointSymbol) {
    try {
      const data = await selectShipyard(systemSymbol, waypointSymbol);

      if (data.error) {
        alert(`Error: ${data.error.message}`);
        return;
      }

      console.log('Selected shipyard data:', data.data);
      setSelectedShipyard(data.data);
    } catch (error) {
      console.error('Error fetching shipyard data:', error);
      alert('Failed to load shipyard data. Please check your token and try again.');
    }
  }

  async function handlePurchaseShip(shipType, waypointSymbol) {
    try {
      const data = await purchaseShip(shipType, waypointSymbol);

      if (data.error) {
        alert(`Error: ${data.error.message}`);
        return;
      }

      alert('Ship purchased successfully!');
      handleLoadAgent();
      handleLoadShips();
    } catch (error) {
      console.error('Error purchasing ship:', error);
      alert('Failed to purchase ship. Please check your token and try again.');
    }
  }

  async function handleLoadShips() {
    try {
      const data = await getShips();

      if (data.error) {
        alert(`Error: ${data.error.message}`);
        return;
      }

      console.log('Ships Data:', data.data);
      setShipsData(data.data);
    } catch (error) {
      console.error('Error fetching ships data:', error);
      alert('Failed to load ships data. Please check your token and try again.');
    }
  }

  return (
    <div className="dashboard">
      <h1>SpaceTraders Fleet Commander</h1>
      <p>Connect your agent to begin.</p>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Paste your agent token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />

        <button onClick={handleSaveToken}>Save Token</button>
        <button
          onClick={() => {
            handleLoadAgent();
            handleLoadShips();
          }}
        >
          Load Agent Data
        </button>
        <button onClick={handleLoadContracts}>Load Contracts</button>
        <button
          onClick={() => handleAcceptContract(contractsData?.[0]?.id)}
          disabled={!contractsData?.length}
        >
          Accept Contract
        </button>
        <button onClick={() => handleLoadShipyards(systemSymbol)} disabled={!systemSymbol}>
          Load Shipyards
        </button>
      </div>

      {agentData && (
        <div id="agent-info" className="panel">
          <h2>Agent Information</h2>
          <p>Symbol: {agentData.symbol}</p>
          <p>Headquarters: {agentData.headquarters}</p>
          <p>Credits: {agentData.credits}</p>
          <p>Starting Faction: {agentData.startingFaction}</p>
        </div>
      )}

      {shipsData && (
        <div className="panel">
          <h2>Ships</h2>
          {shipsData.length === 0 ? (
            <p>No ships found.</p>
          ) : (
            shipsData.map((ship) => (
              <div key={ship.symbol}>
                <p>Ship Symbol: {ship.symbol}</p>
                <p>Role: {ship.registration?.role}</p>
                <p>Status: {ship.nav?.status}</p>
                <p>System: {ship.nav?.systemSymbol}</p>
                <p>Waypoint: {ship.nav?.waypointSymbol}</p>
              </div>
            ))
          )}
        </div>
      )}

      {contractsData && (
        <div className="panel">
          <h2>Contracts</h2>

          {contractsData.length === 0 ? (
            <p>No contracts found.</p>
          ) : (
            contractsData.map((contract) => (
              <div key={contract.id}>
                <p>Contract ID: {contract.id}</p>
                <p>Faction: {contract.factionSymbol}</p>
                <p>Accepted: {contract.accepted ? 'Yes' : 'No'}</p>
                <p>Fulfilled: {contract.fulfilled ? 'Yes' : 'No'}</p>
                <p>Deadline: {contract.terms.deadline}</p>
                <p>Payment on accept: {contract.terms.payment.onAccepted}</p>
                <p>Payment on fulfill: {contract.terms.payment.onFulfilled}</p>

                <h3>Deliverables</h3>
                {contract.terms.deliver.map((item) => (
                  <div key={`${contract.id}-${item.tradeSymbol}`}>
                    <p>Trade Symbol: {item.tradeSymbol}</p>
                    <p>Destination: {item.destinationSymbol}</p>
                    <p>Units Required: {item.unitsRequired}</p>
                    <p>Units Fulfilled: {item.unitsFulfilled}</p>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}

      {selectedShipyard ? (
        <div className="panel">
          <h2>Selected Shipyard</h2>
          <p>Symbol: {selectedShipyard.symbol}</p>
          <p>Faction: {selectedShipyard.factionSymbol || 'Unknown'}</p>

          <button onClick={() => setSelectedShipyard(null)}>Back to Shipyards</button>

          <h3>Ships Available</h3>
          {selectedShipyard.ships && selectedShipyard.ships.length > 0 ? (
            selectedShipyard.ships.map((ship) => (
              <div key={ship.type}>
                <p>Type: {ship.type}</p>
                <p>Name: {ship.name}</p>
                <p>Purchase Price: {ship.purchasePrice}</p>
                <button onClick={() => handlePurchaseShip(ship.type, selectedShipyard.symbol)}>
                  Purchase Ship
                </button>
              </div>
            ))
          ) : (
            <p>No ship data available at this shipyard.</p>
          )}
        </div>
      ) : (
        shipyardsData && (
          <div className="panel">
            <h2>Shipyards</h2>
            {shipyardsData.length === 0 ? (
              <p>No shipyards found in this system.</p>
            ) : (
              shipyardsData.map((shipyard) => (
                <div key={shipyard.symbol}>
                  <p>Symbol: {shipyard.symbol}</p>
                  <p>Type: {shipyard.type}</p>
                  <button onClick={() => handleSelectShipyard(systemSymbol, shipyard.symbol)}>
                    View Shipyard
                  </button>
                </div>
              ))
            )}
          </div>
        )
      )}
    </div>
  );
}

export default Dashboard;
