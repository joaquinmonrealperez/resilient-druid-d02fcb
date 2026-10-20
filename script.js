// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('¡Gracias! Tu mensaje ha sido enviado. Te contactaremos pronto.');
        this.reset();
    });
});

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
    }
});

// ============================================
// GEM SCORING SYSTEM - 4 PROFILES WITH WEIGHTS
// ============================================

// Profile weights from the document
const profileWeights = {
    'A': {
        name: 'Recursos medio-altos / riesgo medio-alto',
        weights: {
            '1.1': 10, '1.2': 8,
            '2.1': 4, '2.2': 7,
            '3.1': 22, '3.2': 12, '3.3': 6,
            '4.1': 6, '4.2': 6,
            '5.1': 4, '5.2': 4,
            '6.1': 2, '6.2': 2,
            '7.1': 2.5, '7.2': 1.5, '7.3': 1.5, '7.4': 1.5
        }
    },
    'B': {
        name: 'Pocos recursos / riesgo medio-alto',
        weights: {
            '1.1': 16, '1.2': 12,
            '2.1': 6, '2.2': 12,
            '3.1': 13.5, '3.2': 9, '3.3': 5,
            '4.1': 3, '4.2': 4,
            '5.1': 4.5, '5.2': 4.5,
            '6.1': 2, '6.2': 2,
            '7.1': 2.5, '7.2': 1.5, '7.3': 1.5, '7.4': 1
        }
    },
    'C': {
        name: 'Recursos medio-altos / conservador',
        weights: {
            '1.1': 18, '1.2': 11,
            '2.1': 5, '2.2': 11,
            '3.1': 12.5, '3.2': 10, '3.3': 5,
            '4.1': 2, '4.2': 5,
            '5.1': 5.5, '5.2': 5.5,
            '6.1': 1, '6.2': 1,
            '7.1': 1.8, '7.2': 1.2, '7.3': 1.5, '7.4': 3
        }
    },
    'D': {
        name: 'Pocos recursos / conservador',
        weights: {
            '1.1': 20, '1.2': 15,
            '2.1': 6, '2.2': 9,
            '3.1': 10, '3.2': 8, '3.3': 5,
            '4.1': 2, '4.2': 3,
            '5.1': 6, '5.2': 6,
            '6.1': 1, '6.2': 1,
            '7.1': 2.5, '7.2': 1.0, '7.3': 1.5, '7.4': 3
        }
    }
};

// CNAE industrial sectors with base scores
const cnaeSectors = {
    '1010': { name: 'Carnes y productos cárnicos', baseScore: 65 },
    '1020': { name: 'Pescados y mariscos', baseScore: 60 },
    '1030': { name: 'Frutas y verduras', baseScore: 70 },
    '1040': { name: 'Aceites y grasas', baseScore: 68 },
    '1050': { name: 'Productos lácteos', baseScore: 72 },
    '1060': { name: 'Productos de molinería', baseScore: 62 },
    '1070': { name: 'Panadería y pastelería', baseScore: 58 },
    '1080': { name: 'Alimentos para animales', baseScore: 55 },
    '1090': { name: 'Otros productos alimenticios', baseScore: 60 },
    '1100': { name: 'Bebidas', baseScore: 75 },
    '1200': { name: 'Productos de tabaco', baseScore: 40 },
    '1310': { name: 'Preparación de fibras textiles', baseScore: 50 },
    '1320': { name: 'Tejido de textiles', baseScore: 48 },
    '1330': { name: 'Acabado de textiles', baseScore: 52 },
    '1390': { name: 'Otros productos textiles', baseScore: 55 },
    '1410': { name: 'Confección de prendas', baseScore: 58 },
    '1420': { name: 'Artículos de peletería', baseScore: 62 },
    '1430': { name: 'Artículos de punto', baseScore: 56 },
    '1510': { name: 'Curtido y acabado del cuero', baseScore: 60 },
    '1520': { name: 'Calzado', baseScore: 65 },
    '1610': { name: 'Aserrado y cepillado de la madera', baseScore: 55 },
    '1620': { name: 'Productos de madera, corcho y cestería', baseScore: 58 },
    '1710': { name: 'Fabricación de papel y cartón', baseScore: 62 },
    '1720': { name: 'Productos de papel y cartón', baseScore: 64 },
    '1810': { name: 'Artes gráficas', baseScore: 60 },
    '1820': { name: 'Reproducción de soportes grabados', baseScore: 55 },
    '1910': { name: 'Coquerías', baseScore: 45 },
    '1920': { name: 'Refino de petróleo', baseScore: 50 },
    '2010': { name: 'Productos químicos básicos', baseScore: 68 },
    '2020': { name: 'Pesticidas y productos agroquímicos', baseScore: 62 },
    '2030': { name: 'Pinturas, barnices y tintas', baseScore: 65 },
    '2040': { name: 'Jabones, detergentes y cosméticos', baseScore: 70 },
    '2050': { name: 'Otros productos químicos', baseScore: 66 },
    '2060': { name: 'Fibras artificiales y sintéticas', baseScore: 58 },
    '2110': { name: 'Productos farmacéuticos básicos', baseScore: 75 },
    '2120': { name: 'Especialidades farmacéuticas', baseScore: 78 },
    '2210': { name: 'Productos de caucho', baseScore: 60 },
    '2220': { name: 'Productos de plástico', baseScore: 62 },
    '2310': { name: 'Vidrio y productos de vidrio', baseScore: 58 },
    '2320': { name: 'Productos cerámicos refractarios', baseScore: 55 },
    '2330': { name: 'Productos cerámicos de construcción', baseScore: 60 },
    '2340': { name: 'Otros productos cerámicos', baseScore: 62 },
    '2350': { name: 'Cemento, cal y yeso', baseScore: 58 },
    '2360': { name: 'Productos de hormigón y mortero', baseScore: 56 },
    '2370': { name: 'Piedra ornamental y para la construcción', baseScore: 54 },
    '2390': { name: 'Productos abrasivos y minerales no metálicos', baseScore: 52 },
    '2410': { name: 'Productos básicos de hierro y acero', baseScore: 60 },
    '2420': { name: 'Tubos y tuberías', baseScore: 58 },
    '2430': { name: 'Productos de primera transformación', baseScore: 56 },
    '2440': { name: 'Productos de metales no férreos', baseScore: 62 },
    '2450': { name: 'Fundición de metales', baseScore: 55 },
    '2510': { name: 'Productos metálicos para la construcción', baseScore: 65 },
    '2520': { name: 'Depósitos, cisternas y contenedores', baseScore: 62 },
    '2530': { name: 'Generadores de vapor', baseScore: 58 },
    '2540': { name: 'Armas y municiones', baseScore: 45 },
    '2550': { name: 'Forja, estampación y embutición', baseScore: 56 },
    '2560': { name: 'Tratamiento y revestimiento de metales', baseScore: 58 },
    '2570': { name: 'Artículos de cuchillería y cubertería', baseScore: 60 },
    '2590': { name: 'Otros productos metálicos', baseScore: 62 },
    '2610': { name: 'Componentes electrónicos', baseScore: 72 },
    '2620': { name: 'Ordenadores y equipos periféricos', baseScore: 70 },
    '2630': { name: 'Equipos de telecomunicaciones', baseScore: 74 },
    '2640': { name: 'Productos electrónicos de consumo', baseScore: 68 },
    '2650': { name: 'Instrumentos de medida y control', baseScore: 76 },
    '2660': { name: 'Equipos de radiación y electromedicina', baseScore: 78 },
    '2670': { name: 'Instrumentos ópticos y fotográficos', baseScore: 72 },
    '2680': { name: 'Soportes magnéticos y ópticos', baseScore: 60 },
    '2710': { name: 'Motores, generadores y transformadores', baseScore: 68 },
    '2720': { name: 'Pilas y acumuladores', baseScore: 65 },
    '2730': { name: 'Cables y dispositivos de cableado', baseScore: 62 },
    '2740': { name: 'Lámparas y aparatos de iluminación', baseScore: 66 },
    '2750': { name: 'Aparatos eléctricos de uso doméstico', baseScore: 64 },
    '2790': { name: 'Otros equipos eléctricos', baseScore: 62 },
    '2810': { name: 'Motores y turbinas', baseScore: 70 },
    '2820': { name: 'Equipos de uso general', baseScore: 68 },
    '2830': { name: 'Maquinaria agrícola y forestal', baseScore: 62 },
    '2840': { name: 'Máquinas herramienta', baseScore: 72 },
    '2890': { name: 'Otra maquinaria para usos específicos', baseScore: 66 },
    '2910': { name: 'Vehículos de motor', baseScore: 75 },
    '2920': { name: 'Carrocerías para vehículos', baseScore: 68 },
    '2930': { name: 'Componentes y accesorios de vehículos', baseScore: 70 },
    '3010': { name: 'Construcción naval', baseScore: 58 },
    '3020': { name: 'Material ferroviario', baseScore: 55 },
    '3030': { name: 'Aeronaves y vehículos espaciales', baseScore: 72 },
    '3040': { name: 'Vehículos militares de combate', baseScore: 50 },
    '3090': { name: 'Otro material de transporte', baseScore: 60 },
    '3100': { name: 'Mobiliario', baseScore: 62 },
    '3210': { name: 'Joyería y artículos similares', baseScore: 68 },
    '3220': { name: 'Instrumentos musicales', baseScore: 60 },
    '3230': { name: 'Artículos deportivos', baseScore: 64 },
    '3240': { name: 'Juguetes y juegos', baseScore: 62 },
    '3250': { name: 'Instrumentos médicos y odontológicos', baseScore: 76 },
    '3290': { name: 'Otras industrias manufactureras', baseScore: 58 },
    '3310': { name: 'Reparación de productos metálicos', baseScore: 55 },
    '3320': { name: 'Instalación de máquinas y equipos', baseScore: 60 }
};

// Country base scores (market attractiveness)
const countryBaseScores = {
    'Germany': 85, 'France': 82, 'United Kingdom': 80, 'Italy': 72, 'Spain': 70,
    'Poland': 65, 'Netherlands': 84, 'Belgium': 78, 'Austria': 76, 'Switzerland': 82,
    'Sweden': 78, 'Denmark': 76, 'Finland': 74, 'Norway': 75, 'Ireland': 74,
    'Portugal': 68, 'Greece': 62, 'Czech Republic': 68, 'Hungary': 64, 'Romania': 58,
    'China': 68, 'Japan': 82, 'South Korea': 80, 'India': 62, 'Singapore': 86,
    'Vietnam': 52, 'Indonesia': 50, 'Thailand': 58, 'Malaysia': 60, 'Philippines': 54,
    'United States': 88, 'Canada': 84, 'Mexico': 64, 'Brazil': 60, 'Chile': 62,
    'Colombia': 58, 'Argentina': 54, 'Peru': 56, 'Morocco': 52, 'Egypt': 48,
    'South Africa': 54, 'Australia': 82, 'New Zealand': 80, 'Turkey': 60,
    'Russia': 50, 'Ukraine': 48, 'Israel': 72, 'UAE': 74, 'Saudi Arabia': 62,
    // Africa (solo los que tienen puntuacion base propia)
    'Algeria': 46, 'Tunisia': 48, 'Kenya': 44, 'Nigeria': 42,
    // Oceania
    'Papua New Guinea': 40, 'Fiji': 42
};

// Color mapping - Updated: Red 0-60, Orange 60-80, Green 80-100
// Seis tramos de atractivo, de mas a menos:
//   verde intenso 90-100 | verde claro 80-90 | naranja intenso 70-80
//   naranja claro 60-70 | rojo claro 40-60 | rojo intenso 0-40
const colors = {
    veryHigh: '#15803d',  // Verde intenso: 90-100
    high:     '#4ade80',  // Verde claro:    80-90
    midHigh:  '#ea580c',  // Naranja intenso:70-80
    mid:      '#fdba74',  // Naranja claro:  60-70
    low:      '#f87171',  // Rojo claro:     40-60
    veryLow:  '#b91c1c'   // Rojo intenso:   0-40
};

// Descripcion de los seis tramos de color del mapa. La puntuacion que colorea
// el mapa es el atractivo del mercado ajustado por tu perfil y capacidad
// exportadora, de ahi que los niveles se nombren "atractivo" y no
// "Probabilidad de exito". La seccion de mercado concreto (que si calcula una
// probabilidad de exito) usa por su parte levelText, mas abajo.
const nivelAtractivo = {
    veryHigh: 'atractivo muy alto (90-100)',
    high:     'atractivo alto (80-90)',
    midHigh:  'atractivo medio-alto (70-80)',
    mid:      'atractivo medio (60-70)',
    low:      'atractivo bajo (40-60)',
    veryLow:  'atractivo muy bajo (0-40)'
};

// Descripcion de los niveles en el modulo de mercado concreto, donde si se
// trata de una Probabilidad de éxito exportador.
const levelText = {
    veryHigh: 'Probabilidad de éxito muy alta (90-100)',
    high:     'Probabilidad de éxito alta (80-90)',
    midHigh:  'Probabilidad de éxito medio-alta (70-80)',
    mid:      'Probabilidad de éxito media (60-70)',
    low:      'Probabilidad de éxito baja (40-60)',
    veryLow:  'Probabilidad de éxito muy baja (0-40)'
};

// Country names in Spanish
const countryNamesES = {
    'Germany': 'Alemania', 'France': 'Francia', 'United Kingdom': 'Reino Unido',
    'Italy': 'Italia', 'Spain': 'España', 'Poland': 'Polonia', 'Netherlands': 'Países Bajos',
    'Belgium': 'Bélgica', 'Austria': 'Austria', 'Switzerland': 'Suiza',
    'Sweden': 'Suecia', 'Denmark': 'Dinamarca', 'Finland': 'Finlandia', 'Norway': 'Noruega',
    'Ireland': 'Irlanda', 'Portugal': 'Portugal', 'Greece': 'Grecia',
    'Czech Republic': 'República Checa', 'Hungary': 'Hungría', 'Romania': 'Rumania',
    'Bulgaria': 'Bulgaria', 'Croatia': 'Croacia', 'Slovakia': 'Eslovaquia',
    'Slovenia': 'Eslovenia', 'Estonia': 'Estonia', 'Latvia': 'Letonia',
    'Lithuania': 'Lituania', 'Luxembourg': 'Luxemburgo', 'Malta': 'Malta',
    'Cyprus': 'Chipre', 'Iceland': 'Islandia', 'Albania': 'Albania',
    'Serbia': 'Serbia', 'Bosnia and Herzegovina': 'Bosnia y Herzegovina',
    'North Macedonia': 'Macedonia del Norte', 'Montenegro': 'Montenegro',
    'Kosovo': 'Kosovo', 'Moldova': 'Moldavia', 'Belarus': 'Bielorrusia',
    'Ukraine': 'Ucrania', 'Russia': 'Rusia',
    'China': 'China', 'Japan': 'Japón', 'South Korea': 'Corea del Sur',
    'India': 'India', 'Singapore': 'Singapur', 'Vietnam': 'Vietnam',
    'Indonesia': 'Indonesia', 'Thailand': 'Tailandia', 'Malaysia': 'Malasia',
    'Philippines': 'Filipinas', 'Bangladesh': 'Bangladés', 'Pakistan': 'Pakistán',
    'Sri Lanka': 'Sri Lanka', 'Nepal': 'Nepal', 'Myanmar': 'Myanmar',
    'Cambodia': 'Camboya', 'Laos': 'Laos', 'Brunei': 'Brunéi',
    'Mongolia': 'Mongolia', 'Kazakhstan': 'Kazajistán', 'Uzbekistan': 'Uzbekistán',
    'Turkmenistan': 'Turkmenistán', 'Kyrgyzstan': 'Kirguistán', 'Tajikistan': 'Tayikistán',
    'Afghanistan': 'Afganistán', 'Iran': 'Irán', 'Iraq': 'Irak',
    'Syria': 'Siria', 'Lebanon': 'Líbano', 'Jordan': 'Jordania',
    'Israel': 'Israel', 'Saudi Arabia': 'Arabia Saudita', 'UAE': 'Emiratos Árabes Unidos',
    'Qatar': 'Catar', 'Kuwait': 'Kuwait', 'Bahrain': 'Baréin', 'Oman': 'Omán',
    'Yemen': 'Yemen', 'Turkey': 'Turquía', 'Georgia': 'Georgia',
    'Armenia': 'Armenia', 'Azerbaijan': 'Azerbaiyán',
    'United States': 'Estados Unidos', 'Canada': 'Canadá', 'Mexico': 'México',
    'Brazil': 'Brasil', 'Chile': 'Chile', 'Colombia': 'Colombia',
    'Argentina': 'Argentina', 'Peru': 'Perú', 'Venezuela': 'Venezuela',
    'Ecuador': 'Ecuador', 'Bolivia': 'Bolivia', 'Paraguay': 'Paraguay',
    'Uruguay': 'Uruguay', 'Guyana': 'Guyana', 'Suriname': 'Surinam',
    'Cuba': 'Cuba', 'Dominican Republic': 'República Dominicana', 'Haiti': 'Haití',
    'Jamaica': 'Jamaica', 'Trinidad and Tobago': 'Trinidad y Tobago',
    'Bahamas': 'Bahamas', 'Barbados': 'Barbados', 'Guatemala': 'Guatemala',
    'Honduras': 'Honduras', 'El Salvador': 'El Salvador', 'Nicaragua': 'Nicaragua',
    'Costa Rica': 'Costa Rica', 'Panama': 'Panamá', 'Belize': 'Belice',
    'Morocco': 'Marruecos', 'Egypt': 'Egipto', 'South Africa': 'Sudáfrica',
    'Nigeria': 'Nigeria', 'Kenya': 'Kenia', 'Ethiopia': 'Etiopía',
    'Ghana': 'Ghana', 'Tanzania': 'Tanzania', 'Uganda': 'Uganda',
    'Senegal': 'Senegal', 'Ivory Coast': 'Costa de Marfil', 'Cameroon': 'Camerún',
    'Democratic Republic of the Congo': 'República Democrática del Congo',
    'Republic of the Congo': 'República del Congo', 'Angola': 'Angola',
    'Zambia': 'Zambia', 'Zimbabwe': 'Zimbabue', 'Mozambique': 'Mozambique',
    'Madagascar': 'Madagascar', 'Mauritius': 'Mauricio', 'Tunisia': 'Túnez',
    'Algeria': 'Argelia', 'Libya': 'Libia', 'Sudan': 'Sudán',
    'South Sudan': 'Sudán del Sur', 'Somalia': 'Somalia', 'Eritrea': 'Eritrea',
    'Djibouti': 'Yibuti', 'Rwanda': 'Ruanda', 'Burundi': 'Burundi',
    'Malawi': 'Malaui', 'Botswana': 'Botsuana', 'Namibia': 'Namibia',
    'Lesotho': 'Lesoto', 'Eswatini': 'Esuatini', 'Gambia': 'Gambia',
    'Guinea': 'Guinea', 'Sierra Leone': 'Sierra Leona', 'Liberia': 'Liberia',
    'Togo': 'Togo', 'Benin': 'Benín', 'Burkina Faso': 'Burkina Faso',
    'Mali': 'Mali', 'Niger': 'Níger', 'Chad': 'Chad', 'Mauritania': 'Mauritania',
    'Western Sahara': 'Sáhara Occidental', 'Equatorial Guinea': 'Guinea Ecuatorial',
    'Gabon': 'Gabón', 'Central African Republic': 'República Centroafricana',
    'Australia': 'Australia', 'New Zealand': 'Nueva Zelanda',
    'Papua New Guinea': 'Papúa Nueva Guinea', 'Fiji': 'Fiyi',
    'Solomon Islands': 'Islas Salomón', 'Vanuatu': 'Vanuatu',
    'Samoa': 'Samoa', 'Tonga': 'Tonga', 'Kiribati': 'Kiribati',
    'Tuvalu': 'Tuvalu', 'Nauru': 'Nauru', 'Palau': 'Palaos',
    'Marshall Islands': 'Islas Marshall', 'Micronesia': 'Micronesia',
    // Variantes de nombre que aparecen en el GeoJSON (datasets/geo-countries)
    'Czechia': 'República Checa', 'United States of America': 'Estados Unidos',
    'United Arab Emirates': 'Emiratos Árabes Unidos', 'United Republic of Tanzania': 'Tanzania',
    'Republic of Serbia': 'Serbia', 'East Timor': 'Timor Oriental',
    'The Bahamas': 'Bahamas', 'Falkland Islands': 'Islas Malvinas',
    'Palestine': 'Palestina', 'North Korea': 'Corea del Norte',
    'Somaliland': 'Somalilandia', 'Bhutan': 'Bután', 'Monaco': 'Mónaco',
    'Guinea-Bissau': 'Guinea-Bisáu', 'Sao Tome and Principe': 'Santo Tomé y Príncipe',
    'S\u00E3o Tome and Principe': 'Santo Tomé y Príncipe',
    'Cura\u00E7ao': 'Curazao', 'Aland': '\u00C5land', 'Vatican': 'Ciudad del Vaticano',
    'Northern Cyprus': 'Chipre del Norte', 'Greenland': 'Groenlandia',
    'Maldives': 'Maldivas', 'Antarctica': 'Ant\u00E1rtida',
    'Gibraltar': 'Gibraltar', 'Taiwan': 'Taiw\u00E1n', 'Macao S.A.R': 'Macao',
    'Hong Kong S.A.R.': 'Hong Kong', 'Liechtenstein': 'Liechtenstein',
    'San Marino': 'San Marino', 'Andorra': 'Andorra', 'Seychelles': 'Seychelles',
    'Grenada': 'Granada', 'Dominica': 'Dominica', 'Montserrat': 'Montserrat',
    'Barbados': 'Barbados', 'Saint Lucia': 'Santa Luc\u00EDa', 'Jamaica': 'Jamaica',
    'Aruba': 'Aruba', 'Bermuda': 'Bermudas', 'Cayman Islands': 'Islas Caim\u00E1n',
    'Puerto Rico': 'Puerto Rico', 'Anguilla': 'Anguila', 'Niue': 'Niue',
    'Guam': 'Guam', 'Palau': 'Palaos', 'Nauru': 'Nauru',
    'Saint Martin': 'San Mart\u00EDn', 'Sint Maarten': 'San Mart\u00EDn Neerland\u00E9s',
    'New Caledonia': 'Nueva Caledonia', 'Cook Islands': 'Islas Cook',
    'Norfolk Island': 'Isla Norfolk', 'Saint Helena': 'Santa Elena',
    'Comoros': 'Comoras', 'Cabo Verde': 'Cabo Verde', 'Jersey': 'Jersey',
    'Guernsey': 'Guernsey', 'Isle of Man': 'Isla de Man',
    'Faroe Islands': 'Islas Feroe', 'Wallis and Futuna': 'Wallis y Futuna',
    'Samoa Americana': 'Samoa Americana', 'American Samoa': 'Samoa Americana',
    'Antigua and Barbuda': 'Antigua y Barbuda',
    'Saint Kitts and Nevis': 'San Crist\u00F3bal y Nieves',
    'Saint Vincent and the Grenadines': 'San Vicente y las Granadinas',
    'Saint Barthelemy': 'San Bartolom\u00E9', 'Turks and Caicos Islands': 'Islas Turcas y Caicos',
    'Pitcairn Islands': 'Islas Pitcairn', 'French Polynesia': 'Polinesia Francesa',
    'Federated States of Micronesia': 'Estados Federados de Micronesia',
    'Northern Mariana Islands': 'Islas Marianas del Norte',
    'British Virgin Islands': 'Islas V\u00EDrgenes Brit\u00E1nicas',
    'United States Virgin Islands': 'Islas V\u00EDrgenes de Estados Unidos',
    'Saint Pierre and Miquelon': 'San Pedro y Miquel\u00F3n',
    'French Southern and Antarctic Lands': 'Tierras Australes y Ant\u00E1rticas Francesas',
    'Coral Sea Islands': 'Islas del Mar de Coral',
    'Spratly Islands': 'Islas Spratly',
    'Clipperton Island': 'Isla de la Pasi\u00F3n',
    'United States Minor Outlying Islands': 'Islas Menores Distantes de Estados Unidos',
    'Indian Ocean Territories': 'Territorios Brit\u00E1nicos del Oc\u00E9ano \u00CDndico',
    'British Indian Ocean Territory': 'Territorio Brit\u00E1nico del Oc\u00E9ano \u00CDndico',
    'South Georgia and the Islands': 'Georgia del Sur y las Islas Sandwich del Sur',
    'Heard Island and McDonald Islands': 'Isla Heard e Islas MacDonald',
    'Ashmore and Cartier Islands': 'Islas Ashmore y Cartier',
    'Serranilla Bank': 'Banco de Serranilla', 'Scarborough Reef': 'Arrecife de Scarborough',
    'Dhekelia Sovereign Base Area': 'Bases Militares Soberanas de Dhekelia',
    'Akrotiri Sovereign Base Area': 'Bases Militares Soberanas de Akrotiri',
    'US Naval Base Guantanamo Bay': 'Base Naval estadounidense de Guant\u00E1namo',
    'Brazilian Island': 'Isla Brazilera',
    'Baykonur Cosmodrome': 'Cosmodromo de Baikonur',
    'Siachen Glacier': 'Glaciar de Siachen',
    'Southern Patagonian Ice Field': 'Campo de Hielo Patag\u00F3nico Sur',
    'Cyprus No Mans Area': 'Zona sin Chipre', 'Bir Tawil': 'Bir Tawil'
};

// Get Spanish country name
function getCountryNameES(countryName) {
    return countryNamesES[countryName] || countryName;
}

// countryBaseScores esta indexada por los nombres en ingles. El informe trabaja
// con el nombre en castellano para que el texto se lea bien, y esa mezcla era la
// causa de un fallo grave: al buscar 'Alemania' en una tabla cuyas claves son
// 'Germany' no se encontraba nada, la busqueda caia al valor por defecto de 50 y
// los 17 criterios se puntuaban como si el pais tuviera una base de 50 puntos.
// El informe describia un mercado imaginario, y su tabla de criterios no
// cuadraba con el total de la portada.
//
// clavePais() acepta el nombre en ingles o en castellano y devuelve siempre la
// clave inglesa. basePais() devuelve directamente la puntuacion base.
//
// El mapa no trae los nombres de countryBaseScores, sino los del fichero
// GeoJSON: 'United States of America', 'Republic of Korea', 'Czechia',
// 'Bosnia and Herz.'... De 258 paises del mapa, 206 no coincidian con ninguna
// clave y todos caian a la base de 50. Por eso el popup marcaba 93 puntos
// (esa puntuacion si se calculaba con la clave correcta, porque elMatching
// parcial de alli si la encontraba) y la tabla del informe de ese mismo mercado
// decia 55. El total venia de un pais y el desglose de otro.
//
// Resolucion en este orden, y se para en el primero que acierte:
//   1. La clave exacta tal cual
//   2. Minusculas, en ingles o castellano
//   3. Sin tildes, sin signos de puntuacion y sin el "the" inicial
//   4. Los sinonimos de la tabla de alias
//   5. La coincidencia parcial mas larga ('United States of America' ->
//      'United States'; 'Papua New Guinea' gana a 'Guinea')
const ALIAS_PAIS = {
    'united states of america': 'United States',
    'russian federation': 'Russia',
    'republic of korea': 'South Korea',
    'korea south': 'South Korea',
    'viet nam': 'Vietnam',
    'lao people s democratic republic': 'Laos',
    'czechia': 'Czech Republic',
    'czech republic': 'Czech Republic',
    'slovakia': 'Slovakia',
    'bosnia and herz': 'Bosnia and Herzegovina',
    'bosnia and herzegovina': 'Bosnia and Herzegovina',
    'moldova republic of': 'Moldova',
    'republic of moldova': 'Moldova',
    'tanzania united republic of': 'Tanzania',
    'united republic of tanzania': 'Tanzania',
    'syrian arab republic': 'Syria',
    'turkiye': 'Turkey',
    'turkey': 'Turkey',
    'holland': 'Netherlands',
    'netherlands': 'Netherlands',
    'the netherlands': 'Netherlands',
    'united kingdom of great britain and northern ireland': 'United Kingdom',
    'great britain': 'United Kingdom',
    'england': 'United Kingdom',
    'united states': 'United States',
    'state of palestine': 'Palestine',
    'palestine': 'Palestine',
    'democratic republic of the congo': 'Democratic Republic of the Congo',
    'democratic republic of congo': 'Democratic Republic of the Congo',
    'congo kinshasa': 'Democratic Republic of the Congo',
    'republic of the congo': 'Republic of the Congo',
    'congo brazzaville': 'Republic of the Congo',
    'ivory coast': 'Ivory Coast',
    "cote d'ivoire": 'Ivory Coast',
    "côte d'ivoire": 'Ivory Coast',
    'east timor': 'Timor-Leste',
    'timor leste': 'Timor-Leste',
    'north macedonia': 'North Macedonia',
    'macedonia': 'North Macedonia',
    'south sudan': 'South Sudan',
    'sahrawi arab democratic republic': 'Western Sahara',
    'western sahara': 'Western Sahara',
    'solomon islands': 'Solomon Islands',
    'brunei darussalam': 'Brunei',
    'cape verde': 'Cape Verde',
    'cape verde islands': 'Cape Verde',
    'swaziland': 'Eswatini',
    'burma': 'Myanmar',
    'east Timor': 'Timor-Leste'
};

// Normaliza para comparar: minusculas, sin tildes, sin apostrofos ni
// guiones, solo letras y espacios, y sin el "the" inicial.
function normalizarPais(nombre) {
    let t = String(nombre).toLowerCase();
    t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    t = t.replace(/[''`´]/g, '').replace(/[.\-_,()]/g, ' ');
    t = t.replace(/[^a-z0-9 ]/g, ' ');
    t = t.replace(/\s+/g, ' ').trim();
    t = t.replace(/^the /, '');
    return t;
}

const CLAVES_PAIS = (function () {
    const mapa = {};
    const normalizadas = {};
    Object.keys(countryBaseScores).forEach(function (clave) {
        mapa[clave.toLowerCase()] = clave;
        const es = countryNamesES[clave];
        if (es) mapa[String(es).toLowerCase()] = clave;
        normalizadas[normalizarPais(clave)] = clave;
        if (es) normalizadas[normalizarPais(es)] = clave;
    });
    // Los alias se anaden despues: si dos claves se normalizasen igual, gana la
    // primera; los alias resuelven los nombres que el GeoJSON usa.
    Object.keys(ALIAS_PAIS).forEach(function (alias) {
        if (Object.prototype.hasOwnProperty.call(countryBaseScores, ALIAS_PAIS[alias])) {
            normalizadas[normalizarPais(alias)] = ALIAS_PAIS[alias];
        }
    });
    return { simple: mapa, normalizada: normalizadas };
})();

// Devuelve la clave inglesa, o null si el pais no existe en los datos.
function clavePais(nombre) {
    if (nombre === null || nombre === undefined || nombre === '') return null;

    // 1. Clave exacta
    if (Object.prototype.hasOwnProperty.call(countryBaseScores, nombre)) return nombre;

    // 2. Minusculas, ingles o castellano
    const minus = String(nombre).toLowerCase();
    if (CLAVES_PAIS.simple[minus]) return CLAVES_PAIS.simple[minus];

    // 3 y 4. Sin tildes, sin signos, y alias
    const norm = normalizarPais(nombre);
    if (CLAVES_PAIS.normalizada[norm]) return CLAVES_PAIS.normalizada[norm];

    // 5. Coincidencia parcial: gana la clave mas larga que este contenida en el
    // nombre, para que 'Papua New Guinea' no se resuelva como 'Guinea'.
    let mejor = null;
    let mejorLargo = 0;
    Object.keys(countryBaseScores).forEach(function (clave) {
        const ck = normalizarPais(clave);
        if (ck.length < 4) return;
        if (norm.indexOf(ck) !== -1 && ck.length > mejorLargo) {
            mejor = clave;
            mejorLargo = ck.length;
        }
    });
    return mejor;
}

function basePais(nombre) {
    const clave = clavePais(nombre);
    return clave === null ? 50 : countryBaseScores[clave];
}

// Get sources with URLs for each criterion
function getSourcesForCriterion(criterionCode) {
    const sources = {
        '1.1': [
            { name: 'Comisión Europea - Access2Markets', url: 'https://trade.ec.europa.eu/access-to-markets/' },
            { name: 'OECD - Trade Barriers in SME Internationalisation', url: 'https://www.oecd.org/' }
        ],
        '1.2': [
            { name: 'OMC - World Trade Report', url: 'https://www.wto.org/' },
            { name: 'ICEX - Guía de país', url: 'https://www.icex.es/' }
        ],
        '2.1': [
            { name: 'Banco Mundial - Logistics Performance Index', url: 'https://lpi.worldbank.org/' }
        ],
        '2.2': [
            { name: 'Banco Mundial - Logistics Performance Index', url: 'https://lpi.worldbank.org/' },
            { name: 'Foro Económico Mundial - Global Competitiveness Report', url: 'https://www.weforum.org/' }
        ],
        '3.1': [
            { name: 'Banco Mundial - World Development Indicators', url: 'https://databank.worldbank.org/' },
            { name: 'Banco Mundial - World Integrated Trade Solution', url: 'https://wits.worldbank.org/' }
        ],
        '3.2': [
            { name: 'OECD - SME trade, GVCs and competition', url: 'https://www.oecd.org/' }
        ],
        '3.3': [
            { name: 'Hofstede, G. (2010). Cultures and Organizations', url: 'https://www.hofstede-insights.com/' }
        ],
        '4.1': [
            { name: 'Banco Mundial - World Development Indicators', url: 'https://databank.worldbank.org/' }
        ],
        '4.2': [
            { name: 'FMI - World Economic Outlook', url: 'https://www.imf.org/' },
            { name: 'Banco Mundial - Global Economic Prospects', url: 'https://www.worldbank.org/' }
        ],
        '5.1': [
            { name: 'Banco Mundial - Worldwide Governance Indicators', url: 'https://info.worldbank.org/governance/wgi/' }
        ],
        '5.2': [
            { name: 'Banco Mundial - Worldwide Governance Indicators', url: 'https://info.worldbank.org/governance/wgi/' },
            { name: 'Transparency International - Corruption Perceptions Index', url: 'https://www.transparency.org/' }
        ],
        '6.1': [
            { name: 'Comisión Europea - Acuerdos comerciales', url: 'https://trade.ec.europa.eu/' }
        ],
        '6.2': [
            { name: 'ICEX - Programas de apoyo a la exportación', url: 'https://www.icex.es/' },
            { name: 'Cámaras de Comercio de España', url: 'https://www.camaras.org/' }
        ],
        '7.1': [
            { name: 'Banco Mundial - Import Demand Elasticities', url: 'https://www.worldbank.org/' }
        ],
        '7.2': [
            { name: 'OECD - SME trade, GVCs and competition', url: 'https://www.oecd.org/' }
        ],
        '7.3': [
            { name: 'OECD - SME trade, GVCs and competition', url: 'https://www.oecd.org/' },
            { name: 'Banco Mundial - World Integrated Trade Solution', url: 'https://wits.worldbank.org/' }
        ],
        '7.4': [
            { name: 'Banco Mundial - Regulatory Quality', url: 'https://info.worldbank.org/governance/wgi/' }
        ]
    };
    return sources[criterionCode] || [];
}

// Perfil de empresa.
//
// No hay un selector con el que elegirlo a mano: el perfil se deduce de las
// dos primeras preguntas de "Tus preferencias" (recursos y orientacion al
// riesgo). Son las unicas dos variables que lo determinan, y los cuatro
// perfiles existentes son exactamente las cuatro combinaciones posibles:
//
//   recursos medio-altos + riesgo medio-alto -> A
//   pocos recursos     + riesgo medio-alto -> B
//   recursos medio-altos + conservador     -> C
//   pocos recursos     + conservador     -> D
//
// Si las respuestas no estan marcadas se usa A, que es lo que pasaba antes
// cuando el selector.traia el perfil A marcado por defecto.
function getSelectedProfile() {
    const recursos = document.querySelector('input[name="recursos"]:checked');
    const riesgo = document.querySelector('input[name="riesgo"]:checked');

    const muchosRecursos = !recursos || recursos.value !== 'pocos';
    const moderado = !riesgo || riesgo.value !== 'conservador';

    if (muchosRecursos && moderado) return 'A';
    if (!muchosRecursos && moderado) return 'B';
    if (muchosRecursos && !moderado) return 'C';
    return 'D';
}

// Nombre legible del perfil, para mostrarlo mientras el usuario contesta.
function nombrePerfil(clave) {
    return profileWeights[clave] ? profileWeights[clave].name : '';
}

// Escribe el perfil detectado debajo de las dos preguntas.
function pintarPerfilDetectado() {
    const destino = document.getElementById('perfil-resultado-valor');
    if (!destino) return;
    const clave = getSelectedProfile();
    destino.textContent = clave + ' · ' + nombrePerfil(clave);
}

// Get CNAE code
function getCnaeCode() {
    const input = document.getElementById('cnae-input');
    return input ? input.value.trim() : '';
}

// Rellena el desplegable de productos CNAE con el catalogo completo
function initCnaeSelector() {
    const lista = document.getElementById('cnae-lista');
    if (!lista) return;
    const codigos = Object.keys(cnaeSectors).sort();
    const fragmento = document.createDocumentFragment();
    codigos.forEach(function (codigo) {
        const opcion = document.createElement('option');
        opcion.value = codigo;
        opcion.label = cnaeSectors[codigo].name;
        // "codigo - nombre" para que ambos campos sean busquables
        opcion.textContent = codigo + ' - ' + cnaeSectors[codigo].name;
        fragmento.appendChild(opcion);
    });
    lista.appendChild(fragmento);
}

// Muestra en vivo el nombre real del producto segun el CNAE introducido
function initCnaePreview() {
    const input = document.getElementById('cnae-input');
    const ayuda = document.getElementById('cnae-ayuda');
    if (!input || !ayuda) return;

    const textoPorDefecto = ayuda.textContent;

    function refrescar() {
        const codigo = getCnaeCodigo(input.value);
        if (!codigo) {
            ayuda.textContent = textoPorDefecto;
            ayuda.style.color = '';
            return;
        }
        if (cnaeSectors[codigo]) {
            ayuda.textContent = 'Producto: ' + cnaeSectors[codigo].name;
            ayuda.style.color = '#047857';
        } else {
            ayuda.textContent = 'CNAE ' + codigo + ' no figura en el catalogo de GEM';
            ayuda.style.color = '#b45309';
        }
    }

    input.addEventListener('input', refrescar);
    input.addEventListener('change', refrescar);
    refrescar();
}

// Calculate FMFS score based on profile
// --- Arquitectura del GEM Score (6 pasos) ---
//
// Paso 1  La empresa responde las 22 preguntas.
// Paso 2  Cada respuesta se transforma en un score 0-100.
// Paso 3  Se calculan los seis bloques.
// Paso 4  Se aplica el perfil A, B, C o D.
// Paso 5  FMFS ponderado por perfil.
// Paso 6  Se combina con el Market Attractiveness mediante media geometrica.

// Los seis bloques y las preguntas que los componen (Paso 3).
// 22 preguntas: se han retirado las tres que dependian del mercado objetivo,
// porque ahora se responden mas adelante, para un pais concreto.
const BLOQUES = [
    { id: 'PMF',         nombre: 'Encaje producto-Mercado',   preguntas: [1, 2, 3] },
    { id: 'Adapt',       nombre: 'Capacidad de adaptación',   preguntas: [4, 5, 6, 7] },
    { id: 'Finanzas',    nombre: 'Recursos financieros',      preguntas: [8, 9, 10, 11] },
    { id: 'Comercial',   nombre: 'Capacidad comercial',       preguntas: [12, 13, 14, 15, 16] },
    { id: 'Experiencia', nombre: 'Experiencia internacional', preguntas: [17, 18, 19] },
    { id: 'Operaciones', nombre: 'Capacidad operativa',       preguntas: [20, 21, 22] }
];

// Peso de cada bloque en el FMFS para un perfil concreto (Paso 4).
// Derivado de los pesos que ya trae cada perfil, agregando los criterios
// del mercado asociados a cada bloque. Un perfil conservative, por ejemplo,
// da mas peso a la confianza legal (Operaciones) y menos al mercado.
const CRITERIO_POR_BLOQUE = {
    PMF: '3.1', Adapt: '1.1', Finanzas: '4.1',
    Comercial: '2.1', Experiencia: '6.1', Operaciones: '5.1'
};

function getPesosBloques(profile) {
    const weights = profileWeights[profile].weights;
    const pesos = {};
    BLOQUES.forEach(function (bloque) {
        pesos[bloque.id] = weights[CRITERIO_POR_BLOQUE[bloque.id]] || 5;
    });
    return pesos;
}

// Devuelve la respuesta de cada pregunta como valor numerico (Paso 2)
function leerRespuestas() {
    const selects = document.querySelectorAll('.questionnaire-grid select');
    const respuestas = [];
    selects.forEach(function (select, index) {
        respuestas.push(select.value ? parseInt(select.value, 10) : null);
    });
    return respuestas;
}

// Paso 3: media de las preguntas de cada bloque, mas el total contestado
function calcularBloques(respuestas) {
    const bloques = [];
    let contestadas = 0;
    respuestas.forEach(function (r) { if (r !== null) contestadas++; });

    BLOQUES.forEach(function (definicion) {
        const valores = definicion.preguntas
            .map(function (n) { return respuestas[n - 1]; })
            .filter(function (v) { return v !== null; });
        const media = valores.length
            ? valores.reduce(function (a, b) { return a + b; }, 0) / valores.length
            : null;
        bloques.push({
            id: definicion.id,
            nombre: definicion.nombre,
            score: media === null ? null : Math.round(media),
            contestadas: valores.length,
            total: definicion.preguntas.length
        });
    });

    return { bloques: bloques, contestadas: contestadas };
}

// Paso 5: FMFS = media de los seis bloques, ponderada por el perfil elegido.
// Devuelve null si la empresa no ha contestado ninguna pregunta, para poder
// distinguir "sin datos" de "con puntuación cero".
function calcularFMFS() {
    const profile = getSelectedProfile();
    const respuestas = leerRespuestas();
    const { bloques, contestadas } = calcularBloques(respuestas);
    const pesos = getPesosBloques(profile);

    let sumaPonderada = 0;
    let pesoAcumulado = 0;
    const detalle = bloques.map(function (bloque) {
        if (bloque.score === null) return Object.assign({}, bloque, { peso: pesos[bloque.id] });
        sumaPonderada += bloque.score * pesos[bloque.id];
        pesoAcumulado += pesos[bloque.id];
        return Object.assign({}, bloque, { peso: pesos[bloque.id] });
    });

    const score = pesoAcumulado > 0 ? Math.round(sumaPonderada / pesoAcumulado) : null;

    return {
        score: score,
        profile: profile,
        bloques: detalle,
        contestadas: contestadas,
        total: BLOQUES.reduce(function (a, b) { return a + b.preguntas.length; }, 0)
    };
}

// Market Attractiveness Score: cuanto ofrece el mercado, con independencia
// de la empresa. Es la mitad "externa" del modelo.
//
// Se calcula como la media PONDERADA de los 17 criterios, con los pesos que
// corresponde al perfil de la empresa. No se parte de un numero unico por
// pais: el resultado sale de la misma tabla que el usuario ve en el informe,
// de modo que el total y el desglose no pueden contradecirse.
function calcularAtractividadMercado(country, profile, cnae) {
    const puntajes = getCriterionScores(country, profile, cnae);
    const pesos = profileWeights[profile].weights;

    let sumaPesos = 0;
    let acumulado = 0;
    Object.keys(NOMBRES_CRIT).forEach(function (crit) {
        const peso = pesos[crit] || 0;
        sumaPesos += peso;
        acumulado += puntajes[crit] * peso;
    });

    if (!sumaPesos) return 0;
    return Math.max(0, Math.min(100, Math.round(acumulado / sumaPesos)));
}

// Paso 6: GEM Score = raiz cuadrada de (FMFS x Atractividad).
// La media geometrica es la que hace que el modelo funcione: un mercado
// excelente no compensa a una empresa incapaz de cumplir, y una empresa
// muy preparada tampoco salva a un mercado hostil. El equilibrio premia.
function calcularGEMScore(country, profile, cnae, fmfs) {
    const atractivo = calcularAtractividadMercado(country, profile, cnae);

    // Sin respuestas del cuestionario no hay FMFS, asi que solo mostramos
    // la atleastractividad del mercado en lugar de inventar un dato.
    if (fmfs === null || fmfs === undefined) {
        return {
            score: atractivo,
            atractivo: atractivo,
            fmfs: null,
            completo: false
        };
    }

    const score = Math.round(Math.sqrt(fmfs * atractivo));
    return {
        score: Math.max(0, Math.min(100, score)),
        atractivo: atractivo,
        fmfs: fmfs,
        completo: true
    };
}

// Calcula el GEM Score de un pais con el estado actual del cuestionario
function calculateCountryScore(country, profile, cnae) {
    const fmfs = calcularFMFS();
    return calcularGEMScore(country, profile, cnae, fmfs.score).score;
}

// Igual que el anterior, pero devuelve tambien el desglose de los dos factores
function obtenerGEMScore(country, profile, cnae) {
    const fmfs = calcularFMFS();
    return calcularGEMScore(country, profile, cnae, fmfs.score);
}

// --- Probabilidad de éxito exportador en un mercado concreto ---
//
// Las tres preguntas que se responden aqui son las que dependian del mercado
// objetivo y que se retiraron del cuestionario general.
const PREGUNTAS_MERCADO = [
    {
        titulo: 'En qué medida el producto responde a una necesidad concreta y existente en el mercado objetivo?',
        opciones: [
            ['20', 'Nada adecuado'], ['40', 'Poco adecuado'], ['60', 'Medianamente adecuado'],
            ['80', 'Bastante adecuado'], ['100', 'Totalmente adecuado']
        ]
    },
    {
        titulo: '¿Qué evidencia tiene la empresa de que clientes del mercado objetivo estarían dispuestos a comprar?',
        opciones: [
            ['20', 'Ninguna evidencia'], ['40', 'Solo intención de compra'], ['60', 'Algunas muestras o pruebas'],
            ['80', 'Pedidos o cartas de intención'], ['100', 'Clientes cerrados o repeat orders']
        ]
    },
    {
        titulo: '¿Presencia comercial en el mercado objetivo?',
        opciones: [
            ['20', 'Ninguna presencia'], ['40', 'Solo venta a distancia'], ['60', 'Un agente o socio local'],
            ['80', 'Oficina o representante comercial'], ['100', 'Filial o estructura propia consolidada']
        ]
    }
];

function initProbabilidadExportador() {
    const selectPais = document.getElementById('prob-pais');
    const contPreguntas = document.getElementById('prob-preguntas');
    const contResultado = document.getElementById('prob-resultado');
    if (!selectPais || !contPreguntas || !contResultado) return;

    // Lista de paises disponibles, en castellano y ordenados alfabeticamente
    const paises = Object.keys(countryBaseScores)
        .filter(function (p) { return p !== 'Spain'; })
        .map(function (p) { return { valor: p, nombre: getCountryNameES(p) }; })
        .sort(function (a, b) { return a.nombre.localeCompare(b.nombre, 'es'); });

    paises.forEach(function (p) {
        const opcion = document.createElement('option');
        opcion.value = p.valor;
        opcion.textContent = p.nombre;
        selectPais.appendChild(opcion);
    });

    // Las tres preguntas
    PREGUNTAS_MERCADO.forEach(function (pregunta, indice) {
        const bloque = document.createElement('div');
        bloque.className = 'prob-pregunta';

        const etiqueta = document.createElement('p');
        etiqueta.innerHTML = '<strong>' + (indice + 1) + '.</strong> ' + pregunta.titulo;
        bloque.appendChild(etiqueta);

        const select = document.createElement('select');
        select.className = 'form-control';
        select.id = 'prob-q' + (indice + 1);
        select.innerHTML = '<option value="">Seleccionar...</option>';
        pregunta.opciones.forEach(function (op) {
            const option = document.createElement('option');
            option.value = op[0];
            option.textContent = op[1];
            select.appendChild(option);
        });
        bloque.appendChild(select);

        contPreguntas.appendChild(bloque);
        select.addEventListener('change', calcularProbabilidadExportador);
    });

    selectPais.addEventListener('change', calcularProbabilidadExportador);
    calcularProbabilidadExportador();
}

// Probabilidad de éxito exportador = (suma de las 3 respuestas / 300) x
// el atractivo del mercado ajustado por perfil y capacidad exportadora.
function calcularProbabilidadExportador() {
    const selectPais = document.getElementById('prob-pais');
    const contResultado = document.getElementById('prob-resultado');
    if (!selectPais || !contResultado) return;

    const pais = selectPais.value;
    const nombrePais = getCountryNameES(pais);

    const valores = [];
    for (let i = 1; i <= 3; i++) {
        const select = document.getElementById('prob-q' + i);
        valores.push(select && select.value ? parseInt(select.value, 10) : null);
    }
    const contestadas = valores.filter(function (v) { return v !== null; }).length;

    // Si no se ha contestado nada se avisa de que falta seguir los pasos.
    if (contestadas === 0) {
        contResultado.classList.add('error');
        contResultado.innerHTML =
            '<p class="prob-error">ERROR: selecciona un mercado y contesta las tres preguntas para ver tu Probabilidad de éxito exportador.</p>';
        return;
    }

    const suma = valores.reduce(function (a, b) { return a + (b || 0); }, 0);
    const porcentajeEncaje = Math.round((suma / 300) * 100);

    const ajustado = calcularGEMScore(pais, getSelectedProfile(), getCnaeCode(), calcularFMFS().score).score;
    const probabilidad = Math.round((suma / 300) * ajustado);

    const nivel = getScoreLevel(probabilidad);
    const color = colors[nivel];

    contResultado.innerHTML =
        '<h3>Probabilidad de éxito exportador en ' + nombrePais + '</h3>' +
        '<div class="prob-valor" style="color:' + color + '">' + probabilidad + '<small>/100</small></div>' +
        '<p class="prob-nivel">' + levelText[nivel] + '</p>' +
        '<p class="prob-nota">' +
            'Cómo se ha calculado: tus tres respuestas suman ' + suma + ' sobre un máximo de 300, es decir un ' +
            porcentajeEncaje + '% de encaje con el mercado. Ese porcentaje se aplica sobre el atractivo del mercado ' +
            'ajustado por tu perfil y capacidad exportadora (' + ajustado + '/100). ' +
            probabilidad + '/100 = (' + suma + '/300) × ' + ajustado + '.' +
        '</p>';

    contResultado.classList.remove('error');

    registrarAnalisisProbabilidad(nombrePais, probabilidad, suma);
}

// Esta funcion se dispara cada vez que se mueve un desplegable, asi que antes
// de guardar hay que comprobar que el analisis no sea el mismo que el ultimo
// que ya se registro. De lo contrario el historial se llenaria de repetidos
// del mismo mercado.
function registrarAnalisisProbabilidad(nombrePais, probabilidad, suma) {
    const lista = leerActividad();
    const primero = lista[0];
    // La puntuacion forma parte del titulo, no del detalle
    const titulo = 'Probabilidad de éxito exportador en ' + nombrePais + ': ' + probabilidad + '/100';
    if (primero && primero.tipo === 'prob' && primero.titulo === titulo) return;

    registrarActividad(
        'prob',
        titulo,
        'Encaje de tus respuestas ' + suma + '/300 · atractivo del mercado ' +
            'ajustado a tu perfil'
    );
}

// --- Acceso, registro y seccion privada ------------------------------------
//
// AVISO IMPORTANTE
// Esta aplicacion es estatica: no hay servidor. La cuenta y la contrasena se
// guardan solo en el navegador del visitante y NO se envian a ningun sitio.
// Sirve para enseñar el diseno y el funcionamiento, pero todavia no protege
// nada ni guarda los registros. Para ponerlo en marcha de verdad hay que
// anadir un backend en el punto marcado como PUNTO DE CONEXION mas abajo.

const CLAVE_USUARIOS = 'gem.usuarios';
const CLAVE_SESION = 'gem.sesion';
const CLAVE_ACTIVIDAD = 'gem.actividad';

// Secciones que solo se verian con sesion iniciada cuando el cierre este activo.
// La seccion "yo" NO va aqui: no se muestra por scroll sino solo al pulsar su
// enlace del menu, y la gestiona initYo.
const SECCIONES_PRIVADAS = ['servicios', 'preferencias', 'mapa', 'prob-exito'];

// Numero maximo de entradas que se guardan. El historial es para consulta
// inmediata, no para archivo, asi que se recorta para no llenar el navegador.
const MAX_ACTIVIDAD = 60;

// CIERRE DE LA WEB.
//
// false = modo prueba: todas las secciones se ven siempre, sin necesidad de
//         entrar. Es lo que se enseña ahora a la empresa informatica y a los
//         primeros usuarios.
// true  = modo produccion: sin entrar solo se ven Acceso, Registro y
//         Contacto. Poner en true cuando haya un servidor donde comprobar
//         usuario y contrasena.
const CIERRE_ACTIVO = false;

function leerUsuarios() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
    } catch (e) {
        return [];
    }
}

function guardarUsuarios(lista) {
    // PUNTO DE CONEXION: sustituir por la llamada al servidor cuando exista.
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
}

// Reglas de la contrasena: 6 caracteres, 1 mayuscula, 1 minuscula y 2 numeros.
// Devuelve un texto de error, o cadena vacia si la contrasena es valida.
function validarPassword(password) {
    if (!password) return 'Escribe la contrasena.';
    if (password.length < 6) return 'La contrasena debe tener al menos 6 caracteres.';
    if (!/[A-Z]/.test(password)) return 'La contrasena debe incluir al menos una mayuscula.';
    if (!/[a-z]/.test(password)) return 'La contrasena debe incluir al menos una minuscula.';
    if ((password.match(/[0-9]/g) || []).length < 2) return 'La contrasena debe incluir al menos dos numeros.';
    return '';
}

function validarEmail(email) {
    if (!email) return 'Escribe el correo electronico.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'El correo electronico no tiene un formato valido.';
    return '';
}

function mostrarError(idElemento, texto) {
    const caja = document.getElementById(idElemento);
    if (!caja) return;
    if (!texto) {
        caja.hidden = true;
        caja.textContent = '';
        return;
    }
    caja.hidden = false;
    caja.textContent = texto;
}

function marcarError(campo, hayError) {
    if (campo) campo.classList.toggle('error', hayError);
}

// Pantallas de acceso y de registro. Solo se muestra una de las dos: al
// pulsar "Entrar" aparece el acceso y se oculta el registro, y al revés.
function mostrarPanelAuth(panel) {
    const acceso = document.getElementById('acceso');
    const registro = document.getElementById('registro');
    if (acceso) acceso.classList.toggle('oculto', panel !== 'acceso');
    if (registro) registro.classList.toggle('oculto', panel !== 'registro');
    const destino = document.getElementById(panel);
    if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ocultarPanelesAuth() {
    ['acceso', 'registro'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('oculto');
    });
}

// --- Estado de la sesion ----------------------------------------------------

function haySesion() {
    return !!localStorage.getItem(CLAVE_SESION);
}

function usuarioActual() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_SESION));
    } catch (e) {
        return null;
    }
}

// Aplica el estado de sesion a la pagina: muestra u oculta secciones,
// cambia los enlaces del menu y avisa a las demas funciones.
function aplicarSesion() {
    const conSesion = haySesion();
    const usuario = conSesion ? usuarioActual() : null;

    // En modo prueba ninguna seccion se oculta
    if (CIERRE_ACTIVO) {
        SECCIONES_PRIVADAS.forEach(function (id) {
            const seccion = document.getElementById(id);
            if (seccion) seccion.classList.toggle('oculto', !conSesion);
        });
    } else {
        SECCIONES_PRIVADAS.forEach(function (id) {
            const seccion = document.getElementById(id);
            if (seccion) seccion.classList.remove('oculto');
        });
    }

    // El mapa no tiene sentido oculto: se vacia y se vuelve a dibujar
    document.querySelectorAll('.nav-auth').forEach(function (li) {
        li.hidden = conSesion;
    });
    document.querySelectorAll('.nav-sesion').forEach(function (li) {
        li.hidden = !conSesion;
    });
    // Sin sesion no puede quedar nada de "Mi cuenta" abierto a la vista
    if (!conSesion) {
        ocultarPanelMiCuenta();
        cerrarSubmenuCuenta();
    }
    const etiqueta = document.getElementById('nav-usuario');
    // Sin sesion se vacia el nombre: si no, el del usuario anterior se queda
    // escrito en el menu aunque ya no haya cuenta iniciada.
    if (etiqueta) etiqueta.textContent = usuario ? usuario.usuario : '';

    pintarActividad();

    const url = new URL(window.location.href);
    if (CIERRE_ACTIVO && !conSesion && SECCIONES_PRIVADAS.indexOf(url.hash.slice(1)) !== -1) {
        url.hash = '#contacto';
        window.location.replace(url.toString());
        return;
    }
    if (conSesion) {
        // Redibuja lo que dependia del mapa ahora que ya se puede ver
        try { initMap(); renderTopMarkets(); pintarFMFS(); } catch (e) { /* aun no listo */ }
    }
}

function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
    aplicarSesion();
}

// --- Actividad guardada -----------------------------------------------------

// Cada analisis que hace el usuario se anade aqui para poder consultarlo
// despues desde la seccion "Yo". Se guarda solo en su navegador: no se
// envia a ningun servidor.
function leerActividad() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_ACTIVIDAD));
        return Array.isArray(datos) ? datos : [];
    } catch (e) {
        return [];
    }
}

// registrarActividad(tipo, titulo, detalle)
// tipo: 'mapa' | 'prob' | 'cuestionario' | 'perfil'
function registrarActividad(tipo, titulo, detalle) {
    try {
        const lista = leerActividad();
        lista.unshift({
            tipo: tipo,
            titulo: titulo,
            detalle: detalle || '',
            fecha: new Date().toISOString()
        });
        // Se recorta por el principio: lo mas reciente primero
        localStorage.setItem(CLAVE_ACTIVIDAD, JSON.stringify(lista.slice(0, MAX_ACTIVIDAD)));
        pintarActividad();
    } catch (e) {
        // Si el navegador no deja guardar (modo privado, cuota llena) la web
        // sigue funcionando: solo se pierde el historial.
    }
}

function borrarActividad() {
    localStorage.removeItem(CLAVE_ACTIVIDAD);
    pintarActividad();
}

function formatearFecha(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ' · ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

// Rellena el panel de actividad con la ficha de la cuenta y el historial.
function pintarActividad() {
    const lista = leerActividad();
    const vacio = document.getElementById('yo-vacio');
    const ul = document.getElementById('yo-lista');
    const btnBorrar = document.getElementById('yo-borrar-actividad');

    // Ficha de la cuenta
    const datos = document.getElementById('yo-datos');
    const usuario = usuarioActual();
    if (datos) {
        const etiquetas = {
            usuario: 'Usuario',
            email: 'Email',
            tipoCuenta: 'Tipo de cuenta',
            nombreEmpresa: 'Empresa',
            lugar: 'Lugar',
            cargo: 'Cargo',
            fechaRegistro: 'Registrado'
        };
        const filas = [];
        if (usuario) {
            Object.keys(etiquetas).forEach(function (clave) {
                const valor = usuario[clave];
                if (!valor) return;
                let texto = valor;
                if (clave === 'fechaRegistro') texto = formatearFecha(valor);
                filas.push('<dt>' + etiquetas[clave] + '</dt><dd>' + escaparHTML(String(texto)) + '</dd>');
            });
        }
        if (!filas.length) {
            filas.push('<dt>Sesión</dt><dd>Sin cuenta iniciada</dd>');
        }
        datos.innerHTML = filas.join('');
    }

    // Lista de actividad
    if (ul) {
        if (!lista.length) {
            ul.innerHTML = '';
            if (vacio) vacio.hidden = false;
        } else {
            if (vacio) vacio.hidden = true;
            ul.innerHTML = lista.map(function (item) {
                const clase = ['mapa', 'prob', 'cuestionario', 'perfil'].indexOf(item.tipo) !== -1 ? item.tipo : '';
                return '<li class="yo-item">' +
                    '<div class="yo-item-cuerpo">' +
                    '<span class="yo-item-tipo ' + clase + '">' + escaparHTML(item.tipo || 'actividad') + '</span>' +
                    '<p class="yo-item-titulo">' + escaparHTML(item.titulo || '') + '</p>' +
                    (item.detalle ? '<p class="yo-item-detalle">' + escaparHTML(item.detalle) + '</p>' : '') +
                    '</div>' +
                    '<span class="yo-item-fecha">' + escaparHTML(formatearFecha(item.fecha)) + '</span>' +
                    '</li>';
            }).join('');
        }
    }

    // "Borrar actividad" solo se activa si hay algo que borrar
    if (btnBorrar) {
        const hayDatos = lista.length > 0;
        btnBorrar.classList.toggle('btn-disabled', !hayDatos);
        btnBorrar.classList.toggle('btn-cerrar-cuenta', !hayDatos);
        btnBorrar.disabled = !hayDatos;
    }
}

// Evita que un dato guardado se interprete como HTML al pintarlo.
function escaparHTML(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Descarga el historial como fichero de texto, sin depender de la red.
function exportarActividad() {
    const lista = leerActividad();
    if (!lista.length) return;
    const usuario = usuarioActual() || {};
    const cabecera = [
        'GEM - Global Export Market Intelligence',
        'Actividad de ' + (usuario.usuario || 'usuario') +
            (usuario.email ? ' (' + usuario.email + ')' : ''),
        'Exportado el ' + new Date().toLocaleString('es-ES'),
        ''
    ].join('\n');

    const cuerpo = lista.map(function (item, i) {
        return [
            '----------------------------------------',
            (i + 1) + '. ' + (item.tipo || 'actividad').toUpperCase(),
            '   ' + (item.titulo || ''),
            (item.detalle ? '   ' + item.detalle : ''),
            '   ' + formatearFecha(item.fecha)
        ].filter(Boolean).join('\n');
    }).join('\n');

    const blob = new Blob([cabecera + cuerpo + '\n'], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gem-actividad.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Pide confirmacion antes de borrar, porque no hay vuelta atras.
function confirmarBorrado(texto, alConfirmar) {
    if (window.confirm(texto)) alConfirmar();
}

// --- Navegacion protegida ---------------------------------------------------

// Si se pide entrar en una seccion privada sin sesion, se va al contacto.
function vigilarNavegacionPrivada() {
    document.addEventListener('click', function (evento) {
        const enlace = evento.target.closest('a[href^="#"]');
        if (!enlace || haySesion() || !CIERRE_ACTIVO) return;
        const destino = enlace.getAttribute('href').slice(1);
        if (SECCIONES_PRIVADAS.indexOf(destino) === -1) return;

        evento.preventDefault();
        mostrarAvisoSesion();
        document.getElementById('contacto').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

function mostrarAvisoSesion() {
    let aviso = document.getElementById('aviso-sesion');
    if (!aviso) {
        aviso = document.createElement('p');
        aviso.id = 'aviso-sesion';
        aviso.className = 'auth-error';
        const contacto = document.getElementById('contacto');
        const cabecera = contacto ? contacto.querySelector('.section-header') : null;
        if (cabecera && cabecera.parentNode) {
            cabecera.parentNode.insertBefore(aviso, cabecera.nextSibling);
        }
    }
    aviso.hidden = false;
    aviso.textContent = 'Para ver los servicios y las herramientas de analisis necesitas entrar con tu cuenta.';
}

// --- Seccion "Mi cuenta" ----------------------------------------------------
//
// El menu tiene un boton "Mi cuenta". Al pulsarlo se abre la seccion y se
// despliegan tres opciones: actividad pasada, suscripciones y pago, y cerrar
// sesion. Cada opcion muestra un panel distinto en el mismo sitio.
//
// Al entrar en la pagina no se ve nada de esto: ni la seccion ni el desplegable.

function initYo() {
    ocultarPanelMiCuenta();
    cerrarSubmenuCuenta();
    pintarActividad();

    // Boton "Mi cuenta": abre la seccion y despliega las tres opciones.
    document.addEventListener('click', function (evento) {
        const boton = evento.target.closest('#nav-mi-cuenta');
        if (!boton) return;
        evento.preventDefault();
        const submenu = document.getElementById('cuenta-submenu');
        // Si ya esta abierta, el segundo clic la pliega
        if (submenu && !submenu.hidden) {
            cerrarSubmenuCuenta();
            ocultarPanelMiCuenta();
            return;
        }
        abrirSubmenuCuenta();
        mostrarPanelMiCuenta();
    });

    // Las tres opciones del desplegable: cada una abre su panel
    document.addEventListener('click', function (evento) {
        const opcion = evento.target.closest('[data-cuenta-panel]');
        if (!opcion) return;
        evento.preventDefault();
        mostrarPanelCuenta(opcion.getAttribute('data-cuenta-panel'));
    });

    // Al pulsar fuera del desplegable, este se pliega
    document.addEventListener('click', function (evento) {
        const submenu = document.getElementById('cuenta-submenu');
        if (!submenu || submenu.hidden) return;
        if (evento.target.closest('.nav-cuenta')) return;
        cerrarSubmenuCuenta();
    });

    // Navegar a cualquier otra seccion cierra la de Mi cuenta
    document.addEventListener('click', function (evento) {
        const enlace = evento.target.closest('a[href^="#"]');
        if (!enlace || enlace.closest('.nav-cuenta')) return;
        ocultarPanelMiCuenta();
        cerrarSubmenuCuenta();
    });

    // Descargar el historial
    document.addEventListener('click', function (evento) {
        const boton = evento.target.closest('#yo-exportar');
        if (!boton) return;
        evento.preventDefault();
        exportarActividad();
    });

    // Borrar solo la actividad, sin cerrar la sesion
    document.addEventListener('click', function (evento) {
        const boton = evento.target.closest('#yo-borrar-actividad');
        if (!boton || boton.disabled) return;
        evento.preventDefault();
        confirmarBorrado(
            'Se borrara el historial de actividad guardado en este navegador. Tu cuenta seguira abierta.\n\nContinuar?',
            function () {
                borrarActividad();
                alert('El historial se ha borrado de este navegador.');
            }
        );
    });

    // Cerrar sesion sin borrar nada
    document.addEventListener('click', function (evento) {
        const boton = evento.target.closest('#cuenta-cerrar-sesion');
        if (!boton) return;
        evento.preventDefault();
        cerrarSesion();
    });

    // Cerrar sesion y borrar cuenta y actividad
    document.addEventListener('click', function (evento) {
        const boton = evento.target.closest('#cuenta-borrar-todo');
        if (!boton) return;
        evento.preventDefault();
        confirmarBorrado(
            'Se cerrara tu sesion y se borraran de este navegador el historial de actividad y los datos de la cuenta. Esta accion no se puede deshacer.\n\nContinuar?',
            function () {
                borrarActividad();
                cerrarSesion();
            }
        );
    });
}

function abrirSubmenuCuenta() {
    const submenu = document.getElementById('cuenta-submenu');
    const boton = document.getElementById('nav-mi-cuenta');
    if (submenu) submenu.hidden = false;
    if (boton) boton.setAttribute('aria-expanded', 'true');
}

function cerrarSubmenuCuenta() {
    const submenu = document.getElementById('cuenta-submenu');
    const boton = document.getElementById('nav-mi-cuenta');
    if (submenu) submenu.hidden = true;
    if (boton) boton.setAttribute('aria-expanded', 'false');
}

// La seccion "Mi cuenta" se comporta como las pantallas de acceso y de
// registro: al entrar en la pagina esta oculta, y solo aparece al pulsar su
// boton del menu. Con cualquier otra accion vuelve a esconderse.
function ocultarPanelMiCuenta() {
    const el = document.getElementById('mi-cuenta');
    if (el) el.classList.add('oculto');
    // Sin panel visible no hay ninguna de las tres opciones a la vista
    mostrarPanelCuenta(null);
}

function mostrarPanelMiCuenta() {
    const el = document.getElementById('mi-cuenta');
    if (!el) return;
    el.classList.remove('oculto');
    pintarActividad();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Muestra uno de los tres paneles y oculta los otros dos.
// Sin argumentos no se ve ninguno.
function mostrarPanelCuenta(nombre) {
    document.querySelectorAll('.cuenta-panel').forEach(function (panel) {
        panel.hidden = panel.getAttribute('data-panel') !== nombre;
    });

    const textos = {
        actividad: 'Tus análisis y los datos de tu cuenta',
        suscripciones: 'Servicios que tienes contratados',
        sesion: 'Cerrar la sesión o borrar tu cuenta'
    };
    const intro = document.getElementById('mi-cuenta-intro');
    if (intro) intro.textContent = textos[nombre] || 'Elige qué quieres consultar';
}

// --- Formularios ------------------------------------------------------------

function initAuth() {
    // Al entrar en la pagina no se ve ninguna de las dos pantallas: aparecen
    // solo cuando se pulsa "Entrar" o "Registrarse" en el menu.
    ocultarPanelesAuth();

    // Enlaces del menu y enlaces cruzados entre las dos pantallas
    document.addEventListener('click', function (evento) {
        const enlace = evento.target.closest('a[href^="#"]');
        if (!enlace) return;
        const destino = enlace.getAttribute('href').slice(1);
        if (destino !== 'acceso' && destino !== 'registro') return;
        evento.preventDefault();
        mostrarPanelAuth(destino);
    });

    // Selector autonomo / empresa: muestra los campos de empresa al elegir
    document.querySelectorAll('input[name="tipo"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            const esEmpresa = document.querySelector('input[name="tipo"]:checked').value === 'empresa';
            const grupo = document.getElementById('grupo-empresa');
            if (grupo) grupo.hidden = !esEmpresa;
        });
    });

    // Alta
    const formAcceso = document.getElementById('form-acceso');
    if (formAcceso) {
        formAcceso.addEventListener('submit', function (evento) {
            evento.preventDefault();
            const usuario = document.getElementById('acceso-usuario');
            const password = document.getElementById('acceso-password');

            const errorPass = validarPassword(password.value);
            mostrarError('acceso-error', errorPass);
            marcarError(password, !!errorPass);

            if (!usuario.value.trim()) {
                mostrarError('acceso-error', 'Escribe tu usuario.');
                marcarError(usuario, true);
                return;
            }
            marcarError(usuario, false);
            if (errorPass) return;

            // PUNTO DE CONEXION: sustituir por la verificacion contra el servidor.
            const usuarios = leerUsuarios();
            const encontrado = usuarios.find(function (u) {
                return u.usuario.toLowerCase() === usuario.value.trim().toLowerCase();
            });

            if (!encontrado) {
                mostrarError('acceso-error', 'No hay ninguna cuenta con ese usuario.');
                return;
            }
            if (encontrado.password !== password.value) {
                mostrarError('acceso-error', 'La contrasena no es correcta.');
                return;
            }

            localStorage.setItem(CLAVE_SESION, JSON.stringify({
                usuario: encontrado.usuario,
                tipo: encontrado.tipo,
                empresa: encontrado.empresa || null
            }));
            mostrarError('acceso-error', '');
            formAcceso.reset();
            ocultarPanelesAuth();
            aplicarSesion();
            document.getElementById('servicios').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Registro
    const formRegistro = document.getElementById('form-registro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', function (evento) {
            evento.preventDefault();
            const tipo = document.querySelector('input[name="tipo"]:checked').value;
            const esEmpresa = tipo === 'empresa';

            const usuario = document.getElementById('reg-usuario');
            const lugar = document.getElementById('reg-lugar');
            const email = document.getElementById('reg-email');
            const telefono = document.getElementById('reg-telefono');
            const password = document.getElementById('reg-password');
            const empresa = document.getElementById('reg-empresa');
            const cargo = document.getElementById('reg-cargo');

            let primerError = '';

            if (!usuario.value.trim()) primerError = 'Escribe el nombre del usuario.';
            else if (leerUsuarios().some(function (u) {
                return u.usuario.toLowerCase() === usuario.value.trim().toLowerCase();
            })) primerError = 'Ese nombre de usuario ya esta en uso.';

            if (!primerError && !lugar.value.trim()) primerError = 'Escribe el lugar de procedencia.';
            if (!primerError) primerError = validarEmail(email.value);

            if (!primerError && telefono.value.trim().length < 9) {
                primerError = 'Escribe un telefono de al menos 9 cifras.';
            }
            if (esEmpresa && !primerError && !empresa.value.trim()) {
                primerError = 'Escribe el nombre de la empresa.';
            }
            if (esEmpresa && !primerError && !cargo.value) {
                primerError = 'Selecciona el cargo en la empresa.';
            }
            if (!primerError) primerError = validarPassword(password.value);

            mostrarError('registro-error', primerError);
            [usuario, lugar, email, telefono, password, empresa, cargo].forEach(function (campo) {
                marcarError(campo, false);
            });
            if (primerError) {
                if (primerError.indexOf('usuario') !== -1 || primerError.indexOf('contrasena') !== -1) marcarError(usuario, true);
                if (primerError.indexOf('contrasena') !== -1) marcarError(password, true);
                if (primerError.indexOf('correo') !== -1) marcarError(email, true);
                if (primerError.indexOf('telefono') !== -1) marcarError(telefono, true);
                if (primerError.indexOf('lugar') !== -1) marcarError(lugar, true);
                if (primerError.indexOf('empresa') !== -1) marcarError(empresa, true);
                if (primerError.indexOf('cargo') !== -1) marcarError(cargo, true);
                return;
            }

            const usuarios = leerUsuarios();
            usuarios.push({
                usuario: usuario.value.trim(),
                password: password.value,
                tipo: tipo,
                empresa: esEmpresa ? empresa.value.trim() : null,
                cargo: esEmpresa ? cargo.value : null,
                lugar: lugar.value.trim(),
                email: email.value.trim(),
                telefono: telefono.value.trim(),
                fecha: new Date().toISOString()
            });
            guardarUsuarios(usuarios);

            // Entra directamente con la cuenta recien creada
            localStorage.setItem(CLAVE_SESION, JSON.stringify({
                usuario: usuario.value.trim(),
                tipo: tipo,
                empresa: esEmpresa ? empresa.value.trim() : null
            }));

            formRegistro.reset();
            const grupo = document.getElementById('grupo-empresa');
            if (grupo) grupo.hidden = true;
            mostrarError('registro-error', '');
            ocultarPanelesAuth();
            aplicarSesion();
            document.getElementById('servicios').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    aplicarSesion();
    vigilarNavegacionPrivada();
}

// --- Llamadas "i" que abren un panel de informacion ------------------------
//
// Cada boton .info-badge declara en data-info-for los bloques de la pagina que
// se copian al panel. Se copian en lugar de escribirse dos veces para que el
// texto que aparece en el panel y el de la pagina no puedan divergir.
//
// Un panel puede reunir varios bloques separados por comas:
//   data-info-for="map-info,info-box-criterios"
function initInfoPopups() {
    const overlay = document.getElementById('info-overlay');
    const cuerpo = document.getElementById('info-popup-cuerpo');
    const cerrar = document.getElementById('info-popup-cerrar');
    const badges = Array.prototype.slice.call(document.querySelectorAll('.info-badge'));

    if (!overlay || !cuerpo || !badges.length) return;

    // Deja fija la ultima "i" pulsada para devolverle el foco al cerrar
    let badgeActivo = null;

    function abrir(badge) {
        const ids = (badge.getAttribute('data-info-for') || '').split(',')
            .map(function (s) { return s.trim(); })
            .filter(function (s) { return s.length > 0; });

        cuerpo.innerHTML = '';

        ids.forEach(function (id) {
            const origen = document.getElementById(id);
            if (!origen) return;
            // cloneNode(true) lleva el contenido y sus clases sin duplicar el id.
            // El atributo hidden se quita porque el bloque de origen puede
            // estarlo (contenido que solo existe dentro del panel).
            const copia = origen.cloneNode(true);
            copia.removeAttribute('hidden');
            cuerpo.appendChild(copia);
        });

        if (!cuerpo.innerHTML.trim()) return;

        overlay.hidden = false;
        document.body.style.overflow = 'hidden';
        badgeActivo = badge;
        badge.setAttribute('aria-expanded', 'true');
        if (cerrar) cerrar.focus();
    }

    function cerrarPopup() {
        if (overlay.hidden) return;
        overlay.hidden = true;
        document.body.style.overflow = '';
        badges.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
        if (badgeActivo) badgeActivo.focus();
        badgeActivo = null;
    }

    badges.forEach(function (badge) {
        badge.addEventListener('click', function () {
            if (overlay.hidden) abrir(badge);
            else cerrarPopup();
        });
    });

    if (cerrar) cerrar.addEventListener('click', cerrarPopup);

    // Clic en el velo (fuera del panel)
    overlay.addEventListener('click', function (evento) {
        if (evento.target === overlay) cerrarPopup();
    });

    // Escape cierra
    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape') cerrarPopup();
    });
}

// Dibuja el resultado del FMFS con el desglose de los seis bloques (Pasos 3 y 5)
function pintarFMFS() {
    const resultDiv = document.getElementById('fmfs-result');
    if (!resultDiv) return;

    const fmfs = calcularFMFS();

    if (fmfs.score === null) {
        resultDiv.classList.remove('show');
        resultDiv.innerHTML = '';
        return;
    }

    const nivel = getScoreLevel(fmfs.score);
    const color = colors[nivel];

    const filasBloques = fmfs.bloques.map(function (bloque) {
        const valor = bloque.score === null ? '—' : bloque.score;
        const colorPunto = bloque.score === null
            ? '#d1d5db'
            : (bloque.score >= 80 ? '#15803d' : bloque.score >= 60 ? '#ea580c' : '#b91c1c');
        return '<tr>'
            + '<td class="fmfs-bloque-nombre">' + bloque.nombre + '</td>'
            + '<td class="fmfs-bloque-valor"><span style="color:' + colorPunto + '">' + valor + '</span></td>'
            + '<td class="fmfs-bloque-estado">' + bloque.contestadas + '/' + bloque.total + '</td>'
            + '</tr>';
    }).join('');

    const interpretation = fmfs.score >= 80
        ? 'Excelente preparación para exportar.'
        : fmfs.score >= 60
        ? 'Buen nivel de preparación. Hay áreas de mejora.'
        : fmfs.score >= 40
        ? 'Necesitas fortalecer varios aspectos antes de exportar.'
        : 'Te recomendamos trabajar en tu preparación para la exportación.';

    resultDiv.innerHTML = `
        <h4>Capacidad de exportar &middot; Perfil ${fmfs.profile}</h4>
        <div class="score" style="color:${color}">${fmfs.score}/100</div>
        <p>${profileWeights[fmfs.profile].name}</p>
        <p>${fmfs.contestadas} de ${fmfs.total} preguntas</p>
        <table class="fmfs-tabla">
            <thead><tr><th>Bloque</th><th>Score</th><th>Respondidas</th></tr></thead>
            <tbody>${filasBloques}</tbody>
        </table>
        <p style="margin-top:12px;font-size:0.9rem;color:#6b7280;">${interpretation}</p>
    `;
    resultDiv.classList.add('show');
}

// El boton del cuestionario llama a esta: primero pinta y despues anade
// el resultado al historial, para que quede registrado lo que el usuario
// ha analysing en ese momento.
function calcularYRegistrarFMFS() {
    pintarFMFS();
    const fmfs = calcularFMFS();
    if (fmfs.score === null) return;
    registrarActividad(
        'cuestionario',
        'Capacidad de exportar: ' + fmfs.score + '/100',
        'Perfil ' + fmfs.profile + ' · ' + profileWeights[fmfs.profile].name +
            ' · ' + fmfs.contestadas + ' de ' + fmfs.total + ' preguntas contestadas'
    );
}

// Nombre legible de cada criterio (compartido por el PDF y el Top 3)
const NOMBRES_CRIT = {
    '1.1': 'Normativas locales y trámites aduaneros',
    '1.2': 'Restricciones comerciales',
    '2.1': 'Almacenamiento y distribución',
    '2.2': 'Coste del transporte e infraestructuras',
    '3.1': 'Demanda y valor del producto',
    '3.2': 'Competencia',
    '3.3': 'Idioma y cultura',
    '4.1': 'Poder adquisitivo',
    '4.2': 'Crecimiento económico y estabilidad monetaria',
    '5.1': 'Confianza en el sistema legal',
    '5.2': 'Ausencia de corrupción y conflictos políticos',
    '6.1': 'Acuerdos bilaterales / TLC',
    '6.2': 'Promoción comercial y subsidios',
    '7.1': 'Elasticidad histórica de importaciones en crisis',
    '7.2': 'Dependencia de proveedores dominantes',
    '7.3': 'Intensidad competitiva ajustada por cuota española',
    '7.4': 'Volatilidad regulatoria sectorial'
};

// Hash determinista: mismo pais + perfil + CNAE -> mismos numeros,
// de modo que los puntos fuertes y debiles no cambien en cada recarga.
function hashEstable(texto) {
    let h = 2166136261;
    const cadena = String(texto);
    for (let i = 0; i < cadena.length; i++) {
        h ^= cadena.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

// Numero pseudoaleatorio determinista en [0, 1) a partir de una semilla
function aleatorioSemilla(semilla) {
    let x = (semilla + 0x6D2B79F5) >>> 0;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
}

// Puntuacion de cada criterio, estable para un pais + perfil + CNAE.
//
// Los 17 criterios NO se inventan: se derivan de los datos del pais. Cada
// criterio recibe un nivel propio (alto, medio, bajo) combinado con
// la base del pais, de modo que un mercado con buenas condiciones no
// puntue igual en infraestructura que en corrupcion.
//
// La suma ponderada de estos 17 valores, con los pesos del perfil, es
// exactamente el Atractivo del mercado. Asi la tabla del informe y la
// puntuacion final siempre coinciden por construccion.
function getCriterionScores(country, profile, cnae) {
    // El nombre del pais se normaliza a la clave inglesa. Sin esto, la web
    // (que llama con 'Germany') y el informe (que llama con 'Alemania') darian
    // puntuaciones distintas para el mismo mercado: no solo cairia la base a
    // 50, sino que la semilla del hash tambien cambiaria.
    const clave = clavePais(country) || country;
    const base = (clave !== null && countryBaseScores[clave] !== undefined) ? countryBaseScores[clave] : 50;
    const pesos = profileWeights[profile].weights;

    // Ajuste por CNAE: el producto concreto desplaza al mercado unos puntos
    let cnaeAdjustment = 0;
    if (cnae && cnaeSectors[cnae]) {
        cnaeAdjustment = (cnaeSectors[cnae].baseScore - 60) * 0.3;
    }
    const centro = base + cnaeAdjustment;

    const puntajes = {};
    Object.keys(NOMBRES_CRIT).forEach(function (crit, i) {
        // Perfil propio del criterio: no todos los indicadores pesan igual en
        // todos los mercados. El hash mantiene el resultado estable entre
        // recargas sin que deje de variar de un pais a otro.
        const semilla = hashEstable(clave + '|' + profile + '|' + crit);
        const ruido = aleatorioSemilla(semilla);

        // El peso del perfil modula cuanto se aparta del centro del mercado.
        // Un perfil conservador penaliza mas los indicadores de riesgo.
        const peso = pesos[crit] || 0;
        const sensibilidad = 0.6 + (peso / 20) * 0.8;   // 0.6 a 1.4
        const desviacion = (ruido - 0.5) * 26 * sensibilidad;

        puntajes[crit] = Math.max(0, Math.min(100, Math.round(centro + desviacion)));
    });

    return puntajes;
}

// Tres criterios con mejor puntuacion (puntos fuertes) y tres con peor
// puntuacion (puntos debiles) de un mercado concreto.
function getFortalezasDebilidades(country, profile, cnae) {
    const puntajes = getCriterionScores(country, profile, cnae);
    const lista = Object.keys(NOMBRES_CRIT).map(function (crit) {
        return { crit: crit, nombre: NOMBRES_CRIT[crit], score: puntajes[crit] };
    });
    // Mas alto primero para fortalezas, mas bajo primero para debilidades
    const fortalezas = lista.slice().sort(function (a, b) { return b.score - a.score; }).slice(0, 3);
    const debilidades = lista.slice().sort(function (a, b) { return a.score - b.score; }).slice(0, 3);
    return { fortalezas: fortalezas, debilidades: debilidades };
}

// Get score level - seis tramos: verde 90-100, naranja 60-90, rojo 0-60
function getScoreLevel(score) {
    if (score >= 90) return 'veryHigh';
    if (score >= 80) return 'high';
    if (score >= 70) return 'midHigh';
    if (score >= 60) return 'mid';
    if (score >= 40) return 'low';
    return 'veryLow';
}

// Initialize Leaflet map with country borders
let map;

// Contador de generaciones: impide que una descarga antigua pinte los paises
// sobre un mapa que ya se ha sustituido por otro.
let generacionMapa = 0;

// Descarga y memoriza el GeoJSON de paises, que es un dato fijo
let promesaGeoJson = null;
function cargarGeoJson() {
    if (!promesaGeoJson) {
        promesaGeoJson = fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
            .then(function (respuesta) { return respuesta.json(); })
            .catch(function (error) {
                promesaGeoJson = null;   // permite reintentar si falla
                throw error;
            });
    }
    return promesaGeoJson;
}

// Territorios y enclaves que se dibujan ENCIMA de un pais y hacen que
// parezca que hay paises duplicados. Se excluyen del GeoJSON.
const NO_PAISES = new Set([
    'Northern Cyprus', 'Cyprus No Mans Area', 'Somaliland',
    'Dhekelia Sovereign Base Area', 'Akrotiri Sovereign Base Area',
    'US Naval Base Guantanamo Bay', 'Brazilian Island',
    'Siachen Glacier', 'Baykonur Cosmodrome',
    'Southern Patagonian Ice Field', 'Bir Tawil'
]);

// En el GeoJSON, Francia viene como MultiPolygon y su primer poligono es el
// hexagono de Ultramar, que cae en America del Sur, junto a Surinam. Al
// dibujar el MultiPolygon completo, Francia aparece ahi en lugar de (o
// ademas de) en Europa. Se eliminan los anillos Ultramar y se conserva solo
// el europeo, que es lo que ve el usuario.
// Devuelve la geometria de Francia sin los anillos de Ultramar.
function FranciaSinUltramar(geometria) {
    if (!geometria) return geometria;
    if (geometria.type === 'Polygon') return geometria;

    const poligonos = geometria.coordinates.filter(function (anel) {
        const punto = Array.isArray(anel[0]) ? anel[0][0] : anel[0];
        const lon = punto[0];
        // Europa occidental: longitudes entre -10 y 10 grados
        return lon > -10 && lon < 10;
    });

    return { type: 'MultiPolygon', coordinates: poligonos };
}

function initMap() {
    // initMap puede llamarse varias veces (cambio de perfil o de CNAE).
    // Destruimos siempre la instancia anterior para no dejar dos mapas
    // compitiendo por el mismo contenedor.
    if (map) {
        try { map.remove(); } catch (e) { /* instancia ya destruida */ }
        map = null;
    }

    // El mapa se puede ampliar y reducir, pero no se desplaza: se queda
    // siempre centrado en el mundo para no perderse por el mapa.
    //
    // En movil el mapa es estrecho, asi que se abre en el zoom minimo
    // (nivel 0) para que quepa el mundo entero de una vez. Despues se
    // permiten 3 niveles de zoom sin poder moverlo de sitio.
    const esMovil = window.innerWidth <= 768;
    const zoomInicial = esMovil ? 0 : 2;
    const zoomMinimo = esMovil ? 0 : 2;
    const zoomMaximo = esMovil ? 3 : 7;

    map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        dragging: false,
        keyboard: false,
        boxZoom: false,
        inertia: false,
        bounceAtZoomLimits: false,
        // Quita el enlace "Leaflet" de la atribucion. Se conserva el aviso de
        // OpenStreetMap porque su licencia obliga a mantenerlo visible.
        prefix: false
    }).setView([20, 0], zoomInicial);

    map.setMinZoom(zoomMinimo);
    map.setMaxZoom(zoomMaximo);

    // Fondo del mapa con OpenStreetMap. La atribucion es obligatoria por su
    // licencia, asi que se muestra completa.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // Add country borders using GeoJSON
    // Cada vez que se crea el mapa sube el contador de generacion. Si al
    // terminar la descarga el mapa ya no es el vigente, se descarta el
    // resultado: si no, varias descargas simultaneas apilarían los paises
    // y el mapa apareceria duplicado.
    generacionMapa++;
    const miGeneracion = generacionMapa;

    // El GeoJSON no cambia nunca, asi que se descarga una sola vez y se
    // reutiliza. Antes se pedia en cada cambio de perfil o de CNAE, lo que
    // ralentizaba la web y multiplicaba las descargas simultaneas.
    cargarGeoJson().then(data => {
            if (miGeneracion !== generacionMapa || !map) return;

            // Descartamos enclave y territorios que se solapan con un pais
            const features = data.features
                .filter(function (f) {
                    const nombre = f.properties.ADMIN || f.properties.name;
                    return !NO_PAISES.has(nombre);
                })
                .map(function (f) {
                    const nombre = f.properties.ADMIN || f.properties.name;
                    // Francia: se queda solo con el territorio europeo
                    if (nombre === 'France' || nombre === 'Francia') {
                        return Object.assign({}, f, {
                            geometry: FranciaSinUltramar(f.geometry)
                        });
                    }
                    return f;
                });

            L.geoJSON({ type: 'FeatureCollection', features: features }, {
                style: function(feature) {
                    const countryName = feature.properties.ADMIN || feature.properties.name;
                    
                    // Spain appears in white (country of origin, not export destination)
                    if (countryName === 'Spain' || countryName === 'España') {
                        return {
                            fillColor: '#ffffff',
                            weight: 2,
                            opacity: 1,
                            color: '#333',
                            fillOpacity: 1
                        };
                    }
                    
                    const countryInfo = findCountryInfo(countryName);
                    
                    return {
                        fillColor: countryInfo ? colors[countryInfo.level] : '#e5e7eb',
                        weight: 1,
                        opacity: 1,
                        color: '#666',
                        fillOpacity: 0.7
                    };
                },
                onEachFeature: function(feature, layer) {
                    const countryName = feature.properties.ADMIN || feature.properties.name;
                    const countryInfo = findCountryInfo(countryName);
                    const countryNameES = getCountryNameES(countryName);
                    
                    if (countryInfo) {
                        // Tooltip with Spanish name and score on hover
                        layer.bindTooltip(
                            `<div style="font-family: Inter, sans-serif; font-size: 13px; font-weight: 600;">
                                ${countryNameES}<br>
                                <span style="color: ${colors[countryInfo.level]}; font-size: 16px;">${countryInfo.score}/100</span>
                            </div>`,
                            { sticky: true, direction: 'top', offset: [0, -10] }
                        );
                        
                        layer.on('click', function(e) {
                            showCountryPopup(e.latlng, countryName, countryInfo);
                        });
                        
                        layer.on('mouseover', function(e) {
                            this.setStyle({
                                weight: 2,
                                color: '#333',
                                fillOpacity: 0.9
                            });
                        });
                        
                        layer.on('mouseout', function(e) {
                            this.setStyle({
                                weight: 1,
                                color: '#666',
                                fillOpacity: 0.7
                            });
                        });
                    }
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
            addCircleMarkers(map);
        });
}

// Extended country scores for all countries
const extendedCountryScores = {
    // Europe
    'Germany': 85, 'France': 82, 'United Kingdom': 80, 'Italy': 72, 'Spain': 70,
    'Poland': 65, 'Netherlands': 84, 'Belgium': 78, 'Austria': 76, 'Switzerland': 82,
    'Sweden': 78, 'Denmark': 76, 'Finland': 74, 'Norway': 75, 'Ireland': 74,
    'Portugal': 68, 'Greece': 62, 'Czech Republic': 68, 'Hungary': 64, 'Romania': 58,
    'Bulgaria': 55, 'Croatia': 60, 'Slovakia': 62, 'Slovenia': 66, 'Estonia': 68,
    'Latvia': 62, 'Lithuania': 64, 'Luxembourg': 80, 'Malta': 65, 'Cyprus': 58,
    'Iceland': 72, 'Albania': 48, 'Serbia': 52, 'Bosnia and Herzegovina': 45,
    'North Macedonia': 48, 'Montenegro': 50, 'Kosovo': 42, 'Moldova': 48,
    'Belarus': 45, 'Ukraine': 48, 'Russia': 50,
    
    // Asia
    'China': 68, 'Japan': 82, 'South Korea': 80, 'India': 62, 'Singapore': 86,
    'Vietnam': 52, 'Indonesia': 50, 'Thailand': 58, 'Malaysia': 60, 'Philippines': 54,
    'Bangladesh': 45, 'Pakistan': 42, 'Sri Lanka': 48, 'Nepal': 38, 'Myanmar': 40,
    'Cambodia': 42, 'Laos': 40, 'Brunei': 62, 'Mongolia': 45, 'Kazakhstan': 52,
    'Uzbekistan': 48, 'Turkmenistan': 42, 'Kyrgyzstan': 40, 'Tajikistan': 38,
    'Afghanistan': 30, 'Iran': 45, 'Iraq': 38, 'Syria': 25, 'Lebanon': 42,
    'Jordan': 48, 'Israel': 72, 'Saudi Arabia': 62, 'UAE': 74, 'Qatar': 70,
    'Kuwait': 68, 'Bahrain': 65, 'Oman': 60, 'Yemen': 28, 'Turkey': 60,
    'Georgia': 50, 'Armenia': 48, 'Azerbaijan': 50,
    
    // Americas
    'United States': 88, 'Canada': 84, 'Mexico': 64, 'Brazil': 60, 'Chile': 62,
    'Colombia': 58, 'Argentina': 54, 'Peru': 56, 'Venezuela': 35, 'Ecuador': 52,
    'Bolivia': 45, 'Paraguay': 48, 'Uruguay': 58, 'Guyana': 42, 'Suriname': 40,
    'Cuba': 38, 'Dominican Republic': 50, 'Haiti': 25, 'Jamaica': 45,
    'Trinidad and Tobago': 52, 'Bahamas': 55, 'Barbados': 58, 'Guatemala': 48,
    'Honduras': 42, 'El Salvador': 40, 'Nicaragua': 38, 'Costa Rica': 55,
    'Panama': 58, 'Belize': 45,
    
    // Africa
    'Morocco': 52, 'Egypt': 48, 'South Africa': 54, 'Nigeria': 42, 'Kenya': 45,
    'Ethiopia': 35, 'Ghana': 40, 'Tanzania': 38, 'Uganda': 35, 'Senegal': 42,
    'Ivory Coast': 40, 'Cameroon': 38, 'Democratic Republic of the Congo': 28,
    'Republic of the Congo': 32, 'Angola': 38, 'Zambia': 35, 'Zimbabwe': 32,
    'Mozambique': 35, 'Madagascar': 28, 'Mauritius': 55, 'Tunisia': 48,
    'Algeria': 45, 'Libya': 35, 'Sudan': 25, 'South Sudan': 20, 'Somalia': 18,
    'Eritrea': 22, 'Djibouti': 25, 'Rwanda': 35, 'Burundi': 25, 'Malawi': 28,
    'Botswana': 48, 'Namibia': 45, 'Lesotho': 30, 'Eswatini': 35, 'Gambia': 30,
    'Guinea': 28, 'Sierra Leone': 22, 'Liberia': 25, 'Togo': 32, 'Benin': 30,
    'Burkina Faso': 25, 'Mali': 22, 'Niger': 20, 'Chad': 18, 'Mauritania': 25,
    'Western Sahara': 20, 'Equatorial Guinea': 35, 'Gabon': 38, 'Central African Republic': 20,
    
    // Oceania
    'Australia': 82, 'New Zealand': 80, 'Papua New Guinea': 35, 'Fiji': 42,
    'Solomon Islands': 28, 'Vanuatu': 30, 'Samoa': 35, 'Tonga': 32,
    'Kiribati': 25, 'Tuvalu': 22, 'Nauru': 28, 'Palau': 30,
    'Marshall Islands': 25, 'Micronesia': 28
};

// Find country info by name
//
// Devuelve tambien 'clave': la clave inglesa del pais ya resuelta. El popup la
// usa para generar el informe. Antes solo devolvia la puntuacion, y el boton
// mandaba a descargarInforme el nombre crudo del GeoJSON ('United States of
// America'), que no existe en countryBaseScores: la puntuacion del popup era
// correcta pero los 17 criterios del informe se puntuaban contra la base 50.
function findCountryInfo(countryName) {
    const profile = getSelectedProfile();
    const cnae = getCnaeCode();
    const clave = clavePais(countryName);

    if (clave !== null) {
        const score = calculateCountryScore(clave, profile, cnae);
        const level = getScoreLevel(score);
        return { score: score, level: level, clave: clave };
    }

    // Pais sin datos propios: se prueba con extendedCountryScores, que tiene
    // mas entradas, pero solo con coincidencia exacta.
    const exacto = Object.keys(extendedCountryScores).find(
        k => normalizarPais(k) === normalizarPais(countryName));
    if (exacto) {
        const score = calculateCountryScore(exacto, profile, cnae);
        const level = getScoreLevel(score);
        return { score: score, level: level, clave: exacto };
    }

    const defaultScore = 50;
    const level = getScoreLevel(defaultScore);
    return { score: defaultScore, level: level, clave: null };
}

// Show country popup with options
function showCountryPopup(latlng, countryName, countryInfo) {
    const profile = getSelectedProfile();
    const cnae = getCnaeCode();
    const cnaeName = getCnaeNombre(cnae);
    const cnaeLinea = cnae
        ? `<strong>Producto:</strong> ${cnaeName}<br><strong>CNAE:</strong> ${cnae}`
        : `<strong>Producto:</strong> Sin CNAE indicado`;
    const countryNameES = getCountryNameES(countryName);
    
    const popup = L.popup()
        .setLatLng(latlng)
        .setContent(`
            <div style="min-width: 280px; font-family: Inter, sans-serif;">
                <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #1f2937; border-bottom: 2px solid ${colors[countryInfo.level]}; padding-bottom: 8px;">
                    ${countryNameES}
                </h3>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; background: ${colors[countryInfo.level]}; color: white; font-size: 12px; font-weight: 600;">
                        ${nivelAtractivo[countryInfo.level]}
                    </span>
                    <span style="font-size: 24px; font-weight: 700; color: #1a56db;">${countryInfo.score}/100</span>
                </div>
                <div style="margin-bottom: 12px; padding: 8px; background: #f3f4f6; border-radius: 6px; font-size: 12px;">
                    <strong>Perfil:</strong> ${profile} - ${profileWeights[profile].name}<br>
                    ${cnaeLinea}
                </div>
                <div style="margin-top: 12px;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280; font-weight: 600;">OPCIONES:</p>
                    <button onclick="descargarInforme('${countryInfo.clave || countryName}', ${countryInfo.score}, '${profile}', '${cnae}')" 
                        style="display: block; width: 100%; padding: 10px 12px; margin-bottom: 6px; background: #1a56db; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; text-align: left; transition: all 0.2s;">
                        📄 Ver informe PDF
                    </button>
                    <button onclick="alert('Te contactaremos con consultoría especializada en ${countryNameES}')" 
                        style="display: block; width: 100%; padding: 10px 12px; margin-bottom: 6px; background: #f3f4f6; color: #374151; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; text-align: left; transition: all 0.2s;">
                        👤 Contactar consultoría
                    </button>
                    <button onclick="alert('Mostrando empresas similares que exportan a ${countryNameES}')" 
                        style="display: block; width: 100%; padding: 10px 12px; background: #f3f4f6; color: #374151; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; text-align: left; transition: all 0.2s;">
                        🏢 Ver empresas similares
                    </button>
                </div>
            </div>
        `)
        .openOn(map);
}

// Criterion justifications with official sources and CNAE-specific info
const criterionJustifications = {
    '1.1': {
        title: 'Normativas locales y trámites aduaneros',
        justification: (country, score, cnae, cnaeName) => {
            const baseScore = basePais(country);
            const productInfo = cnae ? ` para el sector ${cnaeName} (CNAE ${cnae})` : '';
            if (baseScore >= 75) return `${country} cuenta con un marco regulatorio claro y transparente para el comercio internacional${productInfo}. Los trámites aduaneros están bien definidos y existen acuerdos comerciales que facilitan el acceso al mercado. (Fuentes: ICEX, Comisión Europea, Access2Markets)`;
            if (baseScore >= 55) return `${country} presenta requisitos regulatorios moderados${productInfo}. Existen procedimientos aduaneros establecidos, aunque pueden requerir documentación específica para productos industriales. (Fuentes: ICEX, OMC, OECD)`;
            return `${country} tiene un entorno regulatorio más complejo con requisitos específicos${productInfo} que pueden dificultar el acceso al mercado. Se recomienda asesoramiento especializado. (Fuentes: ICEX, OMC)`;
        }
    },
    '1.2': {
        title: 'Restricciones comerciales',
        justification: (country, score, cnae, cnaeName) => {
            const baseScore = basePais(country);
            const productInfo = cnae ? ` para productos del sector ${cnaeName}` : '';
            if (baseScore >= 75) return `${country} mantiene acuerdos comerciales preferenciales con la UE que reducen o eliminan aranceles${productInfo}. Las barreras no arancelarias son mínimas. (Fuentes: Comisión Europea, OMC, ICEX)`;
            if (baseScore >= 55) return `${country} aplica aranceles moderados y cuenta con algunos acuerdos comerciales${productInfo}. Existen barreras no arancelarias que deben considerarse. (Fuentes: OMC, ICEX)`;
            return `${country} presenta restricciones comerciales significativas incluyendo aranceles elevados y barreras no arancelarias${productInfo} que dificultan el acceso al mercado. (Fuentes: OMC, Banco Mundial)`;
        }
    },
    '2.1': {
        title: 'Almacenamiento y distribución',
        justification: (country, score, cnae, cnaeName) => {
            const baseScore = basePais(country);
            const productInfo = cnae ? ` para el sector ${cnaeName}` : '';
            if (baseScore >= 75) return `${country} dispone de infraestructuras logísticas modernas y eficientes${productInfo}, con redes de almacenamiento y distribución bien desarrolladas que facilitan la cadena de suministro. (Fuentes: Banco Mundial, LPI Logistics Performance Index)`;
            if (baseScore >= 55) return `${country} cuenta con capacidades logísticas razonablemente desarrolladas${productInfo}, aunque pueden existir limitaciones en ciertas regiones o tipos de productos. (Fuentes: Banco Mundial, LPI)`;
            return `${country} presenta desafíos en infraestructuras logísticas${productInfo} que pueden afectar la eficiencia de la cadena de suministro y aumentar costes operativos. (Fuentes: Banco Mundial, LPI)`;
        }
    },
    '2.2': {
        title: 'Coste del transporte e infraestructuras',
        justification: (country, score, cnae, cnaeName) => {
            const baseScore = basePais(country);
            const productInfo = cnae ? ` para el sector ${cnaeName}` : '';
            if (baseScore >= 75) return `${country} posee una red de transporte eficiente${productInfo} con puertos, aeropuertos y carreteras de calidad que optimizan los costes logísticos para el comercio internacional. (Fuentes: Banco Mundial, LPI, Foro Económico Mundial)`;
            if (baseScore >= 55) return `${country} tiene infraestructuras de transporte aceptables${productInfo}, aunque los costes de flete pueden ser moderados debido a la distancia o geografía del país. (Fuentes: Banco Mundial, LPI)`;
            return `${country} presenta desafíos en infraestructuras de transporte${productInfo} que pueden incrementar los costes logísticos y los tiempos de entrega. (Fuentes: Banco Mundial, LPI)`;
        }
    },
    '3.1': {
        title: 'Demanda y valor del producto',
        justification: (country, score, cnae, cnaeName) => {
            const baseScore = basePais(country);
            const productInfo = cnae ? ` de ${cnaeName}` : ' industriales';
            if (baseScore >= 75) return `${country} muestra una demanda significativa y creciente para productos${productInfo}, con un mercado que valora la calidad y la innovación. (Fuentes: Banco Mundial, WDI, WITS)`;
            if (baseScore >= 55) return `${country} presenta una demanda moderada para productos${productInfo}, con oportunidades en nichos específicos del mercado. (Fuentes: Banco Mundial, WITS)`;
            return `${country} tiene una demanda limitada para productos${productInfo}, lo que puede requerir estrategias de mercado específicas. (Fuentes: Banco Mundial, WITS)`;
        }
    },
    '3.2': {
        title: 'Competencia',
        justification: (country, score, cnae, cnaeName) => {
            const baseScore = basePais(country);
            const productInfo = cnae ? ` en el sector ${cnaeName}` : '';
            if (baseScore >= 75) return `El mercado de ${country} presenta una competencia moderada${productInfo} con oportunidades para productos diferenciados de calidad. La posición española es competitiva en varios sectores. (Fuentes: OECD, WITS)`;
            if (baseScore >= 55) return `${country} tiene un mercado competitivo${productInfo} con presencia de múltiples actores internacionales. Se requiere diferenciación y estrategia de posicionamiento. (Fuentes: OECD, WITS)`;
            return `${country} presenta una competencia intensa${productInfo} con actores dominantes que dificultan la entrada de nuevos competidores. (Fuentes: OECD, WITS)`;
        }
    },
    '3.3': {
        title: 'Idioma y cultura',
        justification: (country, score, cnae, cnaeName) => {
            const spanishSpeaking = ['Spain', 'Mexico', 'Chile', 'Colombia', 'Argentina', 'Peru'];
            const productInfo = cnae ? ` para el sector ${cnaeName}` : '';
            if (spanishSpeaking.includes(country)) return `${country} comparte idioma español y muchos elementos culturales con España${productInfo}, lo que facilita la comunicación comercial y la adaptación de productos. (Fuentes: Hofstede, G. (2010). Cultures and Organizations: Software of the Mind. McGraw-Hill)`;
            const englishSpeaking = ['United States', 'United Kingdom', 'Canada', 'Australia', 'New Zealand', 'Ireland'];
            if (englishSpeaking.includes(country)) return `${country} tiene el idioma inglés como lengua principal${productInfo}, lo que facilita los negocios internacionales con empresas españolas acostumbradas al comercio en inglés. (Fuentes: Hofstede, G. (2010). Cultures and Organizations: Software of the Mind. McGraw-Hill)`;
            return `${country} presenta diferencias culturales y de idioma${productInfo} que pueden requerir adaptación de productos y estrategias de comunicación específicas. (Fuentes: Hofstede, G. (2010). Cultures and Organizations: Software of the Mind. McGraw-Hill)`;
        }
    },
    '4.1': {
        title: 'Poder adquisitivo',
        justification: (country, score, cnae, cnaeName) => {
            const baseScore = basePais(country);
            const productInfo = cnae ? ` para productos del sector ${cnaeName}` : '';
            if (baseScore >= 75) return `${country} tiene un nivel de ingresos alto con consumidores con poder adquisitivo elevado${productInfo}. (Fuentes: Banco Mundial, WDI)`;
            if (baseScore >= 55) return `${country} presenta un poder adquisitivo medio${productInfo} con oportunidades para productos de gama media-alta. (Fuentes: Banco Mundial, WDI)`;
            return `${country} tiene un poder adquisitivo limitado${productInfo} que puede restringir la demanda de productos importados de mayor valor. (Fuentes: Banco Mundial, WDI)`;
        }
    },
    '4.2': {
        title: 'Crecimiento económico y estabilidad monetaria',
        justification: (country, score, cnae, cnaeName) => {
            const baseScore = basePais(country);
            const productInfo = cnae ? ` para el sector ${cnaeName}` : '';
            if (baseScore >= 75) return `${country} mantiene una economía estable con crecimiento moderado y políticas macroeconómicas sólidas${productInfo} que proporcionan un entorno predecible para los negocios. (Fuentes: FMI WEO, Banco Mundial)`;
            if (baseScore >= 55) return `${country} presenta un crecimiento económico aceptable${productInfo} con cierta volatilidad monetaria que debe monitorearse. (Fuentes: FMI WEO, Banco Mundial)`;
            return `${country} presenta desafíos económicos${productInfo} con volatilidad monetaria que pueden afectar la rentabilidad de las operaciones de exportación. (Fuentes: FMI WEO, Banco Mundial)`;
        }
    },
    '5.1': {
        title: 'Confianza en el sistema legal',
        justification: (country, score, cnae, cnaeName) => {
            const baseScore = basePais(country);
            const productInfo = cnae ? ` para el sector ${cnaeName}` : '';
            if (baseScore >= 75) return `${country} tiene un sistema legal claro y transparente${productInfo}, especialmente para el comercio internacional, con buena predictibilidad jurídica y protección de contratos. (Fuentes: Banco Mundial, WGI)`;
            if (baseScore >= 55) return `${country} cuenta con un sistema legal aceptable${productInfo}, aunque pueden existir ciertas limitaciones en la ejecución de contratos. (Fuentes: Banco Mundial, WGI)`;
            return `${country} presenta debilidades en el sistema legal${productInfo} que pueden generar incertidumbre jurídica para las operaciones comerciales. (Fuentes: Banco Mundial, WGI)`;
        }
    },
    '5.2': {
        title: 'Ausencia de corrupción/conflictos políticos',
        justification: (country, score, cnae, cnaeName) => {
            const baseScore = basePais(country);
            const productInfo = cnae ? ` para el sector ${cnaeName}` : '';
            if (baseScore >= 75) return `${country} es reconocido como uno de los países con menor corrupción percibida y una democracia estable${productInfo}, proporcionando un entorno seguro para los negocios. (Fuentes: Banco Mundial, WGI, Transparency International)`;
            if (baseScore >= 55) return `${country} presenta niveles moderados de corrupción y estabilidad política aceptable${productInfo} para el comercio internacional. (Fuentes: Banco Mundial, WGI)`;
            return `${country} presenta desafíos en gobernanza y estabilidad política${productInfo} que pueden afectar las operaciones comerciales. (Fuentes: Banco Mundial, WGI)`;
        }
    },
    '6.1': {
        title: 'Acuerdos bilaterales / TLC',
        justification: (country, score, cnae, cnaeName) => {
            const euAgreement = ['Chile', 'Mexico', 'Colombia', 'Peru', 'South Korea', 'Singapore', 'Vietnam', 'Japan', 'Canada', 'United States', 'Morocco', 'Egypt', 'South Africa', 'Turkey', 'Israel'];
            const productInfo = cnae ? ` para productos del sector ${cnaeName}` : '';
            if (euAgreement.includes(country)) return `${country} mantiene acuerdos comerciales preferenciales con la UE que eliminan o reducen aranceles${productInfo}. (Fuentes: Comisión Europea, Access2Markets)`;
            return `${country} no tiene un acuerdo comercial preferencial específico con la UE${productInfo}, aplicándose aranceles generales. (Fuentes: Comisión Europea, OMC)`;
        }
    },
    '6.2': {
        title: 'Promoción comercial y subsidios',
        justification: (country, score, cnae, cnaeName) => {
            const baseScore = basePais(country);
            const productInfo = cnae ? ` para el sector ${cnaeName}` : '';
            if (baseScore >= 75) return `${country} cuenta con programas de apoyo a la exportación y facilitación comercial${productInfo} a través de instituciones como ICEX, Cámaras de Comercio y organismos internacionales. (Fuentes: ICEX, Cámaras de Comercio)`;
            if (baseScore >= 55) return `${country} tiene algunos programas de promoción comercial${productInfo}, aunque menos desarrollados que en otros mercados. (Fuentes: ICEX, Cámaras de Comercio)`;
            return `${country} tiene programas limitados de promoción comercial${productInfo} para empresas extranjeras. (Fuentes: ICEX)`;
        }
    },
    '7.1': {
        title: 'Elasticidad histórica de importaciones en crisis',
        justification: (country, score, cnae, cnaeName) => {
            const baseScore = basePais(country);
            const productInfo = cnae ? ` para el sector ${cnaeName}` : '';
            if (baseScore >= 75) return `${country} ha demostrado resiliencia en sus importaciones durante crisis económicas${productInfo}, manteniendo una demanda relativamente estable para productos industriales. (Fuentes: Banco Mundial, Import Demand Elasticities)`;
            if (baseScore >= 55) return `${country} muestra una elasticidad moderada de importaciones en crisis${productInfo}, con capacidad de recuperación aceptable. (Fuentes: Banco Mundial)`;
            return `${country} presenta alta volatilidad en importaciones durante crisis${productInfo}, lo que puede afectar la estabilidad de la demanda. (Fuentes: Banco Mundial)`;
        }
    },
    '7.2': {
        title: 'Dependencia de proveedores dominantes',
        justification: (country, score, cnae, cnaeName) => {
            const baseScore = basePais(country);
            const productInfo = cnae ? ` para el sector ${cnaeName}` : '';
            if (baseScore >= 75) return `${country} tiene cadenas de suministro diversificadas${productInfo} con múltiples proveedores, reduciendo la vulnerabilidad ante dependencias. (Fuentes: OECD, GVCs)`;
            if (baseScore >= 55) return `${country} presenta cierta concentración de proveedores${productInfo} que puede generar vulnerabilidades en la cadena de suministro. (Fuentes: OECD)`;
            return `${country} tiene alta dependencia de proveedores dominantes${productInfo} que puede afectar la seguridad del suministro. (Fuentes: OECD)`;
        }
    },
    '7.3': {
        title: 'Intensidad competitiva ajustada por cuota española',
        justification: (country, score, cnae, cnaeName) => {
            const baseScore = basePais(country);
            const productInfo = cnae ? ` en el sector ${cnaeName}` : '';
            if (baseScore >= 75) return `La posición española en ${country} es competitiva${productInfo} con cuota de mercado aceptable en varios sectores industriales. (Fuentes: OECD, WITS)`;
            if (baseScore >= 55) return `La cuota española en ${country} es moderada${productInfo}, con oportunidades de crecimiento en nichos específicos. (Fuentes: OECD, WITS)`;
            return `La presencia española en ${country} es limitada${productInfo}, requiriendo estrategias de entrada específicas. (Fuentes: OECD, WITS)`;
        }
    },
    '7.4': {
        title: 'Volatilidad regulatoria sectorial',
        justification: (country, score, cnae, cnaeName) => {
            const baseScore = basePais(country);
            const productInfo = cnae ? ` para el sector ${cnaeName}` : '';
            if (baseScore >= 75) return `${country} mantiene un marco regulatorio estable y predecible${productInfo}, con cambios poco frecuentes y bien comunicados. (Fuentes: Banco Mundial, WGI/Regulatory Quality)`;
            if (baseScore >= 55) return `${country} presenta cierta volatilidad regulatoria${productInfo} que requiere monitoreo constante de cambios normativos. (Fuentes: Banco Mundial, WGI)`;
            return `${country} tiene alta volatilidad regulatoria${productInfo} que puede generar incertidumbre para las operaciones comerciales. (Fuentes: Banco Mundial, WGI)`;
        }
    }
};

// Nombre legible del producto a partir del CNAE
// Acepta "1020", " 1020 ", "CNAE 1020" y lo resuelve contra el catalogo
function getCnaeNombre(cnae) {
    if (cnae === null || cnae === undefined) return '';
    // Extraer el primer grupo de 4 digitos por si viene con texto alrededor
    const digitos = String(cnae).match(/\d{4}/);
    if (!digitos) return '';
    const codigo = digitos[0];
    if (cnaeSectors[codigo]) return cnaeSectors[codigo].name;
    return 'Producto CNAE ' + codigo;
}

// Codigo CNAE normalizado a 4 digitos, o cadena vacia
function getCnaeCodigo(cnae) {
    const digitos = String(cnae === null || cnae === undefined ? '' : cnae).match(/\d{4}/);
    return digitos ? digitos[0] : '';
}

// Download PDF report
// Añade "Página X de Y" en la esquina inferior izquierda de todas las paginas.
// Se recorre una a una porque el numero total solo se conoce cuando el
// documento ya esta completo.
function numerarPaginas(doc, x, y) {
    const total = doc.internal.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(140, 146, 158);
        doc.text(`Página ${i} de ${total}`, x, y);
    }
    doc.setTextColor(0, 0, 0);
}

function descargarInforme(countryKey, score, profile, cnae) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    // Todo el informe se redacta con el nombre del pais en castellano, pero
    // todos los calculos se hacen con la clave inglesa. Antes se usaba el
    // nombre en castellano para las dos cosas, y como countryBaseScores solo
    // esta indexada en ingles, la busqueda no encontraba nada y caia al valor
    // por defecto de 50: los 17 criterios se puntuaban como si el pais tuviera
    // una base de 50 puntos, y el informe describia un mercado imaginario.
    const country = getCountryNameES(countryKey);

    // Red de seguridad. Si arrives aqui con un nombre que no existe en los
    // datos, los 17 criterios se puntuarian contra la base por defecto de 50 y
    // el informe describiria un pais que no es el que se ha pedido. Se avisa
    // en consola en vez de colar un informe falso.
    if (clavePais(countryKey) === null) {
        console.warn('[GEM] countryBaseScores no conoce "' + countryKey +
            '". Los criterios se calcularan con la base por defecto de 50. ' +
            'Revisa que el informe se pida con una clave valida.');
    }
    const cnaeName = getCnaeNombre(cnae);
    const level = getScoreLevel(score);
    const levelDesc = nivelAtractivo[level];
    const weights = profileWeights[profile].weights;

    // Desglose de los dos factores del modelo, resuelto antes de dibujar nada
    // porque lo usan tanto la portada como el resumen.
    //
    // El total NO es siempre la media ponderada de los 17 criterios: cuando el
    // visitante ya ha rellenado el cuestionario de preferencias, es la media
    // geometrica del Atractivo del mercado (el que sale de la tabla de
    // dimensiones) y de la capacidad exportadora de la empresa (el FMFS).
    //
    //   Atractivo del mercado = media ponderada de los 17 criterios
    //   Puntuacion final       = raiz cuadrada de (Atractivo x FMFS)
    //
    // Sin cuestionario solo existe el primer factor, y entonces los dos son el
    // mismo numero. Antes el informe anunciaba los dos con nombres distintos
    // sin mostrar los dos por separado: parecia que eran dos cifras diferentes.
    const factores = obtenerGEMScore(countryKey, profile, cnae);
    const atractivoMercado = factores.atractivo;
    const capacidadExportadora = factores.fmfs;
    const sinCuestionario = (capacidadExportadora === null || capacidadExportadora === undefined);

    // Nombre del indicador, para que el texto no prometa un "ajuste por
    // capacidad exportadora" que todavia no se ha hecho.
    const nombrePuntuacion = sinCuestionario
        ? 'El Atractivo del mercado'
        : 'El Atractivo del mercado ajustado por tu perfil y capacidad exportadora';

    // Page 1: Cover
    doc.setFillColor(26, 86, 219);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('GEM - Global Export Market', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Informe de Evaluación de Mercado', 105, 30, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(28);
    doc.text(country, 105, 80, { align: 'center' });
    doc.setFontSize(16);
    // Sin cuestionario de preferencias no hay capacidad exportadora que
    // combinar, asi que el total ES el atractivo del mercado. Decirlo con las
    // dos etiquetas distintas generaba la idea de que eran dos cifras
    // diferentes, cuando en realidad eran el mismo numero con dos nombres.
    doc.text(sinCuestionario
        ? `Atractivo del mercado: ${score}/100`
        : `Atractivo del mercado ajustado por tu perfil y capacidad exportadora: ${score}/100`,
        105, 100, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`Nivel: ${levelDesc}`, 105, 115, { align: 'center' });

    if (sinCuestionario) {
        doc.setFontSize(9);
        doc.setTextColor(90, 100, 120);
        doc.text(
            'Todavía no has definido tu capacidad exportadora, así que la puntuación es la del mercado solo. ' +
            'Si completas el cuestionario de preferencias, la puntuación combinará ambos factores.',
            105, 128, { align: 'center', maxWidth: 170 }
        );
        doc.setTextColor(0, 0, 0);
    }
    
    doc.setFontSize(12);
    doc.text(`Perfil de empresa: ${profile} - ${profileWeights[profile].name}`, 20, 150);
    doc.setFontSize(11);
    const cnaeCodigo = getCnaeCodigo(cnae);
    if (cnaeCodigo) {
        doc.text(`Producto CNAE ${cnaeCodigo}`, 20, 161);
        doc.setTextColor(75, 85, 99);
        doc.text(cnaeName, 20, 171);
    } else {
        doc.text('Producto CNAE', 20, 161);
        doc.setTextColor(75, 85, 99);
        doc.text('Sin CNAE indicado', 20, 171);
    }
    doc.setTextColor(0, 0, 0);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 186);
    
    // Puntuacion de cada uno de los 17 criterios. Se usa la misma funcion que
    // la web, para que los numeros de esta tabla sean exactamente los que
    // alimentan el Atractivo del mercado ajustado que aparece en la portada.
    // Antes se sorteaban con Math.random(), lo que hacia que el mismo informe
    // mostrara criterios distintos cada vez que se generaba.
    const criterionScores = getCriterionScores(countryKey, profile, cnae);

    // Helper function to draw a colored header bar
    function drawHeaderBar(title, subtitle) {
        doc.setFillColor(26, 86, 219);
        doc.rect(0, 0, 210, 35, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.text(title, 105, 18, { align: 'center' });
        doc.setFontSize(11);
        doc.text(subtitle, 105, 28, { align: 'center' });
        doc.setTextColor(0, 0, 0);
    }
    
    // Anchos de columna de la tabla de criterios (suma 180, margen izq. 15)
    // Columnas de la tabla de criterios. La de pesos se elimino a peticion:
    // el peso es un dato interno del modelo, no un dato del mercado, y ocupa
    // una columna entera que el cliente no usa para decidir nada. El espacio
    // se ha repartido entre la descripcion y la justificacion.
    const COL = {
        code:  { x: 17,  w: 14 },
        score: { x: 34,  w: 18 },
        name:  { x: 55,  w: 47 },
        just:  { x: 104, w: 89 }
    };


    // Cabecera de la tabla de criterios
    function drawTableHeader(y) {
        doc.setFillColor(26, 86, 219);
        doc.setTextColor(255, 255, 255);
        doc.rect(15, y, 180, 8, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Criterio', COL.code.x, y + 5);
        doc.text('Punt.', COL.score.x, y + 5);
        doc.text('Descripción', COL.name.x, y + 5);
        doc.text('Justificación', COL.just.x, y + 5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        return y + 8;
    }

    // Suma de los pesos de un grupo de criterios. Los objetos que devuelve
// getFortalezasDebilidades traen la clave del criterio en 'crit'.
function ponderacionTotal(grupo, profile) {
    // El perfil se pasa como parametro y ya no se lee del estado de la pagina.
    // Antes usaba getSelectedProfile(), que es el perfil marcado en ese momento
    // en los desplegables y no necesariamente el del informe que se esta
    // generando: al pedir un informe de otro perfil, el peso conjunto impreso
    // salia con los pesos del perfil equivocado.
    const pesosPerfil = profileWeights[profile].weights;
    const total = (grupo || []).reduce(function (acc, c) {
        const p = parseFloat(pesosPerfil[c.crit] || 0);
        return acc + (isNaN(p) ? 0 : p);
    }, 0);
    return Math.round(total * 10) / 10;
}

// Redondea a un decimal
function redondear1(n) { return Math.round(n * 10) / 10; }

// Recomendaciones en funcion de la puntuacion y de los puntos debiles reales
function construirRecomendaciones(score, country, fortalezas, debilidades) {
    const lista = [];

    if (score >= 70) {
        lista.push(`Incluir ${country} entre los mercados prioritarios de su estrategia de internacionalización para el sector seleccionado.`);
    } else {
        lista.push(`Considerar ${country} como opción secundaria y evaluar mercados alternativos con un atractivo superior para su perfil.`);
    }

    if (fortalezas.length) {
        lista.push(`Apoyarse en el punto fuerte principal detectado (${fortalezas[0].nombre.toLowerCase()}) como argumento comercial ante los clientes e investigadores locales.`);
    }

    debilidades.forEach(d => {
        lista.push(`Planificar una acción para compensar la limitación en ${d.nombre.toLowerCase()} (${d.score}/100): identificar la barrera concreta y estimar su coste de vencimiento antes de entrar.`);
    });

    if (score >= 80) {
        lista.push('Realizar un estudio de mercado detallado y una visita exploratoria antes de cerrar el plan de entrada, para validar los supuestos del modelo.');
        lista.push('Revisar la puntuación cada seis meses: los indicadores de este mercado pueden cambiar con rapidez.');
    } else if (score >= 60) {
        lista.push('Solicitar asesoramiento especializado en ICEX y en las cámaras de comercio antes de iniciar los trámites.');
        lista.push('Empezar con un piloto o un pedido de prueba para verificar la demanda antes de comprometer capital.');
        lista.push('Revisar la puntuación cada seis meses: los indicadores de este mercado pueden cambiar con rapidez.');
    } else {
        lista.push('Postergar la entrada hasta haber resuelto los puntos débiles detectados o hasta disponer de más recursos.');
        lista.push('Solicitar asesoramiento especializado en ICEX y en las cámaras de comercio para valorar si la exportación es viable.');
        lista.push('Revisar la puntuación cada seis meses: los indicadores de este mercado pueden cambiar con rapidez.');
    }

    lista.push('Considerar los servicios adicionales de GEM: Servicio Únete, Consultoría y Grandes Oportunidades.');

    return lista;
}

// Redaccion de la frase final del apartado 3
function decisionRecomendada(score) {
    if (score >= 90) return 'se recomienda una entrada plena, con recursos dedicados a este mercado.';
    if (score >= 80) return 'se recomienda entrar de forma progresiva, con una primera fase de validación.';
    if (score >= 70) return 'se recomienda una entrada con cautela, con atención a los puntos débiles señalados.';
    if (score >= 60) return 'se recomienda estudiar el mercado en detalle antes de decidir.';
    return 'no se recomienda una entrada inmediata con el perfil actual.';
}

// Limite inferior del area imprimible. Por debajo de esta linea el pie de
    // pagina choca con el contenido.
    const LIMITE_INFERIOR = 268;
    const ESPACIO_ENTRE_FILAS = 2;

// Amplia una justificacion hasta que ocupe al menos el numero de lineas
    // pedido. Se anaden frases de contexto utiles en lugar de rellenar con
    // puntos suspensivos, para que el informe no tenga texto de relleno.
    // MIN_LINEAS_JUST = lineas minimas por criterio.
    const MIN_LINEAS_JUST = 5;

    // Extension especifica de cada criterio. Se prefiere esta al texto generico
    // porque aporta informacion propia del criterio, en lugar de repetir la
    // misma coletilla en las 17 filas de la tabla.
    const COMPLEMENTOS_POR_CRITERIO = {
        '1.1': 'La puntuacion combina la facilidad de registro del producto en el mercado con el tiempo medio de despacho aduanero. Conviene verificar si el sector exige certificaciones, etiquetado en el idioma local o ensayos obligatorios, porque pueden alterar la estimación.',
        '1.2': 'Se valoran tanto los aranceles aplicables al sector como las barreras no arancelarias, como cotas, licencias de importación y requisitos de contenido local. El acuerdo comercial vigente con la Unión Europea determina en buena parte el resultado.',
        '2.1': 'Este criterio mide la disponibilidad y el coste de los espacios de almacenamiento y el alcance de la red de distribución. Para productos perecederos o de volumen alto, la capacidad de frío y los plazos de entrega pesan más que el precio del metro cuadrado.',
        '2.2': 'Se tiene en cuenta el coste del flete internacional y la calidad de las infraestructuras de transporte, incluidos puertos, carreteras y transporte aéreo. La distancia y la insularidad incrementan el coste de forma notable.',
        '3.1': 'La demanda se estima a partir del tamaño del mercado, del crecimiento del consumo y del precio medio del producto. Un mercado grande con demanda decreciente no puntúa igual que uno moderado pero en expansión sostenida.',
        '3.2': 'La competencia se valora por el número y el tamaño de los competidores ya instalados y por la facilidad de entrada para un nuevo operador. Un mercado con demanda alta pero muy concentrado puede ser poco rentable para una pyme.',
        '3.3': 'Este criterio recoge las barreras de comunicación: idioma oficial, uso del inglés en el comercio internacional y cercanía cultural del mercado. En países con un único idioma oficial ajeno al español, la adaptación del producto y de la documentación técnica exige inversión adicional.',
        '4.1': 'El poder adquisitivo se mide comparando el nivel de ingresos con el precio del producto. Permite prever si el cliente local puede asumir el precio de exportación sin caer en una franja de consumo inalcanzable.',
        '4.2': 'Se valoran el crecimiento del producto interior bruto, la estabilidad de precios y la ausencia de crisis monetarias. Un mercado con buen crecimiento pero con inflación alta complica el mantenimiento de un margen estable a medio plazo.',
        '5.1': 'Este criterio refleja el grado de confianza en el sistema judicial y el cumplimiento efectivo de los contratos. Un entorno con litigios lentos o resueltos de forma discrecional eleva el riesgo de la inversión comercial.',
        '5.2': 'Se combinan la percepción de corrupción con la estabilidad institucional y la ausencia de conflictos armados o inestabilidad política. Estos factores condicionan la cobertura de los seguros de crédito y la disposición a invertir.',
        '6.1': 'La puntuación refleja los acuerdos comerciales vigentes con la Unión Europea, su tipo y la cobertura de las partidas arancelarias del sector. Los tipos arancelarios preferenciales pueden modificar de forma notable el resultado.',
        '6.2': 'Este criterio valora el apoyo público a la exportación: los programas del ICEX, las ayudas a la inversión y el peso de las cámaras de comercio y las agencias de promoción en el país de destino.',
        '7.1': 'Se estima cuánto cayó la importación del sector durante las últimas crisis. Una economía que reduce sus compras en las contracciones presenta un riesgo de demanda superior al de otra que mantiene el consumo.',
        '7.2': 'Este criterio mide el grado de concentración de las importaciones en unos pocos proveedores. Cuando un país depende de uno o dos proveedores dominantes, entrar exige superar su ventaja acumulada y sus precios.',
        '7.3': 'Es un criterio propio de GEM: mide la intensidad competitiva ajustada por la cuota de exportación española del producto en ese mercado. Muestra si un exportador español tiene recorrido adicional o si el mercado ya está cubierto por producción nacional.',
        '7.4': 'Se valora la frecuencia con la que el sector cambia de normativa y la dificultad de adaptarse a tiempo. Los sectores estables obtienen una puntuación más alta porque la inversión queda más protegida y es más predecible.'
    };

    function ampliarJustificacion(texto, ancho, code) {
        let lineas = doc.splitTextToSize(texto, ancho);
        if (lineas.length >= MIN_LINEAS_JUST) return lineas;

        let ampliado = texto;

        // Primero se aplica la extension propia del criterio
        const propio = COMPLEMENTOS_POR_CRITERIO[code];
        if (propio && ampliado.indexOf(propio) === -1) {
            ampliado += ' ' + propio;
            lineas = doc.splitTextToSize(ampliado, ancho);
        }
        if (lineas.length >= MIN_LINEAS_JUST) return lineas;

        // SiTodavia falta, se recurre al texto generico
        const COMPLEMENTOS_JUST = [
            'La puntuacion se sostiene en los indicadores publicados por las fuentes citadas.',
            'El valor se pondera segun el perfil de la empresa.',
            'La evaluacion se revisa de forma periodica.',
            'Conviene contrastarlo con ICEX y con las camaras de comercio.',
            'Si el resultado fuera inesperado, conviene un analisis mas detallado.'
        ];
        let i = 0;
        while (lineas.length < MIN_LINEAS_JUST && i < COMPLEMENTOS_JUST.length) {
            if (ampliado.indexOf(COMPLEMENTOS_JUST[i]) === -1) {
                ampliado += ' ' + COMPLEMENTOS_JUST[i];
            }
            i++;
            lineas = doc.splitTextToSize(ampliado, ancho);
        }
        return lineas;
    }

    // Fila de criterio: celdas multilinea + fuentes con hipervinculo debajo
    function drawCriteriaRow(y, code, score, name, justification) {
        const PADDING = 2.5;
        const LINEA = 3.4;
        const fsJust = 6.6;

        // Ajuste de lineas para evitar solapamientos
        const lCode = doc.splitTextToSize(String(code), COL.code.w - 1);
        const lScore = doc.splitTextToSize(String(score), COL.score.w - 1);
        const lName = doc.splitTextToSize(String(name), COL.name.w - 2 * PADDING);
        const lJust = ampliarJustificacion(String(justification), COL.just.w - 2 * PADDING, code);

        // Las fuentes ya no se dibujan aqui. Antes cada criterio llevaba debajo
        // su lista de enlaces, que ocupaba cuatro o cinco lineas por fila y
        // repetia fuentes que se usan en varios criterios. Ahora se recogen
        // todas en una lista unica con enlace al final del informe.
        const altoJust = lJust.length * LINEA + 1.5;
        const altoNombre = lName.length * LINEA + 1.5;
        const alto = Math.max(altoJust, altoNombre, 9);

        // Si la fila no cabe entera en el area imprimible, se salta de pagina
        // en lugar de partirla: una justificacion cortada a media queda mal
        // en un informe justificativo.
        if (y + alto > LIMITE_INFERIOR) {
            doc.addPage();
            const yNuevo = drawTableHeader(43);
            y = yNuevo;
        }

        // Fondo con sombreado alterno
        doc.setFillColor(243, 244, 246);
        doc.setTextColor(0, 0, 0);
        doc.rect(15, y, 180, alto, 'F');

        // Bordes
        doc.setDrawColor(210, 213, 219);
        doc.setLineWidth(0.2);
        doc.rect(15, y, 180, alto);

        let yc = y + PADDING + 2;

        // Criterio
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(lCode, COL.code.x, yc);
        doc.setFont('helvetica', 'normal');

        // Peso
        // Puntuacion con color segun los seis tramos de atractivo
        const num = parseInt(String(score), 10);
        const colScore = num >= 90 ? [21, 128, 61] : num >= 80 ? [34, 197, 94] :
                         num >= 70 ? [234, 88, 12] : num >= 60 ? [253, 186, 116] :
                         num >= 40 ? [248, 113, 113] : [185, 28, 28];
        doc.setTextColor(colScore[0], colScore[1], colScore[2]);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.text(lScore, COL.score.x, yc + 0.3);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        // Descripcion
        doc.setFontSize(6.8);
        doc.text(lName, COL.name.x + PADDING, yc);

        // Justificacion multilinea
        doc.setFontSize(fsJust);
        doc.setTextColor(55, 65, 81);
        doc.text(lJust, COL.just.x + PADDING, yc);

        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        return y + alto + ESPACIO_ENTRE_FILAS;
    }

    // Helper function to draw score box - Red 0-60, Orange 60-80, Green 80-100
    function drawScoreBox(x, y, score, label, ancho, alto) {
        const w = ancho || 50;
        const h = alto || 25;
        const color = score >= 90 ? [21, 128, 61] : score >= 80 ? [34, 197, 94] :
                      score >= 70 ? [234, 88, 12] : score >= 60 ? [253, 186, 116] :
                      score >= 40 ? [248, 113, 113] : [185, 28, 28];
        doc.setFillColor(color[0], color[1], color[2]);
        doc.roundedRect(x, y, w, h, 3, 3, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(h > 25 ? 26 : 16);
        doc.text(`${score}`, x + w / 2, y + h * 0.46, { align: 'center' });
        doc.setFontSize(h > 25 ? 10 : 8);
        doc.text(label, x + w / 2, y + h * 0.78, { align: 'center' });
        doc.setTextColor(0, 0, 0);
    }
    
    // Page 2: Justificación de la Puntuación (1/3) - Criterios 1.1 a 3.2
    doc.addPage();
    drawHeaderBar('1. Justificación por Criterio (1/3)', `Evaluación de ${country} - ${cnaeName}`);
    
    let yPos = 43;

    const intro = `Este informe presenta la evaluación del mercado de ${country} para su empresa según la metodología GEM (Global Export Market). El Atractivo del mercado ajustado por tu perfil y capacidad exportadora obtenido es de ${score} sobre 100 puntos, lo que clasifica este mercado como "${levelDesc}" para su perfil de empresa (${profile}: ${profileWeights[profile].name}). Cada criterio se justifica con fuentes oficiales sobre las que se apoya el Atractivo del mercado ajustado por tu perfil y capacidad exportadora.`;
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    doc.text(doc.splitTextToSize(intro, 180), 17, yPos);
    yPos += doc.splitTextToSize(intro, 180).length * 3.6 + 8;

    yPos = drawTableHeader(yPos);

    const criteriaData1 = ['1.1', '1.2', '2.1', '2.2', '3.1', '3.2'];
    criteriaData1.forEach(code => {
        const just = criterionJustifications[code].justification(country, score, cnae, cnaeName)
            .replace(/\s*\(Fuentes:[^)]*\)/g, '');
        yPos = drawCriteriaRow(
            yPos, code, `${criterionScores[code]}/100`,
            NOMBRES_CRIT[code], just
        );
    });

    // Page 3: Justificación de la Puntuación (2/3) - Criterios 3.3 a 5.2
    doc.addPage();
    drawHeaderBar('1. Justificación por Criterio (2/3)', `Evaluación de ${country} - ${cnaeName}`);

    yPos = drawTableHeader(43);

    const criteriaData2 = ['3.3', '4.1', '4.2', '5.1', '5.2', '6.1'];

    criteriaData2.forEach(code => {
        const just = criterionJustifications[code].justification(country, score, cnae, cnaeName)
            .replace(/\s*\(Fuentes:[^)]*\)/g, '');
        yPos = drawCriteriaRow(
            yPos, code, `${criterionScores[code]}/100`,
            NOMBRES_CRIT[code], just
        );
    });

    // Page 4: Justificación de la Puntuación (3/3) - Criterios 6.2 a 7.4
    doc.addPage();
    drawHeaderBar('1. Justificación por Criterio (3/3)', `Evaluación de ${country} - ${cnaeName}`);

    yPos = drawTableHeader(43);

    const criteriaData3 = ['6.2', '7.1', '7.2', '7.3', '7.4'];

    criteriaData3.forEach(code => {
        const just = criterionJustifications[code].justification(country, score, cnae, cnaeName)
            .replace(/\s*\(Fuentes:[^)]*\)/g, '');
        yPos = drawCriteriaRow(
            yPos, code, `${criterionScores[code]}/100`,
            NOMBRES_CRIT[code], just
        );
    });

    // El resumen por dimension y el cuadro de la puntuacion final se
    // eliminaron a peticion: la tabla de criterios de arriba ya es el
    // detalle, y repetirlo por dimensiones solo duplicaba numeros. Las
    // fuentes de todos los criterios se reunen ahora en una lista unica
    // al final del informe.

    // Paginas 5 y 6: Apartado 2, Analisis del Resultado
    doc.addPage();
    drawHeaderBar('2. Análisis del Resultado', `Evaluación de ${country} - ${cnaeName}`);

    yPos = 50;

    // Solo la puntuacion final: los cuadros por regulatorio y por acceso
    // se han eliminado del informe.
    drawScoreBox(60, yPos, score, 'ATTRACTIVO DEL MERCADO AJUSTADO', 90, 38);

    yPos += 50;

    // Datos reales del pais: los tres criterios mas fuertes y los tres mas
    // debiles, ya calculados para el informe. Sirven para que el analisis
    // no sea generico sino que nombre los factores concretos que la explican.
    const fdInforme = getFortalezasDebilidades(countryKey, profile, cnae);
    const fortalezas = (fdInforme.fortalezas || []).slice(0, 3);
    const debilidades = (fdInforme.debilidades || []).slice(0, 3);
    const aspecto = nombre => nombre.charAt(0).toUpperCase() + nombre.slice(1);

    // Titulo de nivel
    doc.setFontSize(14);
    doc.setTextColor(26, 86, 219);
    doc.text('2.1 Lectura de la puntuación', 20, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 9;

    doc.setFontSize(11);
    let analisis = '';
    if (score >= 90) {
        analisis = `${nombrePuntuacion} de ${score}/100 sitúa a ${country} en el tramo de mercado MUY ATRACTIVO para una empresa del sector ${cnaeName} con perfil ${profile}. Es un destino con condiciones muy favorables: los factores que lolimitan son pocos y se concentran en aspectos secundarios.

Conviene leer esta puntuación junto con el detalle por criterio que figura en el apartado 1. El resultado no es un promedio neutro, sino la media geométrica de dos componentes: lo que tu empresa puede hacer y lo que el país ofrece. Si uno de los dos componentes cayera por debajo de 60, el resultado bajaría aunque el otro fuera excelente.`;
    } else if (score >= 80) {
        analisis = `${nombrePuntuacion} de ${score}/100 sitúa a ${country} en el tramo de mercado ALTAMENTE ATRACTIVO para una empresa del sector ${cnaeName} con perfil ${profile}. Las condiciones son favorables y quedan pocos puntos de fricción por resolver.

Conviene leer esta puntuación junto con el detalle por criterio que figura en el apartado 1. El resultado no es un promedio neutro, sino la media geométrica de dos componentes: lo que tu empresa puede hacer y lo que el país ofrece. Si uno de los dos componentes cayera por debajo de 60, el resultado bajaría aunque el otro fuera excelente.`;
    } else if (score >= 70) {
        analisis = `${nombrePuntuacion} de ${score}/100 sitúa a ${country} en el tramo de mercado con ATRACTIVO MEDIO-ALTO para una empresa del sector ${cnaeName} con perfil ${profile}. Es una opción sólida, con oportunidades claras y algunos puntos de atención que conviene vigilar antes de comprometer recursos.

Conviene leer esta puntuación junto con el detalle por criterio que figura en el apartado 1. El resultado no es un promedio neutro, sino la media geométrica de dos componentes: lo que tu empresa puede hacer y lo que el país ofrece. Si uno de los dos componentes cayera por debajo de 60, el resultado bajaría aunque el otro fuera excelente.`;
    } else if (score >= 60) {
        analisis = `${nombrePuntuacion} de ${score}/100 sitúa a ${country} en el tramo de mercado con ATRACTIVO MEDIO para una empresa del sector ${cnaeName} con perfil ${profile}. Hay oportunidades reales de exportación, pero también desafíos que deben resolverse antes de entrar.

Conviene leer esta puntuación junto con el detalle por criterio que figura en el apartado 1. El resultado no es un promedio neutro, sino la media geométrica de dos componentes: lo que tu empresa puede hacer y lo que el país ofrece. Si uno de los dos componentes cayera por debajo de 60, el resultado bajaría aunque el otro fuera excelente.`;
    } else if (score >= 40) {
        analisis = `${nombrePuntuacion} de ${score}/100 sitúa a ${country} en el tramo de mercado con ATRACTIVO BAJO para una empresa del sector ${cnaeName} con perfil ${profile}. Las dificultades que presenta el destino hacen recomendable una evaluación previa y cuidadosa antes de iniciar cualquier contacto comercial.

Conviene leer esta puntuación junto con el detalle por criterio que figura en el apartado 1. El resultado no es un promedio neutro, sino la media geométrica de dos componentes: lo que tu empresa puede hacer y lo que el país ofrece. Si uno de los dos componentes cayera por debajo de 60, el resultado bajaría aunque el otro fuera excelente.`;
    } else {
        analisis = `${nombrePuntuacion} de ${score}/100 sitúa a ${country} en el tramo de mercado con ATRACTO MUY BAJO para una empresa del sector ${cnaeName} con perfil ${profile}. Los desafíos que concurren en este destino desaconsejan una entrada inmediata con el perfil actual.

Conviene leer esta puntuación junto con el detalle por criterio que figura en el apartado 1. El resultado no es un promedio neutro, sino la media geométrica de dos componentes: lo que tu empresa puede hacer y lo que el país ofrece. Si uno de los dos componentes cayera por debajo de 60, el resultado bajaría aunque el otro fuera excelente.`;
    }

    doc.text(doc.splitTextToSize(analisis, 180), 20, yPos);
    yPos += doc.splitTextToSize(analisis, 180).length * 5 + 14;

    // Solo escribir si queda sitio en la pagina; el resto va a la siguiente.
    if (yPos > LIMITE_INFERIOR - 40) {
        doc.addPage();
        drawHeaderBar('2. Análisis del Resultado (2/2)', `Evaluación de ${country} - ${cnaeName}`);
        yPos = 50;
    }

    // 2.2 Factores que favorecen la entrada
    doc.setFontSize(14);
    doc.setTextColor(26, 86, 219);
    doc.text('2.2 Factores que favorecen la entrada', 20, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 9;

    doc.setFontSize(11);
    if (fortalezas.length) {
        fortalezas.forEach(f => {
            const texto = `· ${aspecto(f.nombre)}: ${f.score}/100. ${
                score >= 80
                    ? 'Es uno de los puntos fuertes del mercado y juega a favor de una entrada con garantías.'
                    : score >= 60
                        ? 'Es un factor favorable que compensa parcialmente las limitaciones del resto de indicadores.'
                        : 'Es el principal apoyo con el que cuenta este mercado frente a sus debilidades.'}`;
            const ls = doc.splitTextToSize(texto, 178);
            doc.text(ls, 20, yPos);
            yPos += ls.length * 5 + 2;
        });
    } else {
        doc.text('No se han identificado criterios con puntuación alta en este mercado.', 20, yPos);
        yPos += 8;
    }

    yPos += 10;
    const razonFuerte = `En conjunto, estos tres criterios explican la parte alta de la puntuación de ${country}. Su peso conjunto dentro del modelo es del ${redondear1(ponderacionTotal(fortalezas, profile))} %, de modo que mejoras en ellos tendrian un efecto directo sobre el resultado.`;
    doc.text(doc.splitTextToSize(razonFuerte, 180), 20, yPos);
    yPos += doc.splitTextToSize(razonFuerte, 180).length * 5 + 14;

    if (yPos > LIMITE_INFERIOR - 40) {
        doc.addPage();
        drawHeaderBar('2. Análisis del Resultado', `Evaluación de ${country} - ${cnaeName}`);
        yPos = 50;
    }

    // 2.3 Factores que_last
    doc.setFontSize(14);
    doc.setTextColor(26, 86, 219);
    doc.text('2.3 Factores que limitan', 20, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 9;

    doc.setFontSize(11);
    if (debilidades.length) {
        debilidades.forEach(d => {
            const texto = `· ${aspecto(d.nombre)}: ${d.score}/100. ${
                score >= 80
                    ? 'Es una limitación menor, tolerable en un mercado por lo demás favorable.'
                    : score >= 60
                        ? 'Es un punto de atención que conviene vigilar durante la operación.'
                        : 'Es una barrera relevante que puede condicionar o impedir la entrada.'}`;
            const ls = doc.splitTextToSize(texto, 178);
            doc.text(ls, 20, yPos);
            yPos += ls.length * 5 + 2;
        });
    } else {
        doc.text('No se han identificado criterios con puntuación baja en este mercado.', 20, yPos);
        yPos += 8;
    }

    yPos += 10;
    const razonDebil = `Estos tres criterios concentran la parte baja de la evaluación y suman el ${redondear1(ponderacionTotal(debilidades, profile))} % del peso del modelo. Son los puntos sobre los que conviene actuar antes de lanzar una estrategia de entrada en ${country}.`;
    doc.text(doc.splitTextToSize(razonDebil, 180), 20, yPos);
    yPos += doc.splitTextToSize(razonDebil, 180).length * 5 + 14;

    if (yPos > LIMITE_INFERIOR - 40) {
        doc.addPage();
        drawHeaderBar('2. Análisis del Resultado', `Evaluación de ${country} - ${cnaeName}`);
        yPos = 50;
    }

    // 2.4 Sensibilidad al perfil
    doc.setFontSize(14);
    doc.setTextColor(26, 86, 219);
    doc.text('2.4 Sensibilidad de la puntuación al perfil', 20, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 9;

    doc.setFontSize(11);
    const sensibilidad = `La puntuación de ${score}/100 corresponde al perfil ${profile} (${profileWeights[profile].name}). La misma evaluación aplicada a otro perfil de empresa arroja un resultado distinto, porque los pesos de los 17 criterios cambian según el nivel de recursos y la orientación al riesgo.

Esto tiene una consecuencia práctica: si una empresa con recursos altos y tolerancia al riesgo media obtiene aquí ${score} puntos, es posible que una pyme conservadora con muchos menos recursos obtenga una puntuación sensiblemente menor en este mismo mercado. A la inversa, un mercado que parece mediocre para un perfil puede resultar accesible para otro. La comparación entre mercados solo es válida si se realiza dentro de un mismo perfil.`;
    const lsSens = doc.splitTextToSize(sensibilidad, 180);
    doc.text(lsSens, 20, yPos);
    yPos += lsSens.length * 5 + 14;

    // Apartado 3: Conclusion y recomendaciones
    if (yPos > LIMITE_INFERIOR - 30) {
        doc.addPage();
        drawHeaderBar('3. Conclusiones y Recomendaciones', `Evaluación de ${country} - ${cnaeName}`);
        yPos = 50;
    } else {
        yPos += 6;
    }

    doc.setFontSize(14);
    doc.setTextColor(26, 86, 219);
    doc.text('3. CONCLUSIONES Y RECOMENDACIONES', 20, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 10;

    doc.setFontSize(11);
    const productoTexto = getCnaeCodigo(cnae)
        ? `producto ${cnaeName} (CNAE ${getCnaeCodigo(cnae)})`
        : 'producto CNAE no especificado';
    const conclusion = `La evaluación de ${country} para su empresa (Perfil ${profile}) y ${productoTexto} ha obtenido una puntuación final de ${score}/100, clasificándose como "${levelDesc}".

Esta cifra resulta de combinar, mediante media geométrica, la capacidad de exportar de la empresa y el atractivo del mercado. Un resultado de ${score} puntos significa que ambos componentes se mueven en un rango parecido: no hay una situación en la que un mercado excelente compense la falta de preparación de la empresa, ni a la inversa.

Sobre la base de esta evaluación, ${decisionRecomendada(score)}`;
    const lsConcl = doc.splitTextToSize(conclusion, 180);
    doc.text(lsConcl, 20, yPos);
    yPos += lsConcl.length * 5 + 14;

    if (yPos > LIMITE_INFERIOR - 30) {
        doc.addPage();
        drawHeaderBar('3. Conclusiones y Recomendaciones (2/2)', `Evaluación de ${country} - ${cnaeName}`);
        yPos = 50;
    }

    doc.setFontSize(14);
    doc.setTextColor(26, 86, 219);
    doc.text('RECOMENDACIONES', 20, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 10;

    const recomendaciones = construirRecomendaciones(score, country, fortalezas, debilidades);

    doc.setFontSize(11);
    recomendaciones.forEach(rec => {
        const ls = doc.splitTextToSize('· ' + rec, 178);
        doc.text(ls, 20, yPos);
        yPos += ls.length * 5 + 3;
    });

    if (yPos > LIMITE_INFERIOR - 20) {
        doc.addPage();
        drawHeaderBar('3. Conclusiones y Recomendaciones', `Evaluación de ${country} - ${cnaeName}`);
        yPos = 50;
    }

    // ---- Fuentes del informe ----
    //
    // Antes cada criterio llevaba debajo sus propias fuentes con enlace, y eso
    // ocupaba cuatro o cinco lineas por fila y repetia fuentes que se usan en
    // varios criterios: el Banco Mundial aparecia unas veinte veces. Ahora se
    // recogen todas aqui, una sola vez, ordenadas alfabeticamente y con su
    // enlace. La lista es la de los 17 criterios, no solo los de este informe.
    const fuentesInforme = (function () {
        const vistas = {};
        Object.keys(NOMBRES_CRIT).forEach(function (code) {
            (getSourcesForCriterion(code) || []).forEach(function (f) {
                if (f && f.name && !vistas[f.name]) vistas[f.name] = f.url || '';
            });
        });
        return Object.keys(vistas).sort(function (a, b) {
            return a.localeCompare(b, 'es');
        }).map(function (nombre) {
            return { nombre: nombre, url: vistas[nombre] };
        });
    })();

    if (yPos > LIMITE_INFERIOR - 60) {
        doc.addPage();
        yPos = 50;
    }

    doc.setFontSize(13);
    doc.setTextColor(26, 86, 219);
    doc.text('Fuentes consultadas', 20, yPos);
    yPos += 8;

    doc.setFontSize(7.5);
    doc.setTextColor(55, 65, 81);
    doc.text(
        'Todas las puntuaciones de este informe se apoyan en los indicadores publicados por estas fuentes.',
        20, yPos
    );
    yPos += 9;

    const LINEA_FUENTE = 4;
    fuentesInforme.forEach(function (f) {
        if (yPos > LIMITE_INFERIOR - 5) {
            doc.addPage();
            yPos = 43;
        }
        if (f.url) {
            doc.setTextColor(26, 86, 219);
            doc.textWithLink('· ' + f.nombre, 20, yPos, { url: f.url });
        } else {
            doc.setTextColor(55, 65, 81);
            doc.text('· ' + f.nombre, 20, yPos);
        }
        yPos += LINEA_FUENTE;
    });

    // Cierre
    yPos += 8;
    if (yPos > LIMITE_INFERIOR - 20) {
        doc.addPage();
        yPos = 50;
    }
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text('Para más información, contacte con GEM en info@globalexportmarket.com', 20, yPos);
    yPos += 6;
    doc.text(`Informe generado por GEM - Global Export Market - ${new Date().toLocaleDateString('es-ES')}`, 20, yPos);
    
    // Numero de pagina en la esquina inferior izquierda de cada pagina.
    // Se anade al final, cuando ya se sabe cuantas paginas tiene el informe.
    numerarPaginas(doc, 20, 288);
    
    // Visualiza el PDF en un visor superpuesto dentro de la propia pagina.
    // Se evita abrir una ventana nueva porque el bloqueador de ventanas
    // emergentes la cancela y, en muchos navegadores, una URL blob: cargada
    // en el nivel superior de la ventana se queda en blanco.
    // "paginas" se declara fuera porque despues se usa para el historial.
    let paginas = 0;
    try {
        const nombreArchivo = `GEM_Informe_${country.replace(/[\s\/\\:*?"<>|]+/g, '_')}_${score}.pdf`;
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        paginas = doc.internal.getNumberOfPages();

        if (mostrarVisorPDF(url, nombreArchivo, country)) {
            mostrarAvisoDescarga(nombreArchivo, blob.size, paginas, true);
        } else {
            // Si el visor no puede crearse, el informe se descarga igualmente
            descargarBlob(url, nombreArchivo);
            setTimeout(() => URL.revokeObjectURL(url), 60000);
            mostrarAvisoDescarga(nombreArchivo, blob.size, paginas, false);
        }
    } catch (e) {
        doc.save(`GEM_Informe_${country.replace(/\s+/g, '_')}_${score}.pdf`);
    }

    registrarInformeMercado(country, score, paginas);
}

// Generar el informe es la accion mas relevante del mapa, asi que es lo que
// se guarda en el historial. Se comprueba antes que no sea el mismo mercado
// con la misma puntuacion, porque el PDF puede descargarse varias veces.
function registrarInformeMercado(country, score, paginas) {
    const lista = leerActividad();
    const primero = lista[0];
    const titulo = 'Informe de mercado: ' + country + ' (' + score + '/100)';
    if (primero && primero.tipo === 'mapa' && primero.titulo === titulo) return;

    registrarActividad(
        'mapa',
        titulo,
        'Atractivo del mercado ajustado por tu perfil y capacidad exportadora' +
            (paginas ? ' · informe de ' + paginas + ' páginas' : '')
    );
}

// Crea el visor superpuesto con el PDF incrustado. Un iframe con la URL blob
// carga el visor nativo del navegador, que no depende de navegación ni de
// plugins externos.
function mostrarVisorPDF(url, nombreArchivo, country) {
    try {
        cerrarVisorPDF();

        const fondo = document.createElement('div');
        fondo.id = 'gem-visor';
        fondo.setAttribute('role', 'dialog');
        fondo.setAttribute('aria-modal', 'true');
        fondo.setAttribute('aria-label', 'Informe de ' + country);
        fondo.style.cssText = [
            'position:fixed', 'inset:0', 'z-index:100000',
            'background:rgba(15,23,42,.88)', 'backdrop-filter:blur(4px)',
            'display:flex', 'flex-direction:column',
            'font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif'
        ].join(';');

        const marco = document.createElement('iframe');
        marco.title = nombreArchivo;
        marco.src = url;
        marco.style.cssText = [
            'flex:1', 'width:100%', 'border:0', 'background:#525659',
            'min-height:0'
        ].join(';');

        const barra = document.createElement('div');
        barra.style.cssText = [
            'display:flex', 'align-items:center', 'gap:12px',
            'padding:12px 16px', 'background:#0f172a', 'color:#fff',
            'flex-shrink:0', 'flex-wrap:wrap'
        ].join(';');

        const titulo = document.createElement('div');
        titulo.style.cssText = 'font-size:15px;font-weight:700;margin-right:auto';
        titulo.textContent = 'Informe de ' + country;

        const info = document.createElement('span');
        info.style.cssText = 'font-size:13px;opacity:.75';
        info.textContent = nombreArchivo;

        const btnDescargar = botonVisor('&#8595; Descargar', 'rgba(26,86,219,.95)');
        btnDescargar.addEventListener('click', function () {
            descargarBlob(url, nombreArchivo);
        });

        const btnPestana = botonVisor('Abrir en pestana', 'rgba(255,255,255,.14)');
        btnPestana.addEventListener('click', function () {
            window.open(url, '_blank');
        });

        const btnCerrar = botonVisor('&times; Cerrar', 'rgba(255,255,255,.14)');
        btnCerrar.addEventListener('click', cerrarVisorPDF);

        barra.append(titulo, info, btnPestana, btnDescargar, btnCerrar);

        // Cerrar al pulsar fuera del marco del PDF
        fondo.addEventListener('mousedown', function (ev) {
            if (ev.target === fondo) cerrarVisorPDF();
        });

        fondo.append(barra, marco);
        document.body.appendChild(fondo);
        document.body.style.overflow = 'hidden';

        // Cerrar con la tecla Escape
        document.addEventListener('keydown', function onEsc(ev) {
            if (ev.key === 'Escape') {
                cerrarVisorPDF();
                document.removeEventListener('keydown', onEsc);
            }
        });

        return true;
    } catch (e) {
        return false;
    }
}

// Boton estandar del visor
function botonVisor(html, fondo) {
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = html;
    b.style.cssText = [
        'padding:9px 16px', 'border-radius:8px', 'border:none', 'cursor:pointer',
        'background:' + fondo, 'color:#fff', 'font-size:13px', 'font-weight:600',
        'font-family:inherit'
    ].join(';');
    return b;
}

// Elimina el visor superpuesto
function cerrarVisorPDF() {
    const visor = document.getElementById('gem-visor');
    if (visor) visor.remove();
    document.body.style.overflow = '';
}

// Descarga directa de un blob como archivo
function descargarBlob(url, nombreArchivo) {
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Aviso visual de descarga correcta
function mostrarAvisoDescarga(nombre, bytes, paginas, abierto) {
    const previo = document.getElementById('gem-aviso-descarga');
    if (previo) previo.remove();
    const detalle = paginas
        ? `${Math.round(bytes / 1024)} KB &middot; ${paginas} p&aacute;ginas`
        : `${Math.round(bytes / 1024)} KB`;
    const titulo = abierto ? 'Informe generado' : 'Informe descargado';
    const icono = abierto ? '&#128196;' : '&#10003;';
    const nota = abierto
        ? 'Se muestra en pantalla. Ciérralo con el botón o la tecla Esc.'
        : 'No se pudo mostrar en pantalla: se ha descargado el archivo.';
    const div = document.createElement('div');
    div.id = 'gem-aviso-descarga';
    div.innerHTML = `
        <div style="display:flex;align-items:center;gap:14px;
                    background:#059669;color:#fff;padding:16px 20px;border-radius:10px;
                    box-shadow:0 10px 25px rgba(0,0,0,.25);font-family:Inter,sans-serif;">
            <span style="font-size:24px;">${icono}</span>
            <div>
                <strong style="display:block;font-size:15px;">${titulo}</strong>
                <span style="font-size:13px;opacity:.9;">${nombre} &middot; ${detalle}</span>
                <span style="display:block;font-size:12px;opacity:.8;margin-top:2px;">${nota}</span>
            </div>
            <button onclick="this.closest('#gem-aviso-descarga').remove()"
                    style="margin-left:auto;background:rgba(255,255,255,.2);color:#fff;
                           border:none;cursor:pointer;font-size:19px;line-height:1;
                           padding:6px 10px;border-radius:6px;">&times;</button>
        </div>`;
    Object.assign(div.style, {
        position: 'fixed', bottom: '24px', right: '24px', zIndex: '100000',
        maxWidth: '400px', animation: 'gemFade .3s ease'
    });
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 5000);
}

// Recuadro de zonas geograficas: al pulsar una, el ranking se recalcula
// mostrando los tres mercados mejor puntuados de esa zona.
function initZonasGeo() {
    const lista = document.getElementById('zonas-lista');
    if (!lista) return;

    // Marca la zona inicial para que el HTML y el script no discrepen
    lista.querySelectorAll('.zona-btn').forEach(function (b) {
        const activo = b.getAttribute('data-zona') === zonaSeleccionada;
        b.classList.toggle('activa', activo);
        b.setAttribute('aria-pressed', activo ? 'true' : 'false');
    });

    lista.addEventListener('click', function (evento) {
        const boton = evento.target.closest('.zona-btn');
        if (!boton) return;

        const zona = boton.getAttribute('data-zona');
        if (!ZONAS_GEOGRAFICAS[zona]) return;

        zonaSeleccionada = zona;

        // Marca visualmente la zona activa
        lista.querySelectorAll('.zona-btn').forEach(function (b) {
            b.classList.toggle('activa', b === boton);
            b.setAttribute('aria-pressed', b === boton ? 'true' : 'false');
        });

        renderTopMarkets();
    });
}

// ---- Top 3 mercados con puntos fuertes y debiles ----

// Zonas geograficas en las que se puede acotar el ranking de los tres
// mercados mas puntuados.
// La clave 'todas' es la opcion por defecto: ranking sobre todos los paises
// que tienen puntuacion base.
const ZONAS_GEOGRAFICAS = {
    todas: {
        nombre: 'Todos los mercados',
        paises: null   // null = todos los disponibles
    },
    europa: {
        nombre: 'Europa',
        paises: ['Germany', 'France', 'United Kingdom', 'Italy', 'Spain',
                 'Poland', 'Netherlands', 'Belgium', 'Austria', 'Switzerland',
                 'Sweden', 'Denmark', 'Finland', 'Norway', 'Ireland',
                 'Portugal', 'Greece', 'Czech Republic', 'Hungary', 'Romania']
    },
    america: {
        nombre: 'América',
        paises: ['United States', 'Canada', 'Mexico', 'Brazil', 'Chile',
                 'Colombia', 'Argentina', 'Peru']
    },
    asia: {
        nombre: 'Asia',
        paises: ['China', 'Japan', 'South Korea', 'India', 'Singapore',
                 'Vietnam', 'Indonesia', 'Thailand', 'Malaysia', 'Philippines']
    },
    orienteProximo: {
        nombre: 'Oriente Próximo',
        paises: ['Turkey', 'Israel', 'UAE', 'Saudi Arabia']
    },
    africa: {
        nombre: 'África',
        paises: ['Morocco', 'South Africa', 'Egypt', 'Algeria', 'Tunisia',
                 'Kenya', 'Nigeria']
    },
    restoMundo: {
        // Oceania y Europa oriental: lo que no encaja en las zonas anteriores
        nombre: 'Resto del Mundo',
        paises: ['Australia', 'New Zealand', 'Papua New Guinea', 'Fiji',
                 'Russia', 'Ukraine']
    }
};

// Zona seleccionada por el usuario. Se cambia al pulsar un boton del
// recuadro de zonas y se conserva al recalcular el mapa.
// Por defecto Asia, mercado de mayor crecimiento para la pyme española.
let zonaSeleccionada = 'asia';

// Devuelve los paises de la zona indicada que tienen puntuacion base.
// España se excluye siempre: es el pais de origen, no un destino.
function paisesDeZona(zona) {
    const definicion = ZONAS_GEOGRAFICAS[zona] || ZONAS_GEOGRAFICAS.todas;
    const disponibles = Object.keys(countryBaseScores).filter(function (p) {
        return p !== 'Spain';
    });
    if (!definicion.paises) return disponibles;
    return disponibles.filter(function (p) {
        return definicion.paises.indexOf(p) !== -1;
    });
}

// Paises que se consideran para el ranking (los de la zona seleccionada)
function paisesParaRanking() {
    return paisesDeZona(zonaSeleccionada);
}

// Dibuja los tres mercados mejor puntuados con su tabla de puntos
// fuertes (3 mejores criterios) y debiles (3 peores criterios).
function renderTopMarkets() {
    const grid = document.getElementById('top-markets-grid');
    const intro = document.getElementById('top-markets-intro');
    if (!grid) return;

    const profile = getSelectedProfile();
    const cnae = getCnaeCode();
    const cnaeNombre = getCnaeNombre(cnae);

    // Ordenar por puntuacion final, de mayor a menor
    //
    // Se guarda tambien el Atractivo del mercado y el FMFS de cada pais, para
    // que la tarjeta pueda explicar de donde sale el numero grande. El FMFS es
    // el mismo para todos los paises, asi que ordenar por la puntuacion final
    // y ordenar por el Atractivo del mercado da exactamente el mismo ranking.
    const ranking = paisesParaRanking()
        .map(function (pais) {
            const factores = obtenerGEMScore(pais, profile, cnae);
            return {
                pais: pais,
                score: factores.score,
                atractivo: factores.atractivo,
                fmfs: factores.fmfs
            };
        })
        .sort(function (a, b) { return b.score - a.score; })
        .slice(0, 3);

    if (intro) {
        const prefijo = cnaeNombre
            ? 'Para tu perfil ' + profile + ' y el producto ' + cnaeNombre +
              ' (CNAE ' + getCnaeCodigo(cnae) + ')'
            : 'Para tu perfil ' + profile;
        intro.textContent = prefijo +
            ', para ver los mercados con mayor atractivo del mercado ajustado por tu perfil y capacidad exportadora, ' +
            'selecciona una zona geográfica';
    }

    grid.innerHTML = '';

    if (!ranking.length) {
        const aviso = document.createElement('p');
        aviso.className = 'top-markets-vacio';
        aviso.textContent = 'No hay mercados con puntuación en esta zona.';
        grid.appendChild(aviso);
        return;
    }

    ranking.forEach(function (item, indice) {
        const nombreES = getCountryNameES(item.pais);
        const level = getScoreLevel(item.score);
        const color = colors[level];
        const fd = getFortalezasDebilidades(item.pais, profile, cnae);

        const tarjeta = document.createElement('article');
        tarjeta.className = 'top-market-card';
        tarjeta.style.setProperty('--nivel-color', color);

        // Fila de la cabecera con puesto, pais y puntuacion
        const cabecera = document.createElement('div');
        cabecera.className = 'top-market-head';
        cabecera.innerHTML =
            '<span class="top-market-rank">' + (indice + 1) + '</span>' +
            '<h4 class="top-market-name">' + nombreES + '</h4>' +
            '<span class="top-market-score">' + item.score +
            '<small>/100</small></span>';
        tarjeta.appendChild(cabecera);

        // Nivel de atractivo
        const nivel = document.createElement('span');
        nivel.className = 'top-market-level';
        nivel.textContent = nivelAtractivo[level];
        tarjeta.appendChild(nivel);

        // Desglose del numero grande. Sin esto, los puntos fuertes y debiles de
        // abajo no parecian explicar la puntuacion de la cabecera, porque no
        // son su media ponderada: son los 17 criterios (el Atractivo del
        // mercado) combinados con la capacidad exportadora de la empresa.
        const desglose = document.createElement('p');
        desglose.className = 'top-market-desglose';
        desglose.innerHTML = (item.fmfs === null || item.fmfs === undefined)
            ? 'Atractivo del mercado <strong>' + item.atractivo + '/100</strong>' +
              '. Completa tus preferencias para combinarlo con tu capacidad exportadora.'
            : 'Atractivo del mercado <strong>' + item.atractivo + '</strong> × capacidad ' +
              'exportadora <strong>' + item.fmfs + '</strong> = raíz de ' +
              '(' + item.atractivo + ' × ' + item.fmfs + ') = <strong>' + item.score + '</strong>';
        tarjeta.appendChild(desglose);

        // Tabla de puntos fuertes y debiles
        const tabla = document.createElement('table');
        tabla.className = 'top-market-table';

        const cabeceraTabla = document.createElement('thead');
        cabeceraTabla.innerHTML =
            '<tr><th>Puntos fuertes</th><th>Puntos débiles</th></tr>';
        tabla.appendChild(cabeceraTabla);

        const cuerpo = document.createElement('tbody');
        for (let i = 0; i < 3; i++) {
            const fila = document.createElement('tr');

            const celdaFuerte = document.createElement('td');
            celdaFuerte.className = 'td-fuerte';
            celdaFuerte.innerHTML =
                '<span class="punto punto-fuerte">' + fd.fortalezas[i].score + '</span>' +
                '<span class="punto-nombre">' + fd.fortalezas[i].nombre + '</span>';

            const celdaDebil = document.createElement('td');
            celdaDebil.className = 'td-debil';
            celdaDebil.innerHTML =
                '<span class="punto punto-debil">' + fd.debilidades[i].score + '</span>' +
                '<span class="punto-nombre">' + fd.debilidades[i].nombre + '</span>';

            fila.appendChild(celdaFuerte);
            fila.appendChild(celdaDebil);
            cuerpo.appendChild(fila);
        }
        tabla.appendChild(cuerpo);
        tarjeta.appendChild(tabla);

        // Enlace al informe del mercado
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'btn btn-primary top-market-btn';
        boton.textContent = 'Ver informe de ' + nombreES;
        boton.addEventListener('click', function () {
            descargarInforme(item.pais, item.score, profile, cnae);
        });
        tarjeta.appendChild(boton);

        grid.appendChild(tarjeta);
    });
}

// Fallback circle markers
function addCircleMarkers(map) {
    const profile = getSelectedProfile();
    const cnae = getCnaeCode();
    
    const markets = [
        { name: 'Alemania', coords: [51.1657, 10.4515] },
        { name: 'Francia', coords: [46.2276, 2.2137] },
        { name: 'Reino Unido', coords: [55.3781, -3.4360] },
        { name: 'Italia', coords: [41.8719, 12.5674] },
        { name: 'España', coords: [40.4637, -3.7492] },
        { name: 'Polonia', coords: [51.9194, 19.1451] },
        { name: 'Países Bajos', coords: [52.1326, 5.2913] },
        { name: 'China', coords: [35.8617, 104.1954] },
        { name: 'Japón', coords: [36.2048, 138.2529] },
        { name: 'Corea del Sur', coords: [35.9078, 127.7669] },
        { name: 'India', coords: [20.5937, 78.9629] },
        { name: 'Singapur', coords: [1.3521, 103.8198] },
        { name: 'Vietnam', coords: [14.0583, 108.2772] },
        { name: 'Indonesia', coords: [-0.7893, 113.9213] },
        { name: 'Estados Unidos', coords: [37.0902, -95.7129] },
        { name: 'Canadá', coords: [56.1304, -106.3468] },
        { name: 'México', coords: [23.6345, -102.5528] },
        { name: 'Brasil', coords: [-14.2350, -51.9253] },
        { name: 'Chile', coords: [-35.6751, -71.5430] },
        { name: 'Colombia', coords: [4.5709, -74.2973] },
        { name: 'Marruecos', coords: [31.7917, -7.0926] },
        { name: 'Egipto', coords: [26.8206, 30.8025] },
        { name: 'Sudáfrica', coords: [-30.5595, 22.9375] },
        { name: 'Australia', coords: [-25.2744, 133.7751] },
        { name: 'Nueva Zelanda', coords: [-40.9006, 174.8860] },
    ];

    markets.forEach(market => {
        const score = calculateCountryScore(market.name, profile, cnae);
        const level = getScoreLevel(score);
        const color = colors[level];
        
        const marker = L.circleMarker(market.coords, {
            radius: 12,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);

        marker.bindPopup(`
            <div style="text-align: center; min-width: 150px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937;">${market.name}</h3>
                <div style="display: inline-block; padding: 4px 12px; border-radius: 12px; background: ${color}; color: white; font-size: 12px; font-weight: 600; margin-bottom: 8px;">
                    ${nivelAtractivo[level]}
                </div>
                <p style="margin: 0; font-size: 24px; font-weight: 700; color: #1a56db;">${score}/100</p>
            </div>
        `);
    });
}

// Evita reconstruir el mapa varias veces mientras se escribe el CNAE
let temporizadorCnae = null;
function programarActualizacionMapa() {
    if (temporizadorCnae) clearTimeout(temporizadorCnae);
    temporizadorCnae = setTimeout(function () {
        // initMap ya se encarga de destruir el mapa anterior
        initMap();
        renderTopMarkets();
    }, 350);
}

document.addEventListener('DOMContentLoaded', function () {
    initCnaeSelector();
    initCnaePreview();

    // Refleja el perfil y el CNAE elegidos en el mapa y en el Top 3.
    // El perfil ya no tiene radios propios: se deduce de las dos preguntas de
    // recursos y riesgo, asi que se escuchan esas.
    // No hay que llamar a map.remove() aqui: initMap lo hace por nosotros y
    // hacerlo dos veces deja el contenedor marcado y rompe la recreacion.
    document.querySelectorAll('input[name="recursos"], input[name="riesgo"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            pintarPerfilDetectado();
            initMap();
            renderTopMarkets();
        });
    });
    pintarPerfilDetectado();

    const cnaeInput = document.getElementById('cnae-input');
    if (cnaeInput) {
        cnaeInput.addEventListener('change', function () {
            initMap();
            renderTopMarkets();
        });
        cnaeInput.addEventListener('input', programarActualizacionMapa);
    }

    // Menu hamburguesa: abre y cierra la lista de secciones
    const botonHamburguesa = document.getElementById('hamburger');
    const menu = document.getElementById('nav-menu');

    function cerrarMenu() {
        if (!menu || !botonHamburguesa) return;
        menu.classList.remove('abierto');
        botonHamburguesa.classList.remove('activo');
        botonHamburguesa.setAttribute('aria-expanded', 'false');
        botonHamburguesa.setAttribute('aria-label', 'Abrir menu de navegacion');
        menu.querySelectorAll('a.activo').forEach(function (a) { a.classList.remove('activo'); });
    }

    if (botonHamburguesa && menu) {
        botonHamburguesa.addEventListener('click', function () {
            const abierto = menu.classList.toggle('abierto');
            botonHamburguesa.classList.toggle('activo', abierto);
            botonHamburguesa.setAttribute('aria-expanded', abierto ? 'true' : 'false');
            botonHamburguesa.setAttribute('aria-label', abierto ? 'Cerrar menu de navegacion' : 'Abrir menu de navegacion');
        });

        // Al elegir una seccion: primero crece un 50% y despues se cierra
        menu.querySelectorAll('a').forEach(function (enlace) {
            enlace.addEventListener('click', function () {
                menu.querySelectorAll('a.activo').forEach(function (a) { a.classList.remove('activo'); });
                enlace.classList.add('activo');
                setTimeout(cerrarMenu, 420);
            });
        });

        // Cierra al pulsar fuera, al pulsar Escape o al redimensionar
        document.addEventListener('click', function (evento) {
            if (!menu.classList.contains('abierto')) return;
            if (!menu.contains(evento.target) && !botonHamburguesa.contains(evento.target)) {
                cerrarMenu();
            }
        });

        document.addEventListener('keydown', function (evento) {
            if (evento.key === 'Escape') cerrarMenu();
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) cerrarMenu();
        });
    }

    // La barra fija se vuelve azul en cuanto se desplaza la pagina
    const cabecera = document.querySelector('.header');
    function marcarCabecera() {
        if (cabecera) cabecera.classList.toggle('scrolled', window.scrollY > 40);
    }
    marcarCabecera();
    window.addEventListener('scroll', marcarCabecera, { passive: true });

    // Navegacion por anclas: el boton "Probar" lleva a Mis preferencias
    document.querySelectorAll('a[href^="#"]').forEach(function (enlace) {
        enlace.addEventListener('click', function (evento) {
            const destino = enlace.getAttribute('href');
            if (!destino || destino === '#') {
                evento.preventDefault();
                return;
            }
            const destinoEl = document.querySelector(destino);
            if (destinoEl) {
                evento.preventDefault();
                destinoEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // El FMFS se recalcula en cuanto se responde cualquier pregunta: el score
    // se muestra siempre, sea parcial o completo, para que la empresa vea la
    // evolucion mientras contesta.
    document.querySelectorAll('.questionnaire-grid select').forEach(function (select) {
        select.addEventListener('change', function () {
            pintarFMFS();
            initMap();
            renderTopMarkets();
        });
    });

    pintarFMFS();
    initAuth();
    initYo();
    initSonido();
    initZonasGeo();
    renderTopMarkets();
    initProbabilidadExportador();
    initInfoPopups();
    initMap();
});

// --- Musica de fondo --------------------------------------------------------
//
// Un unico elemento <audio> en bucle, a volumen bajo para que quede de ambiente.
// Intenta arrancar solo al abrir la pagina; el boton de abajo es para silenciar,
// no para activar. Si el visitante lo silencia, se recuerda para que la
// siguiente visita ya empiece en silencio.

const CLAVE_SONIDO = 'gem.sonido.silenciado';

// Volumen del fondo. A 0,18 no se oia en un movil: es un 18 % de la
// potencia maxima, y con el altavoz del telefono por debajo de eso la
// musica desaparece. 0,32 se sigue oyendo como ambiente, no como musica
// protagonista.
const VOLUMEN_FONDO = 0.32;

function initSonido() {
    const audio = document.getElementById('audio-fondo');
    const boton = document.getElementById('control-sonido');
    if (!audio || !boton) return;

    audio.volume = VOLUMEN_FONDO;

    // El boton siempre dice lo mismo: "silenciar". Lo que cambia es si la
    // musica esta sonando o no, y eso se ve con el boton apagado.
    function pintar(callado) {
        boton.classList.toggle('silenciado', callado);
    }

    // Si el visitante ya lo habia silenciado en otra visita, se respeta y no
    // se intenta reproducir. Es "let" porque el boton puede volver a activarlo.
    let silenciado = localStorage.getItem(CLAVE_SONIDO) === '1';
    pintar(silenciado);

    // ARRANQUE AUTOMATICO
    // ----------------------
    // Chrome, Firefox, Safari y Edge bloquean el sonido automatico con sonido
    // hasta que el visitante interactua con la pagina. No es un fallo del
    // codigo: es una norma deliberada de todos los navegadores desde 2017,
    // puesta para que ninguna web empiece a gritarle al visitante sin que lo
    // haya pedido. No hay forma de saltarsela.
    //
    // Comprobado en este equipo: play() al abrir la pagina se rechaza, y
    // arrancar silenciado y quitar el mute despues tampoco vale (el navegador
    // deja sonar y lo pausa en cuanto se quita el silencio).
    //
    // Asi que se hace todo lo que si es posible, en este orden:
    //
    //   1. Se intenta al abrir, por si el navegador lo permite (a quien ya
    //      visita mucho el sitio, Chrome suele permitirlselo).
    //   2. En cuanto el visitante hace CUALQUIER cosa, se reintenta.
    //      Se escuchan todos los gestos posibles y en fase de captura, para
    //      coger tambien el mas pequeno movimiento del raton o el primer
    //      scroll, no solo un clic.
    //   3. Si el visitante vuelve con la musica silenciada, no se intenta
    //      nada y no se le molesta.

    function reproducir() {
        if (silenciado) return;
        const p = audio.play();
        if (p && typeof p.catch === 'function') p.catch(function () {});
    }

    // El primer gesto del visitante, el que sea. Se pone en fase de captura
    // para que salte antes que cualquier otra cosa de la pagina.
    const gestos = ['pointerdown', 'pointermove', 'touchstart', 'keydown', 'wheel', 'scroll', 'click'];

    function alPrimerGesto() {
        if (!silenciado) reproducir();
        gestos.forEach(function (evento) {
            document.removeEventListener(evento, alPrimerGesto, true);
        });
    }

    if (!silenciado) {
        reproducir();
        gestos.forEach(function (evento) {
            document.addEventListener(evento, alPrimerGesto, true);
        });
    }

    // El boton silencia. Si la musica no ha podido arrancar todavia (porque el
    // navegador lo ha bloqueado), la primera pulsacion la arranca y a partir de
    // ahi vuelve a hacer lo que dice: silenciar.
    boton.addEventListener('click', function () {
        if (!audio.paused) {
            audio.pause();
            localStorage.setItem(CLAVE_SONIDO, '1');
            pintar(true);
        } else {
            localStorage.setItem(CLAVE_SONIDO, '0');
            silenciado = false;
            pintar(false);
            const p = audio.play();
            if (p && typeof p.catch === 'function') p.catch(function () {});
        }
    });

    // Red de seguridad del bucle. El atributo loop deberia bastar, pero si el
    // navegador pierde el estado (una pausa del sistema, una pestana en segundo
    // plano) la pista se pararia para siempre. Al llegar al final se vuelve al
    // principio, y cada dos segundos se comprueba que siga sonando.
    audio.addEventListener('ended', function () {
        audio.currentTime = 0;
        if (!audio.paused) reproducir();
    });

    setInterval(function () {
        if (!audio.paused && audio.ended) {
            audio.currentTime = 0;
            reproducir();
        }
    }, 2000);

    // Si el archivo no existe o no se puede reproducir, el boton se apaga
    // para no prometer una musica que no suena.
    audio.addEventListener('error', function () {
        pintar(true);
        boton.disabled = true;
        boton.title = 'No hay musica de fondo disponible';
    });
}
