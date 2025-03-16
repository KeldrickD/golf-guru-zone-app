'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Star,
  Award,
  DollarSign,
  Users,
  GraduationCap,
} from 'lucide-react';
import { Calendar } from "@/components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

interface Instructor {
  id: string;
  name: string;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  specialties: string[];
  experience: string;
  certifications: string[];
  availability: {
    [key: string]: string[]; // day: available times
  };
  pricing: {
    [key: string]: number; // duration: price
  };
  location: string;
}

const mockInstructors: Instructor[] = [
  {
    id: '1',
    name: 'John Smith',
    title: 'PGA Professional',
    image: '/instructors/john-smith.jpg',
    rating: 4.8,
    reviews: 124,
    specialties: ['Beginners', 'Short Game', 'Putting'],
    experience: '15+ years',
    certifications: ['PGA Class A', 'TPI Certified'],
    availability: {
      'Monday': ['09:00', '10:00', '14:00', '15:00'],
      'Tuesday': ['09:00', '10:00', '11:00', '14:00'],
      'Wednesday': ['13:00', '14:00', '15:00', '16:00'],
      'Thursday': ['09:00', '10:00', '14:00', '15:00'],
      'Friday': ['09:00', '10:00', '11:00', '14:00'],
    },
    pricing: {
      '30': 60,
      '60': 100,
      '90': 140,
    },
    location: 'Pine Valley Golf Club',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    title: 'LPGA Professional',
    image: '/instructors/sarah-johnson.jpg',
    rating: 4.9,
    reviews: 98,
    specialties: ['Women\'s Golf', 'Junior Golf', 'Full Swing'],
    experience: '12+ years',
    certifications: ['LPGA Class A', 'U.S. Kids Certified'],
    availability: {
      'Monday': ['10:00', '11:00', '15:00', '16:00'],
      'Wednesday': ['09:00', '10:00', '14:00', '15:00'],
      'Friday': ['10:00', '11:00', '14:00', '15:00'],
    },
    pricing: {
      '30': 55,
      '60': 95,
      '90': 135,
    },
    location: 'Oakmont Country Club',
  },
];

export const LessonBooking = () => {
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [selectedDuration, setSelectedDuration] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInstructors = mockInstructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.specialties.some(specialty =>
      specialty.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getAvailableTimes = (date: Date | undefined) => {
    if (!date || !selectedInstructor) return [];
    const dayOfWeek = format(date, 'EEEE');
    return selectedInstructor.availability[dayOfWeek] || [];
  };

  const handleBookLesson = () => {
    if (!selectedInstructor || !selectedDate || !selectedTime || !selectedDuration) {
      return;
    }

    // In a real app, this would make an API call to book the lesson
    alert(`Lesson booked with ${selectedInstructor.name} on ${format(selectedDate, 'PPP')} at ${selectedTime}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          Book a Golf Lesson
        </CardTitle>
        <CardDescription>
          Find and book lessons with local PGA professionals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Search Instructors</Label>
          <Input
            placeholder="Search by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInstructors.map((instructor) => (
            <Card
              key={instructor.id}
              className={`cursor-pointer transition-all ${
                selectedInstructor?.id === instructor.id
                  ? 'border-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedInstructor(instructor)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={instructor.image} alt={instructor.name} />
                    <AvatarFallback>{instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-medium">{instructor.name}</h3>
                    <p className="text-sm text-muted-foreground">{instructor.title}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{instructor.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({instructor.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-primary" />
                    <span>{instructor.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{instructor.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>From ${Math.min(...Object.values(instructor.pricing))}/lesson</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-1">
                    {instructor.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedInstructor && (
          <Card>
            <CardHeader>
              <CardTitle>Book Your Lesson</CardTitle>
              <CardDescription>
                Select your preferred date, time, and duration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Select Time</Label>
                  <Select
                    value={selectedTime}
                    onValueChange={setSelectedTime}
                    disabled={!selectedDate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pick a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTimes(selectedDate).map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Lesson Duration</Label>
                  <Select
                    value={selectedDuration}
                    onValueChange={setSelectedDuration}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(selectedInstructor.pricing).map(([duration, price]) => (
                        <SelectItem key={duration} value={duration}>
                          {duration} minutes - ${price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                {selectedDuration && (
                  <span>
                    Total: ${selectedInstructor.pricing[selectedDuration]}
                  </span>
                )}
              </div>
              <Button
                onClick={handleBookLesson}
                disabled={!selectedDate || !selectedTime || !selectedDuration}
              >
                Book Lesson
              </Button>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}; 