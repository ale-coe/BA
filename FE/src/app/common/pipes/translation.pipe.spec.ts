import { TranslationPipe } from './translation.pipe';

describe('CategoryPipe', () => {
  it('create an instance', () => {
    const pipe = new TranslationPipe();
    expect(pipe).toBeTruthy();
  });
});
