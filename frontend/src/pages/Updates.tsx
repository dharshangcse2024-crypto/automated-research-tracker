import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RefreshCw, Loader2, AlertCircle, ExternalLink, Calendar, User } from 'lucide-react';
import { apiClient } from '../api';
import type { Article } from '../types/api';

export function Updates() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.getArticles();
      // Sort by newest first
      const sortedData = data.sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime());
      setArticles(sortedData);
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to the backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Research Updates</h2>
          <p className="text-gray-500">A unified feed of all incoming research data.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={fetchArticles} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Feed
        </Button>
      </div>

      {isLoading && articles.length === 0 ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-600" />
            <p>Loading latest research articles...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 flex flex-col items-center justify-center text-red-600 text-center">
            <AlertCircle className="h-8 w-8 mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
            <p className="text-sm max-w-md mb-4">{error}</p>
            <Button variant="outline" onClick={fetchArticles}>Try Again</Button>
          </CardContent>
        </Card>
      ) : articles.length === 0 ? (
        <Card>
          <CardContent className="p-12 flex items-center justify-center text-gray-500">
            No new updates available at this time.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl leading-tight">
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-start gap-2">
                        {article.title}
                        <ExternalLink className="h-4 w-4 shrink-0 mt-1 opacity-50" />
                      </a>
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 pt-1">
                      {article.authors && article.authors.length > 0 && (
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {article.authors.join(', ')}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(article.published_date)}
                      </span>
                      <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                        {article.source}
                      </span>
                    </div>
                  </div>
                  {article.relevance_label && (
                    <Badge variant={
                      article.relevance_label.toLowerCase() === 'high' ? 'error' : 
                      article.relevance_label.toLowerCase() === 'medium' ? 'warning' : 
                      'default'
                    } className="shrink-0">
                      {article.relevance_label} Relevance
                      {article.relevance_score && ` (${(article.relevance_score * 100).toFixed(0)}%)`}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-700 space-y-3">
                  {article.summary ? (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">AI Summary</h4>
                      <p>{article.summary}</p>
                    </div>
                  ) : article.abstract ? (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Abstract</h4>
                      <p className="line-clamp-3">{article.abstract}</p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
