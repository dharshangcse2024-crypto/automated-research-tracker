import { Card, CardContent } from '../components/ui/Card';
import { Bookmark } from 'lucide-react';

export function SavedResearch() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Saved Research</h2>
        <p className="text-gray-500">Your bookmarked and curated research findings.</p>
      </div>

      <Card>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Bookmark className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold">No saved items</h3>
            <p className="mt-2 text-sm text-gray-500">
              When you see interesting research, bookmark it to save it here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
