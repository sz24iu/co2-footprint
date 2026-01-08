// ============================================
// 1. CO₂-DATEN (fiktiv, aber realistisch)
// ============================================
const co2Data = [
    // Deutschland
    { 
        land: "Deutschland", 
        unternehmen: "Volkswagen AG", 
        branche: "Automobil", 
        emissionen: 45.2, 
        jahr: 2023, 
        trend: "down",
        details: "Reduktion durch E-Mobilitätsinitiativen"
    },
    { 
        land: "Deutschland", 
        unternehmen: "RWE AG", 
        branche: "Energie", 
        emissionen: 78.5, 
        jahr: 2023, 
        trend: "stable",
        details: "Kohleausstieg bis 2030 geplant"
    },
    { 
        land: "Deutschland", 
        unternehmen: "BASF SE", 
        branche: "Chemie", 
        emissionen: 22.8, 
        jahr: 2023, 
        trend: "down",
        details: "Investitionen in grüne Chemie"
    },
    
    // USA
    { 
        land: "USA", 
        unternehmen: "ExxonMobil", 
        branche: "Öl & Gas", 
        emissionen: 120.3, 
        jahr: 2023, 
        trend: "up",
        details: "Steigende Förderung in Permian Basin"
    },
    { 
        land: "USA", 
        unternehmen: "General Motors", 
        branche: "Automobil", 
        emissionen: 52.7, 
        jahr: 2023, 
        trend: "down",
        details: "Umstellung auf Elektrofahrzeuge"
    },
    { 
        land: "USA", 
        unternehmen: "Duke Energy", 
        branche: "Energie", 
        emissionen: 88.9, 
        jahr: 2023, 
        trend: "stable",
        details: "Mix aus fossilen und erneuerbaren Energien"
    },
    
    // China
    { 
        land: "China", 
        unternehmen: "Sinopec", 
        branche: "Öl & Gas", 
        emissionen: 215.8, 
        jahr: 2023, 
        trend: "up",
        details: "Wachstum der petrochemischen Industrie"
    },
    { 
        land: "China", 
        unternehmen: "State Grid", 
        branche: "Energie", 
        emissionen: 189.4, 
        jahr: 2023, 
        trend: "up",
        details: "Kohlelastiger Energiemix"
    },
    { 
        land: "China", 
        unternehmen: "SAIC Motor", 
        branche: "Automobil", 
        emissionen: 41.6, 
        jahr: 2023, 
        trend: "stable",
        details: "Wachstum im E-Auto-Sektor"
    },
    
    // Weitere Länder
    { 
        land: "Japan", 
        unternehmen: "Toyota", 
        branche: "Automobil", 
        emissionen: 38.9, 
        jahr: 2023, 
        trend: "down",
        details: "Wasserstoff-Initiativen"
    },
    { 
        land: "Japan", 
        unternehmen: "Tokyo Electric", 
        branche: "Energie", 
        emissionen: 67.2, 
        jahr: 2023, 
        trend: "stable",
        details: "Wiederinbetriebnahme von Atomkraftwerken"
    },
    { 
        land: "Indien", 
        unternehmen: "Reliance Industries", 
        branche: "Öl & Gas", 
        emissionen: 92.1, 
        jahr: 2023, 
        trend: "up",
        details: "Expansion der Raffineriekapazitäten"
    },
    { 
        land: "Frankreich", 
        unternehmen: "TotalEnergies", 
        branche: "Öl & Gas", 
        emissionen: 58.3, 
        jahr: 2023, 
        trend: "stable",
        details: "Investitionen in erneuerbare Energien"
    },
    { 
        land: "Großbritannien", 
        unternehmen: "BP", 
        branche: "Öl & Gas", 
        emissionen: 63.7, 
        jahr: 2023, 
        trend: "down",
        details: "Netto-Null-Strategie 2050"
    },
    { 
        land: "Niederlande", 
        unternehmen: "Shell", 
        branche: "Öl & Gas", 
        emissionen: 71.5, 
        jahr: 2023, 
        trend: "stable",
        details: "CO₂-Abscheidungsprojekte"
    },
    { 
        land: "Südkorea", 
        unternehmen: "Hyundai", 
        branche: "Automobil", 
        emissionen: 34.8, 
        jahr: 2023, 
        trend: "down",
        details: "E-Mobilitäts-Offensive"
    },
    { 
        land: "Brasilien", 
        unternehmen: "Petrobras", 
        branche: "Öl & Gas", 
        emissionen: 49.6, 
        jahr: 2023, 
        trend: "up",
        details: "Offshore-Förderung im Amazonasgebiet"
    },
    { 
        land: "Australien", 
        unternehmen: "BHP", 
        branche: "Bergbau", 
        emissionen: 41.2, 
        jahr: 2023, 
        trend: "stable",
        details: "Emissionen aus Eisenore-Abbau"
    }
];

// ============================================
// 2. RTL/LTR UMSCHALTUNG
// ============================================
function toggleRTL() {
    const html = document.documentElement;
    const isRTL = html.getAttribute('dir') === 'rtl';
    const newDir = isRTL ? 'ltr' : 'rtl';
    
    // HTML-Attribut ändern
    html.setAttribute('dir', newDir);
    
    // Button-Text aktualisieren
    const button = document.getElementById('rtl-btn');
    const icon = button.querySelector('i');
    
    if (newDir === 'rtl') {
        button.innerHTML = '<i class="fas fa-exchange-alt me-1"></i> LTR';
        button.title = "Zu Links-nach-Rechts wechseln";
        showNotification('Rechts-nach-Links Modus aktiviert', 'info');
    } else {
        button.innerHTML = '<i class="fas fa-exchange-alt me-1"></i> RTL';
        button.title = "Zu Rechts-nach-Links wechseln";
        showNotification('Links-nach-Rechts Modus aktiviert', 'info');
    }
    
    // DataTables Tabelle neu zeichnen für korrekte Darstellung
    if (window.dataTableInstance) {
        window.dataTableInstance.draw();
    }
}

// ============================================
// 3. DATATABLES 2.X INITIALISIERUNG
// ============================================
function initializeTable() {
    // DataTables 2.x Initialisierung
    const table = new DataTable('#co2-table', {
        // Datenquelle
        data: co2Data,
        
        // Spalten-Definition
        columns: [
            { 
                data: 'land',
                title: 'Land',
                className: 'dt-body-left'
            },
            { 
                data: 'unternehmen',
                title: 'Unternehmen',
                className: 'dt-body-left'
            },
            { 
                data: 'branche',
                title: 'Branche',
                className: 'dt-body-left'
            },
            { 
                data: 'emissionen',
                title: 'Emissionen (Mt CO₂)',
                className: 'dt-body-right',
                render: function(data, type) {
                    if (type === 'display' || type === 'filter') {
                        // Formatierung mit Tausendertrennzeichen und eine Dezimalstelle
                        return new Intl.NumberFormat('de-DE', {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1
                        }).format(data);
                    }
                    return data;
                }
            },
            { 
                data: 'jahr',
                title: 'Jahr',
                className: 'dt-body-center'
            },
            { 
                data: 'trend',
                title: 'Trend',
                className: 'dt-body-center',
                render: function(data, type) {
                    const trendConfig = {
                        'up': {
                            icon: 'fa-arrow-up',
                            css: 'trend-up',
                            text: 'Steigend',
                            color: '#dc3545'
                        },
                        'down': {
                            icon: 'fa-arrow-down',
                            css: 'trend-down',
                            text: 'Fallend',
                            color: '#28a745'
                        },
                        'stable': {
                            icon: 'fa-minus',
                            css: 'trend-stable',
                            text: 'Stabil',
                            color: '#6c757d'
                        }
                    };
                    
                    const config = trendConfig[data] || trendConfig.stable;
                    
                    if (type === 'display') {
                        return `
                            <div class="d-flex align-items-center justify-content-center">
                                <i class="fas ${config.icon} ${config.css} me-2"></i>
                                <span>${config.text}</span>
                            </div>
                        `;
                    }
                    
                    return config.text;
                }
            }
        ],
        
        // Deutsche Sprache
        language: {
            url: 'https://cdn.datatables.net/plug-ins/2.3.6/i18n/de-DE.json'
        },
        
        // Standard-Sortierung nach Emissionen (absteigend)
        order: [[3, 'desc']],
        
        // Zeilen pro Seite
        pageLength: 10,
        
        // Responsive Design
        responsive: true,
        
        // Layout-Konfiguration
        layout: {
            topStart: null,
            topEnd: 'search',
            bottomStart: 'info',
            bottomEnd: 'paging'
        },
        
        // Such-Optionen
        search: {
            return: true
        },
        
        // Spalten-Sortierung aktivieren
        ordering: true,
        
        // Initialisierung Callback
        initComplete: function() {
            console.log('DataTables 2.x initialisiert');
            
            // Suchfeld Event-Listener
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('input', function(e) {
                    table.search(e.target.value).draw();
                });
            }
        },
        
        // Zeilen-Callback für zusätzliche Attribute
        createdRow: function(row, data, dataIndex) {
            // Datenattribute für Responsive Mode
            $(row).find('td:eq(0)').attr('data-label', 'Land');
            $(row).find('td:eq(1)').attr('data-label', 'Unternehmen');
            $(row).find('td:eq(2)').attr('data-label', 'Branche');
            $(row).find('td:eq(3)').attr('data-label', 'Emissionen (Mt CO₂)');
            $(row).find('td:eq(4)').attr('data-label', 'Jahr');
            $(row).find('td:eq(5)').attr('data-label', 'Trend');
            
            // Tooltip für Details
            $(row).attr('title', data.details || 'Keine weiteren Details verfügbar');
            $(row).attr('data-bs-toggle', 'tooltip');
        }
    });
    
    // Tabelle global verfügbar machen
    window.dataTableInstance = table;
    
    return table;
}

// ============================================
// 4. CSV EXPORT-FUNKTION
// ============================================
function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header
    csvContent += "Land,Unternehmen,Branche,Emissionen (Mt CO₂),Jahr,Trend,Details\n";
    
    // Daten
    co2Data.forEach(row => {
        const trendText = row.trend === 'up' ? 'Steigend' : 
                         row.trend === 'down' ? 'Fallend' : 'Stabil';
        
        // CSV-sichere Formatierung (Anführungszeichen escapen)
        const safeDetails = (row.details || '').replace(/"/g, '""');
        
        csvContent += `"${row.land}","${row.unternehmen}","${row.branche}",${row.emissionen},${row.jahr},"${trendText}","${safeDetails}"\n`;
    });
    
    // Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `co2_emissionen_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('CSV-Export erfolgreich gestartet', 'success');
}

// ============================================
// 5. XSS-SICHERHEITSFUNKTIONEN
// ============================================
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // HTML-Entities escapen
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

function escapeHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return String(text).replace(/[&<>"']/g, function(m) {
        return map[m];
    });
}

// ============================================
// 6. HILFSFUNKTIONEN
// ============================================
function showNotification(message, type = 'info') {
    // Einfache Notification (kann durch Toast ersetzt werden)
    const alertClass = {
        'success': 'alert-success',
        'error': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    }[type] || 'alert-info';
    
    const notification = document.createElement('div');
    notification.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 1050;
        min-width: 300px;
    `;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Nach 5 Sekunden entfernen
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function resetAllFilters() {
    if (window.dataTableInstance) {
        window.dataTableInstance.search('').draw();
        document.getElementById('searchInput').value = '';
        showNotification('Alle Filter wurden zurückgesetzt', 'success');
    }
}

// ============================================
// 7. EVENT LISTENER UND INITIALISIERUNG
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('CO₂ Footprint App wird geladen...');
    
    try {
        // 1. DataTables initialisieren
        initializeTable();
        
        // 2. Event-Listener für Suchfeld (falls es existiert)
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const searchValue = sanitizeInput(e.target.value);
                if (window.dataTableInstance) {
                    window.dataTableInstance.search(searchValue).draw();
                }
            });
        }
        
        // 3. Event-Listener für Filter-Reset
        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetAllFilters);
        }
        
        // 4. Event-Listener für Export
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportToCSV);
        }
        
        // 5. Bootstrap Tooltips aktivieren
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        
        // 6. Sicherheits-Check: Alle Benutzereingaben escapen
        document.querySelectorAll('input, textarea').forEach(input => {
            const originalValue = input.value;
            input.value = escapeHTML(originalValue);
        });
        
        console.log(`✅ App erfolgreich initialisiert mit ${co2Data.length} Datensätzen`);
        showNotification('CO₂ Footprint Tracker geladen', 'success');
        
    } catch (error) {
        console.error('❌ Fehler bei der Initialisierung:', error);
        showNotification('Fehler beim Laden der Anwendung', 'error');
        
        // Fallback: Einfache Tabelle ohne DataTables
        const tableBody = document.querySelector('#co2-table tbody');
        if (tableBody) {
            co2Data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${escapeHTML(item.land)}</td>
                    <td>${escapeHTML(item.unternehmen)}</td>
                    <td>${escapeHTML(item.branche)}</td>
                    <td>${escapeHTML(item.emissionen.toFixed(1))}</td>
                    <td>${escapeHTML(item.jahr.toString())}</td>
                    <td>${escapeHTML(item.trend)}</td>
                `;
                tableBody.appendChild(row);
            });
        }
    }
});

// ============================================
// 8. GLOBALE FUNKTIONEN FÜR EVENT-HANDLER
// ============================================
// Wichtig: Diese müssen global verfügbar sein für onclick-Attribute
window.toggleRTL = toggleRTL;
window.exportToCSV = exportToCSV;
window.resetAllFilters = resetAllFilters;