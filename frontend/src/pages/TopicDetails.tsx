import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function TopicDetails() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Topic Details (ID: {id})</h2>
          <p className="text-gray-500">Detailed view and latest findings for this topic.</p>
        </div>
        <Badge variant="success">Tracking Active</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-gray-500">
            Fetching recent data from backend...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
