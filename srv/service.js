const cds = require('@sap/cds');
const axios = require('axios'); // We need this to talk to the AI

module.exports = cds.service.impl(async function() {

    // ---------------------------------------------------------
    // 1. EVENT: When Data Arrives (The "Trigger")
    // ---------------------------------------------------------
    this.before('CREATE', 'LogIngest', async (req) => {
        const log = req.data;
        console.log(`\n==========================================`);
        console.log(`>> 1. SAP Received Data: CPU ${log.cpu_usage}%`);

        try {
            // STEP A: Prepare data for the Brain
            const payload = {
                cpu: log.cpu_usage || 0,
                memory: log.memory_usage || 0,
                disk: log.disk_usage || 0
            };

            // STEP B: Call the AI Brain (Terminal 2)
            console.log(`>> 2. Calling AI Brain at http://127.0.0.1:8000...`);
            const aiResponse = await axios.post('http://127.0.0.1:8000/predict', payload);
            
            // STEP C: Read the Brain's Answer
            const risk = aiResponse.data;
            console.log(`>> 3. AI Response: Risk Level = ${risk.risk_level} (Score: ${risk.risk_score})`);

            // STEP D: Update the Log based on AI
            // We save the score too (optional but good for debugging)
            log.ai_risk_score = risk.risk_score; 

            if (risk.risk_score > 0.8 || risk.risk_level === "High") {
                log.severity = 'CRITICAL';
                log.message = log.message + " [⚠️ AI FLAGGED CRITICAL]";
            } else {
                log.severity = 'LOW';
                log.message = log.message + " [✅ AI CLEARED]";
            }

        } catch (error) {
            console.log(`>> ❌ AI Connection Failed: ${error.message}`);
            // If AI is dead, default to Medium
            log.severity = 'MEDIUM'; 
        }
        console.log(`==========================================\n`);
    });

    // ---------------------------------------------------------
    // 2. ACTION: Reboot System (The "Fix It" Button)
    // ---------------------------------------------------------
    // This listens for the 'rebootSystem' action on the DashboardLogs entity
    this.on('rebootSystem', 'DashboardLogs', async (req) => {
        console.log(">> 🛠️ Action Triggered: Rebooting System...");
        
        // The ID of the row we clicked is hidden inside req.params
        // Example: req.params might look like [ { ID: '...' } ]
        const id = req.params[0]; 

        if (id) {
            // Update the database to "Fix" the issue
            await UPDATE(req.target).set({
                severity: 'LOW',
                message: 'System Rebooted [✅ FIXED]',
                cpu_usage: 0,
                memory_usage: 0
            }).where(id);

            console.log(`>> ✅ Log ${id.ID} has been rebooted!`);
        } else {
            console.log(">> ⚠️ Error: Could not find ID to reboot.");
        }
    });

});