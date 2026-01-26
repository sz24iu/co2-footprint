// 1. CO₂-Daten - Laden aus externe JSON Datei
let co2Data = [];

// Daten von der externen JSON Datei laden
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        co2Data = await response.json();
        console.log(`Daten erfolgreich geladen: ${co2Data.length} Datensätze`);
        return true;
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        showNotification('Fehler beim Laden der Daten', 'error');
        return false;
    }
}


// 2. RTL/LTR Umschaltung
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

// 3. Datatables Initialisierung (linksbuendig)
function initializeTable() {
    const table = new DataTable('#co2-table', {
        // Datenquelle
        data: co2Data,
        
        // Spalten-Definition - alle erstmal linksbuendig
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
                title: 'Emissionen (Mio. t CO₂)',
                className: 'dt-body-left',
                render: function(data, type) {
                    if (type === 'display' || type === 'filter') {
                        // Formatierung mit Tausendertrennzeichen
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
                className: 'dt-body-left'
            },
            { 
                data: 'trend',
                title: 'Trend',
                className: 'dt-body-left',
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
                            <div class="d-flex align-items-center">
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
        
        // Suchfeld von DataTables ausblenden
        layout: {
            topStart: null,
            topEnd: null,
            bottomStart: 'info',
            bottomEnd: 'paging'
        },
        
        // DataTables-eigenes Suchfeld deaktivieren
        search: false,
        
        //
        initComplete: function() {
            console.log('DataTables 2.x initialisiert - Alle Spalten linksbündig');
        },
        
        // 
        createdRow: function(row, data, dataIndex) {
            // Datenattribute für Responsive Mode
            $(row).find('td:eq(0)').attr('data-label', 'Land');
            $(row).find('td:eq(1)').attr('data-label', 'Unternehmen');
            $(row).find('td:eq(2)').attr('data-label', 'Branche');
            $(row).find('td:eq(3)').attr('data-label', 'Emissionen (Mio. t CO₂)');
            $(row).find('td:eq(4)').attr('data-label', 'Jahr');
            $(row).find('td:eq(5)').attr('data-label', 'Trend');
        }
    });
    
    // Tabelle global verfügbar machen
    window.dataTableInstance = table;
    
    return table;
}

// 4. CSV Export-Funktion
function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header
    csvContent += "Land,Unternehmen,Branche,Emissionen (Mio. t CO₂),Jahr,Trend\n";
    
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

// 5. XSS-Schutz
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

// 6. Hilfsfunktionen
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

// 7. Navigation Highlightening
function setupNavigation() {
    // Aktiven Navigationspunkt setzen basierend auf Scroll-Position
    const sections = document.querySelectorAll('main, footer');
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

// 8. Event Listener und Initialisierung
document.addEventListener('DOMContentLoaded', async function() {
    console.log('CO₂-Footprint Tracker wird geladen...');
    
    try {
        // 1. Daten laden
        const dataLoaded = await loadData();
        if (!dataLoaded) {
            throw new Error('Daten konnten nicht geladen werden');
        }
        
        // 2. Navigation einrichten
        setupNavigation();
        
        // 3. DataTables initialisieren
        initializeTable();
        
        // 4. Event-Listener für eigenes Suchfeld
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const searchValue = sanitizeInput(e.target.value);
                if (window.dataTableInstance) {
                    window.dataTableInstance.search(searchValue).draw();
                }
            });
        }
        
        // 5. Event-Listener für Filter-Reset
        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                if (window.dataTableInstance) {
                    window.dataTableInstance.search('').order([[3, 'desc']]).draw();
                    document.getElementById('searchInput').value = '';
                    showNotification('Alle Filter und Sortierungen wurden zurückgesetzt', 'success');
                }
            });
        }
        
        // 6. Event-Listener für CSV Export
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportToCSV);
        }
        
        // 7. Sicherheits-Check: Alle Benutzereingaben escapen
        document.querySelectorAll('input, textarea').forEach(input => {
            const originalValue = input.value;
            input.value = escapeHTML(originalValue);
        });
        
        console.log(`App erfolgreich initialisiert mit ${co2Data.length} Datensätzen`);
        
    } catch (error) {
        console.error('Fehler bei der Initialisierung:', error);
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

// 9. Globale Funktionen fuer Eventhandler
window.toggleRTL = toggleRTL;
window.exportToCSV = exportToCSV;