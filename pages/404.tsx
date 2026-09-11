import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal as TerminalIcon,
  GitBranch,
  Bug,
  Coffee,
  RotateCcw,
  Home,
  BookOpen,
  Send,
  AlertCircle,
  Check,
  Copy,
  Sparkles,
  FileCode,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/data/portfolio";

const DEV_EXCUSES = [
  "It worked on localhost:3000, must be a cosmic ray bit flip in production.",
  "That's not a missing page, it's an undocumented feature awaiting RFC approval.",
  "Someone did a `git push --force` straight to `main` at 4:59 PM on a Friday.",
  "Have you tried deleting node_modules, clearing cache, and re-evaluating life choices?",
  "According to RFC 1035, there is a 99.8% mathematical probability this is a DNS cache issue.",
  "The container responsible for this URL was OOM-killed by 37 idle Chrome tabs.",
  "The route exists in a quantum superposition; observing it caused it to collapse into null.",
  "Our LLM promised it would generate this endpoint on edge, but ran out of tokens.",
  "Works fine on my machine ¯\\_(ツ)_/¯ (Docker container not included).",
  "We refactored the monolith into 250 microservices and lost the map to this one.",
];

const STACK_TRACE = `PageNotFoundException: 404 NullPointerException: Route dereferenced void
  at Internet.resolveRoute (https://parampanwar.xyz/core/router.ts:404:13)
  at Developer.deployToProd (/life/decisions/friday-evening.js:42:0)
  at CoffeeMachine.dispense (/kitchen/espresso.ts:0:0) -> Error: BeansEmptyException
  at TestSuite.runAll (/ci-cd/staging.ts:1:1) -> Warning: 0 tests found (as usual)
  at WillToDebug.evaporate (/brain/serotonin.rs:0:0)
  Caused by: CosmicRayBitFlipError at memory address 0xDEADBEEF
  System state: Panic -> Returning to safe state (home)`;

const GIT_BLAME = `commit 404deadbeef (Param Panwar   Fri 03:14:22) "quick fix before sleep, surely won't break prod"
commit c0ffee12345 (AI Copilot     Fri 03:15:01) "LGTM: hallucinated a route that doesn't exist"
commit b16b00b5000 (Friday Bot     Fri 16:59:59) "merged PR #404 without reviewing [FORCE_PUSH]"
commit 777abcdef01 (Cosmic Ray     Sat 00:00:00) "flipped bit #4 at memory 0x00404"`;

const RCA_JSON = `{
  "incident_id": "INC-404-LOST-IN-SPACE",
  "status": "TRIAGED (Marked as Won't Fix)",
  "severity": "SEV-1 (Param is out of coffee)",
  "root_cause": "User followed a broken link or URL typo",
  "it_worked_on_localhost": true,
  "tested_in_staging": false,
  "is_it_dns": true,
  "blame_assigned_to": "Deploying on a Friday afternoon",
  "recommended_action": "git checkout main"
}`;

type TabType = "terminal" | "stacktrace" | "blame" | "rca";

export default function NotFound() {
  const router = useRouter();
  const currentPath = router.asPath || "/unknown-route";

  const [activeTab, setActiveTab] = useState<TabType>("terminal");
  const [excuseIndex, setExcuseIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [cmdInput, setCmdInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<Array<{ text: string; type: "cmd" | "output" | "error" | "info" }>>([
    { text: `curl -I https://parampanwar.xyz${currentPath}`, type: "cmd" },
    { text: "HTTP/2 404 Not Found", type: "error" },
    { text: "server: caffeinated-edge/2.4.0", type: "info" },
    { text: "x-developer-status: works-on-my-machine", type: "info" },
    { text: "x-coffee-level: 0% [CRITICAL_FAILURE]", type: "info" },
    { text: `error: Path '${currentPath}' dereferenced a garbage collected memory address.`, type: "output" },
    { text: "💡 Tip: Type 'help' or click a command below to recover.", type: "info" },
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Pick a random excuse on mount
    setExcuseIndex(Math.floor(Math.random() * DEV_EXCUSES.length));
  }, []);

  const handleNextExcuse = () => {
    setExcuseIndex((prev) => (prev + 1) % DEV_EXCUSES.length);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    const newLogs = [...terminalLogs, { text: trimmed, type: "cmd" as const }];

    if (lower === "help") {
      newLogs.push({
        text: "Available commands: [home | main | cd ~], [blog | cd blog], [contact | ping], [excuse], [stacktrace], [sudo rm -rf /], [clear]",
        type: "info",
      });
    } else if (lower === "clear") {
      setTerminalLogs([]);
      setCmdInput("");
      return;
    } else if (lower === "home" || lower === "main" || lower === "cd ~" || lower === "git checkout main") {
      newLogs.push({ text: "Switching branch to 'main'... Teleporting home 🚀", type: "output" });
      setTerminalLogs(newLogs);
      setTimeout(() => router.push("/"), 600);
      return;
    } else if (lower === "blog" || lower === "cd blog" || lower === "git log") {
      newLogs.push({ text: "Fetching commits & articles... Opening blog 📖", type: "output" });
      setTerminalLogs(newLogs);
      setTimeout(() => router.push("/blog"), 600);
      return;
    } else if (lower === "contact" || lower === "ping param" || lower === "ping") {
      newLogs.push({ text: "Pinging param@parampanwar.xyz: 64 bytes received (0.404 ms). Opening contact 📬", type: "output" });
      setTerminalLogs(newLogs);
      setTimeout(() => router.push("/contact"), 600);
      return;
    } else if (lower === "excuse" || lower === "cat excuse.txt" || lower === "cat /dev/excuse") {
      handleNextExcuse();
      newLogs.push({ text: `[EXCUSE] "${DEV_EXCUSES[(excuseIndex + 1) % DEV_EXCUSES.length]}"`, type: "info" });
    } else if (lower.includes("sudo rm -rf") || lower === "rm -rf /") {
      newLogs.push({
        text: "Nice try, Neo. You don't have root permissions in this portfolio. Incident reported to Santa Claus.",
        type: "error",
      });
    } else if (lower === "npm run dev" || lower === "npm start") {
      newLogs.push({
        text: "Ready on http://localhost:3000 (just kidding, this page is still null and void)",
        type: "info",
      });
    } else if (lower === "git blame" || lower === "blame") {
      setActiveTab("blame");
      newLogs.push({ text: "Opening git blame inspector...", type: "info" });
    } else if (lower === "stacktrace") {
      setActiveTab("stacktrace");
      newLogs.push({ text: "Opening call stack trace...", type: "info" });
    } else {
      newLogs.push({
        text: `bash: ${trimmed}: command not found. Try 'help' or 'git checkout main'.`,
        type: "error",
      });
    }

    setTerminalLogs(newLogs);
    setCmdInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(cmdInput);
    }
  };

  return (
    <>
      <Head>
        <title>404: Segmentation Fault (Core Dumped) | {siteConfig.name}</title>
        <meta name="description" content="404 Page Not Found - It worked fine on localhost:3000..." />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-center items-center">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-signal/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" />

        <div className="max-w-4xl w-full mx-auto">
          {/* Top Developer Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center justify-center sm:justify-between gap-2.5 mb-8 text-xs font-mono border border-rim/70 bg-surface/80 backdrop-blur-md rounded-xl p-3 shadow-lg shadow-black/40"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 font-semibold">FATAL_404_PAGE_NOT_FOUND</span>
            </div>
            <div className="flex items-center gap-4 text-text-muted">
              <span className="flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-signal" />
                <span className="text-text-secondary">detached-at-404</span>
              </span>
              <span className="hidden sm:inline text-rim-2">|</span>
              <span className="flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-text-secondary">Caffeine: 0%</span>
              </span>
              <span className="hidden sm:inline text-rim-2">|</span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-signal" />
                <span className="text-text-secondary">Env: prod (Friday 5PM)</span>
              </span>
            </div>
          </motion.div>

          {/* Hero Glitch & Headline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="relative inline-block select-none mb-3">
              <h1 className="font-mono text-7xl sm:text-9xl md:text-[10rem] font-extrabold tracking-tighter leading-none">
                <span className="text-signal">4</span>
                <span className="text-stroke">0</span>
                <span className="text-signal">4</span>
              </h1>
              <span className="absolute -top-3 -right-6 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-medium animate-bounce-slow">
                NullPointer
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-2">
              Segmentation Fault: Route Dereferenced Null
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto text-sm sm:text-base font-body">
              The page you are looking for does not exist, was garbage collected, or was pushed directly to prod without testing.
            </p>
          </motion.div>

          {/* Developer Excuse Generator */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 p-4 rounded-xl border border-signal/20 bg-surface-2/60 backdrop-blur-md relative overflow-hidden group"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-signal/10 border border-signal/30 flex items-center justify-center shrink-0 mt-0.5 text-signal">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-signal/80 flex items-center gap-1.5 font-semibold">
                    <span>$ cat /dev/developer-excuses.txt</span>
                  </span>
                  <p className="text-sm font-mono text-text-primary mt-1 italic">
                    "{DEV_EXCUSES[excuseIndex]}"
                  </p>
                </div>
              </div>
              <button
                onClick={handleNextExcuse}
                className="self-end sm:self-center shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rim hover:border-signal/50 bg-surface hover:bg-surface-3 text-xs font-mono text-text-secondary hover:text-signal transition-all duration-200 active:scale-95"
                title="Roll another excuse"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Roll Excuse 🎲</span>
              </button>
            </div>
          </motion.div>

          {/* Interactive Debugger / Terminal Window */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-rim bg-[#0d0d14] overflow-hidden shadow-2xl shadow-black/80 mb-10"
          >
            {/* Window Title Bar with Tabs */}
            <div className="bg-[#14141d] px-4 py-2.5 border-b border-rim flex flex-wrap items-center justify-between gap-3 select-none">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
                <span className="ml-2 text-xs font-mono text-text-muted hidden md:inline">
                  debug-console@param-portfolio: ~/{currentPath.replace(/^\//, "") || "404"}
                </span>
              </div>

              {/* Inspector Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab("terminal")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                    activeTab === "terminal"
                      ? "bg-surface-3 text-signal border border-signal/20 font-medium"
                      : "text-text-muted hover:text-text-secondary hover:bg-surface/50"
                  }`}
                >
                  <TerminalIcon className="w-3.5 h-3.5" />
                  <span>terminal.sh</span>
                </button>

                <button
                  onClick={() => setActiveTab("stacktrace")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                    activeTab === "stacktrace"
                      ? "bg-surface-3 text-signal border border-signal/20 font-medium"
                      : "text-text-muted hover:text-text-secondary hover:bg-surface/50"
                  }`}
                >
                  <Bug className="w-3.5 h-3.5" />
                  <span>stacktrace.ts</span>
                </button>

                <button
                  onClick={() => setActiveTab("blame")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                    activeTab === "blame"
                      ? "bg-surface-3 text-signal border border-signal/20 font-medium"
                      : "text-text-muted hover:text-text-secondary hover:bg-surface/50"
                  }`}
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>git-blame.log</span>
                </button>

                <button
                  onClick={() => setActiveTab("rca")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                    activeTab === "rca"
                      ? "bg-surface-3 text-signal border border-signal/20 font-medium"
                      : "text-text-muted hover:text-text-secondary hover:bg-surface/50"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>rca.json</span>
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm min-h-[260px] max-h-[360px] overflow-y-auto">
              {activeTab === "terminal" && (
                <div className="flex flex-col h-full justify-between gap-4">
                  <div className="space-y-1.5 overflow-y-auto">
                    {terminalLogs.map((log, i) => (
                      <div key={i} className="leading-relaxed break-all">
                        {log.type === "cmd" ? (
                          <div className="flex items-center gap-2 text-text-primary">
                            <span className="text-signal">guest@portfolio:~$</span>
                            <span>{log.text}</span>
                          </div>
                        ) : log.type === "error" ? (
                          <p className="text-red-400 font-semibold">{log.text}</p>
                        ) : log.type === "info" ? (
                          <p className="text-text-muted">{log.text}</p>
                        ) : (
                          <p className="text-text-secondary">{log.text}</p>
                        )}
                      </div>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>

                  {/* Interactive CLI input & Quick Action Pills */}
                  <div className="pt-3 border-t border-rim/60">
                    <div className="flex items-center gap-2 mb-3 bg-surface/60 px-3 py-2 rounded-lg border border-rim/70 focus-within:border-signal/50 transition-colors">
                      <span className="text-signal font-bold">❯</span>
                      <input
                        type="text"
                        value={cmdInput}
                        onChange={(e) => setCmdInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="type command (e.g. 'home', 'blog', 'ping', 'help')..."
                        className="bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none w-full font-mono text-xs sm:text-sm"
                      />
                      <span className="text-[10px] text-text-muted hidden sm:inline px-1.5 py-0.5 rounded border border-rim">
                        ENTER
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-text-muted">
                      <span className="text-[11px] text-text-muted mr-1">Quick Run:</span>
                      <button
                        onClick={() => executeCommand("git checkout main")}
                        className="px-2.5 py-1 rounded bg-surface hover:bg-surface-3 border border-rim text-text-secondary hover:text-signal transition-colors font-mono"
                      >
                        $ git checkout main
                      </button>
                      <button
                        onClick={() => executeCommand("git log")}
                        className="px-2.5 py-1 rounded bg-surface hover:bg-surface-3 border border-rim text-text-secondary hover:text-signal transition-colors font-mono"
                      >
                        $ git log (blog)
                      </button>
                      <button
                        onClick={() => executeCommand("ping param")}
                        className="px-2.5 py-1 rounded bg-surface hover:bg-surface-3 border border-rim text-text-secondary hover:text-signal transition-colors font-mono"
                      >
                        $ ping param
                      </button>
                      <button
                        onClick={() => executeCommand("sudo rm -rf /")}
                        className="px-2.5 py-1 rounded bg-surface hover:bg-surface-3 border border-rim text-red-400/80 hover:text-red-400 transition-colors font-mono"
                      >
                        $ sudo rm -rf /
                      </button>
                      <button
                        onClick={() => executeCommand("excuse")}
                        className="px-2.5 py-1 rounded bg-surface hover:bg-surface-3 border border-rim text-text-secondary hover:text-signal transition-colors font-mono"
                      >
                        $ cat excuse.txt
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "stacktrace" && (
                <div className="relative">
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => handleCopy(STACK_TRACE)}
                      className="flex items-center gap-1 text-xs text-text-muted hover:text-signal transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-signal" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy Trace"}</span>
                    </button>
                  </div>
                  <pre className="text-red-400 whitespace-pre-wrap leading-relaxed font-mono bg-red-950/20 p-4 rounded-lg border border-red-500/20 text-xs sm:text-sm overflow-x-auto">
                    {STACK_TRACE}
                  </pre>
                </div>
              )}

              {activeTab === "blame" && (
                <div className="relative">
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => handleCopy(GIT_BLAME)}
                      className="flex items-center gap-1 text-xs text-text-muted hover:text-signal transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-signal" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy Blame"}</span>
                    </button>
                  </div>
                  <pre className="text-text-secondary whitespace-pre-wrap leading-relaxed font-mono bg-surface p-4 rounded-lg border border-rim text-xs sm:text-sm overflow-x-auto">
                    {GIT_BLAME}
                  </pre>
                </div>
              )}

              {activeTab === "rca" && (
                <div className="relative">
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => handleCopy(RCA_JSON)}
                      className="flex items-center gap-1 text-xs text-text-muted hover:text-signal transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-signal" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy JSON"}</span>
                    </button>
                  </div>
                  <pre className="text-signal whitespace-pre-wrap leading-relaxed font-mono bg-surface p-4 rounded-lg border border-rim text-xs sm:text-sm overflow-x-auto">
                    {RCA_JSON}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>

          {/* Primary Navigation Actions (Developer Themed) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 text-center"
          >
            <Link href="/" className="btn-primary flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>git checkout main (Home)</span>
            </Link>

            <Link href="/blog" className="btn-ghost flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>git log (Read Blogs)</span>
            </Link>

            <Link href="/contact" className="btn-ghost flex items-center gap-2">
              <Send className="w-4 h-4" />
              <span>ping param (Report Bug)</span>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}

