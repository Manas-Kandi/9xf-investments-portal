'use client';

import { useState } from 'react';
import { updateOfferingConfig } from '@/app/actions/offering';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function OfferingBuilder({ initialConfig, raiseId, slug }: { initialConfig: any, raiseId: string, slug?: string }) {
  const [config, setConfig] = useState(initialConfig);
  const [loading, setLoading] = useState(false);
  const [currentSlug, setSlug] = useState(slug);

  const handleSave = async () => {
    setLoading(true);
    const res = await updateOfferingConfig(raiseId, config);
    if (res.success && res.slug) setSlug(res.slug);
    setLoading(false);
  };

  const previewUrl = currentSlug ? `/offering/${currentSlug}` : '#';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Offering Page Builder</h1>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          {currentSlug && (
            <Link href={previewUrl} target="_blank">
              <Button variant="secondary" className="border border-white/10">
                <ExternalLink className="w-4 h-4 mr-2" /> View Live
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="bg-neutral-900 border border-white/10">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hero" className="mt-6">
          <Card className="bg-neutral-900 border-white/10">
            <CardHeader><CardTitle>Hero Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-white/70 mb-1 block">Headline</label>
                <Input 
                  value={config.heroTitle || ''} 
                  onChange={(e) => setConfig({...config, heroTitle: e.target.value})} 
                  placeholder="Invest in the Future of..."
                />
              </div>
              <div>
                <label className="text-sm text-white/70 mb-1 block">Subheadline</label>
                <Input 
                  value={config.heroSubtitle || ''} 
                  onChange={(e) => setConfig({...config, heroSubtitle: e.target.value})} 
                  placeholder="The world's first..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="story" className="mt-6">
          <Card className="bg-neutral-900 border-white/10">
            <CardHeader><CardTitle>The Story</CardTitle></CardHeader>
            <CardContent>
              <Textarea 
                className="min-h-[300px]" 
                placeholder="Markdown supported..."
                value={config.story || ''}
                onChange={(e) => setConfig({...config, story: e.target.value})}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <Card className="bg-neutral-900 border-white/10">
            <CardHeader><CardTitle>Media Assets</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-white/70 mb-1 block">Cover Image URL</label>
                <Input 
                  value={config.coverImageUrl || ''} 
                  onChange={(e) => setConfig({...config, coverImageUrl: e.target.value})} 
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-sm text-white/70 mb-1 block">Video URL (YouTube/Vimeo)</label>
                <Input 
                  value={config.videoUrl || ''} 
                  onChange={(e) => setConfig({...config, videoUrl: e.target.value})} 
                  placeholder="https://youtube.com/..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
