using { HealthService } from '../srv/service';

// This tells the UI how to display the "DashboardLogs" table
annotate HealthService.DashboardLogs with @(
    UI : {
        // 1. Define which columns to show in the table
        LineItem : [
            { 
                $Type : 'UI.DataField', 
                Value : timestamp,
                Label : 'Time'
            },
            { 
                $Type : 'UI.DataField', 
                Value : severity,
                Label : 'Risk Level'
            },
            { 
                $Type : 'UI.DataField', 
                Value : message,
                Label : 'System Message'
            },
            { 
                $Type : 'UI.DataField', 
                Value : cpu_usage,
                Label : 'CPU %'
            },
            // 2. THE MAGICAL BUTTON ⚡
            {
                $Type : 'UI.DataFieldForAction',
                Action : 'HealthService.rebootSystem',
                Label : '⚡ Reboot System'
            }
        ]
    }
);