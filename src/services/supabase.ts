import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LevelData } from '../entities/Level';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export interface OnlineMap {
    id: string | number;
    title: string;
    author: string;
    crazygames_user_id: string | null;
    level_data: LevelData;
    created_at: string;
    avg_rating?: number;
    total_ratings?: number;
    comments_count?: number;
}

export interface MapComment {
    id: string | number;
    map_id: string | number;
    author: string;
    comment: string;
    created_at: string;
}

export interface MapRating {
    map_id: string | number;
    user_id: string;
    rating: number;
}

let supabase: SupabaseClient | null = null;
let isUsingMock = true;

// Initialize Supabase Client
try {
    if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL') {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
        isUsingMock = false;
        console.log('Supabase service initialized successfully.');
    } else {
        console.warn('Supabase credentials missing. Using local storage mock database.');
    }
} catch (error) {
    console.error('Error initializing Supabase client:', error);
}

export function isRealSupabase(): boolean {
    return !isUsingMock && supabase !== null;
}

// -------------------------------------------------------------
// Mock Database Operations using LocalStorage
// -------------------------------------------------------------
const MOCK_MAPS_KEY = 'ballz_mock_online_maps';
const MOCK_RATINGS_KEY = 'ballz_mock_online_ratings';
const MOCK_COMMENTS_KEY = 'ballz_mock_online_comments';

function getMockMaps(): OnlineMap[] {
    const raw = localStorage.getItem(MOCK_MAPS_KEY);
    if (!raw) {
        // Seed with a default map if empty
        const defaultMaps: OnlineMap[] = [
            {
                id: 1,
                title: 'Fun Bounce!',
                author: 'CrazyGamer99',
                crazygames_user_id: 'mock-user-1',
                level_data: {
                    balls: [0, 2, 2, 4],
                    launcher: { x: 512, y: 700 },
                    portal: { x: 512, y: 150 },
                    stars: [
                        { x: 300, y: 400 },
                        { x: 512, y: 350 },
                        { x: 724, y: 400 }
                    ],
                    blocks: [
                        { x: 512, y: 500, type: 11 },
                        { x: 300, y: 500, type: 12 },
                        { x: 724, y: 500, type: 13 }
                    ],
                    spikes: [
                        { x: 512, y: 600 }
                    ]
                },
                created_at: new Date(Date.now() - 3600000 * 24).toISOString()
            },
            {
                id: 2,
                title: 'Matryoshka Split Heaven',
                author: 'SplitMaster',
                crazygames_user_id: 'mock-user-2',
                level_data: {
                    balls: [7, 7, 7],
                    launcher: { x: 150, y: 600 },
                    portal: { x: 850, y: 200 },
                    stars: [
                        { x: 500, y: 400 },
                        { x: 550, y: 350 }
                    ],
                    blocks: [
                        { x: 450, y: 450, type: 14 },
                        { x: 600, y: 300, type: 12 }
                    ],
                    spikes: []
                },
                created_at: new Date(Date.now() - 3600000 * 2).toISOString()
            }
        ];
        localStorage.setItem(MOCK_MAPS_KEY, JSON.stringify(defaultMaps));
        return defaultMaps;
    }
    return JSON.parse(raw);
}

function getMockRatings(): MapRating[] {
    const raw = localStorage.getItem(MOCK_RATINGS_KEY);
    if (!raw) {
        const defaultRatings: MapRating[] = [
            { map_id: 1, user_id: 'mock-user-2', rating: 5 },
            { map_id: 1, user_id: 'mock-user-3', rating: 4 },
            { map_id: 2, user_id: 'mock-user-1', rating: 3 }
        ];
        localStorage.setItem(MOCK_RATINGS_KEY, JSON.stringify(defaultRatings));
        return defaultRatings;
    }
    return JSON.parse(raw);
}

function getMockComments(): MapComment[] {
    const raw = localStorage.getItem(MOCK_COMMENTS_KEY);
    if (!raw) {
        const defaultComments: MapComment[] = [
            { id: 1, map_id: 1, author: 'SplitMaster', comment: 'Really fun bounce setup, loved it!', created_at: new Date().toISOString() },
            { id: 2, map_id: 2, author: 'CrazyGamer99', comment: 'Nice usage of the split ball!', created_at: new Date().toISOString() }
        ];
        localStorage.setItem(MOCK_COMMENTS_KEY, JSON.stringify(defaultComments));
        return defaultComments;
    }
    return JSON.parse(raw);
}

// -------------------------------------------------------------
// Core Database APIs
// -------------------------------------------------------------

export async function saveMap(
    title: string,
    author: string,
    cgUserId: string | null,
    levelData: LevelData
): Promise<{ data: any; error: any }> {
    const mapTitle = title.trim() || 'Unnamed Map';
    const mapAuthor = author.trim() || 'Guest';

    if (isUsingMock) {
        const maps = getMockMaps();
        const newId = maps.length > 0 ? Math.max(...maps.map(m => Number(m.id))) + 1 : 1;
        const newMap: OnlineMap = {
            id: newId,
            title: mapTitle,
            author: mapAuthor,
            crazygames_user_id: cgUserId,
            level_data: levelData,
            created_at: new Date().toISOString()
        };
        maps.unshift(newMap);
        localStorage.setItem(MOCK_MAPS_KEY, JSON.stringify(maps));
        return { data: newMap, error: null };
    }

    try {
        const { data, error } = await supabase!
            .from('ballz_map')
            .insert({
                title: mapTitle,
                author: mapAuthor,
                crazygames_user_id: cgUserId,
                level_data: levelData
            })
            .select()
            .single();

        return { data, error };
    } catch (e: any) {
        return { data: null, error: e.message || e };
    }
}

export async function getMaps(): Promise<{ data: OnlineMap[]; error: any }> {
    if (isUsingMock) {
        const maps = getMockMaps();
        const ratings = getMockRatings();
        const comments = getMockComments();

        // Enrich with rating aggregates and comment counts
        const enriched = maps.map(map => {
            const mapRatings = ratings.filter(r => r.map_id === map.id);
            const total = mapRatings.length;
            const avg = total > 0 ? mapRatings.reduce((sum, r) => sum + r.rating, 0) / total : 0;
            const commentsCount = comments.filter(c => c.map_id === map.id).length;

            return {
                ...map,
                avg_rating: Math.round(avg * 10) / 10,
                total_ratings: total,
                comments_count: commentsCount
            };
        });

        return { data: enriched, error: null };
    }

    try {
        // Load maps from Supabase
        const { data: mapsData, error: mapsError } = await supabase!
            .from('ballz_map')
            .select('*')
            .order('created_at', { ascending: false });

        if (mapsError) return { data: [], error: mapsError };

        // Fetch ratings and comments aggregations
        const maps: OnlineMap[] = [];

        for (const map of mapsData) {
            // Fetch rating count and average
            const { data: ratingData } = await supabase!
                .from('ballz_rating')
                .select('rating')
                .eq('map_id', map.id);

            const total = ratingData?.length || 0;
            const avg = total > 0 ? (ratingData?.reduce((sum, r) => sum + r.rating, 0) || 0) / total : 0;

            // Fetch comment count
            const { count: commentCount } = await supabase!
                .from('ballz_comment')
                .select('*', { count: 'exact', head: true })
                .eq('map_id', map.id);

            maps.push({
                ...map,
                avg_rating: Math.round(avg * 10) / 10,
                total_ratings: total,
                comments_count: commentCount || 0
            });
        }

        return { data: maps, error: null };
    } catch (e: any) {
        return { data: [], error: e.message || e };
    }
}

export async function getMapComments(mapId: string | number): Promise<{ data: MapComment[]; error: any }> {
    if (isUsingMock) {
        const comments = getMockComments().filter(c => c.map_id === mapId);
        // Sort descending by date
        comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return { data: comments, error: null };
    }

    try {
        const { data, error } = await supabase!
            .from('ballz_comment')
            .select('*')
            .eq('map_id', mapId)
            .order('created_at', { ascending: false });

        return { data: data || [], error };
    } catch (e: any) {
        return { data: [], error: e.message || e };
    }
}

export async function submitComment(
    mapId: string | number,
    author: string,
    commentText: string
): Promise<{ data: any; error: any }> {
    const cleanComment = commentText.trim();
    if (!cleanComment) return { data: null, error: 'Comment cannot be empty' };

    const cleanAuthor = author.trim() || 'Guest';

    if (isUsingMock) {
        const comments = getMockComments();
        const newId = comments.length > 0 ? Math.max(...comments.map(c => Number(c.id))) + 1 : 1;
        const newComment: MapComment = {
            id: newId,
            map_id: mapId,
            author: cleanAuthor,
            comment: cleanComment,
            created_at: new Date().toISOString()
        };
        comments.unshift(newComment);
        localStorage.setItem(MOCK_COMMENTS_KEY, JSON.stringify(comments));
        return { data: newComment, error: null };
    }

    try {
        const { data, error } = await supabase!
            .from('ballz_comment')
            .insert({
                map_id: mapId,
                author: cleanAuthor,
                comment: cleanComment
            })
            .select()
            .single();

        return { data, error };
    } catch (e: any) {
        return { data: null, error: e.message || e };
    }
}

export async function submitRating(
    mapId: string | number,
    userId: string,
    ratingValue: number
): Promise<{ data: any; error: any }> {
    const rating = Math.max(1, Math.min(5, Math.round(ratingValue)));

    if (isUsingMock) {
        const ratings = getMockRatings();
        const existingIdx = ratings.findIndex(r => r.map_id === mapId && r.user_id === userId);

        if (existingIdx > -1) {
            ratings[existingIdx].rating = rating;
        } else {
            ratings.push({ map_id: mapId, user_id: userId, rating });
        }

        localStorage.setItem(MOCK_RATINGS_KEY, JSON.stringify(ratings));
        return { data: { map_id: mapId, user_id: userId, rating }, error: null };
    }

    try {
        // Upsert rating
        const { data, error } = await supabase!
            .from('ballz_rating')
            .upsert(
                { map_id: mapId, user_id: userId, rating },
                { onConflict: 'map_id,user_id' }
            )
            .select()
            .single();

        return { data, error };
    } catch (e: any) {
        return { data: null, error: e.message || e };
    }
}

export async function getPlayerRatingForMap(
    mapId: string | number,
    userId: string
): Promise<number | null> {
    if (isUsingMock) {
        const ratings = getMockRatings();
        const found = ratings.find(r => r.map_id === mapId && r.user_id === userId);
        return found ? found.rating : null;
    }

    try {
        const { data, error } = await supabase!
            .from('ballz_rating')
            .select('rating')
            .eq('map_id', mapId)
            .eq('user_id', userId)
            .maybeSingle();

        if (error || !data) return null;
        return data.rating;
    } catch (e) {
        return null;
    }
}
