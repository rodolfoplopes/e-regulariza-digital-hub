
/**
 * Utilities for process management in the e-regulariza platform
 */

/**
 * Counter for daily processes - in a real implementation, 
 * this would be stored in and retrieved from a database
 */
let dailyCounter = 0;

/**
 * Resets the daily counter - this would be triggered by a cron job or similar
 * in a production environment with proper persistence
 */
export function resetDailyCounter(): void {
  dailyCounter = 0;
}

/**
 * Generates a unique process number in the format ER-DDMM-XXXX
 * Where DDMM is the current day and month, and XXXX is a sequential counter
 * @returns Process number string
 */
export function generateProcessNumber(): string {
  const now = new Date();
  const prefix = 'ER';
  
  // Format day and month as DDMM
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const datePart = `${day}${month}`;
  
  // In a real implementation, this counter would be stored in and fetched from a database
  // For this demo, we're using a simple incrementing variable
  dailyCounter += 1;
  
  // Format counter as 4 digits
  const counterPart = String(dailyCounter).padStart(4, '0');
  
  return `${prefix}-${datePart}-${counterPart}`;
}

/**
 * Validates if a process number follows the correct format (ER-DDMM-XXXX)
 * @param processNumber The process number to validate
 * @returns Boolean indicating if the process number is valid
 */
export function isValidProcessNumber(processNumber: string): boolean {
  // Format: ER-DDMM-XXXX where DD is 01-31, MM is 01-12, and XXXX is any 4 digits
  const regex = /^ER-([0-2][1-9]|3[0-1])(0[1-9]|1[0-2])-\d{4}$/;
  return regex.test(processNumber);
}
