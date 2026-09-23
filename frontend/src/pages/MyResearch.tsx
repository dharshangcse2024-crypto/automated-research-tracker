import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export function MyResearch() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Research</h2>
          <p className="text-gray-500">Manage your tracked research topics.</p>
        </div>
        <Link to="/research/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Topic
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No research topics yet</h3>
            <p className="mb-4 mt-2 text-sm text-gray-500">
              You haven't created any research topics. Get started by creating a new one.
            </p>
            <Link to="/research/new">
              <Button variant="outline">Create Topic</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
