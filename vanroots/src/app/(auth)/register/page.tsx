"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-6">
      <div className="w-full max-w-md space-y-8 rounded-[2rem] bg-white p-10 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#0f4a45]">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500">Join the VanRoots travel community</p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe"
                className="mt-1 w-full border-b border-gray-200 py-3 text-sm font-medium outline-none focus:border-[#f6931e] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
              <input 
                type="email" 
                placeholder="email@example.com"
                className="mt-1 w-full border-b border-gray-200 py-3 text-sm font-medium outline-none focus:border-[#f6931e] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="mt-1 w-full border-b border-gray-200 py-3 text-sm font-medium outline-none focus:border-[#f6931e] transition-colors"
              />
            </div>
          </div>

          <Button className="w-full rounded-full bg-[#0f4a45] py-6 font-bold text-white shadow-lg shadow-[#0f4a45]/20 hover:bg-[#0a3330]">
            Sign Up
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link href="/login" className="font-bold text-[#f6931e] hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
