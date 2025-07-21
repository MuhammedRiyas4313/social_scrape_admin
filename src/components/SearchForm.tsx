"use client"

import { PLATFORM, PLATFORM_TYPE } from '@/common/constants.common';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Twitter, MessageSquare, Newspaper, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SearchForm({ onSearch }: { onSearch: (params: any) => void }) {
  const [keyword, setKeyword] = useState('');
  const [platform, setPlatform] = useState<PLATFORM_TYPE>(PLATFORM.TWITTER);
  const [timeframe, setTimeframe] = useState('7d');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ keyword, platform, timeframe });
  };

  const platformIcons = {
    [PLATFORM.TWITTER]: Twitter,
    [PLATFORM.REDDIT]: MessageSquare,
    [PLATFORM.NEWS]: Newspaper,
  };

  const platformColors = {
    [PLATFORM.TWITTER]: "text-blue-500",
    [PLATFORM.REDDIT]: "text-orange-500", 
    [PLATFORM.NEWS]: "text-gray-600",
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl bg-gradient-to-br from-card to-card/80 border-0 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
            <Search className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Social Media Search
            </h2>
            <p className="text-sm text-muted-foreground">Analyze conversations across platforms</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Search Keywords
            </label>
            <Input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter keywords to analyze..."
              required
              className="transition-all duration-300 focus:scale-105"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Platform</label>
              <Select value={platform} onValueChange={(value) => setPlatform(value as PLATFORM_TYPE)}>
                <SelectTrigger className="h-12 transition-all duration-300 hover:border-primary/30 focus:scale-105">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PLATFORM.TWITTER} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Twitter className={cn("h-4 w-4", platformColors[PLATFORM.TWITTER])} />
                      Twitter
                    </div>
                  </SelectItem>
                  <SelectItem value={PLATFORM.REDDIT} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <MessageSquare className={cn("h-4 w-4", platformColors[PLATFORM.REDDIT])} />
                      Reddit
                    </div>
                  </SelectItem>
                  <SelectItem value={PLATFORM.NEWS} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Newspaper className={cn("h-4 w-4", platformColors[PLATFORM.NEWS])} />
                      News
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Time Range
              </label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="h-12 transition-all duration-300 hover:border-primary/30 focus:scale-105">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            variant="search"
            size="lg"
            className="w-full"
          >
            <Search className="h-5 w-5 mr-2" />
            Analyze Social Media
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}