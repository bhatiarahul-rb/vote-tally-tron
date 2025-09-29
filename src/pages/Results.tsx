import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useVoting } from '@/hooks/useVoting';
import { TeamCard } from '@/components/TeamCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Trophy } from 'lucide-react';

export default function Results() {
  const { user, signOut } = useAuth();
  const { teams, loading, isResultsAvailable } = useVoting();

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

  const resultsAvailable = isResultsAvailable();
  const sortedTeams = [...teams].sort((a, b) => b.votes - a.votes);
  const totalVotes = teams.reduce((sum, team) => sum + team.votes, 0);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Voting Results</h1>
              <p className="text-muted-foreground">See how the teams performed</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {!resultsAvailable && (
            <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
                  Results Not Yet Available
                </h2>
                <p className="text-yellow-600 dark:text-yellow-400">
                  Voting is still active. Results will be available after the voting period ends.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Final Results</h2>
            <p className="text-muted-foreground text-lg">
              Total votes cast: <span className="font-semibold">{totalVotes}</span>
            </p>
          </div>

          {resultsAvailable && sortedTeams.length > 0 && (
            <div className="space-y-6">
              {/* Winner */}
              {sortedTeams[0] && (
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-center">🥇 Winner</h3>
                  <div className="max-w-md mx-auto">
                    <TeamCard
                      team={sortedTeams[0]}
                      onVote={() => {}}
                      canVote={false}
                      hasVoted={false}
                      showResults={true}
                      rank={1}
                    />
                  </div>
                </div>
              )}

              {/* Runner-ups */}
              {sortedTeams.length > 1 && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-center">Runners-up</h3>
                  <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                    {sortedTeams[1] && (
                      <TeamCard
                        team={sortedTeams[1]}
                        onVote={() => {}}
                        canVote={false}
                        hasVoted={false}
                        showResults={true}
                        rank={2}
                      />
                    )}
                    {sortedTeams[2] && (
                      <TeamCard
                        team={sortedTeams[2]}
                        onVote={() => {}}
                        canVote={false}
                        hasVoted={false}
                        showResults={true}
                        rank={3}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* All teams leaderboard */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-center">Complete Leaderboard</h3>
                <div className="space-y-4 max-w-2xl mx-auto">
                  {sortedTeams.map((team, index) => (
                    <Card key={team.id} className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-muted-foreground">
                            #{index + 1}
                          </span>
                          <div>
                            <h4 className="font-semibold">{team.team_name}</h4>
                            {team.description && (
                              <p className="text-sm text-muted-foreground">{team.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{team.votes}</div>
                          <div className="text-sm text-muted-foreground">
                            {team.votes === 1 ? 'vote' : 'votes'}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}