import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Badge } from '@/components/ui/Badge';
import { Calendar } from '@/components/ui/Calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Calendar as CalendarIcon, Users, Trophy, MapPin, Clock, Search, Filter, MessageCircle, Bell } from 'lucide-react';
import { format } from 'date-fns';

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
  rsvpStatus?: 'going' | 'maybe' | 'not-going';
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
  joined?: boolean;
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
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRSVPDialog, setShowRSVPDialog] = useState(false);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesSkill = selectedSkillLevel === 'all' || event.skillLevel === selectedSkillLevel;
    const matchesDate = !selectedDate || format(new Date(event.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    return matchesSearch && matchesType && matchesSkill && matchesDate;
  });

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRSVP = (eventId: string, status: 'going' | 'maybe' | 'not-going') => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            rsvpStatus: status,
            participants: status === 'going' 
              ? (event.rsvpStatus === 'going' ? event.participants : event.participants + 1)
              : (event.rsvpStatus === 'going' ? event.participants - 1 : event.participants)
          }
        : event
    ));
    setShowRSVPDialog(false);
  };

  const handleJoinGroup = (groupId: string) => {
    setGroups(groups.map(group =>
      group.id === groupId
        ? { ...group, joined: !group.joined, members: group.joined ? group.members - 1 : group.members + 1 }
        : group
    ));
  };

  const getEventsByDate = (date: Date) => {
    return events.filter(event => 
      format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Events & Tournaments</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
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
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
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
                    <Dialog open={showRSVPDialog && selectedEvent?.id === event.id} onOpenChange={(open) => {
                      setShowRSVPDialog(open);
                      if (open) setSelectedEvent(event);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant={event.rsvpStatus === 'going' ? 'default' : 'outline'}>
                          {event.rsvpStatus === 'going' ? 'Going' : 'RSVP'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>RSVP to {event.title}</DialogTitle>
                          <DialogDescription>
                            Let others know if you plan to attend this event.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-3 gap-4">
                          <Button
                            variant={event.rsvpStatus === 'going' ? 'default' : 'outline'}
                            onClick={() => handleRSVP(event.id, 'going')}
                          >
                            Going
                          </Button>
                          <Button
                            variant={event.rsvpStatus === 'maybe' ? 'default' : 'outline'}
                            onClick={() => handleRSVP(event.id, 'maybe')}
                          >
                            Maybe
                          </Button>
                          <Button
                            variant={event.rsvpStatus === 'not-going' ? 'default' : 'outline'}
                            onClick={() => handleRSVP(event.id, 'not-going')}
                          >
                            Can't Go
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Calendar</CardTitle>
                <CardDescription>View and manage upcoming events</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    hasEvent: (date) => getEventsByDate(date).length > 0,
                  }}
                  modifiersStyles={{
                    hasEvent: { backgroundColor: 'rgba(34, 197, 94, 0.1)', fontWeight: 'bold' }
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a Date'}
                </CardTitle>
                <CardDescription>
                  {selectedDate ? `Events on ${format(selectedDate, 'MMMM d')}` : 'Click a date to view events'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {selectedDate ? (
                    getEventsByDate(selectedDate).length > 0 ? (
                      <div className="space-y-4">
                        {getEventsByDate(selectedDate).map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-2 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{event.title}</h4>
                              <p className="text-sm text-gray-500">{event.location}</p>
                            </div>
                            <Badge variant={event.type === 'tournament' ? 'default' : 'secondary'}>
                              {event.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">No events scheduled for this date</p>
                    )
                  ) : (
                    <p className="text-center text-gray-500">Select a date to view events</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
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
                  <CardFooter className="flex gap-2">
                    <Button 
                      variant={group.joined ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => handleJoinGroup(group.id)}
                    >
                      {group.joined ? 'Leave Group' : 'Join Group'}
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Bell className="h-4 w-4" />
                    </Button>
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