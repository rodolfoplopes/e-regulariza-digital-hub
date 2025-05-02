
/**
 * Utilities for process management in the e-regulariza platform
 */

/**
 * Generates a unique process number in the format ER-YYMM-XXXX
 * @returns Process number string
 */
export function generateProcessNumber(): string {
  const now = new Date();
  const prefix = 'ER';
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  // In a real implementation, this would fetch the latest sequence from the database
  // For demo purposes, we'll generate a random 4-digit sequence
  const sequence = Math.floor(1000 + Math.random() * 9000).toString();
  
  return `${prefix}-${year}${month}-${sequence}`;
}

/**
 * Validates if a process number follows the correct format
 * @param processNumber The process number to validate
 * @returns Boolean indicating if the process number is valid
 */
export function isValidProcessNumber(processNumber: string): boolean {
  const regex = /^ER-\d{4}-\d{4}$/;
  return regex.test(processNumber);
}
