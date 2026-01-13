
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiscordUser } from '../types';

interface DiscordContextType {
    discordUser: DiscordUser | null;
    setDiscordUser: (user: DiscordUser | null) => void;
    isLoading: boolean;
    logout: () => void;
    login: () => void;
    manageSubscription: () => Promise<void>;
    isProcessingAuth: boolean;
}

const DiscordContext = createContext<DiscordContextType | undefined>(undefined);

export const DiscordProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessingAuth, setIsProcessingAuth] = useState(false);
    const navigate = useNavigate();

    // Load from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('discordUser');
        if (savedUser) {
            try {
                setDiscordUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Failed to parse saved Discord user:', e);
                localStorage.removeItem('discordUser');
            }
        }
        setIsLoading(false);
    }, []);

    // Sync to localStorage
    useEffect(() => {
        if (discordUser) {
            localStorage.setItem('discordUser', JSON.stringify(discordUser));
        } else {
            localStorage.removeItem('discordUser');
        }
    }, [discordUser]);

    // Global handler for OAuth code in URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code && !discordUser && !isProcessingAuth) {
            setIsProcessingAuth(true);

            // Clean up URL (BrowserRouter uses pathname)
            const cleanPath = window.location.pathname;

            // If we are on /auth/callback, we need to redirect
            if (cleanPath === '/auth/callback' || cleanPath === '/auth/callback/') {
                const returnTo = localStorage.getItem('returnTo');
                // Default to /pricing if no returnTo
                const targetPath = returnTo || '/pricing';
                localStorage.removeItem('returnTo');

                navigate(targetPath, { replace: true });
            } else {
                // Just clean the query params
                navigate(cleanPath, { replace: true });
            }

            fetch(`http://localhost:3001/api/discord/callback?code=${code}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.user) {
                        setDiscordUser(data.user);
                    }
                })
                .catch(err => {
                    console.error('Discord OAuth error:', err);
                })
                .finally(() => {
                    setIsProcessingAuth(false);
                });
        }
    }, [discordUser, isProcessingAuth]);

    const logout = () => {
        setDiscordUser(null);
    };

    const login = () => {
        // Store current location to return to in localStorage
        const currentPath = window.location.pathname;
        if (currentPath && !currentPath.includes('callback') && currentPath !== '/') {
            localStorage.setItem('returnTo', currentPath);
        }

        // Redirection logic should be centralized or passed in, but for now we default to redirecting back to current page.
        // However, the callback needs to land on a real route.
        const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
        const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:3000';
        const redirectUri = `${SITE_URL}/auth/callback`;
        const scope = 'identify email';
        const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;

        window.location.href = authUrl;
    };

    const manageSubscription = async () => {
        if (!discordUser) return;

        try {
            const response = await fetch('http://localhost:3001/api/stripe/portal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    discordUserId: discordUser.id,
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Failed to open subscription portal. Do you have an active subscription?');
            }
        } catch (error) {
            console.error('Error opening portal:', error);
            alert('Failed to connect to billing server.');
        }
    };

    return (
        <DiscordContext.Provider value={{ discordUser, setDiscordUser, isLoading, logout, login, manageSubscription, isProcessingAuth }}>
            {children}
        </DiscordContext.Provider>
    );
};

export const useDiscordUser = () => {
    const context = useContext(DiscordContext);
    if (context === undefined) {
        throw new Error('useDiscordUser must be used within a DiscordProvider');
    }
    return context;
};
