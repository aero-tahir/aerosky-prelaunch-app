
export const FIR_BOUNDARIES = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: { name: 'Delhi FIR', code: 'VIDF', color: '#FACC15' }, // Yellow
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [73.0, 30.0], [77.0, 31.0], [80.0, 30.0], [82.0, 28.0],
                    [80.0, 24.0], [76.0, 24.0], [73.0, 26.0], [73.0, 30.0]
                ]]
            }
        },
        {
            type: 'Feature',
            properties: { name: 'Mumbai FIR', code: 'VABF', color: '#F97316' }, // Orange
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [68.0, 24.0], [76.0, 24.0], [80.0, 20.0], [78.0, 15.0],
                    [72.0, 15.0], [68.0, 20.0], [68.0, 24.0]
                ]]
            }
        },
        {
            type: 'Feature',
            properties: { name: 'Chennai FIR', code: 'VOMF', color: '#22C55E' }, // Green
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [72.0, 15.0], [78.0, 15.0], [80.0, 20.0], [84.0, 18.0],
                    [82.0, 8.0], [74.0, 8.0], [72.0, 15.0]
                ]]
            }
        },
        {
            type: 'Feature',
            properties: { name: 'Kolkata FIR', code: 'VECF', color: '#3B82F6' }, // Blue
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [80.0, 24.0], [88.0, 27.0], [92.0, 26.0], [92.0, 21.0],
                    [84.0, 18.0], [80.0, 20.0], [80.0, 24.0]
                ]]
            }
        }
    ]
};

export const TERRAIN_BLIND_SPOTS = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: { name: 'Himalayas - Shadow Zone', risk: 'High' },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [75.0, 32.0], [85.0, 30.0], [90.0, 28.0], [95.0, 29.0],
                    [95.0, 35.0], [75.0, 35.0], [75.0, 32.0]
                ]]
            }
        },
        {
            type: 'Feature',
            properties: { name: 'Western Ghats - Signal Loss', risk: 'Moderate' },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [73.5, 16.0], [74.5, 16.0], [76.0, 11.0], [75.0, 11.0],
                    [73.5, 16.0]
                ]]
            }
        },
        {
            type: 'Feature',
            properties: { name: 'North East - Remote', risk: 'Moderate' },
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [92.0, 22.0], [96.0, 22.0], [97.0, 28.0], [93.0, 28.0],
                    [92.0, 22.0]
                ]]
            }
        }
    ]
};

export const HOLDING_STACKS = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: { name: 'DEL Stack', airport: 'DEL' },
            geometry: {
                type: 'Point',
                coordinates: [76.9, 28.4]
            }
        },
        {
            type: 'Feature',
            properties: { name: 'BOM Stack', airport: 'BOM' },
            geometry: {
                type: 'Point',
                coordinates: [72.7, 19.2]
            }
        }
    ]
};

export const AERO_CHARTS = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: { name: 'Airway J1', category: 'High Altitude' },
            geometry: {
                type: 'LineString',
                coordinates: [[72.0, 19.0], [77.0, 28.0], [88.0, 22.0]]
            }
        },
        {
            type: 'Feature',
            properties: { name: 'Approach Corridor V1', category: 'Terminal' },
            geometry: {
                type: 'LineString',
                coordinates: [[76.5, 27.5], [77.1, 28.5]]
            }
        }
    ]
};

export const AIRPORTS = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: { iata: 'DEL', name: 'Indira Gandhi Intl', type: 'Intl' },
            geometry: { type: 'Point', coordinates: [77.1025, 28.5562] }
        },
        {
            type: 'Feature',
            properties: { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj Intl', type: 'Intl' },
            geometry: { type: 'Point', coordinates: [72.8656, 19.0896] }
        },
        {
            type: 'Feature',
            properties: { iata: 'BLR', name: 'Kempegowda Intl', type: 'Intl' },
            geometry: { type: 'Point', coordinates: [77.7066, 13.1986] }
        },
        {
            type: 'Feature',
            properties: { iata: 'MAA', name: 'Chennai Intl', type: 'Intl' },
            geometry: { type: 'Point', coordinates: [80.1709, 12.9941] }
        },
        {
            type: 'Feature',
            properties: { iata: 'HYD', name: 'Rajiv Gandhi Intl', type: 'Intl' },
            geometry: { type: 'Point', coordinates: [78.4294, 17.2403] }
        },
        {
            type: 'Feature',
            properties: { iata: 'CCU', name: 'Netaji Subhas Chandra Bose Intl', type: 'Intl' },
            geometry: { type: 'Point', coordinates: [88.4467, 22.6547] }
        },
        {
            type: 'Feature',
            properties: { iata: 'AMD', name: 'Sardar Vallabhbhai Patel Intl', type: 'Intl' },
            geometry: { type: 'Point', coordinates: [72.6347, 23.0772] }
        },
        {
            type: 'Feature',
            properties: { iata: 'GOX', name: 'Manohar Intl', type: 'Intl' },
            geometry: { type: 'Point', coordinates: [73.8314, 15.3808] }
        },
        {
            type: 'Feature',
            properties: { iata: 'COK', name: 'Cochin Intl', type: 'Intl' },
            geometry: { type: 'Point', coordinates: [76.4019, 10.1520] }
        },
        {
            type: 'Feature',
            properties: { iata: 'PNQ', name: 'Pune Intl', type: 'Domestic' },
            geometry: { type: 'Point', coordinates: [73.9197, 18.5822] }
        },
        {
            type: 'Feature',
            properties: { iata: 'JAI', name: 'Jaipur Intl', type: 'Intl' },
            geometry: { type: 'Point', coordinates: [75.8092, 26.8242] }
        },
        {
            type: 'Feature',
            properties: { iata: 'LKO', name: 'Chaudhary Charan Singh Intl', type: 'Intl' },
            geometry: { type: 'Point', coordinates: [80.8893, 26.7606] }
        },
        {
            type: 'Feature',
            properties: { iata: 'GAU', name: 'Lokpriya Gopinath Bordoloi Intl', type: 'Intl' },
            geometry: { type: 'Point', coordinates: [91.5856, 26.1061] }
        },
        {
            type: 'Feature',
            properties: { iata: 'IXC', name: 'Chandigarh Intl', type: 'Domestic' },
            geometry: { type: 'Point', coordinates: [76.7885, 30.6735] }
        },
        {
            type: 'Feature',
            properties: { iata: 'TRV', name: 'Trivandrum Intl', type: 'Intl' },
            geometry: { type: 'Point', coordinates: [76.9201, 8.4821] }
        },
        {
            type: 'Feature',
            properties: { iata: 'PAT', name: 'Jay Prakash Narayan Intl', type: 'Domestic' },
            geometry: { type: 'Point', coordinates: [85.0880, 25.5913] }
        },
        {
            type: 'Feature',
            properties: { iata: 'NAG', name: 'Dr. Babasaheb Ambedkar Intl', type: 'Intl' },
            geometry: { type: 'Point', coordinates: [79.0472, 21.0922] }
        },
        {
            type: 'Feature',
            properties: { iata: 'BBI', name: 'Biju Patnaik Intl', type: 'Intl' },
            geometry: { type: 'Point', coordinates: [85.8178, 20.2444] }
        }
    ]
};
