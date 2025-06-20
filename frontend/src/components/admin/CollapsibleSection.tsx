import React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils';

interface Props {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<Props> = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="space-y-2">
      <Collapsible.Trigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between text-xl font-semibold mb-2"
        >
          <span>{title}</span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', open ? 'rotate-180' : 'rotate-0')} />
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content className="space-y-4">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsibleSection;
