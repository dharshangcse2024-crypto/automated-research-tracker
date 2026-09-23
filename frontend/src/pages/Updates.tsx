import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function Updates() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Research Updates</h2>
        <p className="text-gray-500">A unified feed of all incoming research data.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-gray-500">
            No new updates available.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
