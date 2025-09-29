import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useVoting } from '@/hooks/useVoting';
import { CountdownTimer } from '@/components/CountdownTimer';
import { TeamCard } from '@/components/TeamCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Vote() {
  const { user, signOut } = useAuth();
  const { teams, profile, loading, castVote, isVotingActive, getTimeRemaining } = useVoting();

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

  const handleVote = async (teamId: string) => {
    await castVote(teamId);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const votingIsActive = isVotingActive();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Voting Portal</h1>
            {profile && (
              <p className="text-muted-foreground">Welcome, {profile.username}!</p>
            )}
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <CountdownTimer getTimeRemaining={getTimeRemaining} />

          {!votingIsActive && (
            <Card className="border-destructive">
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-semibold text-destructive mb-2">
                  Voting is Currently Inactive
                </h2>
                <p className="text-muted-foreground">
                  Voting is either not yet started or has ended. Check back later or view the results page.
                </p>
              </CardContent>
            </Card>
          )}

          {profile?.has_voted && (
            <Card className="border-green-500 bg-green-50 dark:bg-green-950">
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">
                  Thank You for Voting!
                </h2>
                <p className="text-green-600 dark:text-green-400">
                  Your vote has been recorded. You can view the current standings below.
                </p>
              </CardContent>
            </Card>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-6">Teams</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onVote={handleVote}
                  canVote={votingIsActive}
                  hasVoted={profile?.has_voted || false}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}