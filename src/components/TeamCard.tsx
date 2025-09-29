import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vote, CheckCircle } from 'lucide-react';
import { Team } from '@/hooks/useVoting';

interface TeamCardProps {
  team: Team;
  onVote: (teamId: string) => void;
  canVote: boolean;
  hasVoted: boolean;
  showResults?: boolean;
  rank?: number;
}

export function TeamCard({ team, onVote, canVote, hasVoted, showResults = false, rank }: TeamCardProps) {
  const getRankBadge = () => {
    if (!rank || !showResults) return null;
    
    const badges = {
      1: { text: '🥇 Winner', variant: 'default' as const },
      2: { text: '🥈 Runner-up', variant: 'secondary' as const },
      3: { text: '🥉 2nd Runner-up', variant: 'outline' as const }
    };
    
    return badges[rank as keyof typeof badges];
  };

  const badge = getRankBadge();

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{team.team_name}</CardTitle>
          {badge && (
            <Badge variant={badge.variant} className="ml-2">
              {badge.text}
            </Badge>
          )}
        </div>
        {team.description && (
          <p className="text-muted-foreground">{team.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-lg">
            <span className="font-semibold">{team.votes}</span>
            <span className="text-muted-foreground ml-1">
              {team.votes === 1 ? 'vote' : 'votes'}
            </span>
          </div>
          
          {!showResults && (
            <Button
              onClick={() => onVote(team.id)}
              disabled={!canVote || hasVoted}
              variant={hasVoted ? "outline" : "default"}
              className="flex items-center gap-2"
            >
              {hasVoted ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Voted
                </>
              ) : (
                <>
                  <Vote className="h-4 w-4" />
                  Vote
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}