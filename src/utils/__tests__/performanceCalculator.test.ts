import { describe, it, expect } from 'vitest';
import { parseTimeToSeconds, calculateVDOTFromPerformance, calculateHeartRateZones, generateTrainingRecommendations } from '../performanceCalculator';

import type { TrainingData } from '@/types/training';

describe('parseTimeToSeconds', () => {
  it('parses MM:SS correctly', () => {
    expect(parseTimeToSeconds('12:34')).toBe(754);
  });

  it('parses HH:MM:SS correctly', () => {
    expect(parseTimeToSeconds('1:02:03')).toBe(3723);
  });

  it('returns NaN for invalid format', () => {
    expect(isNaN(parseTimeToSeconds('abc'))).toBe(true);
  });
});

describe('calculateVDOTFromPerformance', () => {
  it('returns expected VDOT for 5k time', () => {
    const vdot = calculateVDOTFromPerformance(5, 1230); // 20:30
    expect(vdot).toBeGreaterThan(49);
    expect(vdot).toBeLessThan(51);
  });
});

describe('calculateHeartRateZones', () => {
  it('produces five zones', () => {
    const zones = calculateHeartRateZones(190, 60, 50);
    expect(zones.length).toBe(5);
    expect(zones[0].minHR).toBeGreaterThan(0);
  });
});

describe('generateTrainingRecommendations', () => {
  it('generates recommendations', () => {
    const data: TrainingData = {
      weeklyVolume: 40,
      intensity: 'modérée',
      currentWeight: 70,
      targetWeight: 68,
      lastRaceDistance: 5,
      lastRaceTime: '20:30',
      maxHeartRate: 190,
      restingHeartRate: 60,
    };
    const vdot = calculateVDOTFromPerformance(5, parseTimeToSeconds('20:30'));
    const recs = generateTrainingRecommendations(data, vdot, 4);
    expect(recs.length).toBeGreaterThan(0);
  });
});
