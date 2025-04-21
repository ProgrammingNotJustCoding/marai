"use client";

import React from "react";
import AIChatInterface from "@/components/AIChatInterface";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function AIChatPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">AI Legal Assistant</h1>
        <AIChatInterface />
      </div>
    </DashboardLayout>
  );
}
