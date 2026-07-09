// CrazyGames SDK Integration Service

export interface CrazyUser {
    username: string;
    profilePictureUrl: string;
}

let isInitialized = false;

declare global {
    interface Window {
        CrazyGames?: {
            SDK: {
                init: () => Promise<void>;
                user: {
                    isUserAccountAvailable: () => Promise<boolean>;
                    getUser: (callback?: (err: any, user: CrazyUser | null) => void) => Promise<CrazyUser | null>;
                    showAuthPrompt: () => Promise<CrazyUser | null>;
                    addAuthListener: (callback: (user: CrazyUser | null) => void) => void;
                    removeAuthListener: (callback: (user: CrazyUser | null) => void) => void;
                };
                game: {
                    gameplayStart: () => void;
                    gameplayStop: () => void;
                    happytime: () => void;
                    loadingStart: () => void;
                    loadingStop: () => void;
                };
            };
        };
    }
}

export async function initCrazyGames(): Promise<boolean> {
    if (isInitialized) return true;
    if (typeof window === 'undefined' || !window.CrazyGames) {
        console.warn('CrazyGames SDK not found on window object.');
        return false;
    }

    try {
        await window.CrazyGames.SDK.init();
        isInitialized = true;
        console.log('CrazyGames SDK initialized successfully');
        return true;
    } catch (e) {
        console.error('Failed to initialize CrazyGames SDK:', e);
        return false;
    }
}

export function isSDKAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.CrazyGames;
}

export async function isUserAccountAvailable(): Promise<boolean> {
    if (!isSDKAvailable()) return false;
    try {
        const user = window.CrazyGames!.SDK.user as any;
        if (typeof user.isUserAccountAvailable === 'function') {
            return await user.isUserAccountAvailable();
        } else if (user.system && typeof user.system.isUserAccountAvailable === 'function') {
            return await user.system.isUserAccountAvailable();
        } else if (typeof user.isUserAccountAvailable === 'boolean') {
            return user.isUserAccountAvailable;
        } else {
            console.warn('isUserAccountAvailable not found as a function on SDK.user. Assuming true to allow user auth flow attempt.');
            return true; 
        }
    } catch (e) {
        console.error('Error checking isUserAccountAvailable:', e);
        return false;
    }
}

export async function getCrazyUser(): Promise<CrazyUser | null> {
    if (!isSDKAvailable()) return null;
    try {
        const available = await isUserAccountAvailable();
        if (!available) return null;
        return await window.CrazyGames!.SDK.user.getUser();
    } catch (e) {
        console.error('Error in getCrazyUser:', e);
        return null;
    }
}

export async function showCrazyAuthPrompt(): Promise<CrazyUser | null> {
    if (!isSDKAvailable()) return null;
    try {
        const available = await isUserAccountAvailable();
        if (!available) {
            alert('User Account system is not available in this environment.');
            return null;
        }
        return await window.CrazyGames!.SDK.user.showAuthPrompt();
    } catch (e: any) {
        console.warn('CrazyGames Auth prompt rejected/cancelled:', e);
        return null;
    }
}

export function gameplayStart() {
    if (isSDKAvailable()) {
        try {
            window.CrazyGames!.SDK.game.gameplayStart();
        } catch (e) {
            console.error('Error calling gameplayStart:', e);
        }
    }
}

export function gameplayStop() {
    if (isSDKAvailable()) {
        try {
            window.CrazyGames!.SDK.game.gameplayStop();
        } catch (e) {
            console.error('Error calling gameplayStop:', e);
        }
    }
}

export function happytime() {
    if (isSDKAvailable()) {
        try {
            window.CrazyGames!.SDK.game.happytime();
        } catch (e) {
            console.error('Error calling happytime:', e);
        }
    }
}

export function loadingStart() {
    if (isSDKAvailable()) {
        try {
            window.CrazyGames!.SDK.game.loadingStart();
        } catch (e) {
            console.error('Error calling loadingStart:', e);
        }
    }
}

export function loadingStop() {
    if (isSDKAvailable()) {
        try {
            window.CrazyGames!.SDK.game.loadingStop();
        } catch (e) {
            console.error('Error calling loadingStop:', e);
        }
    }
}
