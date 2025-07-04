/**
 * Random Digit String Generator
 * Generates random digit strings like "685556676" with customizable length
 */

export interface RandomDigitOptions {
  length?: number; // Number of digits to generate
  allowLeadingZero?: boolean; // Allow the first digit to be 0
  minDigit?: number; // Minimum digit value (0-9)
  maxDigit?: number; // Maximum digit value (0-9)
  customPattern?: string; // Custom pattern with placeholders
}

export class RandomDigits {
  /**
   * Generate a random digit string
   * @param length Number of digits (default: 9)
   * @param allowLeadingZero Allow first digit to be 0 (default: false)
   * @returns Random digit string
   */
  static generate(
    length: number = 9,
    allowLeadingZero: boolean = false
  ): string {
    if (length <= 0) throw new Error("Length must be positive");

    let result = "";

    for (let i = 0; i < length; i++) {
      if (i === 0 && !allowLeadingZero) {
        // First digit: 1-9 (no leading zero)
        result += Math.floor(Math.random() * 9) + 1;
      } else {
        // Other digits: 0-9
        result += Math.floor(Math.random() * 10);
      }
    }

    return result;
  }

  /**
   * Generate multiple random digit strings
   * @param count Number of strings to generate
   * @param length Length of each string
   * @param allowLeadingZero Allow leading zeros
   * @returns Array of random digit strings
   */
  static generateMultiple(
    count: number = 5,
    length: number = 9,
    allowLeadingZero: boolean = false
  ): string[] {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      results.push(this.generate(length, allowLeadingZero));
    }
    return results;
  }

  /**
   * Generate with custom digit range
   * @param length Number of digits
   * @param minDigit Minimum digit (0-9)
   * @param maxDigit Maximum digit (0-9)
   * @param allowLeadingZero Allow leading zeros
   * @returns Random digit string within range
   */
  static generateWithRange(
    length: number = 9,
    minDigit: number = 0,
    maxDigit: number = 9,
    allowLeadingZero: boolean = false
  ): string {
    if (length <= 0) throw new Error("Length must be positive");
    if (minDigit < 0 || minDigit > 9) throw new Error("MinDigit must be 0-9");
    if (maxDigit < 0 || maxDigit > 9) throw new Error("MaxDigit must be 0-9");
    if (minDigit > maxDigit)
      throw new Error("MinDigit cannot be greater than MaxDigit");

    let result = "";

    for (let i = 0; i < length; i++) {
      if (i === 0 && !allowLeadingZero && minDigit === 0) {
        // First digit: max(1, minDigit) to maxDigit
        const firstMin = Math.max(1, minDigit);
        result +=
          Math.floor(Math.random() * (maxDigit - firstMin + 1)) + firstMin;
      } else {
        // Other digits: minDigit to maxDigit
        result +=
          Math.floor(Math.random() * (maxDigit - minDigit + 1)) + minDigit;
      }
    }

    return result;
  }

  /**
   * Generate with pattern (e.g., "XXX-XXX-XXXX" where X = random digit)
   * @param pattern Pattern string with X as placeholder for random digits
   * @param allowLeadingZero Allow leading zeros in digit groups
   * @returns Formatted string with random digits
   */
  static generateWithPattern(
    pattern: string = "XXXXXXXXX",
    allowLeadingZero: boolean = false
  ): string {
    let result = "";
    let isFirstDigitInGroup = true;

    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i];

      if (char === "X" || char === "x") {
        if (isFirstDigitInGroup && !allowLeadingZero) {
          // First digit in a group: 1-9
          result += Math.floor(Math.random() * 9) + 1;
          isFirstDigitInGroup = false;
        } else {
          // Other digits: 0-9
          result += Math.floor(Math.random() * 10);
        }
      } else {
        // Non-digit character (separator)
        result += char;
        isFirstDigitInGroup = true; // Next X will be first in new group
      }
    }

    return result;
  }

  /**
   * Generate phone number style
   * @param format Phone format (default: "XXX-XXX-XXXX")
   * @returns Phone number style string
   */
  static generatePhone(format: string = "XXX-XXX-XXXX"): string {
    return this.generateWithPattern(format, false);
  }

  /**
   * Generate ID number style
   * @param length Length of ID (default: 10)
   * @param includeHyphens Add hyphens for formatting
   * @returns ID number style string
   */
  static generateId(
    length: number = 10,
    includeHyphens: boolean = false
  ): string {
    if (includeHyphens && length >= 6) {
      const pattern = "XXX-XX-" + "X".repeat(length - 5);
      return this.generateWithPattern(pattern, false);
    }
    return this.generate(length, false);
  }

  /**
   * Generate with custom options
   * @param options Configuration options
   * @returns Random digit string based on options
   */
  static generateWithOptions(options: RandomDigitOptions = {}): string {
    const {
      length = 9,
      allowLeadingZero = false,
      minDigit = 0,
      maxDigit = 9,
      customPattern,
    } = options;

    if (customPattern) {
      return this.generateWithPattern(customPattern, allowLeadingZero);
    }

    if (minDigit !== 0 || maxDigit !== 9) {
      return this.generateWithRange(
        length,
        minDigit,
        maxDigit,
        allowLeadingZero
      );
    }

    return this.generate(length, allowLeadingZero);
  }

  /**
   * Generate random number as actual number (not string)
   * @param length Number of digits
   * @param allowLeadingZero Allow leading zeros (will be lost in number)
   * @returns Random number
   */
  static generateAsNumber(
    length: number = 9,
    allowLeadingZero: boolean = false
  ): number {
    const digitString = this.generate(length, allowLeadingZero);
    return parseInt(digitString, 10);
  }

  /**
   * Generate array of random digits (individual digits)
   * @param length Number of digits
   * @param allowLeadingZero Allow first digit to be 0
   * @returns Array of individual digits
   */
  static generateAsArray(
    length: number = 9,
    allowLeadingZero: boolean = false
  ): number[] {
    const digitString = this.generate(length, allowLeadingZero);
    return digitString.split("").map((d) => parseInt(d, 10));
  }
}

// Usage examples and tests
export function examples() {
  console.log("=== Random Digit String Generator Examples ===\n");

  // Basic generation like "685556676"
  console.log("9-digit strings (like 685556676):");
  for (let i = 0; i < 5; i++) {
    console.log(RandomDigits.generate(9));
  }

  // Different lengths
  console.log("\nDifferent lengths:");
  console.log("3 digits:", RandomDigits.generate(3));
  console.log("6 digits:", RandomDigits.generate(6));
  console.log("12 digits:", RandomDigits.generate(12));
  console.log("15 digits:", RandomDigits.generate(15));

  // Allow leading zeros
  console.log("\nWith leading zeros allowed:");
  for (let i = 0; i < 3; i++) {
    console.log(RandomDigits.generate(8, true));
  }

  // Generate multiple at once
  console.log("\nGenerate 5 strings at once:");
  const multiple = RandomDigits.generateMultiple(5, 9);
  multiple.forEach((str, index) => console.log(`${index + 1}: ${str}`));

  // Custom digit ranges
  console.log("\nOnly digits 1-5:");
  console.log(RandomDigits.generateWithRange(10, 1, 5));
  console.log(RandomDigits.generateWithRange(10, 1, 5));

  // Pattern-based generation
  console.log("\nPattern-based generation:");
  console.log("Phone style:", RandomDigits.generatePhone("XXX-XXX-XXXX"));
  console.log("ID style:", RandomDigits.generateId(10, true));
  console.log(
    "Custom pattern:",
    RandomDigits.generateWithPattern("XX-XX-XX-XX")
  );
  console.log(
    "Credit card style:",
    RandomDigits.generateWithPattern("XXXX-XXXX-XXXX-XXXX")
  );

  // As numbers and arrays
  console.log("\nDifferent output formats:");
  console.log("As number:", RandomDigits.generateAsNumber(8));
  console.log("As array:", RandomDigits.generateAsArray(6));

  // Using options
  console.log("\nUsing custom options:");
  console.log(
    RandomDigits.generateWithOptions({
      length: 12,
      minDigit: 2,
      maxDigit: 8,
      allowLeadingZero: false,
    })
  );

  console.log(
    RandomDigits.generateWithOptions({
      customPattern: "XXX.XXX.XXX",
      allowLeadingZero: true,
    })
  );

  // Various lengths like your example
  console.log("\nVarious lengths:");
  console.log("Short (4):", RandomDigits.generate(4));
  console.log("Medium (9):", RandomDigits.generate(9)); // Like your 685556676
  console.log("Long (16):", RandomDigits.generate(16));
  console.log("Very long (25):", RandomDigits.generate(25));
}

// Export default
export default RandomDigits;
