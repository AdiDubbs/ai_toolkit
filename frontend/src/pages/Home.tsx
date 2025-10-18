import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const Home: React.FC = () => {
  return (
    <>
      <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/20 rounded-full shadow-sm backdrop-blur-md hover:scale-[1.1] duration-300">
        <Sparkles className="w-4 h-4 text-yellow-300" />
        <span className="text-base text-primary-foreground font-large">
          Showcase by Aditya Dubey
        </span>
      </div>
      <h1 className="text-6xl md:text-7xl font-bold mb-4 text-primary-foreground leading-tight">
        AI Toolkit
      </h1>
      <Card className="w-full">
        <CardContent>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary-foreground mb-2">
              Get Started
            </CardTitle>
            <CardDescription className="text-lg text-primary-foreground">
              Explore our AI-powered tools designed to enhance your
              productivity. From image analysis to text processing, discover
              what's possible with modern AI.
            </CardDescription>
          </CardHeader>
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            <span className="text-sm text-primary-foreground border border-primary/20 px-3 py-1 rounded-full font-medium backdrop-blur-sm hover:bg-primary/10 hover:scale-[1.1] duration-200">
              Text Summarization
            </span>
            <span className="text-sm text-primary-foreground border border-primary/20 px-3 py-1 rounded-full font-medium backdrop-blur-sm hover:bg-primary/10 hover:scale-[1.1] duration-200">
              Image Captioning
            </span>
            <span className="text-sm text-primary-foreground border border-primary/20 px-3 py-1 rounded-full font-medium backdrop-blur-sm hover:bg-primary/10 hover:scale-[1.1] duration-200">
              More tools coming soon ...
            </span>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col md:flex-row items-stretch gap-6 mb-2 w-full">
        <Card className="w-full">
          <CardContent>
            <CardTitle className="mt-6 mb-2 text-2xl font-bold text-primary-foreground">
              All-in-One AI Toolkit
            </CardTitle>
            <CardDescription className="font-medium text-md text-primary-foreground/80">
              Work faster with everything in one place - text summarization,
              image captioning, sentiment analysis, and more.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent>
            <CardTitle className="mt-6 mb-2 text-2xl font-bold text-primary-foreground">
              Independent, Self-Trained Models
            </CardTitle>
            <CardDescription className="font-medium text-md text-primary-foreground/80">
              Built on models we trained ourselves, not third-party APIs - with
              everything being independent and open-source
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent>
            <CardTitle className="mt-6 mb-2 text-2xl font-bold text-primary-foreground">
              Student Demo
            </CardTitle>
            <CardDescription className="font-medium text-md text-primary-foreground/80">
              A student-driven project showcasing AI capabilities through
              hands-on development
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Home;
