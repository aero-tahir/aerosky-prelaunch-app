export interface FlightMarker {
    id: string;
    lat: number;
    lng: number;
    heading: number;
}

export interface Airport {
    iata: string;
    lat: number;
    lng: number;
}
