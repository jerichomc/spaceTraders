import { useState} from 'react';
import { getAgent } from '../services/spacetraders.js';

function Dashboard() {
  const [token, setToken] = useState('');
  const [agentData, setAgentData] = useState(null);

  function handleSaveToken(){
    localStorage.setItem("agentToken", token);
    alert("Token Saved!");
  }

  async function handleLoadAgent(){
    const data = await getAgent();
    setAgentData(data.data);
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

      {agentData && (
        <div>
          <h2>Agent Information</h2>
          <p>Symbol: {agentData.symbol}</p>
          <p>Headquarters: {agentData.headquarters}</p>
          <p>Credits: {agentData.credits}</p>
          <p>Starting Faction: {agentData.startingFaction}</p>

        </div>
      )}
    </div>
  );
}

export default Dashboard;