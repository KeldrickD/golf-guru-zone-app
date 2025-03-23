import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Search, Book, HelpCircle, ChevronRight, Star, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Rule {
  id: string;
  title: string;
  description: string;
  category: string;
  examples: string[];
  relatedRules: string[];
  helpfulCount: number;
  notHelpfulCount: number;
}

const mockRules: Rule[] = [
  {
    id: '1',
    title: 'Ball Lost or Out of Bounds',
    description: 'If a ball is lost or out of bounds, the player must take stroke-and-distance relief by adding one penalty stroke and playing the original ball or another ball from where the previous stroke was made.',
    category: 'General Rules',
    examples: [
      'Player hits ball into thick rough and cannot find it',
      'Ball lands beyond the course boundaries',
      'Ball enters a water hazard'
    ],
    relatedRules: ['Stroke and Distance', 'Provisional Ball', 'Water Hazards'],
    helpfulCount: 245,
    notHelpfulCount: 12
  },
  {
    id: '2',
    title: 'Putting Green Rules',
    description: 'On the putting green, players may mark, lift, clean, and replace their ball. They may also repair damage on the putting green, including ball marks and old hole plugs.',
    category: 'Putting',
    examples: [
      'Marking ball position on green',
      'Cleaning ball on green',
      'Repairing ball marks'
    ],
    relatedRules: ['Ball Marking', 'Green Repair', 'Ball Cleaning'],
    helpfulCount: 189,
    notHelpfulCount: 8
  },
  {
    id: '3',
    title: 'Bunker Rules',
    description: 'In a bunker, players must not touch the sand with their hand, club, or any other object to test the condition of the bunker or for any other reason.',
    category: 'Hazards',
    examples: [
      'Testing sand condition',
      'Removing loose impediments',
      'Taking practice swings'
    ],
    relatedRules: ['Hazard Play', 'Loose Impediments', 'Practice Swings'],
    helpfulCount: 167,
    notHelpfulCount: 15
  }
];

const categories = ['All Rules', 'General Rules', 'Putting', 'Hazards', 'Equipment', 'Etiquette'];

export default function GolfRules() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Rules');
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

  const filteredRules = mockRules.filter(rule => {
    const matchesSearch = rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Rules' || rule.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRuleSelect = (rule: Rule) => {
    setSelectedRule(rule);
  };

  const handleHelpful = (ruleId: string) => {
    // In a real app, this would update the database
    console.log('Marked as helpful:', ruleId);
  };

  const handleNotHelpful = (ruleId: string) => {
    // In a real app, this would update the database
    console.log('Marked as not helpful:', ruleId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Rules List */}
      <Card>
        <CardHeader>
          <CardTitle>Golf Rules</CardTitle>
          <CardDescription>Search and browse official golf rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {filteredRules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedRule?.id === rule.id
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                    onClick={() => handleRuleSelect(rule)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{rule.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {rule.category}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Rule Details */}
      <Card>
        <CardHeader>
          <CardTitle>Rule Details</CardTitle>
          <CardDescription>
            {selectedRule ? 'Detailed explanation of the selected rule' : 'Select a rule to view details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedRule ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedRule.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedRule.description}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Examples:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  {selectedRule.examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Related Rules:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRule.relatedRules.map((rule, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm"
                    >
                      {rule}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleHelpful(selectedRule.id)}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({selectedRule.helpfulCount})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNotHelpful(selectedRule.id)}
                  className="flex items-center gap-2"
                >
                  <ThumbsDown className="h-4 w-4" />
                  Not Helpful ({selectedRule.notHelpfulCount})
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
              <Book className="h-12 w-12 mb-4" />
              <p>Select a rule from the list to view its details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 