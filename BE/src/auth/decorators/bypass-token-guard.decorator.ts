import { Reflector } from '@nestjs/core';

// always returns true, if decorator is set
export const BypassTokenGuard = Reflector.createDecorator<boolean>({
  transform() {
    return true;
  },
});
