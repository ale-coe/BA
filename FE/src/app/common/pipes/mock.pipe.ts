import { Pipe } from '@angular/core';

export function customMockPipeFactory(name: string): Pipe {
  const metadata: Pipe = {
    name,
  };
  return Pipe(metadata)(
    class MockPipe {
      transform() {
        return '';
      }
    }
  );
}
