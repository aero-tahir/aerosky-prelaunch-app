const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');

export interface LoginResponse {
    token: string;
    email: string;
}

export const AuthService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        return data;
    },

    async verify(): Promise<boolean> {
        const token = localStorage.getItem('authToken');
        if (!token) return false;

        try {
            const response = await fetch(`${API_URL}/api/verify`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.ok;
        } catch {
            return false;
        }
    },

    logout(): void {
        localStorage.removeItem('authToken');
    },

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }
};
