export interface PlanespottersPhoto {
    id: string;
    thumbnail_large: {
        src: string;
        size: { width: number; height: number };
    };
    link: string;
    photographer: string;
}

export interface PlanespottersResponse {
    photos: PlanespottersPhoto[];
}

export const PlanespottersService = {
    fetchPhoto: async (registration: string): Promise<string | null> => {
        if (!registration || registration === 'N/A' || registration.includes('?')) return null;

        try {
            const response = await fetch(`https://api.planespotters.net/pub/photos/reg/${registration}`);
            if (!response.ok) return null;

            const data: PlanespottersResponse = await response.json();
            if (data.photos && data.photos.length > 0) {
                return data.photos[0].thumbnail_large.src;
            }
            return null;
        } catch (error) {
            console.error('Failed to fetch Planespotters photo', error);
            return null;
        }
    }
};
