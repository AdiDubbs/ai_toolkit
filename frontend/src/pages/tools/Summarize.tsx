import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

const MAX_CHAR_COUNT = 2000;
const SUMMARY_ENDPOINT = "http://127.0.0.1:8000/summarize";

const Summarize: React.FC = () => {
  const [input, setInput] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [error, setError] = React.useState("");

  const charactersLeft = MAX_CHAR_COUNT - input.length;

  const handleSummarize = async () => {
    if (!input.trim()) {
      setError("Add some text before generating a summary.");
      return;
    }
    setError("");
    setIsSummarizing(true);
    setSummary("");

    const formData = new FormData();
    const textBlob = new Blob([input], { type: "text/plain" });
    formData.append("file", textBlob, "input.txt");

    try {
      const response = await fetch(SUMMARY_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary.");
      }

      const data = await response.json();
      const summaryText = (data.summary as string | undefined)?.trim() ?? "";

      if (!summaryText) {
        setError("The summarization service returned an empty response.");
      }

      setSummary(summaryText);
    } catch {
      setError("An error occurred while generating the summary.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <>
      <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/20 rounded-full shadow-sm backdrop-blur-md">
        <Sparkles className="w-4 h-4 text-yellow-300" />
        <span className="text-base text-primary-foreground font-medium">
          Summaries in seconds
        </span>
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground leading-tight">
        Text Summarization
      </h1>
      <p className="max-w-2xl text-primary-foreground/80 text-base sm:text-lg">
        Paste in an article, email, or essay and generate a concise overview with one click.
      </p>

      <Card className="w-full">
        <CardHeader className="sm:flex sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl text-primary-foreground">
              Paste your text
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              We&apos;ll keep it short and sweet for a quick read.
            </CardDescription>
          </div>
          <span className="mt-2 inline-flex items-center justify-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-foreground/70">
            {charactersLeft} characters left
          </span>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="summarize-input"
              className="text-sm font-medium text-primary-foreground/80"
            >
              Source text
            </label>
            <Textarea
              id="summarize-input"
              placeholder="Drop in a few paragraphs..."
              maxLength={MAX_CHAR_COUNT}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="h-48 resize-none rounded-2xl border border-primary/20 bg-white/10 text-base text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="h-12 w-full sm:w-auto rounded-3xl px-6 text-base font-semibold bg-emerald-500/80 hover:bg-emerald-500/90"
              onClick={handleSummarize}
              disabled={isSummarizing}
            >
              {isSummarizing ? "Summarizing..." : "Generate summary"}
            </Button>
            <Button
              variant="ghost"
              className="h-12 w-full sm:w-auto rounded-3xl px-6 text-base font-semibold text-primary-foreground hover:bg-primary/10"
              onClick={() => {
                setInput("");
                setSummary("");
                setError("");
              }}
              disabled={isSummarizing}
            >
              Clear
            </Button>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-primary-foreground">
              Summary
            </h2>
            <Card className="w-full border border-primary/20 bg-primary/10">
              <CardContent
                className="min-h-[160px] flex items-center p-6 text-left"
                aria-live="polite"
              >
                {summary ? (
                  <p className="text-primary-foreground text-base leading-relaxed">
                    {summary}
                  </p>
                ) : (
                  <p className="text-primary-foreground/50 italic">
                    Your summary will show up here once it&apos;s ready.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Summarize;
