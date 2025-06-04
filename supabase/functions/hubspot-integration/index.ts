
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HubSpotContact {
  properties: {
    email: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    company?: string;
  };
}

interface HubSpotDeal {
  properties: {
    dealname: string;
    amount?: string;
    dealstage?: string;
    closedate?: string;
  };
  associations?: {
    contacts: { id: string }[];
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data, action } = await req.json();
    const hubspotApiKey = Deno.env.get('HUBSPOT_API_KEY');

    if (!hubspotApiKey) {
      throw new Error('HubSpot API key not configured');
    }

    console.log('HubSpot integration action:', action);
    console.log('Data received:', data);

    let result;

    switch (action) {
      case 'sync_contact':
        result = await syncContact(data, hubspotApiKey);
        break;
      case 'sync_deal':
        result = await syncDeal(data, hubspotApiKey);
        break;
      case 'sync':
        // Sync process data as both contact and deal
        result = await syncProcessData(data, hubspotApiKey);
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
    console.error('HubSpot integration error:', error);
    
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

async function syncContact(contactData: any, apiKey: string) {
  const hubspotContact: HubSpotContact = {
    properties: {
      email: contactData.email,
      firstname: contactData.name?.split(' ')[0] || '',
      lastname: contactData.name?.split(' ').slice(1).join(' ') || '',
      phone: contactData.phone || '',
      company: 'e-regulariza Client'
    }
  };

  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hubspotContact)
  });

  if (!response.ok) {
    // If contact already exists, try to update
    if (response.status === 409) {
      return await updateContactByEmail(contactData.email, hubspotContact.properties, apiKey);
    }
    throw new Error(`HubSpot contact sync failed: ${response.statusText}`);
  }

  return await response.json();
}

async function updateContactByEmail(email: string, properties: any, apiKey: string) {
  const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ properties })
  });

  if (!response.ok) {
    throw new Error(`HubSpot contact update failed: ${response.statusText}`);
  }

  return await response.json();
}

async function syncDeal(dealData: any, apiKey: string) {
  const hubspotDeal: HubSpotDeal = {
    properties: {
      dealname: `Processo ${dealData.process_number} - ${dealData.title}`,
      amount: dealData.amount || '0',
      dealstage: mapStatusToDealStage(dealData.status),
      closedate: dealData.deadline || undefined
    }
  };

  const response = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hubspotDeal)
  });

  if (!response.ok) {
    throw new Error(`HubSpot deal sync failed: ${response.statusText}`);
  }

  return await response.json();
}

async function syncProcessData(processData: any, apiKey: string) {
  console.log('Syncing process data:', processData);

  // First sync the contact
  const contactResult = await syncContact(processData.client, apiKey);
  console.log('Contact synced:', contactResult);

  // Then sync the deal
  const dealResult = await syncDeal(processData, apiKey);
  console.log('Deal synced:', dealResult);

  return {
    contact: contactResult,
    deal: dealResult
  };
}

function mapStatusToDealStage(status: string): string {
  const stageMap: Record<string, string> = {
    'pendente': 'qualifiedtobuy',
    'em_andamento': 'presentationscheduled',
    'concluido': 'closedwon',
    'rejeitado': 'closedlost'
  };

  return stageMap[status] || 'qualifiedtobuy';
}
