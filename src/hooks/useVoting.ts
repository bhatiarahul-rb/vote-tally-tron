import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Team {
  id: string;
  team_name: string;
  description: string;
  votes: number;
}

export interface VotingConfig {
  id: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  has_voted: boolean;
  is_admin: boolean;
}

export function useVoting() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [config, setConfig] = useState<VotingConfig | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('votes', { ascending: false });
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch teams",
        variant: "destructive"
      });
      return;
    }
    
    setTeams(data || []);
  };

  const fetchConfig = async () => {
    const { data, error } = await supabase
      .from('voting_config')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      toast({
        title: "Error",
        description: "Failed to fetch voting configuration",
        variant: "destructive"
      });
      return;
    }
    
    setConfig(data);
  };

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      toast({
        title: "Error",
        description: "Failed to fetch user profile",
        variant: "destructive"
      });
      return;
    }
    
    setProfile(data);
  };

  const castVote = async (teamId: string) => {
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "You must be logged in to vote",
        variant: "destructive"
      });
      return false;
    }

    if (profile.has_voted) {
      toast({
        title: "Error",
        description: "You have already voted",
        variant: "destructive"
      });
      return false;
    }

    if (!isVotingActive()) {
      toast({
        title: "Error",
        description: "Voting is not currently active",
        variant: "destructive"
      });
      return false;
    }

    const { error } = await supabase
      .from('votes')
      .insert([{ user_id: user.id, team_id: teamId }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to cast vote",
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Your vote has been cast!",
    });

    // Refresh data
    await Promise.all([fetchTeams(), fetchProfile()]);
    return true;
  };

  const isVotingActive = () => {
    if (!config) return false;
    const now = new Date();
    const startTime = new Date(config.start_time);
    const endTime = new Date(config.end_time);
    return now >= startTime && now <= endTime && config.is_active;
  };

  const isResultsAvailable = () => {
    if (!config) return false;
    const now = new Date();
    const endTime = new Date(config.end_time);
    return now > endTime;
  };

  const getTimeRemaining = () => {
    if (!config) return null;
    const now = new Date();
    const endTime = new Date(config.end_time);
    const timeLeft = endTime.getTime() - now.getTime();
    
    if (timeLeft <= 0) return null;
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchTeams(), fetchConfig()]);
      if (user) {
        await fetchProfile();
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  return {
    teams,
    config,
    profile,
    loading,
    castVote,
    isVotingActive,
    isResultsAvailable,
    getTimeRemaining,
    refetch: () => Promise.all([fetchTeams(), fetchConfig(), fetchProfile()])
  };
}