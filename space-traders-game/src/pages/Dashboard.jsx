import { useState} from 'react';
import { getAgent, getContracts } from '../services/spacetraders.js';

function Dashboard() {
  const [token, setToken] = useState('');
  const [agentData, setAgentData] = useState(null);
  const [contractsData, setContractsData] = useState(null);

  function handleSaveToken(){
    localStorage.setItem("agentToken", token);
    alert("Token Saved!");
  }

  async function handleLoadAgent(){
    try {
      const data = await getAgent();

      if (data.error) {
        alert(`Error: ${data.error.message}`);
        return;
      }

      setAgentData(data.data);
    } catch (error) {
      console.error("Error fetching agent data:", error);
      alert("Failed to load agent data. Please check your token and try again.");
    }
  }

  async function handleLoadContracts(){
    try {
      const data = await getContracts();

      if (data.error) {
        alert(`Error: ${data.error.message}`);
        return;
      } 
      setContractsData(data.data);
    } catch (error) {
      console.error("Error fetching contracts data:", error);
      alert("Failed to load contracts data. Please check your token and try again.");
    }
  }

  return (
    <div>
      <h1>SpaceTraders Fleet Commander</h1>
      <p>Connect your agent to begin.</p>

      <input type="text"
      placeholder="Paste your agent token"
      value={token}
      onChange={(event) => setToken(event.target.value)}>
      </input>

      <button onClick={handleSaveToken}>Save Token</button>
      <button onClick={handleLoadAgent}>Load Agent Data</button>
      <button onClick={handleLoadContracts}>Load Contracts</button>

      {agentData && (
        <div id="agent-info">
          <h2>Agent Information</h2>
          <p>Symbol: {agentData.symbol}</p>
          <p>Headquarters: {agentData.headquarters}</p>
          <p>Credits: {agentData.credits}</p>
          <p>Starting Faction: {agentData.startingFaction}</p>
        </div>
        
      )}

      {contractsData && (
  <div>
    <h2>Contracts</h2>

    {contractsData.length === 0 ? (
      <p>No contracts found.</p>
    ) : (
      contractsData.map((contract) => (
        <div key={contract.id}>
          <p>Contract ID: {contract.id}</p>
          <p>Faction: {contract.factionSymbol}</p>
          <p>Accepted: {contract.accepted ? "Yes" : "No"}</p>
          <p>Fulfilled: {contract.fulfilled ? "Yes" : "No"}</p>
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

    </div>
    
    
  );
}

export default Dashboard;