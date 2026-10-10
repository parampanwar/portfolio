export const caseStudies: Record<
  string,
  { role: string; problem: string; built: string; result: string }
> = {
  botinx: {
    role: "Full-stack development",
    problem:
      "Businesses need a way to manage customer conversations, broadcasts, and automated responses through WhatsApp.",
    built:
      "A WhatsApp Business API platform with AI-based chatbots, automation, and broadcasting workflows. The stack connects a Next.js and TypeScript frontend with FastAPI, MongoDB, OpenAI, and Gemini.",
    result:
      "A shipped WhatsApp business platform bringing messaging and AI automation into one product.",
  },
  skillix: {
    role: "Full-stack development",
    problem:
      "Recruiters need to evaluate engineering ability and connect verified skills with relevant opportunities.",
    built:
      "An AI-driven assessment and talent matching platform with automated coding challenges, portfolio profiling, and recruiter matching filters.",
    result:
      "A platform that brings skill assessment and recruiter matching together.",
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
