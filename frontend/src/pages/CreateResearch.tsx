import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function CreateResearch() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate creation and redirect
    navigate('/research/1');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create Research Topic</h2>
        <p className="text-gray-500">Set up a new topic to start tracking automated updates.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Topic Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Topic Title</label>
              <input
                id="title"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g., Quantum Computing Advancements"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="keywords" className="text-sm font-medium">Keywords</label>
              <input
                id="keywords"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g., quantum, computing, qubits"
              />
              <p className="text-xs text-gray-500">Comma separated keywords for n8n to track.</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="frequency" className="text-sm font-medium">Update Frequency</label>
              <select
                id="frequency"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="realtime">Real-time</option>
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit">Create Topic</Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
