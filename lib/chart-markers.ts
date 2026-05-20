'use strict';

import type { OpenPosition } from '@/hooks/use-open-positions';

/**
 * Contract marker types supported by SmartCharts.
 * Based on the derivatives-trader implementation in chart-markers.js
 */
export type ContractMarkerType =
  | 'TickContract'
  | 'NonTickContract'
  | 'AccumulatorContract';

export type MarkerDirection = 'up' | 'down';

/** Individual marker point on the chart */
export interface MarkerPoint {
  epoch: number;
  quote?: number | null;
}

/** A single contract marker for SmartCharts contracts_array */
export interface ContractMarker {
  type: ContractMarkerType;
  markers: MarkerPoint[];
  props: {
    contract_type: string;
    status: string;
    profit: string;
    is_sold: boolean;
    entry_tick_time: number;
    date_start: number;
    tick_count?: number;
  };
  direction: MarkerDirection;
  profitAndLossText: string;
  currentEpoch: number;
}

// Accumulator contract types
const ACCUMULATOR_TYPES = new Set(['ACCU']);

/**
 * Determines the marker contract type based on the contract_type string.
 */
function getMarkerContractType(contractType: string): ContractMarkerType {
  if (ACCUMULATOR_TYPES.has(contractType)) {
    return 'AccumulatorContract';
  }
  // Rise/Fall with tick_count are tick contracts
  return 'NonTickContract';
}

/**
 * Determines the marker direction based on contract type.
 */
function getMarkerDirection(contractType: string): MarkerDirection {
  if (contractType === 'PUT' || contractType === 'PUTE') {
    return 'down';
  }
  return 'up';
}

/**
 * Formats profit/loss text for the marker label.
 */
function formatProfitLossText(profit: string, currency: string): string {
  const numericProfit = parseFloat(profit);
  if (isNaN(numericProfit)) return '';
  const sign = numericProfit >= 0 ? '+' : '';
  return `${sign}${numericProfit.toFixed(2)} ${currency}`;
}

/**
 * Calculates a contract marker from an open position.
 * This creates the marker data structure that SmartCharts expects via contracts_array.
 */
export function calculateMarkerFromPosition(
  position: OpenPosition
): ContractMarker | null {
  if (!position.date_start) return null;

  const contractType = position.contract_type;
  const type = getMarkerContractType(contractType);
  const direction = getMarkerDirection(contractType);
  const profitAndLossText = formatProfitLossText(
    position.profit,
    position.currency
  );

  // Entry spot marker - the primary marker shown on chart
  const markers: MarkerPoint[] = [
    {
      epoch: position.date_start,
      quote: null, // Will be interpolated by SmartCharts
    },
  ];

  const currentEpoch = Math.floor(Date.now() / 1000);

  return {
    type,
    markers,
    props: {
      contract_type: contractType,
      status: position.status,
      profit: position.profit,
      is_sold: !!position.is_sold,
      entry_tick_time: position.date_start,
      date_start: position.date_start,
      ...(position.tick_count && { tick_count: position.tick_count }),
    },
    direction,
    profitAndLossText,
    currentEpoch,
  };
}

/**
 * Computes the contracts_array for SmartCharts from a list of open positions.
 * Filters to only positions matching the current symbol.
 */
export function calculateContractMarkers(
  positions: OpenPosition[],
  activeSymbol: string | undefined
): ContractMarker[] {
  if (!activeSymbol || positions.length === 0) return [];

  const markers: ContractMarker[] = [];

  for (const position of positions) {
    // Only show markers for contracts on the currently active symbol
    if (position.underlying_symbol !== activeSymbol) continue;

    const marker = calculateMarkerFromPosition(position);
    if (marker) {
      markers.push(marker);
    }
  }

  return markers;
}
