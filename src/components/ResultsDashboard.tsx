"use client";

import { Doughnut } from "react-chartjs-2";
import WordCloud from "react-wordcloud";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  MessageCircle,
  Hash,
  BarChart3,
  Smile,
  Meh,
  Frown,
  Cloud,
  Activity,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Keyword {
  word: string;
  count: number;
}

interface Hashtag {
  tag: string;
  count: number;
}

interface Sentiment {
  score: number;
  sentiment: "positive" | "neutral" | "negative";
  distribution?: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

interface AnalysisResult {
  keywords: Keyword[];
  hashtags: Hashtag[];
  sentiment: Sentiment;
}

export default function ResultsDashboard({ data }: { data: AnalysisResult }) {
  // Default distribution if not provided
  const sentimentDistribution = data.sentiment.distribution || {
    positive: data.sentiment.sentiment === "positive" ? 60 : 20,
    neutral: data.sentiment.sentiment === "neutral" ? 60 : 20,
    negative: data.sentiment.sentiment === "negative" ? 60 : 20,
  };

  // Filter out noise keywords and limit to top 50
  const filteredKeywords = data.keywords
    .filter(
      (kw) =>
        !["https", "http", "com", "www", "tco"].includes(kw.word.toLowerCase())
    )
    .slice(0, 50);

  // Normalize hashtag counts for better visualization
  const maxHashtagCount = Math.max(...data.hashtags.map((h) => h.count), 1);
  const normalizedHashtags = data.hashtags.map((ht) => ({
    ...ht,
    normalizedCount: Math.round((ht.count / maxHashtagCount) * 100),
  }));

  const sentimentData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [
          sentimentDistribution.positive,
          sentimentDistribution.neutral,
          sentimentDistribution.negative,
        ],
        backgroundColor: [
          "hsl(142.1, 76.2%, 36.3%)", // Positive green
          "hsl(210, 20%, 98%)", // Neutral gray
          "hsl(0, 84.2%, 60.2%)", // Negative red
        ],
        borderColor: "hsl(var(--background))",
        borderWidth: 2,
        hoverOffset: 8,
        cutout: "70%",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "hsl(var(--foreground))",
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            family: "Inter, sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "hsl(var(--popover))",
        titleColor: "hsl(var(--popover-foreground))",
        bodyColor: "hsl(var(--popover-foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.parsed;
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${percentage}% (${value})`;
          },
        },
      },
    },
    // Add animation configuration
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  // Prepare word cloud data with better scaling
  const wordCloudData = filteredKeywords.map((kw) => ({
    text: kw.word,
    value: Math.min(Math.log(kw.count + 1) * 20, 100), // Logarithmic scaling
  }));

  const wordCloudOptions = {
    colors: [
      "hsl(var(--primary))",
      "hsl(var(--primary-glow))",
      "hsl(var(--accent))",
    ],
    enableTooltip: true,
    fontSizes: [14, 64] as [number, number],
    padding: 2,
    rotations: 1,
    rotationAngles: [0, 90] as [number, number],
    scale: "sqrt" as const,
    spiral: "archimedean" as const,
  };

  const getSentimentIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <Smile className="h-5 w-5 text-positive" />;
      case "neutral":
        return <Meh className="h-5 w-5 text-neutral" />;
      case "negative":
        return <Frown className="h-5 w-5 text-negative" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getSentimentColor = (type: string) => {
    switch (type) {
      case "positive":
        return "border-l-positive bg-positive/5";
      case "neutral":
        return "border-l-neutral bg-neutral/5";
      case "negative":
        return "border-l-negative bg-negative/5";
      default:
        return "border-l-primary bg-primary/5";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(sentimentDistribution).map(
          ([type, value]: [string, any]) => (
            <Card
              key={type}
              className={cn(
                "border-l-4 transition-all duration-300 hover:scale-[1.02]",
                getSentimentColor(type)
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground capitalize">
                      {type}
                    </p>
                    <p className="text-2xl font-bold">{value}%</p>
                  </div>
                  {getSentimentIcon(type)}
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Word Cloud */}
        <Card className="col-span-1 shadow-lg hover:shadow-xl transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <Cloud className="h-5 w-5 text-primary-foreground" />
              </div>
              Keyword Cloud
              <Badge variant="secondary" className="ml-auto">
                {filteredKeywords.length} terms
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              {filteredKeywords.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <p>No relevant keywords found</p>
                </div>
              ) : (
                <WordCloud words={wordCloudData} options={wordCloudOptions} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Chart */}
        <Card className="col-span-1 shadow-lg hover:shadow-xl transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              Sentiment Analysis
              <Badge variant="secondary" className="ml-auto">
                Score: {(data.sentiment.score * 100).toFixed(0)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 relative">
              <Doughnut data={sentimentData} options={chartOptions} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-2xl font-bold">
                  {Math.round(data.sentiment.score * 100)}%
                </span>
                <p className="text-xs text-muted-foreground">Sentiment Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keywords List */}
        <Card className="col-span-1 shadow-lg hover:shadow-xl transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              Top Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {filteredKeywords.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  <p>No keywords to display</p>
                </div>
              ) : (
                filteredKeywords.map((kw, index) => (
                  <div
                    key={kw.word}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium">{kw.word}</span>
                    </div>
                    <Badge variant="outline" className="font-semibold">
                      {kw.count}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hashtags List */}
        <Card className="col-span-1 shadow-lg hover:shadow-xl transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <Hash className="h-5 w-5 text-primary-foreground" />
              </div>
              Trending Hashtags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {normalizedHashtags.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  <p>No hashtags to display</p>
                </div>
              ) : (
                normalizedHashtags.map((ht, index) => (
                  <div
                    key={ht.tag}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium text-primary">{ht.tag}</span>
                    </div>
                    <Badge variant="outline" className="font-semibold">
                      {ht.count}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
