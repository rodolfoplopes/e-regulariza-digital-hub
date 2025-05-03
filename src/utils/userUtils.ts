
/**
 * Utility functions for user management in the e-regulariza platform
 */

/**
 * Creates a hash of the CPF for secure storage
 * In a production environment, this would use a secure hashing algorithm
 * @param cpf The CPF to hash
 * @returns Hashed CPF string
 */
export async function createCPFHash(cpf: string): Promise<string> {
  // Remove non-numeric characters
  const cpfClean = cpf.replace(/\D/g, '');
  
  // In a real implementation, we'd use a secure hashing algorithm like SHA-256
  // For this demo, we'll use a simple Base64 encoding (not secure, just for demonstration)
  const encoder = new TextEncoder();
  const data = encoder.encode(cpfClean);
  
  // This is using the Web Crypto API for a more secure hash
  // In production, you'd want to use a salt and proper security measures
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert the hash to a Base64 string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Validates a CPF number according to Brazilian rules
 * @param cpf The CPF to validate
 * @returns Boolean indicating if the CPF is valid
 */
export function validateCPF(cpf: string): boolean {
  // Remove non-numeric characters
  const cpfClean = cpf.replace(/\D/g, '');
  
  // Check if length is 11
  if (cpfClean.length !== 11) {
    return false;
  }

  // Check if all digits are the same (invalid CPF)
  if (/^(\d)\1{10}$/.test(cpfClean)) {
    return false;
  }

  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpfClean.charAt(i)) * (10 - i);
  }
  let checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) {
    checkDigit = 0;
  }
  if (checkDigit !== parseInt(cpfClean.charAt(9))) {
    return false;
  }

  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpfClean.charAt(i)) * (11 - i);
  }
  checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) {
    checkDigit = 0;
  }
  if (checkDigit !== parseInt(cpfClean.charAt(10))) {
    return false;
  }

  return true;
}

/**
 * Formats a CPF string in the standard Brazilian format (000.000.000-00)
 * @param cpf The raw CPF string (numbers only)
 * @returns Formatted CPF string
 */
export function formatCPF(cpf: string): string {
  // Remove non-numeric characters
  const cpfClean = cpf.replace(/\D/g, '');
  
  if (cpfClean.length <= 3) {
    return cpfClean;
  }
  
  if (cpfClean.length <= 6) {
    return `${cpfClean.slice(0, 3)}.${cpfClean.slice(3)}`;
  }
  
  if (cpfClean.length <= 9) {
    return `${cpfClean.slice(0, 3)}.${cpfClean.slice(3, 6)}.${cpfClean.slice(6)}`;
  }
  
  return `${cpfClean.slice(0, 3)}.${cpfClean.slice(3, 6)}.${cpfClean.slice(6, 9)}-${cpfClean.slice(9, 11)}`;
}
