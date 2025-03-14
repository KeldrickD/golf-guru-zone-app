import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Search, BookOpen, Filter, Calendar } from 'lucide-react';

// Types and interfaces
interface OfficialRuling {
  id: string;
  title: string;
  description: string;
  ruleNumber: string;
  category: RulingCategory;
  date: string;
  source: string;
  keywords: string[];
  relatedRulings: string[];
  interpretation: string;
}

enum RulingCategory {
  GENERAL = "General Play",
  TEEING = "Teeing Area",
  BUNKERS = "Bunkers",
  PENALTY_AREAS = "Penalty Areas",
  PUTTING_GREEN = "Putting Green",
  EQUIPMENT = "Equipment",
  RELIEF = "Relief Situations",
  SCORING = "Scoring",
  ETIQUETTE = "Etiquette",
  COMPETITIONS = "Competitions"
}

// Sample data
const sampleRulings: OfficialRuling[] = [
  {
    id: "R2023-001",
    title: "Ball Moving After Address in Bunker",
    description: "Player addressed the ball in bunker, ball moved slightly before swing",
    ruleNumber: "9.4",
    category: RulingCategory.BUNKERS,
    date: "2023-04-15",
    source: "USGA Official Rulings",
    keywords: ["ball movement", "bunker", "address"],
    relatedRulings: ["R2023-002", "R2023-015"],
    interpretation: "If a player causes their ball to move in a bunker after addressing it, they incur a one-stroke penalty and must replace the ball."
  },
  {
    id: "R2023-002",
    title: "Temporary Water in Bunker",
    description: "Relief options for casual water in bunker during tournament play",
    ruleNumber: "16.1c",
    category: RulingCategory.BUNKERS,
    date: "2023-05-20",
    source: "R&A Decisions",
    keywords: ["casual water", "bunker", "relief"],
    relatedRulings: ["R2023-001", "R2023-008"],
    interpretation: "Player may take free relief in bunker, or relief outside bunker with one penalty stroke."
  }
];

export const OfficialRulingsDatabase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RulingCategory | "">("");
  const [filteredRulings, setFilteredRulings] = useState<OfficialRuling[]>(sampleRulings);
  const [selectedRuling, setSelectedRuling] = useState<OfficialRuling | null>(null);

  useEffect(() => {
    const filtered = sampleRulings.filter(ruling => {
      const matchesSearch = 
        ruling.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruling.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruling.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || ruling.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredRulings(filtered);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Official Golf Rulings Database</CardTitle>
          <CardDescription>
            Search through official rulings and interpretations from USGA and R&A
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rulings..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as RulingCategory)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {Object.values(RulingCategory).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="text-lg">Search Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  {filteredRulings.map((ruling) => (
                    <div
                      key={ruling.id}
                      className="mb-4 p-4 border rounded-lg cursor-pointer hover:bg-accent"
                      onClick={() => setSelectedRuling(ruling)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{ruling.title}</h3>
                        <Badge variant="secondary">{ruling.ruleNumber}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {ruling.description}
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline">{ruling.category}</Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {ruling.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="text-lg">Ruling Details</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  {selectedRuling ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{selectedRuling.title}</h3>
                        <div className="flex gap-2 mb-4">
                          <Badge>{selectedRuling.ruleNumber}</Badge>
                          <Badge variant="outline">{selectedRuling.category}</Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-muted-foreground">{selectedRuling.description}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Official Interpretation</h4>
                        <p className="text-muted-foreground">{selectedRuling.interpretation}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Keywords</h4>
                        <div className="flex gap-2 flex-wrap">
                          {selectedRuling.keywords.map((keyword) => (
                            <Badge key={keyword} variant="secondary">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Source Information</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>{selectedRuling.source}</span>
                          <span>•</span>
                          <Calendar className="h-4 w-4" />
                          <span>{selectedRuling.date}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                      <BookOpen className="h-12 w-12 mb-4" />
                      <p>Select a ruling to view detailed information</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 