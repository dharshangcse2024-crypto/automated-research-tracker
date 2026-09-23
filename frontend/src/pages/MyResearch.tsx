import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, Loader2, AlertCircle, BookOpen } from 'lucide-react';
import { apiClient } from '../api';
import type { Topic } from '../types/api';

export function MyResearch() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.getTopics();
      setTopics(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to the backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Research</h2>
          <p className="text-gray-500">Manage your tracked research topics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchTopics} disabled={isLoading} title="Refresh topics">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Link to="/research/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Topic
            </Button>
          </Link>
        </div>
      </div>

      {isLoading && topics.length === 0 ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-600" />
            <p>Loading topics from backend...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 flex flex-col items-center justify-center text-red-600 text-center">
            <AlertCircle className="h-8 w-8 mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
            <p className="text-sm max-w-md mb-4">{error}</p>
            <Button variant="outline" onClick={fetchTopics}>Try Again</Button>
          </CardContent>
        </Card>
      ) : topics.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold">No research topics yet</h3>
              <p className="mb-4 mt-2 text-sm text-gray-500">
                You haven't created any research topics. Get started by creating a new one.
              </p>
              <Link to="/research/new">
                <Button variant="outline">Create Topic</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Link key={topic.id} to={`/research/${topic.id}`} className="block h-full transition-transform hover:-translate-y-1">
              <Card className="h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-1">{topic.name}</CardTitle>
                    {topic.is_active ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="default">Inactive</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{topic.category}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-gray-700 line-clamp-3 flex-1 mb-4">
                    {topic.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {topic.keywords?.slice(0, 3).map((kw, i) => (
                      <Badge key={i} variant="default" className="text-xs">
                        {kw}
                      </Badge>
                    ))}
                    {topic.keywords?.length > 3 && (
                      <Badge variant="default" className="text-xs">
                        +{topic.keywords.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
