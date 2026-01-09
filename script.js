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
        trend: "down"
    },
    { 
        land: "Deutschland", 
        unternehmen: "RWE AG", 
        branche: "Energie", 
        emissionen: 78.5, 
        jahr: 2023, 
        trend: "stable"
    },
    { 
        land: "Deutschland", 
        unternehmen: "BASF SE", 
        branche: "Chemie", 
        emissionen: 22.8, 
        jahr: 2023, 
        trend: "down"
    },
    
    // USA
    { 
        land: "USA", 
        unternehmen: "ExxonMobil", 
        branche: "Öl & Gas", 
        emissionen: 120.3, 
        jahr: 2023, 
        trend: "up"
    },
    { 
        land: "USA", 
        unternehmen: "General Motors", 
        branche: "Automobil", 
        emissionen: 52.7, 
        jahr: 2023, 
        trend: "down"
    },
    { 
        land: "USA", 
        unternehmen: "Duke Energy", 
        branche: "Energie", 
        emissionen: 88.9, 
        jahr: 2023, 
        trend: "stable"
    },
    
    // China
    { 
        land: "China", 
        unternehmen: "Sinopec", 
        branche: "Öl & Gas", 
        emissionen: 215.8, 
        jahr: 2023, 
        trend: "up"
    },
    { 
        land: "China", 
        unternehmen: "State Grid", 
        branche: "Energie", 
        emissionen: 189.4, 
        jahr: 2023, 
        trend: "up"
    },
    { 
        land: "China", 
        unternehmen: "SAIC Motor", 
        branche: "Automobil", 
        emissionen: 41.6, 
        jahr: 2023, 
        trend: "stable"
    },
    
    // Weitere Länder
    { 
        land: "Japan", 
        unternehmen: "Toyota", 
        branche: "Automobil", 
        emissionen: 38.9, 
        jahr: 2023, 
        trend: "down"
    },
    { 
        land: "Japan", 
        unternehmen: "Tokyo Electric", 
        branche: "Energie", 
        emissionen: 67.2, 
        jahr: 2023, 
        trend: "stable"
    },
    { 
        land: "Indien", 
        unternehmen: "Reliance Industries", 
        branche: "Öl & Gas", 
        emissionen: 92.1, 
        jahr: 2023, 
        trend: "up"
    },
    { 
        land: "Frankreich", 
        unternehmen: "TotalEnergies", 
        branche: "Öl & Gas", 
        emissionen: 58.3, 
        jahr: 2023, 
        trend: "stable"
    },
    { 
        land: "Großbritannien", 
        unternehmen: "BP", 
        branche: "Öl & Gas", 
        emissionen: 63.7, 
        jahr: 2023, 
        trend: "down"
    },
    { 
        land: "Niederlande", 
        unternehmen: "Shell", 
        branche: "Öl & Gas", 
        emissionen: 71.5, 
        jahr: 2023, 
        trend: "stable"
    },
    { 
        land: "Südkorea", 
        unternehmen: "Hyundai", 
        branche: "Automobil", 
        emissionen: 34.8, 
        jahr: 2023, 
        trend: "down"
    },
    { 
        land: "Brasilien", 
        unternehmen: "Petrobras", 
        branche: "Öl & Gas", 
        emissionen: 49.6, 
        jahr: 2023, 
        trend: "up"
    },
    { 
        land: "Australien", 
        unternehmen: "BHP", 
        branche: "Bergbau", 
        emissionen: 41.2, 
        jahr: 2023, 
        trend: "stable"
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
    
    if (newDir === 'rtl') {
        button.innerHTML = '<i class="fas fa-exchange-alt me-1"></i> LTR';
        button.title = "Zu Links-nach-Rechts wechseln";
    } else {
        button.innerHTML = '<i class="fas fa-exchange-alt me-1"></i> RTL';
        button.title = "Zu Rechts-nach-Links wechseln";
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
                            text: 'Steigend'
                        },
                        'down': {
                            icon: 'fa-arrow-down',
                            css: 'trend-down',
                            text: 'Fallend'
                        },
                        'stable': {
                            icon: 'fa-minus',
                            css: 'trend-stable',
                            text: 'Stabil'
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
        
        // Initialisierung Callback
        initComplete: function() {
            console.log('DataTables 2.x initialisiert');
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
    csvContent += "Land,Unternehmen,Branche,Emissionen (Mt CO₂),Jahr,Trend\n";
    
    // Daten
    co2Data.forEach(row => {
        const trendText = row.trend === 'up' ? 'Steigend' : 
                         row.trend === 'down' ? 'Fallend' : 'Stabil';
        
        csvContent += `${row.land},${row.unternehmen},${row.branche},${row.emissionen},${row.jahr},${trendText}\n`;
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
    
    // Benachrichtigung
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
    // Einfache Notification
    const alertClass = {
        'success': 'alert-success',
        'error': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    }[type] || 'alert-info';
    
    const notification = document.createElement('div');
    notification.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 80px;
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

// ============================================
// 7. NAVIGATION HIGHLIGHTING
// ============================================
function setupNavigation() {
    // Aktiven Navigationspunkt setzen basierend auf Scroll-Position
    const sections = document.querySelectorAll('section, main, footer');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}` || 
                (current === '' && link.getAttribute('href') === '#top')) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================
// 8. EVENT LISTENER UND INITIALISIERUNG
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('CO₂ Footprint App wird geladen...');
    
    try {
        // 1. Navigation einrichten
        setupNavigation();
        
        // 2. DataTables initialisieren
        initializeTable();
        
        // 3. Event-Listener für Suchfeld
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const searchValue = sanitizeInput(e.target.value);
                if (window.dataTableInstance) {
                    window.dataTableInstance.search(searchValue).draw();
                }
            });
        }
        
        // 4. Event-Listener für Filter-Reset
        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                if (window.dataTableInstance) {
                    window.dataTableInstance.search('').draw();
                    document.getElementById('searchInput').value = '';
                    showNotification('Alle Filter wurden zurückgesetzt', 'success');
                }
            });
        }
        
        // 5. Event-Listener für CSV Export
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportToCSV);
        }
        
        // 6. Sicherheits-Check: Alle Benutzereingaben escapen
        document.querySelectorAll('input, textarea').forEach(input => {
            const originalValue = input.value;
            input.value = escapeHTML(originalValue);
        });
        
        console.log(`✅ App erfolgreich initialisiert mit ${co2Data.length} Datensätzen`);
        
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
// 9. GLOBALE FUNKTIONEN FÜR EVENT-HANDLER
// ============================================
window.toggleRTL = toggleRTL;
window.exportToCSV = exportToCSV;