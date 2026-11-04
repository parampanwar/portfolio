export const caseStudies: Record<
  string,
  { role: string; problem: string; built: string; result: string }
> = {
  botinx: {
    role: "AI Agents & Full-Stack Systems",
    problem:
      "Businesses need intelligent ways to manage high-volume customer conversations, automate support with contextual knowledge, and run scheduled broadcasts via WhatsApp.",
    built:
      "An enterprise WhatsApp Business API platform featuring autonomous AI agents and RAG pipelines for contextual knowledge retrieval, automated response handling, and broadcasting workflows. Built with Next.js, FastAPI, MongoDB, OpenAI, and Gemini.",
    result:
      "A production-grade WhatsApp AI platform orchestrating multi-agent conversational workflows and accurate RAG-driven responses for business customers.",
  },
  skillix: {
    role: "AI Architecture & Full-Stack Engineering",
    problem:
      "Recruiters need to objectively evaluate engineering ability and match verified candidate profiles using contextual intelligence rather than static resume keywords.",
    built:
      "An AI agent-powered skill assessment and recruiter matching platform featuring automated code evaluation, RAG-assisted portfolio profiling, and multi-parameter candidate ranking.",
    result:
      "A unified AI-driven platform accelerating technical hiring with autonomous evaluation agents and contextual candidate-job matching.",
  },
  rferotary: {
    role: "Full-stack development",
    problem:
      "Rotary Friendship Exchange needs a dedicated web application for its exchange program.",
    built:
      "A full-stack application for Rotary Friendship Exchange, using MySQL, Node.js, and Gemini.",
    result: "A dedicated web application for Rotary Friendship Exchange.",
  },
};
