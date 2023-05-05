import { ArrayFilterPipe } from './array-filter.pipe';

describe('ArrayFilterPipe', () => {
  const sut = new ArrayFilterPipe<number>();

  it('should transform [3,2,3,4,3] to [3,3,3]', () => {
    const arr = [3, 2, 3, 4, 3];
    const filter = (item: number, number: number | string) => item == number;

    const result = sut.transform(arr, 3, filter);

    expect(result).toStrictEqual([3, 3, 3]);
  });
});
