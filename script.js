// 1. CO₂-Daten (fiktiv)
const co2Data = [
    { land: "Deutschland", unternehmen: "Volkswagen AG", branche: "Automobil", emissionen: 45.2, jahr: 2023, trend: "down" },
    { land: "Deutschland", unternehmen: "RWE AG", branche: "Energie", emissionen: 78.5, jahr: 2023, trend: "stable" },
    { land: "USA", unternehmen: "ExxonMobil", branche: "Öl & Gas", emissionen: 120.3, jahr: 2023, trend: "up" },
    { land: "USA", unternehmen: "General Motors", branche: "Automobil", emissionen: 52.7, jahr: 2023, trend: "down" },
    { land: "China", unternehmen: "Sinopec", branche: "Öl & Gas", emissionen: 215.8, jahr: 2023, trend: "up" },
    { land: "China", unternehmen: "State Grid", branche: "Energie", emissionen: 189.4, jahr: 2023, trend: "up" },
    { land: "Japan", unternehmen: "Toyota", branche: "Automobil", emissionen: 38.9, jahr: 2023, trend: "down" },
    { land: "Japan", unternehmen: "Tokyo Electric", branche: "Energie", emissionen: 67.2, jahr: 2023, trend: "stable" },
    { land: "Indien", unternehmen: "Reliance Industries", branche: "Öl & Gas", emissionen: 92.1, jahr: 2023, trend: "up" },
    { land: "Frankreich", unternehmen: "TotalEnergies", branche: "Öl & Gas", emissionen: 58.3, jahr: 2023, trend: "stable" },
    { land: "Großbritannien", unternehmen: "BP", branche: "Öl & Gas", emissionen: 63.7, jahr: 2023, trend: "down" },
    { land: "Niederlande", unternehmen: "Shell", branche: "Öl & Gas", emissionen: 71.5, jahr: 2023, trend: "stable" },
    { land: "Südkorea", unternehmen: "Hyundai", branche: "Automobil", emissionen: 34.8, jahr: 2023, trend: "down" },
    { land: "Brasilien", unternehmen: "Petrobras", branche: "Öl & Gas", emissionen: 49.6, jahr: 2023, trend: "up" },
    { land: "Australien", unternehmen: "BHP", branche: "Bergbau", emissionen: 41.2, jahr: 2023, trend: "stable" }
];

// 2. RTL/LTR Umschaltung
function toggleRTL() {
    const html = document.documentElement;
    const isRTL = html.getAttribute('dir') === 'rtl';
    const newDir = isRTL ? 'ltr' : 'rtl';
    
    html.setAttribute('dir', newDir);
    
    const button = document.getElementById('rtl-btn');
    const icon = button.querySelector('i');
    
    if (newDir === 'rtl') {
        button.innerHTML = '<i class="fas fa-exchange-alt me-1"></i> LTR';
        button.title = "Zu Links-nach-Rechts wechseln";
    } else {
        button.innerHTML = '<i class="fas fa-exchange-alt me-1"></i> RTL';
        button.title = "Zu Rechts-nach-Links wechseln";
    }
    
    // DataTables neu zeichnen für korrekte Darstellung
    if ($.fn.DataTable.isDataTable('#co2-table')) {
        $('#co2-table').DataTable().draw();
    }
}

// 3. Tabelle initialisieren und Daten laden
function initializeTable() {
    const table = $('#co2-table').DataTable({
        data: co2Data,
        columns: [
            { data: 'land' },
            { data: 'unternehmen' },
            { data: 'branche' },
            { 
                data: 'emissionen',
                render: function(data, type) {
                    if (type === 'display') {
                        return `<strong>${data.toFixed(1)}</strong>`;
                    }
                    return data;
                }
            },
            { data: 'jahr' },
            { 
                data: 'trend',
                render: function(data, type) {
                    const trendIcons = {
                        'up': '<i class="fas fa-arrow-up trend-up"></i> Steigend',
                        'down': '<i class="fas fa-arrow-down trend-down"></i> Fallend',
                        'stable': '<i class="fas fa-minus trend-stable"></i> Stabil'
                    };
                    return trendIcons[data] || data;
                }
            }
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/de-DE.json'
        },
        pageLength: 10,
        responsive: true,
        order: [[3, 'desc']], // Standard-Sortierung nach Emissionen (absteigend)
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>tip'
    });
    
    return table;
}

// 4. Export-Funktion (CSV)
function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header
    csvContent += "Land,Unternehmen,Branche,Emissionen (Mt CO₂),Jahr,Trend\n";
    
    // Daten
    co2Data.forEach(row => {
        const trendText = row.trend === 'up' ? 'Steigend' : row.trend === 'down' ? 'Fallend' : 'Stabil';
        csvContent += `${row.land},${row.unternehmen},${row.branche},${row.emissionen},${row.jahr},${trendText}\n`;
    });
    
    // Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "co2_emissionen.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 5. Event Listener und Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    // Tabelle initialisieren
    const dataTable = initializeTable();
    
    // Suchfunktion mit eigenem Input
    document.getElementById('searchInput').addEventListener('input', function(e) {
        dataTable.search(e.target.value).draw();
    });
    
    // Filter zurücksetzen
    document.getElementById('resetFilters').addEventListener('click', function() {
        dataTable.search('').columns().search('').draw();
        document.getElementById('searchInput').value = '';
    });
    
    // Export Button
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    
    // Sicherheit: Alle dynamischen Inhalte escapen
    document.querySelectorAll('[data-dynamic]').forEach(element => {
        const original = element.textContent;
        element.textContent = original; // Überschreibt potenziell gefährlichen Content
    });
    
    // Console Log für Debugging
    console.log('CO₂ Footprint App erfolgreich geladen!');
    console.log(`${co2Data.length} Datensätze geladen.`);
});

// 6. XSS-Sicherheitsfunktion
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Beispiel für sichere Eingabeverarbeitung
function handleUserInput() {
    // Falls du später Formulare hinzufügst:
    const userInput = document.getElementById('user-input-field');
    if (userInput) {
        const safeValue = sanitizeInput(userInput.value);
        // ... weiterverarbeiten
    }
}