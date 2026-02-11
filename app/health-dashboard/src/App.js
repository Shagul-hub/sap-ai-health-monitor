import React, { useState, useEffect } from 'react';
import { ThemeProvider, ShellBar, Card, CardHeader, List, StandardListItem, ValueState, ProgressIndicator, Button, Icon } from '@ui5/webcomponents-react';
import axios from 'axios';
import '@ui5/webcomponents-icons/dist/AllIcons.js'; // Import icons

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Logs from Node.js Backend
  const fetchLogs = async () => {
    try {
      // In BTP, this relative path proxies to the backend
      const response = await axios.get('/odata/v4/health/DashboardLogs');
      setLogs(response.data.value);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  // 2. Function to Trigger AI Manually
  const handleAIAnalysis = async (logID) => {
    setLoading(true);
    try {
      await axios.post('/odata/v4/health/predictRisk', { logID });
      alert("AI Analysis Complete! Refreshing...");
      fetchLogs(); // Reload data to see new risk score
    } catch (error) {
      alert("AI Service Failed!");
    }
    setLoading(false);
  };

  return (
    <ThemeProvider>
      {/* A. Top Navigation Bar */}
      <ShellBar primaryTitle="SAP AI System Health Monitor" logo="https://sap.github.io/ui5-webcomponents/assets/images/sap-logo-svg.svg" />

      <div style={{ padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* B. Overview Card */}
        <Card header={<CardHeader title="System Status" subtitle="Live AI Monitoring" avatar={<Icon name="electrocardiogram" />} />} style={{ width: '300px' }}>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2 style={{ color: logs[0]?.severity === 'CRITICAL' ? 'red' : 'green' }}>
              {logs[0]?.severity || "NORMAL"}
            </h2>
            <p>Latest Risk Score: {logs[0]?.ai_risk_score || 0}%</p>
            <ProgressIndicator value={logs[0]?.ai_risk_score || 0} valueState={logs[0]?.ai_risk_score > 80 ? ValueState.Error : ValueState.Success} />
          </div>
        </Card>

        {/* C. Recent Logs List */}
        <Card header={<CardHeader title="Recent Logs" subtitle="Real-time Data Stream" />} style={{ flex: 1, minWidth: '400px' }}>
          <List>
            {logs.map((log) => (
              <StandardListItem
                key={log.ID}
                description={`${log.timestamp} - Module: ${log.module}`}
                additionalText={`CPU: ${log.cpu_usage}% | Mem: ${log.memory_usage}%`}
                additionalTextState={ValueState.Information}
                icon={log.is_archived ? "cloud" : "database"} // Cloud icon if in Azure
              >
                {log.message} 
                {/* Button to Manually Check Health if Risk is Unknown */}
                {!log.ai_risk_score && (
                  <Button design="Emphasized" onClick={() => handleAIAnalysis(log.ID)} disabled={loading} style={{ marginLeft: '10px' }}>
                    Check Risk
                  </Button>
                )}
              </StandardListItem>
            ))}
          </List>
        </Card>

      </div>
    </ThemeProvider>
  );
}

export default App;