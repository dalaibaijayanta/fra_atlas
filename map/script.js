document.addEventListener('DOMContentLoaded', function () {
    // --- Get references to all major containers ---
    const appContainer = document.getElementById('app-container');
    const detailPage = document.getElementById('detail-page');
    const backButton = document.getElementById('back-button');

    // --- State Variables ---
    let currentLanguage = 'or';
    let currentPlotProperties = null; 
    
    // --- Language Switcher Elements ---
    const langEnBtn = document.getElementById('lang-en-btn');
    const langOrBtn = document.getElementById('lang-or-btn');
    const langHiBtn = document.getElementById('lang-hi-btn');
    const sidebarLangEnBtn = document.getElementById('sidebar-lang-en-btn');
    const sidebarLangOrBtn = document.getElementById('sidebar-lang-or-btn');
    const sidebarLangHiBtn = document.getElementById('sidebar-lang-hi-btn');

    const translations = {
        'en': {
            'langEnglish': 'English', 'langOdia': 'Odia', 'langHindi': 'Hindi',
            'sidebarLocation': 'Location', 'sidebarState': 'State:', 'sidebarDistrict': 'District:', 'sidebarTehsil': 'Tehsil:', 'sidebarRI': 'RI:', 'sidebarVillage': 'Village:', 'sidebarSheetNo': 'Sheet No:',
            'sidebarPlotInfo': 'Plot Info', 'sidebarPlotInfoPrompt': 'Click on a plot to see details.', 'sidebarStatusLabel': 'Status:',
            'districtOption': '12 Mayurbhanj', 'tehsilOption': '1 Kuliana', 'riOption': '3 Kuliana', 'villageOption': '72 Manjula Dihi', 'sheetNoOption': '01',
            'backButton': '← Back to Map', 'formSchedule': 'Schedule | Form No. 38-A', 'formTitle': 'Patta', 'labelDistrict': 'District:', 'valueDistrict': 'Mayurbhanj',
            'labelPoliceStation': 'Police Station:', 'valuePoliceStation': 'Kuliana', 'labelPoliceStationNo': 'Police Station No:', 'valuePoliceStationNo': '22',
            'labelTehsil': 'Tehsil:', 'valueTehsil': 'Kuliana', 'labelMouza': 'Mouza Name:', 'labelKhataNo': 'Khata No:', 'labelStatus': 'Claim Status:',
            'headerOwnerInfo': 'Name and address of landlord with nature of ownership', 'headerTenantInfo': 'Name of Tenant or Intermediary', 'labelFatherName': 'F/N',
            'valueOwnershipType': 'Forest land granted by the Government of Odisha', 'labelSerialNo': '(1) Serial number of the holding', 
            'labelPlotNo': '(2) Plot number or enclosure and others', 'labelLandClass': '(3) Classification of land', 'landClassValue': 'Forest Type', 
            'labelArea': '(4) Area', 'unitAcre': 'Acre', 'unitDecimal': 'Decimal', 'headerBoundaries': 'Boundaries and description of location of land', 
            'headerRemarks': 'Remarks', 'headerRightsInfo': '(5) Particulars of the rights of the landlord', 'footerStamp': 'BLANK SPACE FOR STAMPING',
            'statusPending': 'Pending', 'statusApproved': 'Approved', 'statusRejected': 'Rejected',
            'dssTitle': 'Decision Support', 'dssRecommendedSchemeLabel': 'Recommended Scheme:', 'pmKisanScheme': 'PM Kisan Samman Nidhi Yojana'
        },
        'or': {
            'langEnglish': 'English', 'langOdia': 'ଓଡ଼ିଆ', 'langHindi': 'Hindi', 'sidebarLocation': 'অবস্থান', 'sidebarState': 'ରାଜ୍ୟ:', 'sidebarDistrict': 'ଜିଲ୍ଲା:',
            'sidebarTehsil': 'ତହସିଲ:', 'sidebarRI': 'ଆର. ଆଇ.:', 'sidebarVillage': 'ଗାଁ:', 'sidebarSheetNo': 'ସିଟ୍ ନମ୍ବର:', 'sidebarPlotInfo': 'ପ୍ଲଟ୍ ସୂଚନା',
            'sidebarPlotInfoPrompt': 'ବିବରଣୀ ପାଇଁ ଏକ ପ୍ଲଟ୍ ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ |', 'sidebarStatusLabel': 'ସ୍ଥିତି:', 'districtOption': '12 ମୟୂରଭଞ୍ଜ', 'tehsilOption': '1 କୁଳିଅଣା',
            'riOption': '3 କୁଳିଅଣା', 'villageOption': '72 ମଞ୍ଜୁଳା ଡିହି', 'sheetNoOption': '01', 'backButton': '← ମାନଚିତ୍ରକୁ ଫେରନ୍ତୁ',
            'formSchedule': 'Schedule | Form No. 38-A', 'formTitle': 'ପଟ୍ଟା', 'labelDistrict': 'ଜିଲ୍ଲା:', 'valueDistrict': 'ମୟୂରଭଞ୍ଜ', 'labelPoliceStation': 'ଥାନା:',
            'valuePoliceStation': 'କୁଳିଅଣା', 'labelPoliceStationNo': 'ଥାନା ନମ୍ବର:', 'valuePoliceStationNo': '୨୨', 'labelTehsil': 'ତହସିଲ:',
            'valueTehsil': 'କୁଳିଅଣା', 'labelMouza': 'ମୌଜା ନମ୍ବର:', 'labelKhataNo': 'ଖାତା ନମ୍ବର:', 'labelStatus': 'ଦାବି ସ୍ଥିତି:',
            'headerOwnerInfo': 'ଜମିଦାରଙ୍କ ନାମ ଓ ଠିକଣା ସହିତ ମାଲିକାନା ପ୍ରକାର', 'headerTenantInfo': 'ପ୍ରଜା ବା ମଧ୍ୟସ୍ଥିଙ୍କ ନାମ', 'labelFatherName': 'ପିତା',
            'valueOwnershipType': 'ଓଡ଼ିଶା ସରକାରଙ୍କ ଦ୍ବାରା ପ୍ରଦତ୍ତ ଜଙ୍ଗଲ ଜମି', 'labelSerialNo': '(୧) ଖତିୟାନର କ୍ରମିକ ସଂଖ୍ୟା',
            'labelPlotNo': '(୨) ପ୍ଲଟ୍ ନମ୍ବର କିମ୍ବା ବାଡ଼ ଓ ଅନ୍ୟାନ୍ୟ', 'labelLandClass': '(୩) ଜମିର ବର୍ଗୀକରଣ', 'landClassValue': 'ଜଙ୍ଗଲ କିସମ',
            'labelArea': '(୪) କ୍ଷେତ୍ରଫଳ', 'unitAcre': 'ଏକର', 'unitDecimal': 'ଡେସିମିଲ', 'headerBoundaries': 'ଜମିର ଚତୁଃପାର୍ଶ୍ଵ ଓ ଅବସ୍ଥିତି ସହିତ ବିବରଣୀ',
            'headerRemarks': 'ମତାମତ', 'headerRightsInfo': '(୫) ଜମିଦାରଙ୍କ ଅଧିକାର ବିବରଣୀ', 'footerStamp': 'BLANK SPACE FOR STAMPING',
            'statusPending': 'ବିଚାରାଧୀନ', 'statusApproved': 'ଅନୁମୋଦିତ', 'statusRejected': 'ପ୍ରତ୍ୟାଖ୍ୟାନ',
            'dssTitle': 'ନିଷ୍ପତ୍ତି ସମର୍ଥନ', 'dssRecommendedSchemeLabel': 'ସୁପାରିଶ କରାଯାଇଥିବା ଯୋଜନା:', 'pmKisanScheme': 'ପିଏମ୍ କିସାନ ସମ୍ମାନ ନିଧି ଯୋଜନା'
        },
        'hi': {
            'langEnglish': 'English', 'langOdia': 'Odia', 'langHindi': 'हिंदी', 'sidebarLocation': 'स्थान', 'sidebarState': 'राज्य:', 'sidebarDistrict': 'ज़िला:',
            'sidebarTehsil': 'तहसील:', 'sidebarRI': 'आर.आई.:', 'sidebarVillage': 'गाँव:', 'sidebarSheetNo': 'शीट नंबर:', 'sidebarPlotInfo': 'भूखंड जानकारी',
            'sidebarPlotInfoPrompt': 'विवरण के लिए एक भूखंड पर क्लिक करें।', 'sidebarStatusLabel': 'स्थिति:', 'districtOption': '12 मयूरभंज', 'tehsilOption': '1 कुलिआना',
            'riOption': '3 कुलिआना', 'villageOption': '72 मंजुला डिही', 'sheetNoOption': '01', 'backButton': '← मानचित्र पर वापस जाएं', 'formSchedule': 'Schedule | Form No. 38-A',
            'formTitle': 'पट्टा', 'labelDistrict': 'ज़िला:', 'valueDistrict': 'मयूरभंज', 'labelPoliceStation': 'थाना:', 'valuePoliceStation': 'कुलिआना',
            'labelPoliceStationNo': 'थाना संख्या:', 'valuePoliceStationNo': '22', 'labelTehsil': 'तहसील:', 'valueTehsil': 'कुलिआना',
            'labelMouza': 'मौज़ा नाम:', 'labelKhataNo': 'खाता संख्या:', 'labelStatus': 'दावे की स्थिति:', 'headerOwnerInfo': 'स्वामित्व की प्रकृति के साथ जमींदार का नाम और पता',
            'headerTenantInfo': 'किरायेदार या मध्यस्थ का नाम', 'labelFatherName': 'पिता', 'valueOwnershipType': 'ओडिशा सरकार द्वारा प्रदत्त वन भूमि', 'labelSerialNo': '(1) जोत का क्रमांक',
            'labelPlotNo': '(2) भूखंड संख्या या बाड़े और अन्य', 'labelLandClass': '(3) भूमि का वर्गीकरण', 'landClassValue': 'वन प्रकार', 'labelArea': '(4) क्षेत्रफल',
            'unitAcre': 'एकड़', 'unitDecimal': 'डेसीमल', 'headerBoundaries': 'भूमि के स्थान की सीमाएँ और विवरण', 'headerRemarks': 'टिप्पणियाँ',
            'headerRightsInfo': '(5) जमींदार के अधिकारों का विवरण', 'footerStamp': 'स्टाम्पिंग के लिए खाली जगह', 'statusPending': 'लंबित',
            'statusApproved': 'स्वीकृत', 'statusRejected': 'अस्वीकृत',
            'dssTitle': 'निर्णय समर्थन', 'dssRecommendedSchemeLabel': 'अनुशंसित योजना:', 'pmKisanScheme': 'पीएम किसान सम्मान निधि योजना'
        }
    };

    function populateDynamicData(properties, lang) {
        const p = properties;
        const ownerKey = lang === 'en' ? 'owner' : `owner_${lang}`;
        const fatherNameKey = lang === 'en' ? 'father_name' : `father_name_${lang}`;
        const villageKey = lang === 'en' ? 'village' : `village_${lang}`;
        const plotNoKey = lang === 'en' ? 'plot_no' : `plot_no_${lang}`;
        document.getElementById('detail-village').textContent = p[villageKey] || p.village;
        document.getElementById('detail-owner').textContent = p[ownerKey] || p.owner;
        document.getElementById('detail-father-name').textContent = p[fatherNameKey] || p.father_name;
        document.getElementById('detail-plot-no').textContent = p[plotNoKey] || p.plot_no;
        document.getElementById('detail-khata').textContent = (parseInt(p.plot_no) * 10) + Math.floor(Math.random() * 5);
        document.getElementById('detail-serial').textContent = Math.floor(Math.random() * 100);
        document.getElementById('detail-area-acre').textContent = p.area_acres.toFixed(2);
        document.getElementById('detail-area-decimil').textContent = (p.area_acres * 100).toFixed(2);
    }

    function switchLanguage(lang) {
        currentLanguage = lang;
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.getAttribute('data-translate-key');
            if (translations[lang][key]) { el.textContent = translations[lang][key]; }
        });
        if (currentPlotProperties) {
            populateDynamicData(currentPlotProperties, lang);
            document.getElementById('detail-status').textContent = translations[lang][currentPlotProperties.statusKey] || currentPlotProperties.statusKey;
            const recommendedSchemeKeys = runDSSEngine(currentPlotProperties);
            if (recommendedSchemeKeys.length > 0) {
                 const schemeListHTML = recommendedSchemeKeys.map(key => `<li>${translations[lang][key] || key}</li>`).join('');
                 document.getElementById('dss-scheme-name').innerHTML = `<ul>${schemeListHTML}</ul>`;
            }
        }
        langEnBtn.classList.toggle('active', lang === 'en');
        langOrBtn.classList.toggle('active', lang === 'or');
        langHiBtn.classList.toggle('active', lang === 'hi');
        sidebarLangEnBtn.classList.toggle('active', lang === 'en');
        sidebarLangOrBtn.classList.toggle('active', lang === 'or');
        sidebarLangHiBtn.classList.toggle('active', lang === 'hi');
    }

    langEnBtn.addEventListener('click', () => switchLanguage('en'));
    langOrBtn.addEventListener('click', () => switchLanguage('or'));
    langHiBtn.addEventListener('click', () => switchLanguage('hi'));
    sidebarLangEnBtn.addEventListener('click', () => switchLanguage('en'));
    sidebarLangOrBtn.addEventListener('click', () => switchLanguage('or'));
    sidebarLangHiBtn.addEventListener('click', () => switchLanguage('hi'));

    const map = L.map('map', { center: [21.855, 86.332], zoom: 16, zoomControl: false });
    L.control.zoom({ position: 'topright' }).addTo(map);

    const satellite = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { maxZoom: 20, attribution: '© Google' }).addTo(map);
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap contributors' });
    const baseMaps = { "Satellite": satellite, "OpenStreetMap": osm };
    const overlayMaps = {};
    let villagePlotsBounds;
    let waterBodyLayer = null;
    let arrowLayerGroup = null;

    const menuButton = document.getElementById('menu-button');
    const sidebar = document.getElementById('sidebar');
    menuButton.addEventListener('click', () => sidebar.classList.toggle('visible'));

    const plotInfoContent = document.getElementById('plot-info-content');
    function updatePlotInfo(properties) {
        if (properties) {
            const p = properties;
            const statusLabel = translations[currentLanguage]['sidebarStatusLabel'];
            const statusValue = translations[currentLanguage][p.statusKey] || p.statusKey;
            const ownerName = p[`owner_${currentLanguage}`] || p.owner;
            const fatherName = p[`father_name_${currentLanguage}`] || p.father_name;
            const areaString = `${p.area_acres} acres`;
            plotInfoContent.innerHTML = `<p><strong>Owner:</strong> ${ownerName} (${translations[currentLanguage]['labelFatherName']}: ${fatherName})</p><p><strong>Plot No:</strong> ${p.plot_no}</p><p><strong>Area:</strong> ${areaString}</p><p><strong>Village:</strong> ${p.village}</p><p><strong>${statusLabel}</strong> ${statusValue}</p>`;
        } else {
            plotInfoContent.innerHTML = `<p data-translate-key="sidebarPlotInfoPrompt">${translations[currentLanguage]['sidebarPlotInfoPrompt']}</p>`;
        }
    }

    function runDSSEngine(properties) {
        if (properties.area_acres < 1.0) {
            return ['pmKisanScheme'];
        }
        return [];
    }

    function showDetailPage(properties) {
        currentPlotProperties = properties;
        const dssBox = document.getElementById('dss-recommendation-box');
        const recommendedSchemeKeys = runDSSEngine(properties);
        if (recommendedSchemeKeys.length > 0) {
            dssBox.classList.remove('hidden');
        } else {
            dssBox.classList.add('hidden');
        }
        switchLanguage(currentLanguage);
        appContainer.classList.add('hidden');
        detailPage.classList.remove('hidden');
    }

    function hideDetailPage() {
        currentPlotProperties = null;
        appContainer.classList.remove('hidden');
        detailPage.classList.add('hidden');
    }
    backButton.addEventListener('click', hideDetailPage);

    function loadGeoJsonLayer(url, style, layerName) {
        return fetch(url).then(res => res.json()).then(data => {
            const layer = L.geoJSON(data, { style: style });
            overlayMaps[`${layerName} (Count: ${data.features.length})`] = layer;
            if (layerName === "Water Bodies") { waterBodyLayer = layer; }
            return data;
        }).catch(err => console.error(`Error loading ${url}:`, err));
    }

    Promise.all([
        fetch('village_plots.geojson').then(res => res.json()),
        loadGeoJsonLayer('water_bodies.geojson', { color: "#0000FF", weight: 1, fillOpacity: 0.6 }, "Water Bodies"),
        loadGeoJsonLayer('farmland.geojson', { color: "#008000", weight: 1, fillOpacity: 0.5 }, "Farmland")
    ]).then(([villageData, waterData, farmlandData]) => {
        const villageLayer = L.geoJSON(villageData, {
            style: function(feature) {
                const status = feature.properties.statusKey;
                return status === 'statusPending' ? { color: "#FF0000", dashArray: '5, 10', weight: 2.5, opacity: 1, fillColor: "#ff7f50", fillOpacity: 0.4 } : { color: "#800000", weight: 2, opacity: 0.8, fillColor: "#ff7f50", fillOpacity: 0.4 };
            },
            onEachFeature: (feature, layer) => {
                layer.bindPopup(`<b>Owner:</b> ${feature.properties.owner}<br><b>Plot No:</b> ${feature.properties.plot_no}`);
                layer.on('click', e => {
                    updatePlotInfo(feature.properties);
                    villageLayer.eachLayer(l => villageLayer.resetStyle(l));
                    e.target.setStyle({ weight: 5 });
                });
                layer.on('dblclick', () => showDetailPage(feature.properties));
            }
        }).addTo(map);
        overlayMaps[`Village Plots (Count: ${villageData.features.length})`] = villageLayer;
        villagePlotsBounds = villageLayer.getBounds();
        L.control.layers(baseMaps, overlayMaps, { position: 'topright' }).addTo(map);
    }).catch(err => console.error("Error loading initial data:", err));
    
    function createCurvedArrow(latlng1, latlng2) {
        const offsetX = latlng2.lng - latlng1.lng;
        const offsetY = latlng2.lat - latlng1.lat;
        const controlPoint = [(latlng1.lat + latlng2.lat) / 2 + offsetY * 0.2, (latlng1.lng + latlng2.lng) / 2 - offsetX * 0.2];
        const start = L.latLng(latlng1), end = L.latLng(latlng2), control = L.latLng(controlPoint);
        const curvePoints = [];
        for (let i = 0; i <= 1; i += 0.05) {
            const t = i, invT = 1 - t;
            const x = invT * invT * start.lng + 2 * invT * t * control.lng + t * t * end.lng;
            const y = invT * invT * start.lat + 2 * invT * t * control.lat + t * t * end.lat;
            curvePoints.push(L.latLng(y, x));
        }
        const arrowLine = L.polyline(curvePoints, { color: '#00ffff', weight: 3, className: 'water-arrow-path' });
        const arrowHead = L.polylineDecorator(arrowLine, {
            patterns: [{ offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({ pixelSize: 15, pathOptions: { color: '#00ffff', fillOpacity: 1, weight: 0 } }) }]
        });
        return [arrowLine, arrowHead];
    }
    
    L.Control.Custom = L.Control.extend({
        onAdd: function(map) {
            const container = L.DomUtil.create('div', `leaflet-bar custom-map-control ${this.options.className}`);
            const link = L.DomUtil.create('a', '', container);
            link.href = '#';
            link.title = this.options.title;
            link.innerHTML = this.options.icon;
            L.DomEvent.on(link, 'click', L.DomEvent.stop).on(link, 'click', this.options.onClick);
            return container;
        }
    });

    new L.Control.Custom({ position: 'bottomright', title: 'Zoom to Plots', icon: '🎯', className: 'zoom-to-plots-control', onClick: () => { if (villagePlotsBounds) map.fitBounds(villagePlotsBounds); }}).addTo(map);
    
    new L.Control.Custom({ position: 'bottomright', title: 'Find Nearest Water Bodies', icon: '💧', className: 'find-water-control', onClick: function() {
        if (arrowLayerGroup) { map.removeLayer(arrowLayerGroup); arrowLayerGroup = null; return; }
        if (!villagePlotsBounds || !waterBodyLayer) return;
        const settlementCenter = villagePlotsBounds.getCenter();
        const waterDistances = [];
        waterBodyLayer.eachLayer(layer => {
            const waterCenter = layer.getBounds().getCenter();
            const distance = settlementCenter.distanceTo(waterCenter);
            waterDistances.push({ center: waterCenter, distance: distance });
        });
        const nearestThree = waterDistances.sort((a, b) => a.distance - b.distance).slice(0, 3);
        if (nearestThree.length > 0) {
            const arrowLayers = [];
            nearestThree.forEach(waterBody => {
                const curvedArrow = createCurvedArrow(settlementCenter, waterBody.center);
                arrowLayers.push(...curvedArrow);
            });
            arrowLayerGroup = L.layerGroup(arrowLayers);
            arrowLayerGroup.addTo(map);
        }
    }}).addTo(map);
    
    map.on('click', function() {
        updatePlotInfo(null);
        const villageLayerKey = Object.keys(overlayMaps).find(k => k.startsWith("Village Plots"));
        if (villageLayerKey) {
            overlayMaps[villageLayerKey].eachLayer(layer => {
                overlayMaps[villageLayerKey].resetStyle(layer);
            });
        }
    });

    switchLanguage(currentLanguage);
});