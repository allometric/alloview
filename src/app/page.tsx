"use client";
import { useState } from "react";
import ModelViewer from "@/pages/ModelViewer";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();


const Page = () => {
  return (
    <QueryClientProvider client = {queryClient}>
      <ModelViewer></ModelViewer>
    </QueryClientProvider>
  )
}

export default Page;