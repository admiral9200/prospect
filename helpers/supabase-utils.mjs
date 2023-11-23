
import supabaseClient from '@/utils/supabase-client'; // Added import for Supabase client


export const update = async (id, data, errorName, isExport) => {
    const { error: error } = await supabaseClient
        .from(isExport ? 'csv_campaigns' : 'campaigns')
        .update(data)
        .eq('campaign_id', id);

    if (error) {
        console.log(`Error updating ${errorName}:`, error.message);
        throw new Error(`Error updating ${errorName}: ${error.message}`);
    }
}