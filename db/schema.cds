namespace my.health;

using { managed, cuid } from '@sap/cds/common';

// 1. Main Table: Stores Real-Time System Logs
entity SystemLogs : cuid, managed {
    timestamp     : DateTime @cds.on.insert: $now;
    severity      : String enum { LOW; MEDIUM; HIGH; CRITICAL };
    module        : String(20);  // e.g., "FI", "SD", "MM"
    message       : String(200); // e.g., "Memory usage exceeded 90%"
    cpu_usage     : Integer;     // 0-100
    memory_usage  : Integer;     // 0-100
    disk_usage    : Integer;     // 0-100
    
    // AI Integration Fields
    ai_risk_score : Double;      // e.g., 85.5 (Calculated by Python)
    predicted_crash_in : Integer;// e.g., 120 (minutes)
    
    // Azure Integration Fields
    is_archived   : Boolean default false; 
    azure_blob_url: String(500); // URL if moved to Azure Storage
}

// 2. Table: Stores the "Health Rules" (Settings)
entity HealthRules : cuid, managed {
    metric_name   : String(50);  // e.g., "CPU_MAX_THRESHOLD"
    threshold     : Integer;     // e.g., 90
    action_type   : String;      // e.g., "EMAIL_ADMIN" or "AUTO_RESTART"
}