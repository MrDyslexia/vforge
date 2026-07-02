import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  "Structured prompt-to-spec workflow",
  "Bun-powered local build",
  "Responsive shadcn-style UI base",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_34rem)] px-6 py-8 sm:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col justify-center gap-10">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-sm text-muted-foreground shadow-sm backdrop-blur">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          v0-local template ready
        </div>

        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Replace this page with a generated product experience.</h1>
          <p className="text-lg leading-8 text-muted-foreground sm:text-xl">
            This template gives the builder stable Next.js, Tailwind, Bun, and shadcn-style foundations before it creates a custom app from your prompt.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg">
              Start generation
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="lg">
              Review template
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature}>
              <CardHeader>
                <CardTitle className="text-base">{feature}</CardTitle>
                <CardDescription>Stable baseline for local AI-generated apps.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">The `/v0-local` workflow should replace this content with app-specific UI.</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
