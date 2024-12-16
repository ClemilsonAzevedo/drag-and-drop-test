'use client';

import dynamic from "next/dynamic";

const EmailBuilder = dynamic(() => import("../components/EmailBuilder"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <EmailBuilder />
    </div>
  );
}
