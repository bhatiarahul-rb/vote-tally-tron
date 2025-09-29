import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Vote, Trophy, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/vote" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Vote className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-5xl font-bold mb-4">Voting Portal</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Make your voice heard! Cast your vote for your favorite team and see the results in real-time.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto mb-16">
          <Card>
            <CardHeader className="text-center">
              <Vote className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Cast Your Vote</CardTitle>
              <CardDescription>
                Choose your favorite team from the available options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• One vote per user</li>
                <li>• Secure authentication</li>
                <li>• Real-time countdown</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>View Results</CardTitle>
              <CardDescription>
                See live standings and final results after voting ends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Winner announcement</li>
                <li>• Complete leaderboard</li>
                <li>• Vote statistics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>
                Manage teams and voting configuration (admin access required)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Add/remove teams</li>
                <li>• Monitor vote counts</li>
                <li>• Manage deadlines</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="mr-4">
            <a href="/auth">Get Started</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/results">View Results</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
