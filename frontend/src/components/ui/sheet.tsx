import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';
import { cn } from '../../utils';

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: 'left' | 'right' | 'top' | 'bottom';
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 bg-background p-4 shadow-lg transition-transform',
        side === 'right' && 'inset-y-0 right-0 w-80 translate-x-0',
        side === 'left' && 'inset-y-0 left-0 w-80',
        side === 'top' && 'inset-x-0 top-0 h-1/3',
        side === 'bottom' && 'inset-x-0 bottom-0 h-1/3',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
SheetContent.displayName = 'SheetContent';

export { Sheet, SheetTrigger, SheetClose, SheetContent };
