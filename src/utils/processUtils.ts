
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
 * Generates a unique process number in the format ER-YYMM-00001
 * Where YYMM is the current year and month, and 00001 is a sequential counter
 * @returns Process number string
 */
export function generateProcessNumber(): string {
  const now = new Date();
  const prefix = 'ER';
  
  // Format year and month as YYMM
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const datePart = `${year}${month}`;
  
  // In a real implementation, this counter would be stored in and fetched from a database
  // For this demo, we're using a simple incrementing variable
  dailyCounter += 1;
  
  // Format counter as 5 digits
  const counterPart = String(dailyCounter).padStart(5, '0');
  
  return `${prefix}-${datePart}-${counterPart}`;
}

/**
 * Validates if a process number follows the correct format (ER-YYMM-00001)
 * @param processNumber The process number to validate
 * @returns Boolean indicating if the process number is valid
 */
export function isValidProcessNumber(processNumber: string): boolean {
  // Format: ER-YYMM-00001 where YY is year, MM is 01-12, and 00001 is any 5 digits
  const regex = /^ER-\d{2}(0[1-9]|1[0-2])-\d{5}$/;
  return regex.test(processNumber);
}

/**
 * Gets the current daily counter value
 * @returns Current counter value
 */
export function getCurrentCounter(): number {
  return dailyCounter;
}

/**
 * Sets the daily counter to a specific value
 * @param value The value to set the counter to
 */
export function setDailyCounter(value: number): void {
  dailyCounter = value;
}
