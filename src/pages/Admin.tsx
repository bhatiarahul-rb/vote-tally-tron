import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useVoting } from '@/hooks/useVoting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Shield } from 'lucide-react';

export default function Admin() {
  const { user, signOut } = useAuth();
  const { teams, profile, loading, refetch } = useVoting();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const teamName = formData.get('teamName') as string;
    const description = formData.get('description') as string;
    
    const { error } = await supabase
      .from('teams')
      .insert([{ team_name: teamName, description }]);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to add team",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Team added successfully"
      });
      (e.target as HTMLFormElement).reset();
      await refetch();
    }
    
    setIsLoading(false);
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team?')) return;
    
    setIsLoading(true);
    
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete team",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Team deleted successfully"
      });
      await refetch();
    }
    
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage teams and voting configuration</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Add Team Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Team</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTeam} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    name="teamName"
                    type="text"
                    placeholder="Enter team name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter team description (optional)"
                    rows={3}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Team"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Teams Management */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teams.map((team) => (
                  <div key={team.id} className="flex justify-between items-start p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{team.team_name}</h3>
                      {team.description && (
                        <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
                      )}
                      <p className="text-sm font-medium mt-2">
                        Votes: {team.votes}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTeam(team.id)}
                      disabled={isLoading}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voting Statistics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Voting Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{teams.length}</div>
                <div className="text-sm text-muted-foreground">Total Teams</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">
                  {teams.reduce((sum, team) => sum + team.votes, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Votes</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">
                  {teams.length > 0 ? Math.max(...teams.map(t => t.votes)) : 0}
                </div>
                <div className="text-sm text-muted-foreground">Highest Votes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}