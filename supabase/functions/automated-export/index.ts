
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting automated export process...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get processes from the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data: processes, error } = await supabase
      .from('processes')
      .select(`
        process_number,
        title,
        status,
        progress,
        created_at,
        updated_at,
        deadline,
        process_type:process_types(name),
        client:profiles(name, email)
      `)
      .gte('created_at', oneWeekAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    console.log(`Found ${processes.length} processes from the last week`);

    // Check if integrations are enabled
    const { data: settings } = await supabase
      .from('system_settings')
      .select('key, value')
      .in('key', ['sheets_auto_export', 'hubspot_enabled']);

    const settingsMap = settings?.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>) || {};

    const results = [];

    // Export to Google Sheets if enabled
    if (settingsMap.sheets_auto_export === 'true') {
      console.log('Exporting to Google Sheets...');
      
      for (const process of processes) {
        try {
          const { data: sheetResult } = await supabase.functions.invoke('sheets-integration', {
            body: { 
              data: process, 
              action: 'append' 
            }
          });
          
          if (sheetResult?.success) {
            results.push({ type: 'sheets', process: process.process_number, success: true });
          }
        } catch (error) {
          console.error(`Failed to export process ${process.process_number} to Sheets:`, error);
          results.push({ type: 'sheets', process: process.process_number, success: false, error: error.message });
        }
      }
    }

    // Export to HubSpot if enabled
    if (settingsMap.hubspot_enabled === 'true') {
      console.log('Exporting to HubSpot...');
      
      for (const process of processes) {
        try {
          const { data: hubspotResult } = await supabase.functions.invoke('hubspot-integration', {
            body: { 
              data: process, 
              action: 'sync' 
            }
          });
          
          if (hubspotResult?.success) {
            results.push({ type: 'hubspot', process: process.process_number, success: true });
          }
        } catch (error) {
          console.error(`Failed to export process ${process.process_number} to HubSpot:`, error);
          results.push({ type: 'hubspot', process: process.process_number, success: false, error: error.message });
        }
      }
    }

    // Log the export activity
    await supabase
      .from('system_settings')
      .upsert({
        key: 'last_automated_export',
        value: new Date().toISOString(),
        description: `Exported ${processes.length} processes`
      });

    console.log('Automated export completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        exported: processes.length,
        results: results,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Automated export error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
