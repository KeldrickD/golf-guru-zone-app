'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Trophy, Star, Calendar, MapPin, Clock, Users } from 'lucide-react';

interface Tournament {
  id: string;
  name: string;
  date: string;
  location: string;
  course: string;
  purse: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  leaderboard?: Player[];
  teeTime?: string;
}

interface Player {
  position: number;
  name: string;
  score: number;
  today: number;
  thru: string | number;
  earnings?: string;
}

const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: 'The Masters',
    date: '2024-04-11',
    location: 'Augusta, GA',
    course: 'Augusta National Golf Club',
    purse: '$11,500,000',
    status: 'upcoming',
    teeTime: '8:30 AM ET',
  },
  {
    id: '2',
    name: 'PGA Championship',
    date: '2024-05-16',
    location: 'Louisville, KY',
    course: 'Valhalla Golf Club',
    purse: '$12,000,000',
    status: 'upcoming',
  },
  {
    id: '3',
    name: 'The Open Championship',
    date: '2024-07-18',
    location: 'Troon, Scotland',
    course: 'Royal Troon Golf Club',
    purse: '$10,750,000',
    status: 'upcoming',
  },
];

const mockLeaderboard: Player[] = [
  { position: 1, name: 'John Smith', score: -12, today: -4, thru: 'F' },
  { position: 2, name: 'Michael Johnson', score: -10, today: -2, thru: 'F' },
  { position: 3, name: 'David Williams', score: -8, today: -1, thru: 16 },
  { position: 4, name: 'Robert Brown', score: -7, today: +1, thru: 'F' },
  { position: 5, name: 'James Davis', score: -6, today: -3, thru: 15 },
];

export const TournamentTracker = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>(mockTournaments);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleFavoriteToggle = (tournamentId: string) => {
    setFavorites(prev =>
      prev.includes(tournamentId)
        ? prev.filter(id => id !== tournamentId)
        : [...prev, tournamentId]
    );
  };

  const filterTournaments = (status: 'upcoming' | 'ongoing' | 'completed') => {
    return tournaments.filter(t => t.status === status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          Tournament Tracker
        </CardTitle>
        <CardDescription>
          Follow professional golf tournaments and track live leaderboards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Live Now</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="grid gap-4">
              {filterTournaments('upcoming').map((tournament) => (
                <Card key={tournament.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{tournament.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFavoriteToggle(tournament.id)}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                favorites.includes(tournament.id)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-400'
                              }`}
                            />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(tournament.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {tournament.location}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Course:</span> {tournament.course}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Purse:</span> {tournament.purse}
                        </div>
                        {tournament.teeTime && (
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4" />
                            First Tee Time: {tournament.teeTime}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ongoing">
            <Card>
              <CardHeader>
                <CardTitle>The Masters - Round 3</CardTitle>
                <CardDescription>Live Leaderboard</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">POS</TableHead>
                      <TableHead>PLAYER</TableHead>
                      <TableHead className="text-right">TOTAL</TableHead>
                      <TableHead className="text-right">TODAY</TableHead>
                      <TableHead className="text-right">THRU</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLeaderboard.map((player) => (
                      <TableRow key={player.name}>
                        <TableCell>{player.position}</TableCell>
                        <TableCell className="font-medium">{player.name}</TableCell>
                        <TableCell className="text-right">
                          {player.score > 0 ? `+${player.score}` : player.score}
                        </TableCell>
                        <TableCell className="text-right">
                          {player.today > 0 ? `+${player.today}` : player.today}
                        </TableCell>
                        <TableCell className="text-right">{player.thru}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <div className="text-center py-8 text-muted-foreground">
              <Users className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Completed Tournaments</h3>
              <p>Check back later for tournament results and statistics.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 