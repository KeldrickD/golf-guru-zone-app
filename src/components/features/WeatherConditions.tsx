'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  ThermometerSun,
  Compass,
  CloudSun,
  CloudLightning,
  CloudSnow,
  CloudFog,
} from 'lucide-react';
import { format, addDays } from 'date-fns';

interface WeatherData {
  date: string;
  temperature: number;
  condition: string;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  humidity: number;
  visibility: number;
  icon: keyof typeof weatherIcons;
}

interface Course {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const weatherIcons = {
  sunny: Sun,
  partlyCloudy: CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
  thunderstorm: CloudLightning,
  snow: CloudSnow,
  fog: CloudFog,
};

const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Pine Valley Golf Club',
    location: 'Pine Valley, NJ',
    coordinates: {
      lat: 39.7872,
      lng: -74.9701,
    },
  },
  {
    id: '2',
    name: 'Augusta National Golf Club',
    location: 'Augusta, GA',
    coordinates: {
      lat: 33.5021,
      lng: -82.0225,
    },
  },
  {
    id: '3',
    name: 'Pebble Beach Golf Links',
    location: 'Pebble Beach, CA',
    coordinates: {
      lat: 36.5725,
      lng: -121.9486,
    },
  },
];

const generateMockWeatherData = (days: number): WeatherData[] => {
  const conditions = ['sunny', 'partlyCloudy', 'cloudy', 'rain', 'thunderstorm'] as const;
  return Array.from({ length: days }, (_, i) => ({
    date: format(addDays(new Date(), i), 'yyyy-MM-dd'),
    temperature: Math.round(Math.random() * 20 + 15), // 15-35°C
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    windSpeed: Math.round(Math.random() * 20 + 5), // 5-25 km/h
    windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
    precipitation: Math.round(Math.random() * 100), // 0-100%
    humidity: Math.round(Math.random() * 40 + 40), // 40-80%
    visibility: Math.round(Math.random() * 5 + 5), // 5-10 km
    icon: conditions[Math.floor(Math.random() * conditions.length)],
  }));
};

export const WeatherConditions = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = mockCourses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedCourse) {
      // In a real app, this would fetch weather data from an API using the course coordinates
      setWeatherData(generateMockWeatherData(7));
    }
  }, [selectedCourse]);

  const getWeatherAdvice = (data: WeatherData) => {
    const conditions = [];

    if (data.temperature > 30) {
      conditions.push('Stay hydrated');
    }
    if (data.windSpeed > 20) {
      conditions.push('Strong winds may affect ball flight');
    }
    if (data.precipitation > 50) {
      conditions.push('High chance of rain');
    }
    if (data.visibility < 7) {
      conditions.push('Reduced visibility');
    }

    return conditions;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-6 w-6 text-primary" />
          Course Weather Conditions
        </CardTitle>
        <CardDescription>
          Check the weather forecast for your favorite golf courses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Search Courses</Label>
          <Input
            placeholder="Search by course name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className={`cursor-pointer transition-all ${
                selectedCourse?.id === course.id
                  ? 'border-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedCourse(course)}
            >
              <CardContent className="p-4">
                <h3 className="font-medium">{course.name}</h3>
                <p className="text-sm text-muted-foreground">{course.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedCourse && weatherData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedCourse.name} - 7 Day Forecast</CardTitle>
              <CardDescription>
                Weather conditions and playing recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {weatherData.map((data) => {
                  const WeatherIcon = weatherIcons[data.icon];
                  const advice = getWeatherAdvice(data);

                  return (
                    <Card key={data.date}>
                      <CardContent className="p-4">
                        <div className="text-center mb-4">
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(data.date), 'EEE, MMM d')}
                          </p>
                        </div>

                        <div className="flex justify-center mb-4">
                          <WeatherIcon className="h-12 w-12 text-primary" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Temperature</span>
                            <span className="font-medium">{data.temperature}°C</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Wind</span>
                            <span className="font-medium">
                              {data.windSpeed} km/h {data.windDirection}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Precipitation</span>
                            <span className="font-medium">{data.precipitation}%</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Humidity</span>
                            <span className="font-medium">{data.humidity}%</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Visibility</span>
                            <span className="font-medium">{data.visibility} km</span>
                          </div>
                        </div>

                        {advice.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium mb-2">Playing Conditions:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {advice.map((tip, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}; 