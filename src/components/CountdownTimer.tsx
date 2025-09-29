import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CountdownTimerProps {
  getTimeRemaining: () => { days: number; hours: number; minutes: number; seconds: number } | null;
}

export function CountdownTimer({ getTimeRemaining }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [getTimeRemaining]);

  if (!timeLeft) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold text-destructive">Voting Has Ended</h2>
          <p className="text-muted-foreground mt-2">Check the results page to see the winners!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Time Remaining</h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-primary text-primary-foreground rounded-lg p-4">
            <div className="text-2xl font-bold">{timeLeft.days}</div>
            <div className="text-sm">Days</div>
          </div>
          <div className="bg-primary text-primary-foreground rounded-lg p-4">
            <div className="text-2xl font-bold">{timeLeft.hours}</div>
            <div className="text-sm">Hours</div>
          </div>
          <div className="bg-primary text-primary-foreground rounded-lg p-4">
            <div className="text-2xl font-bold">{timeLeft.minutes}</div>
            <div className="text-sm">Minutes</div>
          </div>
          <div className="bg-primary text-primary-foreground rounded-lg p-4">
            <div className="text-2xl font-bold">{timeLeft.seconds}</div>
            <div className="text-sm">Seconds</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}