'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Flag, Maximize, Minimize, MapPin, Map as MapIcon, Golf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Interface for hole data
interface HoleData {
  number: number;
  par: number;
  distance: number;
  hcp: number; // Handicap rating
  coordinates: {
    tee: { x: number; y: number };
    fairway?: { x: number; y: number }[];
    green: { x: number; y: number };
    hazards?: { x: number; y: number; type: 'water' | 'bunker' | 'trees' }[];
  };
  strokesGained?: number;
  avgScore?: number;
}

interface CourseData {
  id: string;
  name: string;
  holes: HoleData[];
  layout?: {
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape';
  };
}

interface CourseMapProps {
  courseId?: string;
  initialHole?: number;
  showStats?: boolean;
  interactive?: boolean;
  onHoleClick?: (holeNumber: number) => void;
  userShots?: any[]; // Optional user shot data to display
}

// Mock course data for a 9-hole course
const mockCourseData: CourseData = {
  id: 'pine-valley',
  name: 'Pine Valley Golf Club',
  layout: {
    width: 800,
    height: 600,
    orientation: 'landscape',
  },
  holes: [
    {
      number: 1,
      par: 4,
      distance: 380,
      hcp: 7,
      coordinates: {
        tee: { x: 100, y: 450 },
        fairway: [
          { x: 150, y: 400 },
          { x: 200, y: 350 },
          { x: 250, y: 300 },
        ],
        green: { x: 300, y: 250 },
        hazards: [
          { x: 180, y: 380, type: 'bunker' },
          { x: 270, y: 270, type: 'bunker' },
        ]
      },
      strokesGained: 0.2,
      avgScore: 4.3
    },
    {
      number: 2,
      par: 3,
      distance: 175,
      hcp: 9,
      coordinates: {
        tee: { x: 350, y: 250 },
        green: { x: 500, y: 250 },
        hazards: [
          { x: 425, y: 230, type: 'bunker' },
          { x: 450, y: 270, type: 'bunker' },
          { x: 420, y: 280, type: 'water' },
        ]
      },
      strokesGained: -0.5,
      avgScore: 3.7
    },
    {
      number: 3,
      par: 5,
      distance: 520,
      hcp: 3,
      coordinates: {
        tee: { x: 550, y: 250 },
        fairway: [
          { x: 600, y: 300 },
          { x: 650, y: 350 },
          { x: 600, y: 400 },
        ],
        green: { x: 550, y: 450 },
        hazards: [
          { x: 620, y: 330, type: 'bunker' },
          { x: 580, y: 420, type: 'water' },
        ]
      },
      strokesGained: 0.8,
      avgScore: 5.1
    },
    {
      number: 4,
      par: 4,
      distance: 410,
      hcp: 5,
      coordinates: {
        tee: { x: 500, y: 500 },
        fairway: [
          { x: 450, y: 450 },
          { x: 400, y: 400 },
        ],
        green: { x: 350, y: 350 },
        hazards: [
          { x: 420, y: 420, type: 'bunker' },
          { x: 370, y: 380, type: 'trees' },
        ]
      },
      strokesGained: -0.2,
      avgScore: 4.5
    },
    {
      number: 5,
      par: 3,
      distance: 155,
      hcp: 11,
      coordinates: {
        tee: { x: 300, y: 350 },
        green: { x: 300, y: 200 },
        hazards: [
          { x: 280, y: 250, type: 'bunker' },
          { x: 320, y: 250, type: 'bunker' },
        ]
      },
      strokesGained: 0.1,
      avgScore: 3.2
    },
    {
      number: 6,
      par: 4,
      distance: 425,
      hcp: 1,
      coordinates: {
        tee: { x: 300, y: 150 },
        fairway: [
          { x: 250, y: 100 },
          { x: 200, y: 150 },
        ],
        green: { x: 150, y: 200 },
        hazards: [
          { x: 220, y: 130, type: 'water' },
          { x: 180, y: 170, type: 'bunker' },
        ]
      },
      strokesGained: -0.9,
      avgScore: 4.8
    },
    {
      number: 7,
      par: 5,
      distance: 535,
      hcp: 13,
      coordinates: {
        tee: { x: 100, y: 200 },
        fairway: [
          { x: 150, y: 150 },
          { x: 200, y: 100 },
          { x: 250, y: 50 },
        ],
        green: { x: 300, y: 50 },
        hazards: [
          { x: 170, y: 130, type: 'trees' },
          { x: 270, y: 60, type: 'bunker' },
        ]
      },
      strokesGained: 0.4,
      avgScore: 5.3
    },
    {
      number: 8,
      par: 4,
      distance: 400,
      hcp: 15,
      coordinates: {
        tee: { x: 350, y: 50 },
        fairway: [
          { x: 400, y: 50 },
          { x: 450, y: 100 },
        ],
        green: { x: 500, y: 150 },
        hazards: [
          { x: 430, y: 80, type: 'bunker' },
          { x: 480, y: 130, type: 'trees' },
        ]
      },
      strokesGained: 0.6,
      avgScore: 4.1
    },
    {
      number: 9,
      par: 4,
      distance: 395,
      hcp: 17,
      coordinates: {
        tee: { x: 550, y: 150 },
        fairway: [
          { x: 600, y: 150 },
          { x: 650, y: 200 },
        ],
        green: { x: 700, y: 250 },
        hazards: [
          { x: 620, y: 170, type: 'bunker' },
          { x: 680, y: 230, type: 'bunker' },
        ]
      },
      strokesGained: 0.3,
      avgScore: 4.2
    }
  ]
};

const CourseMap: React.FC<CourseMapProps> = ({
  courseId = 'pine-valley',
  initialHole = 1,
  showStats = true,
  interactive = true,
  onHoleClick,
  userShots = []
}) => {
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedHole, setSelectedHole] = useState<number>(initialHole);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [viewBox, setViewBox] = useState<string>('0 0 800 600');
  const mapRef = useRef<SVGSVGElement>(null);
  
  // Fetch course data
  useEffect(() => {
    // In a real app, this would be an API call
    setLoading(true);
    setTimeout(() => {
      setCourse(mockCourseData);
      setLoading(false);
    }, 1000);
  }, [courseId]);
  
  // Handle hole selection
  const handleHoleSelect = (holeNumber: number) => {
    if (!interactive) return;
    
    setSelectedHole(holeNumber);
    if (onHoleClick) {
      onHoleClick(holeNumber);
    }
    
    // Focus on selected hole area in the map
    const hole = course?.holes.find(h => h.number === holeNumber);
    if (hole && mapRef.current) {
      const { tee, green } = hole.coordinates;
      const padding = 50;
      
      // Calculate viewport that includes tee and green with padding
      const minX = Math.min(tee.x, green.x) - padding;
      const minY = Math.min(tee.y, green.y) - padding;
      const maxX = Math.max(tee.x, green.x) + padding;
      const maxY = Math.max(tee.y, green.y) + padding;
      
      const width = maxX - minX;
      const height = maxY - minY;
      
      setViewBox(`${minX} ${minY} ${width} ${height}`);
    }
  };
  
  // Toggle fullscreen view
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    // Reset viewbox when toggling
    if (fullscreen) {
      setViewBox('0 0 800 600');
    }
  };
  
  // Reset view to show entire course
  const resetView = () => {
    setViewBox('0 0 800 600');
  };
  
  // Get current hole data
  const currentHole = course?.holes.find(h => h.number === selectedHole);
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (!course) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <MapIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Course data not available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${fullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-950 p-4' : 'relative w-full'}`}
      >
        <Card className={`w-full ${fullscreen ? 'h-full' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>
                  Interactive Course Map
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className={`${fullscreen ? 'h-[calc(100%-8rem)]' : 'h-[400px]'} relative`}>
            <div className="flex h-full">
              {/* Hole selector sidebar */}
              <div className="w-20 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
                {course.holes.map(hole => (
                  <button
                    key={hole.number}
                    onClick={() => handleHoleSelect(hole.number)}
                    className={`w-full p-2 text-center transition-colors ${
                      selectedHole === hole.number 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="text-lg font-semibold">{hole.number}</div>
                    <div className="text-xs">Par {hole.par}</div>
                    <div className="text-xs text-gray-500">{hole.distance}y</div>
                  </button>
                ))}
              </div>
              
              {/* Course map area */}
              <div className="flex-1 relative overflow-hidden">
                <svg
                  ref={mapRef}
                  viewBox={viewBox}
                  className="w-full h-full"
                  style={{ background: '#e7f0e7' }} // Light green for grass
                >
                  {/* Draw all holes */}
                  {course.holes.map(hole => (
                    <g key={hole.number} opacity={selectedHole === hole.number ? 1 : 0.5}>
                      {/* Draw fairway */}
                      {hole.coordinates.fairway && (
                        <path
                          d={`M ${hole.coordinates.tee.x} ${hole.coordinates.tee.y} ${
                            hole.coordinates.fairway.map(point => `L ${point.x} ${point.y}`).join(' ')
                          } L ${hole.coordinates.green.x} ${hole.coordinates.green.y}`}
                          fill="none"
                          stroke="#a3d39c"
                          strokeWidth="30"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeOpacity="0.6"
                        />
                      )}
                      
                      {/* Draw straight line for par 3's */}
                      {hole.par === 3 && (
                        <line
                          x1={hole.coordinates.tee.x}
                          y1={hole.coordinates.tee.y}
                          x2={hole.coordinates.green.x}
                          y2={hole.coordinates.green.y}
                          stroke="#a3d39c"
                          strokeWidth="20"
                          strokeOpacity="0.6"
                        />
                      )}
                      
                      {/* Draw hazards */}
                      {hole.coordinates.hazards?.map((hazard, i) => {
                        if (hazard.type === 'water') {
                          return (
                            <circle
                              key={i}
                              cx={hazard.x}
                              cy={hazard.y}
                              r="15"
                              fill="#77addf"
                              opacity="0.8"
                            />
                          );
                        } else if (hazard.type === 'bunker') {
                          return (
                            <circle
                              key={i}
                              cx={hazard.x}
                              cy={hazard.y}
                              r="10"
                              fill="#e8d68b"
                              stroke="#d4c27a"
                              strokeWidth="1"
                            />
                          );
                        } else {
                          return (
                            <circle
                              key={i}
                              cx={hazard.x}
                              cy={hazard.y}
                              r="12"
                              fill="#5a9359"
                              opacity="0.7"
                            />
                          );
                        }
                      })}
                      
                      {/* Draw tee box */}
                      <circle
                        cx={hole.coordinates.tee.x}
                        cy={hole.coordinates.tee.y}
                        r="8"
                        fill="#333"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                      
                      {/* Draw green */}
                      <circle
                        cx={hole.coordinates.green.x}
                        cy={hole.coordinates.green.y}
                        r="15"
                        fill="#7bc043"
                        stroke="#5a9359"
                        strokeWidth="2"
                      />
                      
                      {/* Draw flag */}
                      <line
                        x1={hole.coordinates.green.x}
                        y1={hole.coordinates.green.y}
                        x2={hole.coordinates.green.x}
                        y2={hole.coordinates.green.y - 20}
                        stroke="#333"
                        strokeWidth="1.5"
                      />
                      <polygon
                        points={`${hole.coordinates.green.x},${hole.coordinates.green.y - 20} ${hole.coordinates.green.x + 8},${hole.coordinates.green.y - 15} ${hole.coordinates.green.x},${hole.coordinates.green.y - 10}`}
                        fill="red"
                      />
                      
                      {/* Hole number label */}
                      <text
                        x={hole.coordinates.tee.x + 15}
                        y={hole.coordinates.tee.y + 5}
                        fontSize="12"
                        fontWeight="bold"
                        fill="#333"
                      >
                        {hole.number}
                      </text>
                    </g>
                  ))}
                  
                  {/* User shots if provided */}
                  {userShots.map((shot, i) => (
                    <circle
                      key={i}
                      cx={shot.x}
                      cy={shot.y}
                      r="4"
                      fill="red"
                      opacity="0.8"
                    />
                  ))}
                </svg>
                
                {/* Zoom controls */}
                <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={resetView}
                    className="bg-white dark:bg-gray-800 shadow-md"
                  >
                    <MapIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          
          {showStats && currentHole && (
            <CardFooter className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Hole {currentHole.number} Stats</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Par: {currentHole.par}</span>
                    <span className="text-sm text-gray-500">Distance: {currentHole.distance} yards</span>
                    <span className="text-sm text-gray-500">Handicap: {currentHole.hcp}</span>
                  </div>
                </div>
                
                {/* Player stats */}
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm">
                    <div className="text-xs text-gray-500 mb-1">Avg. Score</div>
                    <div className="font-semibold">{currentHole.avgScore}</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm">
                    <div className="text-xs text-gray-500 mb-1">Strokes Gained</div>
                    <div className={`font-semibold ${currentHole.strokesGained! > 0 ? 'text-green-600' : currentHole.strokesGained! < 0 ? 'text-red-600' : ''}`}>
                      {currentHole.strokesGained! > 0 ? '+' : ''}{currentHole.strokesGained}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm">
                    <div className="text-xs text-gray-500 mb-1">Difficulty Rank</div>
                    <div className="font-semibold">
                      {currentHole.hcp} of 18
                    </div>
                  </div>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default CourseMap; 