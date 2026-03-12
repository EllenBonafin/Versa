import { getDailyVerse, getDailyGospel } from '../services/dailyContent';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
}));

describe('dailyContent', () => {
  it('returns a verse with required fields', async () => {
    const verse = await getDailyVerse();
    expect(verse).toHaveProperty('reference');
    expect(verse).toHaveProperty('text');
    expect(verse).toHaveProperty('date');
    expect(typeof verse.text).toBe('string');
    expect(verse.text.length).toBeGreaterThan(0);
  });

  it('returns a gospel with reflection', async () => {
    const gospel = await getDailyGospel();
    expect(gospel).toHaveProperty('reference');
    expect(gospel).toHaveProperty('text');
    expect(gospel).toHaveProperty('reflection');
    expect(gospel).toHaveProperty('textEn');
    expect(gospel).toHaveProperty('reflectionEn');
  });

  it('returns consistent verse for same day', async () => {
    const verse1 = await getDailyVerse();
    const verse2 = await getDailyVerse();
    expect(verse1.reference).toBe(verse2.reference);
  });
});
