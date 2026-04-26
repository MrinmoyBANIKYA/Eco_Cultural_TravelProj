"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-6 text-center">
      <h2 className="text-4xl font-black text-[#0f4a45] mb-4 uppercase tracking-tighter">Under Development</h2>
      <p className="text-gray-500 max-w-md mb-8 font-medium">We're currently building this section to bring you the best experience of Northeast India. Stay tuned!</p>
      <Link href="/">
        <Button className="rounded-full bg-[#f6931e] px-8 py-6 font-bold text-white shadow-lg hover:bg-[#e08214] transition-all">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
        </Button>
      </Link>
    </div>
  );
}
