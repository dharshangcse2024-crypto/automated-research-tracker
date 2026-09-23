import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Activity, BookOpen, Clock, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../api';

export function Dashboard() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const [topicCount, setTopicCount] = useState<number | null>(null);
  const [articleCount, setArticleCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [topics, articles] = await Promise.all([
          apiClient.getTopics(),
          apiClient.getArticles()
        ]);
        setTopicCount(topics.length);
        setArticleCount(articles.length);
      } catch (err: any) {
        setError('Unable to load dashboard statistics from the backend.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back, {userName}</h2>
        <p className="text-gray-500">Here is an overview of your research.</p>
      </div>
      
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-3 shrink-0" />
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Topics</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            ) : (
               <div className="text-2xl font-bold">{topicCount !== null ? topicCount : '-'}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Collected Articles</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            ) : (
               <div className="text-2xl font-bold">{articleCount !== null ? articleCount : '-'}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-center h-48 text-gray-500">
              No recent activity to show.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
