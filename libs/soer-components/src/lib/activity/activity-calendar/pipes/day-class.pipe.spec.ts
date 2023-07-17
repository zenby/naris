import { DayClassPipe } from './day-class.pipe';

describe('DayClassPipe', () => {
  const sut = new DayClassPipe<number>();

  it('should return "day-in-future"', () => {
    const arr = [1, 2];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();

    const result = sut.transform(arr, tomorrow);

    expect(result).toBe('day-in-future');
  });

  it('should return "day-with-activity"', () => {
    const arr = [1, 2];
    const today = new Date().toISOString();

    const result = sut.transform(arr, today);

    expect(result).toBe('day-with-activity');
  });

  it('should return "day-without-activity"', () => {
    const arr = [] as Array<number>;
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString();

    const result = sut.transform(arr, yesterday);

    expect(result).toBe('day-without-activity');
  });
});
