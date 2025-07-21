"use client"

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import ResultsDashboard from "@/components/ResultsDashboard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAnalyze, useScrape } from "@/services/index.service";
import { toastError } from "@/utils/toast";
import { Sparkles, BarChart } from "lucide-react";

const Index = () => {
  //STATE
  const [results, setResults] = useState<any>(null);

  //MUTATION
  const { mutateAsync: scrape, isPending: isScrapePending } = useScrape();
  const { mutateAsync: analyze, isPending: isAnalyzePending } = useAnalyze();

  const loading = isScrapePending || isAnalyzePending;

  //HANDLER
  const handleSearch = async (params: any) => {
    try {
      // First scrape the data
      const scrapeRes = await scrape(params);

      console.log(scrapeRes.data, 'SCRAPE DATA')
      
      // Then analyze the scraped data
      const analyzeRes = await analyze({
        posts: scrapeRes.data,
      });

      console.log(analyzeRes.data, 'ANALYZE DATA')

      setResults(analyzeRes.data);
    } catch (error) {
      console.error("Error:", error);
      toastError(error);
      setResults(null)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="relative py-8 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary-glow/5" />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-lg">
                <BarChart className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Social Media Analyzer
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Unlock insights from social conversations
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Hero Description
          <div className="text-center mb-12">
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover trends, analyze sentiment, and understand the conversation around your keywords across multiple social media platforms.
            </p>
            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Real-time analysis
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart className="h-4 w-4 text-primary" />
                Multi-platform support
              </div>
            </div>
          </div> */}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-16 py-5">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Search Form */}
          <div className="flex justify-center">
            <SearchForm onSearch={handleSearch} />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center">
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl">
                <LoadingSpinner 
                  size="lg" 
                  text={isScrapePending ? "Gathering social media data..." : "Analyzing conversations..."}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {results && !loading && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Analysis Results</h2>
                <p className="text-muted-foreground">
                  Here's what we discovered from the social media conversations
                </p>
              </div>
              <ResultsDashboard data={results} />
            </div>
          )}

          {/* Empty State */}
          {!results && !loading && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="p-4 rounded-full bg-muted/50 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <BarChart className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground">
                  Enter a keyword above to start analyzing social media conversations and discover valuable insights.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
