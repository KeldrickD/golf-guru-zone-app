import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Users, Trophy, MapPin, Clock, Search, Filter } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  type: 'tournament' | 'meetup' | 'clinic';
  date: string;
  location: string;
  description: string;
  participants: number;
  maxParticipants: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'all';
  cost: number;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  location: string;
  skillLevel: string;
  meetingFrequency: string;
  image: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Spring Amateur Tournament',
    type: 'tournament',
    date: '2024-04-15',
    location: 'Pine Valley Golf Club',
    description: 'Annual spring tournament for amateur golfers. Prizes for multiple divisions.',
    participants: 45,
    maxParticipants: 72,
    skillLevel: 'all',
    cost: 75
  },
  {
    id: '2',
    title: 'Beginner Golf Clinic',
    type: 'clinic',
    date: '2024-04-20',
    location: 'Golf Academy Center',
    description: 'Learn the basics of golf with our PGA certified instructors.',
    participants: 12,
    maxParticipants: 20,
    skillLevel: 'beginner',
    cost: 45
  },
  {
    id: '3',
    title: 'Weekend Golf Meetup',
    type: 'meetup',
    date: '2024-04-22',
    location: 'City Golf Links',
    description: 'Casual weekend golf meetup. All skill levels welcome.',
    participants: 8,
    maxParticipants: 16,
    skillLevel: 'all',
    cost: 0
  }
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Early Birds Golf Club',
    description: 'Group for early morning golfers. We meet at sunrise for rounds and breakfast.',
    members: 124,
    location: 'Multiple Courses',
    skillLevel: 'All Levels',
    meetingFrequency: 'Weekly',
    image: '/groups/early-birds.jpg'
  },
  {
    id: '2',
    name: 'Senior Golf Society',
    description: 'Social golf group for senior players. Regular tournaments and social events.',
    members: 86,
    location: 'City Golf Club',
    skillLevel: 'Intermediate',
    meetingFrequency: 'Bi-weekly',
    image: '/groups/seniors.jpg'
  },
  {
    id: '3',
    name: 'Ladies Golf Network',
    description: 'Supporting and connecting women golfers. Regular clinics and competitions.',
    members: 156,
    location: 'Various Venues',
    skillLevel: 'All Levels',
    meetingFrequency: 'Weekly',
    image: '/groups/ladies.jpg'
  }
];

export default function Community() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('all');

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesSkill = selectedSkillLevel === 'all' || event.skillLevel === selectedSkillLevel;
    return matchesSearch && matchesType && matchesSkill;
  });

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Events & Tournaments</TabsTrigger>
          <TabsTrigger value="groups">Golf Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                className="px-3 py-2 border rounded-md"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="tournament">Tournaments</option>
                <option value="meetup">Meetups</option>
                <option value="clinic">Clinics</option>
              </select>
              <select
                className="px-3 py-2 border rounded-md"
                value={selectedSkillLevel}
                onChange={(e) => setSelectedSkillLevel(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </div>
                      <Badge variant={event.type === 'tournament' ? 'default' : 'secondary'}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{event.participants}/{event.maxParticipants} participants</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-gray-500" />
                        <span>Skill Level: {event.skillLevel}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-lg font-semibold">
                      {event.cost === 0 ? 'Free' : `$${event.cost}`}
                    </span>
                    <Button>Register</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="groups">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGroups.map((group) => (
                <Card key={group.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{group.name}</CardTitle>
                        <CardDescription>{group.description}</CardDescription>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                        <img
                          src={group.image}
                          alt={group.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{group.members} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{group.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-gray-500" />
                        <span>{group.skillLevel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Meets {group.meetingFrequency}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Join Group</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 