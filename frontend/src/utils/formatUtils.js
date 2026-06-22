/**
 * Global formatting utilities for numbers and currency
 * Provides consistent K/M notation across the application
 */

import { getCurrencySymbol } from '../config/currencyConfig'

/**
 * Format large numbers with K/M notation
 * @param {number|string} value - The value to format
 * @returns {string} Formatted number with K/M notation (e.g., 1.5K, 2.3M)
 */
export const formatLargeNumber = (value) => {
  const num = Number(value)
  if (isNaN(num) || num === 0) return '0'
  
  const absValue = Math.abs(num)
  const sign = num < 0 ? '-' : ''
  
  const tiers = [
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' }
  ]
  
  const tier = tiers.find(t => absValue >= t.value)
  
  if (tier) {
    const formatted = (absValue / tier.value).toFixed(1)
    return `${sign}${parseFloat(formatted)}${tier.symbol}`
  }
  
  return `${sign}${absValue}`
}

/**
 * Format currency with K/M notation
 * @param {number|string} value - The value to format
 * @param {string} currencyCode - Currency code (default: 'USD')
 * @returns {string} Formatted currency with K/M notation (e.g., $1.5K, €2.3M)
 */
export const formatCurrency = (value, currencyCode = 'USD') => {
  const num = Number(value)
  if (isNaN(num) || num === 0) return `${getCurrencySymbol(currencyCode)}0`
  return `${getCurrencySymbol(currencyCode)}${formatLargeNumber(value)}`
}

/**
 * Format number with delimiters (alias for formatLargeNumber)
 * @param {number|string} value - The value to format
 * @returns {string} Formatted number with K/M notation
 */
export const formatNumberWithDelimiters = (value) => {
  return formatLargeNumber(value)
}
