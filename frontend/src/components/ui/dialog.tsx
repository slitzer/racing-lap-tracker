import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';
import { cn } from '../../utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 w-[90vw] max-w-lg translate-y-[-50%] top-1/2 left-1/2 -translate-x-1/2 bg-background p-4 rounded shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = 'DialogContent';

export { Dialog, DialogTrigger, DialogClose, DialogContent };
