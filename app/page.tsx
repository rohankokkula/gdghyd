'use client';
import { useEffect, useState } from "react";

interface ContentResponse {
  entry: {
    title: string;
    color: {
      hex: string;
    };
    rich_text_editor: string;
    image: {
      url: string;
    };
  };
}

export default function Home() {
  const [content, setContent] = useState<ContentResponse | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const fetchData = () => {
      console.log('Fetching new data...');
      fetch('https://eu-cdn.contentstack.com/v3/content_types/demo/entries/bltf17002e4e1b136c4?locale=en-us&include_fallback=true&include_branch=false', {
        headers: {
          'api_key': process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '',
          'access_token': process.env.NEXT_PUBLIC_CONTENTSTACK_ACCESS_TOKEN || '',
          'branch': 'main',
          'environment': process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'dev'
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log('New data received:', data);
          setContent(data);
          setLastUpdate(new Date().toLocaleTimeString());
        })
        .catch(error => console.error('Error fetching content:', error));
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div 
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
      style={{ 
        backgroundColor: content?.entry.color.hex,
        color: '#000000'
      }}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start bg-white/80 p-8 rounded-lg">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          {content?.entry.title}
        </h1>

        <div 
          className="prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: content?.entry.rich_text_editor || '' }}
        />

        <div className="text-sm text-gray-600">
          Last updated: {lastUpdate}
        </div>
      </main>
    </div>
  );
}
