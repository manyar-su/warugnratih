import React from 'react';

type MotionExtras = {
  animate?: unknown;
  exit?: unknown;
  initial?: unknown;
  layout?: unknown;
  layoutId?: unknown;
  transition?: unknown;
  viewport?: unknown;
  whileHover?: unknown;
  whileInView?: unknown;
  whileTap?: unknown;
};

const MOTION_PROP_KEYS = new Set([
  'animate',
  'exit',
  'initial',
  'layout',
  'layoutId',
  'transition',
  'viewport',
  'whileHover',
  'whileInView',
  'whileTap',
]);

type MotionTag = keyof React.JSX.IntrinsicElements;
type MotionComponent = React.ForwardRefExoticComponent<any>;
type MotionFactory = Record<MotionTag, MotionComponent>;

function stripMotionProps(props: Record<string, unknown>) {
  const nextProps: Record<string, unknown> = {};

  Object.entries(props).forEach(([key, value]) => {
    if (!MOTION_PROP_KEYS.has(key)) {
      nextProps[key] = value;
    }
  });

  return nextProps;
}

function createMotionComponent(tag: MotionTag): MotionComponent {
  return React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & MotionExtras>(
    ({ children, ...props }, ref) =>
      React.createElement(tag, { ...stripMotionProps(props), ref }, children),
  );
}

export const motion = new Proxy(
  {},
  {
    get: (_, tag: string) => createMotionComponent(tag as MotionTag),
  },
) as MotionFactory;

export function AnimatePresence({
  children,
}: {
  children: React.ReactNode;
  initial?: boolean;
  mode?: string;
}) {
  return <>{children}</>;
}
