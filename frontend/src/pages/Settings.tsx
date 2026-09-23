import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-gray-500">Manage your account settings and application preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Profile settings placeholder.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Notification preferences placeholder.</p>
        </CardContent>
      </Card>
    </div>
  );
}
