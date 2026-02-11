using { my.health as health } from '../db/schema';

service HealthService {

    // 1. Dashboard View (Reads & Actions)
    // I removed '@readonly' so we can trigger the "Reboot" action on these rows.
    entity DashboardLogs as projection on health.SystemLogs actions {
        // 🛠️ This creates the "Reboot System" capability
        action rebootSystem();
    };

    // 2. Ingestion Endpoint (WRITE-ONLY)
    // The Python AI Service uses this to push new logs.
    @insertonly entity LogIngest as projection on health.SystemLogs;

    // 3. Admin Rules (FULL ACCESS)
    entity Rules as projection on health.HealthRules;

    // 4. Custom Function: AI Trigger
    function predictRisk(logID: UUID) returns String;
}