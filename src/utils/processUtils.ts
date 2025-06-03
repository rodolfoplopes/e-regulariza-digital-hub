
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
      .single();
    
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
