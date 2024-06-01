/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns number
 */
export function getRandomFloat(min, max) {
    // Ensure min <= max for valid range
    if (min > max) {
      [min, max] = [max, min]; // Swap values if min is greater than max
    }
    return min + (max - min) * Math.random();
  }

/**
 * 
 * @param {integer} min 
 * @param {integer} max 
 * @returns integer
 */
  export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

/**
 * 
 * @param {number} ms 
 */
export async function timer(ms) {
    return new Promise(res => {
        setTimeout(() => res(), ms)
    })
}