// Configurações iniciais
const JOAO_MONLEVADE_CENTER = [-19.8127, -43.1735]; // Coordenadas de João Monlevade
const DEFAULT_ZOOM = 12;

// Variáveis globais
let map;
let currentBasemap = 'streets';
let layers = {};
let isMobileMode = false;
let measureControl = null;

// Variáveis para análise espacial
let analysisMode = false;
let selectedNascente = null;
let bufferLayer = null;
let highlightedFeatures = [];
let analysisResults = null;

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    setupEventListeners();
    loadGeoJSONLayers();
    setupResponsiveBehavior();
    showWelcomePopup();
    updateLegend(); // Inicializar legenda
});

// Inicialização do mapa
function initializeMap() {
    // Criar mapa
    map = L.map('map', {
        center: JOAO_MONLEVADE_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        attributionControl: true
    });

    // Adicionar mapas base
    const basemaps = {
        streets: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }),
        satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri',
            maxZoom: 19
        }),
        terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenTopoMap',
            maxZoom: 17
        })
    };

    // Adicionar mapa base padrão
    basemaps.streets.addTo(map);
    layers.basemaps = basemaps;

    // Atualizar coordenadas e zoom na barra de status
    updateStatusBar();
    
    // Event listeners do mapa
    map.on('mousemove', updateCoordinates);
    map.on('zoomend', updateStatusBar);
    map.on('moveend', updateStatusBar);
}

// Configuração dos event listeners
function setupEventListeners() {
    // Toggle de dispositivo
    document.getElementById('desktopMode').addEventListener('click', () => setDeviceMode('desktop'));
    document.getElementById('mobileMode').addEventListener('click', () => setDeviceMode('mobile'));

    // Controles de camadas
    document.querySelectorAll('input[name="basemap"]').forEach(radio => {
        radio.addEventListener('change', changeBasemap);
    });

    document.getElementById('bairros').addEventListener('change', toggleLayer);
    document.getElementById('estruturas').addEventListener('change', toggleLayer);
    document.getElementById('monlevade').addEventListener('change', toggleLayer);
    document.getElementById('ruas').addEventListener('change', toggleLayer);
    document.getElementById('nascentes').addEventListener('change', toggleLayer);

    // Botões de ferramentas
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
    document.getElementById('measureBtn').addEventListener('click', toggleMeasureTool);
    document.getElementById('infoBtn').addEventListener('click', showInfo);

    // Sidebar mobile
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
    document.getElementById('closeSidebar').addEventListener('click', closeSidebar);
    
    // Botão flutuante de camadas
    document.getElementById('layersToggle').addEventListener('click', toggleSidebar);

    // Popup de boas-vindas
    document.getElementById('closeWelcome').addEventListener('click', closeWelcomePopup);
    document.getElementById('startExploring').addEventListener('click', closeWelcomePopup);

    // Controles de análise espacial
    document.getElementById('startAnalysisBtn').addEventListener('click', toggleAnalysisMode);
    document.getElementById('clearAnalysisBtn').addEventListener('click', clearAnalysis);
    document.getElementById('closeResults').addEventListener('click', closeResultsPanel);
    document.getElementById('statsBtn').addEventListener('click', showStatisticalSummary);

    // Detectar mudanças de tamanho da tela
    window.addEventListener('resize', handleResize);
}

// Carregamento das camadas GeoJSON
async function loadGeoJSONLayers() {
    try {
        // Carregar camada de bairros
        const bairrosResponse = await fetch('Informaçoes Bairros.geojson');
        const bairrosData = await bairrosResponse.json();
        
        layers.bairros = L.geoJSON(bairrosData, {
            style: {
                fillColor: '#3498db',
                fillOpacity: 0.3,
                color: '#2980b9',
                weight: 2,
                opacity: 0.8
            },
            onEachFeature: function(feature, layer) {
                if (feature.properties) {
                    const popupContent = `
                        <div class="popup-content">
                            <h4><i class="fas fa-home"></i> ${feature.properties.NOME || 'Bairro'}</h4>
                            <p><strong>Área:</strong> ${feature.properties.AREA ? (feature.properties.AREA / 10000).toFixed(2) + ' ha' : 'N/A'}</p>
                            <p><strong>População:</strong> ${feature.properties.POPULACAO || 'N/A'}</p>
                        </div>
                    `;
                    layer.bindPopup(popupContent);
                }
                
                layer.on('mouseover', function() {
                    this.setStyle({
                        fillOpacity: 0.6,
                        weight: 3
                    });
                });
                
                layer.on('mouseout', function() {
                    this.setStyle({
                        fillOpacity: 0.3,
                        weight: 2
                    });
                });
            }
        });

        // Carregar camada de estruturas urbanas
        const estruturasResponse = await fetch('Estruturas Urbanas.geojson');
        const estruturasData = await estruturasResponse.json();
        
        layers.estruturas = L.geoJSON(estruturasData, {
            style: {
                fillColor: '#e74c3c',
                fillOpacity: 0.4,
                color: '#c0392b',
                weight: 1.5,
                opacity: 0.9
            },
            onEachFeature: function(feature, layer) {
                if (feature.properties) {
                    const popupContent = `
                        <div class="popup-content">
                            <h4><i class="fas fa-building"></i> ${feature.properties.TIPO || 'Estrutura Urbana'}</h4>
                            <p><strong>Nome:</strong> ${feature.properties.NOME || 'N/A'}</p>
                            <p><strong>Função:</strong> ${feature.properties.FUNCAO || 'N/A'}</p>
                        </div>
                    `;
                    layer.bindPopup(popupContent);
                }
                
                layer.on('mouseover', function() {
                    this.setStyle({
                        fillOpacity: 0.7,
                        weight: 2.5
                    });
                });
                
                layer.on('mouseout', function() {
                    this.setStyle({
                        fillOpacity: 0.4,
                        weight: 1.5
                    });
                });
            }
        });

        // Carregar camada de limites municipais
        const monlevadeResponse = await fetch('Monlevade.geojson');
        const monlevadeData = await monlevadeResponse.json();
        
        layers.monlevade = L.geoJSON(monlevadeData, {
            style: {
                fillColor: '#27ae60',
                fillOpacity: 0.2,
                color: '#229954',
                weight: 3,
                opacity: 0.9,
                dashArray: '5,5'
            },
            onEachFeature: function(feature, layer) {
                const popupContent = `
                    <div class="popup-content">
                        <h4><i class="fas fa-map"></i> João Monlevade</h4>
                        <p><strong>Município:</strong> João Monlevade - MG</p>
                        <p><strong>Região:</strong> Vale do Aço</p>
                        <p><strong>Área Total:</strong> ~99 km²</p>
                    </div>
                `;
                layer.bindPopup(popupContent);
                
                layer.on('mouseover', function() {
                    this.setStyle({
                        fillOpacity: 0.4,
                        weight: 4
                    });
                });
                
                layer.on('mouseout', function() {
                    this.setStyle({
                        fillOpacity: 0.2,
                        weight: 3
                    });
                });
            }
        });

        // Carregar camada de ruas
        const ruasResponse = await fetch('Ruas.geojson');
        const ruasData = await ruasResponse.json();
        
        layers.ruas = L.geoJSON(ruasData, {
            style: {
                color: '#f39c12',
                weight: 2,
                opacity: 0.8
            },
            onEachFeature: function(feature, layer) {
                if (feature.properties && feature.properties.NM_LOG) {
                    const nomeRua = feature.properties.NM_TIT_LOG ? 
                        `${feature.properties.NM_TIP_LOG} ${feature.properties.NM_TIT_LOG} ${feature.properties.NM_LOG}` :
                        `${feature.properties.NM_TIP_LOG} ${feature.properties.NM_LOG}`;
                    
                    const popupContent = `
                        <div class="popup-content">
                            <h4><i class="fas fa-road"></i> ${nomeRua}</h4>
                            <p><strong>Setor:</strong> ${feature.properties.CD_SETOR || 'N/A'}</p>
                            <p><strong>Quadra:</strong> ${feature.properties.CD_QUADRA || 'N/A'}</p>
                            <p><strong>Residências:</strong> ${feature.properties.TOT_RES || '0'}</p>
                            <p><strong>Total Geral:</strong> ${feature.properties.TOT_GERAL || '0'}</p>
                        </div>
                    `;
                    layer.bindPopup(popupContent);
                }
                
                layer.on('mouseover', function() {
                    this.setStyle({
                        weight: 4,
                        opacity: 1
                    });
                });
                
                layer.on('mouseout', function() {
                    this.setStyle({
                        weight: 2,
                        opacity: 0.8
                    });
                });
            }
        });

        // Carregar camada de nascentes
        const nascentesResponse = await fetch('Nascentes.geojson');
        const nascentesData = await nascentesResponse.json();
        
        layers.nascentes = L.geoJSON(nascentesData, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 6,
                    fillColor: '#9b59b6',
                    color: '#8e44ad',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function(feature, layer) {
                if (feature.properties) {
                    const popupContent = `
                        <div class="popup-content">
                            <h4><i class="fas fa-tint"></i> Nascente ${feature.properties.NOME}</h4>
                            <p><strong>Altitude:</strong> ${feature.properties.ALTITUDE ? feature.properties.ALTITUDE.toFixed(2) + ' m' : 'N/A'}</p>
                            <p><strong>Data:</strong> ${feature.properties.DATA || 'N/A'}</p>
                            <p><strong>Coordenadas:</strong> ${feature.properties.LATITUDE?.toFixed(6)}, ${feature.properties.LONGITUDE?.toFixed(6)}</p>
                            ${analysisMode ? '<button class="analyze-btn" onclick="analyzeNascente(this)" data-feature-id="' + feature.properties.INDICE + '">Analisar Área</button>' : ''}
                        </div>
                    `;
                    layer.bindPopup(popupContent);
                }
                
                layer.on('mouseover', function() {
                    this.setStyle({
                        radius: 8,
                        fillOpacity: 1,
                        weight: 3
                    });
                });
                
                layer.on('mouseout', function() {
                    this.setStyle({
                        radius: 6,
                        fillOpacity: 0.8,
                        weight: 2
                    });
                });
                
                // Event listener para clique na nascente
                layer.on('click', function(e) {
                    if (analysisMode) {
                        analyzeNascenteByLayer(feature, layer);
                    }
                });
            }
        });

        // Adicionar camadas ao mapa
        layers.bairros.addTo(map);
        layers.estruturas.addTo(map);
        layers.monlevade.addTo(map);
        // Ruas e nascentes não são adicionadas por padrão (checkbox desmarcado)

        // Adicionar marcador central da cidade
        const cityMarker = L.marker(JOAO_MONLEVADE_CENTER, {
            icon: L.divIcon({
                className: 'city-marker',
                html: '<i class="fas fa-map-marker-alt" style="color: #e74c3c; font-size: 2rem;"></i>',
                iconSize: [40, 40],
                iconAnchor: [20, 40]
            })
        }).addTo(map);

        cityMarker.bindPopup(`
            <div class="popup-content">
                <h4><i class="fas fa-map-marker-alt"></i> Centro de João Monlevade</h4>
                <p><strong>Coordenadas:</strong> ${JOAO_MONLEVADE_CENTER[0].toFixed(4)}, ${JOAO_MONLEVADE_CENTER[1].toFixed(4)}</p>
                <p><strong>Altitude:</strong> ~720m</p>
            </div>
        `);

    } catch (error) {
        console.error('Erro ao carregar camadas GeoJSON:', error);
        showError('Erro ao carregar dados da cidade. Verifique se os arquivos GeoJSON estão presentes.');
    }
}

// Mudança de mapa base
function changeBasemap(event) {
    const newBasemap = event.target.value;
    
    if (currentBasemap !== newBasemap) {
        map.removeLayer(layers.basemaps[currentBasemap]);
        layers.basemaps[newBasemap].addTo(map);
        currentBasemap = newBasemap;
    }
}

// Toggle de camadas
function toggleLayer(event) {
    const layerName = event.target.id;
    const isChecked = event.target.checked;
    
    if (layers[layerName]) {
        if (isChecked) {
            layers[layerName].addTo(map);
        } else {
            map.removeLayer(layers[layerName]);
        }
    }
    
    // Atualizar legenda
    updateLegend();
}

// Configuração do modo responsivo
function setupResponsiveBehavior() {
    const isMobile = window.innerWidth <= 768;
    setDeviceMode(isMobile ? 'mobile' : 'desktop');
}

// Mudança de modo de dispositivo
function setDeviceMode(mode) {
    isMobileMode = mode === 'mobile';
    
    // Atualizar botões
    document.getElementById('desktopMode').classList.toggle('active', !isMobileMode);
    document.getElementById('mobileMode').classList.toggle('active', isMobileMode);
    
    // Aplicar classes CSS
    document.body.classList.toggle('mobile-mode', isMobileMode);
    
    // Ajustar layout
    if (isMobileMode) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebarToggle').style.display = 'block';
    } else {
        document.getElementById('sidebarToggle').style.display = 'none';
    }
    
    // Redimensionar mapa
    setTimeout(() => {
        map.invalidateSize();
    }, 300);
}

// Toggle da sidebar no mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
}

// Tela cheia
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Ferramenta de medição
function toggleMeasureTool() {
    if (!measureControl) {
        // Implementação básica de medição
        let measureMode = false;
        let measurePoints = [];
        let measureLine = null;
        
        const measureBtn = document.getElementById('measureBtn');
        
        if (!measureMode) {
            measureMode = true;
            measureBtn.innerHTML = '<i class="fas fa-stop"></i> Parar Medição';
            measureBtn.style.background = '#e74c3c';
            
            map.on('click', onMapClick);
        } else {
            measureMode = false;
            measureBtn.innerHTML = '<i class="fas fa-ruler"></i> Medir Distância';
            measureBtn.style.background = '';
            
            map.off('click', onMapClick);
            if (measureLine) {
                map.removeLayer(measureLine);
                measureLine = null;
            }
            measurePoints = [];
        }
        
        function onMapClick(e) {
            measurePoints.push(e.latlng);
            
            if (measurePoints.length === 1) {
                // Primeiro ponto
                L.marker(e.latlng).addTo(map);
            } else if (measurePoints.length === 2) {
                // Segundo ponto - calcular distância
                const distance = measurePoints[0].distanceTo(measurePoints[1]);
                measureLine = L.polyline(measurePoints, {color: 'red', weight: 3}).addTo(map);
                
                const midPoint = [
                    (measurePoints[0].lat + measurePoints[1].lat) / 2,
                    (measurePoints[0].lng + measurePoints[1].lng) / 2
                ];
                
                L.popup()
                    .setLatLng(midPoint)
                    .setContent(`Distância: ${(distance / 1000).toFixed(2)} km`)
                    .openOn(map);
                
                // Reset para nova medição
                measurePoints = [];
                setTimeout(() => {
                    map.removeLayer(measureLine);
                    measureLine = null;
                }, 5000);
            }
        }
    }
}

// Mostrar informações
function showInfo() {
    const infoContent = `
        <div class="info-popup">
            <h3><i class="fas fa-info-circle"></i> Sobre o WebGIS</h3>
            <p><strong>Desenvolvido com:</strong></p>
            <ul>
                <li>Leaflet.js - Biblioteca de mapas</li>
                <li>OpenStreetMap - Dados de base</li>
                <li>GeoJSON - Dados da cidade</li>
            </ul>
            <p><strong>Funcionalidades:</strong></p>
            <ul>
                <li>3 camadas de mapa base</li>
                <li>Dados dos bairros</li>
                <li>Estruturas urbanas</li>
                <li>Limites municipais</li>
                <li>Interface responsiva</li>
            </ul>
            <p><strong>João Monlevade - MG</strong></p>
            <p>Cidade do Vale do Aço, conhecida pela siderurgia e mineração.</p>
        </div>
    `;
    
    L.popup()
        .setLatLng(JOAO_MONLEVADE_CENTER)
        .setContent(infoContent)
        .openOn(map);
}

// Atualizar coordenadas do mouse
function updateCoordinates(e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    document.getElementById('coordinates').textContent = `Lat: ${lat}, Lng: ${lng}`;
}

// Atualizar barra de status
function updateStatusBar() {
    const zoom = map.getZoom();
    const center = map.getCenter();
    
    document.getElementById('zoom').textContent = `Zoom: ${zoom}`;
    
    // Calcular escala aproximada
    const scale = Math.round(591657550.5 / Math.pow(2, zoom));
    document.getElementById('scale').textContent = `Escala: 1:${scale.toLocaleString()}`;
}

// Mostrar popup de boas-vindas
function showWelcomePopup() {
    const popup = document.getElementById('welcomePopup');
    popup.style.display = 'block';
    
    // Adicionar animação de pulso no botão de camadas após 3 segundos
    setTimeout(() => {
        const layersBtn = document.getElementById('layersToggle');
        layersBtn.classList.add('pulse');
        
        // Remover a animação após 6 segundos
        setTimeout(() => {
            layersBtn.classList.remove('pulse');
        }, 6000);
    }, 3000);
}

// Fechar popup de boas-vindas
function closeWelcomePopup() {
    const popup = document.getElementById('welcomePopup');
    popup.style.display = 'none';
}

// Atualizar legenda dinamicamente
function updateLegend() {
    const legend = document.getElementById('legend');
    const legendItems = legend.querySelectorAll('.legend-item');
    
    legendItems.forEach((item, index) => {
        const layerNames = ['bairros', 'estruturas', 'monlevade', 'ruas', 'nascentes'];
        const layerName = layerNames[index];
        const checkbox = document.getElementById(layerName);
        
        if (checkbox) {
            item.style.opacity = checkbox.checked ? '1' : '0.5';
            item.style.fontWeight = checkbox.checked ? '600' : '400';
        }
    });
}

// Funções de Análise Espacial
function toggleAnalysisMode() {
    analysisMode = !analysisMode;
    const startBtn = document.getElementById('startAnalysisBtn');
    const status = document.getElementById('analysisStatus');
    
    if (analysisMode) {
        startBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar Análise';
        startBtn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        status.innerHTML = '<p><i class="fas fa-mouse-pointer"></i> Clique em uma nascente para analisar</p>';
        
        // Destacar nascentes
        if (layers.nascentes) {
            layers.nascentes.eachLayer(function(layer) {
                layer.setStyle({
                    radius: 8,
                    fillOpacity: 1,
                    weight: 3,
                    fillColor: '#e74c3c',
                    color: '#c0392b'
                });
            });
        }
    } else {
        startBtn.innerHTML = '<i class="fas fa-play"></i> Iniciar Análise';
        startBtn.style.background = '';
        status.innerHTML = '<p><i class="fas fa-info-circle"></i> Clique em uma nascente para analisar</p>';
        
        // Restaurar estilo das nascentes
        if (layers.nascentes) {
            layers.nascentes.eachLayer(function(layer) {
                layer.setStyle({
                    radius: 6,
                    fillOpacity: 0.8,
                    weight: 2,
                    fillColor: '#9b59b6',
                    color: '#8e44ad'
                });
            });
        }
        
        clearAnalysis();
    }
}

function analyzeNascenteByLayer(feature, layer) {
    const radius = parseInt(document.getElementById('bufferRadius').value);
    const center = layer.getLatLng();
    
    // Limpar análise anterior
    clearAnalysis();
    
    // Criar buffer
    const buffer = L.circle(center, {
        radius: radius,
        color: '#ffc107',
        fillColor: '#ffc107',
        fillOpacity: 0.3,
        weight: 2
    }).addTo(map);
    
    bufferLayer = buffer;
    
    // Realizar análise espacial
    performSpatialAnalysis(feature, center, radius);
    
    // Atualizar status
    document.getElementById('analysisStatus').innerHTML = 
        `<p><i class="fas fa-check-circle"></i> Análise concluída para Nascente ${feature.properties.NOME}</p>`;
    
    // Mostrar legenda do buffer
    document.getElementById('bufferLegend').style.display = 'flex';
}

function performSpatialAnalysis(nascente, center, radius) {
    const results = {
        nascente: nascente,
        radius: radius,
        features: {
            bairros: [],
            estruturas: [],
            ruas: []
        },
        stats: {
            totalBairros: 0,
            totalEstruturas: 0,
            totalRuas: 0
        }
    };
    
    // Analisar bairros
    if (layers.bairros) {
        layers.bairros.eachLayer(function(layer) {
            if (layer.getBounds) {
                const bounds = layer.getBounds();
                const distance = center.distanceTo(bounds.getCenter());
                if (distance <= radius) {
                    results.features.bairros.push(layer.feature);
                    results.stats.totalBairros++;
                    
                    // Destacar bairro
                    layer.setStyle({
                        fillOpacity: 0.8,
                        weight: 4,
                        fillColor: '#3498db',
                        color: '#2980b9'
                    });
                    highlightedFeatures.push(layer);
                }
            }
        });
    }
    
    // Analisar estruturas urbanas
    if (layers.estruturas) {
        layers.estruturas.eachLayer(function(layer) {
            if (layer.getBounds) {
                const bounds = layer.getBounds();
                const distance = center.distanceTo(bounds.getCenter());
                if (distance <= radius) {
                    results.features.estruturas.push(layer.feature);
                    results.stats.totalEstruturas++;
                    
                    // Destacar estrutura
                    layer.setStyle({
                        fillOpacity: 0.9,
                        weight: 3,
                        fillColor: '#e74c3c',
                        color: '#c0392b'
                    });
                    highlightedFeatures.push(layer);
                }
            }
        });
    }
    
    // Analisar ruas
    if (layers.ruas) {
        layers.ruas.eachLayer(function(layer) {
            if (layer.getLatLngs) {
                const latlngs = layer.getLatLngs();
                let minDistance = Infinity;
                
                // Calcular distância mínima entre a nascente e a rua
                latlngs.forEach(function(latlng) {
                    const distance = center.distanceTo(latlng);
                    if (distance < minDistance) {
                        minDistance = distance;
                    }
                });
                
                if (minDistance <= radius) {
                    results.features.ruas.push(layer.feature);
                    results.stats.totalRuas++;
                    
                    // Destacar rua
                    layer.setStyle({
                        weight: 5,
                        opacity: 1,
                        color: '#f39c12'
                    });
                    highlightedFeatures.push(layer);
                }
            }
        });
    }
    
    analysisResults = results;
    displayAnalysisResults(results);
}

function displayAnalysisResults(results) {
    const resultsPanel = document.getElementById('analysisResults');
    const resultsContent = document.getElementById('resultsContent');
    
    const nascente = results.nascente;
    const stats = results.stats;
    
    resultsContent.innerHTML = `
        <div class="result-item">
            <h5><i class="fas fa-tint"></i> Nascente ${nascente.properties.NOME}</h5>
            <p><strong>Altitude:</strong> ${nascente.properties.ALTITUDE ? nascente.properties.ALTITUDE.toFixed(2) + ' m' : 'N/A'}</p>
            <p><strong>Data:</strong> ${nascente.properties.DATA || 'N/A'}</p>
            <p><strong>Raio de Análise:</strong> ${results.radius} metros</p>
        </div>
        
        <div class="result-stats">
            <div class="stat-item">
                <span class="stat-number">${stats.totalBairros}</span>
                <span class="stat-label">Bairros</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${stats.totalEstruturas}</span>
                <span class="stat-label">Estruturas</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${stats.totalRuas}</span>
                <span class="stat-label">Ruas</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${stats.totalBairros + stats.totalEstruturas + stats.totalRuas}</span>
                <span class="stat-label">Total</span>
            </div>
        </div>
        
        <div class="result-item">
            <h5><i class="fas fa-info-circle"></i> Resumo</h5>
            <p>A nascente ${nascente.properties.NOME} tem influência sobre:</p>
            <ul>
                <li>${stats.totalBairros} bairro(s) na área de ${results.radius}m</li>
                <li>${stats.totalEstruturas} estrutura(s) urbana(s) próxima(s)</li>
                <li>${stats.totalRuas} rua(s) na zona de influência</li>
            </ul>
        </div>
    `;
    
    resultsPanel.style.display = 'block';
}

function clearAnalysis() {
    // Remover buffer
    if (bufferLayer) {
        map.removeLayer(bufferLayer);
        bufferLayer = null;
    }
    
    // Restaurar estilos das feições destacadas
    highlightedFeatures.forEach(function(layer) {
        if (layer.feature && layer.feature.properties) {
            // Restaurar estilo baseado no tipo de camada
            if (layer.feature.properties.NOME && layer.feature.properties.AREA) {
                // Bairro
                layer.setStyle({
                    fillOpacity: 0.3,
                    weight: 2,
                    fillColor: '#3498db',
                    color: '#2980b9'
                });
            } else if (layer.feature.properties.TIPO) {
                // Estrutura urbana
                layer.setStyle({
                    fillOpacity: 0.4,
                    weight: 1.5,
                    fillColor: '#e74c3c',
                    color: '#c0392b'
                });
            } else if (layer.feature.properties.NM_LOG) {
                // Rua
                layer.setStyle({
                    weight: 2,
                    opacity: 0.8,
                    color: '#f39c12'
                });
            }
        }
    });
    
    highlightedFeatures = [];
    analysisResults = null;
    
    // Ocultar painel de resultados
    document.getElementById('analysisResults').style.display = 'none';
    
    // Ocultar legenda do buffer
    document.getElementById('bufferLegend').style.display = 'none';
    
    // Restaurar status
    document.getElementById('analysisStatus').innerHTML = 
        '<p><i class="fas fa-info-circle"></i> Clique em uma nascente para analisar</p>';
}

function closeResultsPanel() {
    document.getElementById('analysisResults').style.display = 'none';
}

// Função para análise estatística básica
function generateStatisticalSummary() {
    if (!layers.nascentes || !layers.bairros) return;
    
    const summary = {
        totalNascentes: 0,
        nascentesPorBairro: {},
        nascentesUrbanas: 0,
        nascentesRurais: 0
    };
    
    // Contar total de nascentes
    layers.nascentes.eachLayer(function(layer) {
        summary.totalNascentes++;
        
        // Verificar se está em área urbana (próximo a estruturas)
        let isUrban = false;
        if (layers.estruturas) {
            layers.estruturas.eachLayer(function(estrutura) {
                const distance = layer.getLatLng().distanceTo(estrutura.getBounds().getCenter());
                if (distance <= 500) { // 500m de distância
                    isUrban = true;
                }
            });
        }
        
        if (isUrban) {
            summary.nascentesUrbanas++;
        } else {
            summary.nascentesRurais++;
        }
    });
    
    // Contar nascentes por bairro
    layers.nascentes.eachLayer(function(nascente) {
        layers.bairros.eachLayer(function(bairro) {
            const distance = nascente.getLatLng().distanceTo(bairro.getBounds().getCenter());
            if (distance <= 1000) { // 1km de distância
                const bairroNome = bairro.feature.properties.NOME || 'Desconhecido';
                if (!summary.nascentesPorBairro[bairroNome]) {
                    summary.nascentesPorBairro[bairroNome] = 0;
                }
                summary.nascentesPorBairro[bairroNome]++;
            }
        });
    });
    
    return summary;
}

// Função para exibir resumo estatístico
function showStatisticalSummary() {
    const summary = generateStatisticalSummary();
    if (!summary) return;
    
    const resultsPanel = document.getElementById('analysisResults');
    const resultsContent = document.getElementById('resultsContent');
    
    let bairrosContent = '';
    Object.entries(summary.nascentesPorBairro)
        .sort(([,a], [,b]) => b - a)
        .forEach(([bairro, count]) => {
            bairrosContent += `<li><strong>${bairro}:</strong> ${count} nascente(s)</li>`;
        });
    
    resultsContent.innerHTML = `
        <div class="result-item">
            <h5><i class="fas fa-chart-pie"></i> Resumo Estatístico</h5>
            <p><strong>Total de Nascentes:</strong> ${summary.totalNascentes}</p>
        </div>
        
        <div class="result-stats">
            <div class="stat-item">
                <span class="stat-number">${summary.nascentesUrbanas}</span>
                <span class="stat-label">Urbanas</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${summary.nascentesRurais}</span>
                <span class="stat-label">Rurais</span>
            </div>
        </div>
        
        <div class="result-item">
            <h5><i class="fas fa-map-marker-alt"></i> Nascentes por Bairro</h5>
            <ul>
                ${bairrosContent}
            </ul>
        </div>
    `;
    
    resultsPanel.style.display = 'block';
}

// Mostrar erro
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        ${message}
        <button onclick="this.parentElement.remove()">×</button>
    `;
    errorDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// Manipular redimensionamento da janela
function handleResize() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile !== isMobileMode) {
        setDeviceMode(isMobile ? 'mobile' : 'desktop');
    }
    
    // Redimensionar mapa
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

// Adicionar estilos CSS dinâmicos para o marcador da cidade
const style = document.createElement('style');
style.textContent = `
    .city-marker {
        background: none;
        border: none;
    }
    
    .city-marker i {
        filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .error-message button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 1rem;
    }
    
    .info-popup ul {
        margin: 0.5rem 0;
        padding-left: 1.5rem;
    }
    
    .info-popup li {
        margin-bottom: 0.3rem;
    }
`;
document.head.appendChild(style); 