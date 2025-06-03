
import { supabase } from '@/integrations/supabase/client';

/**
 * Generates a unique process number using the database function
 * @returns Process number string in format ER-YYMM-00001
 */
export async function generateProcessNumber(): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('generate_process_number');
    
    if (error) {
      console.error('Error generating process number:', error);
      throw new Error('Erro ao gerar número do processo');
    }
    
    return data;
  } catch (error) {
    console.error('Error generating process number:', error);
    throw new Error('Erro ao gerar número do processo');
  }
}

/**
 * Validates if a process number follows the correct format (ER-YYMM-00001)
 * @param processNumber The process number to validate
 * @returns Boolean indicating if the process number is valid
 */
export function isValidProcessNumber(processNumber: string): boolean {
  const regex = /^ER-\d{2}(0[1-9]|1[0-2])-\d{5}$/;
  return regex.test(processNumber);
}

/**
 * Gets the current counter for the current month
 * @returns Current counter value
 */
export async function getCurrentCounter(): Promise<number> {
  try {
    const currentYM = new Date().toISOString().slice(2, 7).replace('-', ''); // YYMM format
    
    const { data, error } = await supabase
      .from('process_counter')
      .select('counter')
      .eq('year_month', currentYM)
      .maybeSingle(); // Use maybeSingle to avoid errors when no data is found
    
    if (error) {
      console.error('Error fetching counter:', error);
      return 0;
    }
    
    return data?.counter || 0;
  } catch (error) {
    console.error('Error fetching counter:', error);
    return 0;
  }
}

/**
 * Generates a preview process number for display purposes (synchronous)
 * @returns Promise that resolves to process number string
 */
export async function previewProcessNumber(): Promise<string> {
  try {
    const currentCounter = await getCurrentCounter();
    const currentYM = new Date().toISOString().slice(2, 7).replace('-', ''); // YYMM format
    const nextCounter = currentCounter + 1;
    
    return `ER-${currentYM}-${nextCounter.toString().padStart(5, '0')}`;
  } catch (error) {
    console.error('Error generating preview process number:', error);
    const currentYM = new Date().toISOString().slice(2, 7).replace('-', ''); // YYMM format
    return `ER-${currentYM}-00001`;
  }
}
