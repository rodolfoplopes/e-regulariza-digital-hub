
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { data, action } = await req.json();
    const sheetsApiKey = Deno.env.get('GOOGLE_SHEETS_API_KEY');
    const spreadsheetId = Deno.env.get('GOOGLE_SHEETS_SPREADSHEET_ID');

    if (!sheetsApiKey || !spreadsheetId) {
      throw new Error('Google Sheets API key or Spreadsheet ID not configured');
    }

    console.log('Google Sheets integration action:', action);
    console.log('Data received:', data);

    let result;

    switch (action) {
      case 'append':
        result = await appendToSheet(data, sheetsApiKey, spreadsheetId);
        break;
      case 'update':
        result = await updateSheet(data, sheetsApiKey, spreadsheetId);
        break;
      case 'read':
        result = await readFromSheet(sheetsApiKey, spreadsheetId);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Google Sheets integration error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});

async function appendToSheet(data: any, apiKey: string, spreadsheetId: string) {
  // Convert process data to row format
  const row = [
    data.process_number || '',
    data.title || '',
    data.client?.name || '',
    data.client?.email || '',
    data.process_type?.name || '',
    data.status || '',
    data.progress || 0,
    new Date(data.created_at).toLocaleDateString('pt-BR'),
    new Date(data.updated_at).toLocaleDateString('pt-BR'),
    data.deadline ? new Date(data.deadline).toLocaleDateString('pt-BR') : ''
  ];

  const requestBody = {
    values: [row]
  };

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1:append?valueInputOption=RAW&key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }
  );

  if (!response.ok) {
    throw new Error(`Google Sheets append failed: ${response.statusText}`);
  }

  return await response.json();
}

async function updateSheet(data: any, apiKey: string, spreadsheetId: string) {
  // First, check if headers exist, if not, create them
  const headers = [
    'Número do Processo',
    'Título',
    'Cliente',
    'Email',
    'Tipo',
    'Status',
    'Progresso (%)',
    'Data Criação',
    'Última Atualização',
    'Prazo'
  ];

  const requestBody = {
    values: [headers]
  };

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:J1?valueInputOption=RAW&key=${apiKey}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }
  );

  if (!response.ok) {
    throw new Error(`Google Sheets header update failed: ${response.statusText}`);
  }

  return await response.json();
}

async function readFromSheet(apiKey: string, spreadsheetId: string) {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1?key=${apiKey}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Google Sheets read failed: ${response.statusText}`);
  }

  return await response.json();
}
