import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8Z" />
      <path d="M12 2c4 0 7.2 2.1 8.8 5" />
      <path d="M4.2 9.8A8.1 8.1 0 0 1 12 4c1.8 0 3.5.6 4.9 1.7" />
    </svg>
  );
}
