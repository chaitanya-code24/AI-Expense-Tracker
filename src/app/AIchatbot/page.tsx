import { Suspense } from "react";
import AIChatbotClient from "./chatbotclient"; // your actual chatbot UI

export default function AIChatbotPage() {
  return (
    <Suspense fallback={<div>Loading chatbot...</div>}>
      <AIChatbotClient />
    </Suspense>
  );
}
