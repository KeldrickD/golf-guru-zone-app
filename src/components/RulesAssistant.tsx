'use client';

import { useState, useEffect } from 'react';
import { Search, History, Book, ChevronRight, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Alert, AlertDescription, AlertTitle } from './ui/Alert';
import { Skeleton } from './ui/Skeleton';
import { Progress } from './ui/Progress';
import { ScrollArea } from './ui/ScrollArea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { Badge } from './ui/Badge';
import { useToast } from './ui/use-toast';

import RulesAssistantService, { RuleCategory, RuleQuery, RuleResponse, PopularQuery } from '@/services/rulesAssistantService';
import { useWallet } from '@/hooks/useWallet';
import { useSubscription } from '@/hooks/useSubscription';

const RulesAssistant = () => {
  // Services and hooks
  const rulesService = RulesAssistantService.getInstance();
  const { isConnected } = useWallet();
  const { tier } = useSubscription();
  const { toast } = useToast();
  
  // State
  const [activeTab, setActiveTab] = useState('ask');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RuleCategory>(RuleCategory.GENERAL);
  const [isLoading, setIsLoading] = useState(false);
  const [popularQueries, setPopularQueries] = useState<PopularQuery[]>([]);
  const [queryHistory, setQueryHistory] = useState<RuleQuery[]>([]);
  const [currentResponse, setCurrentResponse] = useState<RuleResponse | null>(null);
  const [remainingQueries, setRemainingQueries] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  // Load initial data
  useEffect(() => {
    loadPopularQueries();
    if (isConnected) {
      loadQueryHistory();
      updateRemainingQueries();
    }
  }, [isConnected]);
  
  // Load popular queries
  const loadPopularQueries = async () => {
    try {
      const queries = await rulesService.getPopularQueries();
      setPopularQueries(queries);
    } catch (error) {
      console.error('Error loading popular queries:', error);
      setError('Failed to load popular queries');
    }
  };
  
  // Load query history
  const loadQueryHistory = async () => {
    try {
      const history = await rulesService.getQueryHistory();
      setQueryHistory(history);
    } catch (error) {
      console.error('Error loading query history:', error);
      setError('Failed to load query history');
    }
  };
  
  // Update remaining queries
  const updateRemainingQueries = async () => {
    try {
      const remaining = await rulesService.getRemainingQueries();
      setRemainingQueries(remaining);
    } catch (error) {
      console.error('Error getting remaining queries:', error);
    }
  };
  
  // Handle query submission
  const handleSubmitQuery = async () => {
    if (!query.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a question about golf rules',
        variant: 'destructive'
      });
      return;
    }
    
    if (!isConnected) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your wallet to submit questions',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await rulesService.submitQuery(query, selectedCategory);
      if (response) {
        setCurrentResponse(response);
        await updateRemainingQueries();
        await loadQueryHistory();
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error submitting query:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit query');
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit query',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle viewing a response from history or popular queries
  const handleViewResponse = async (queryId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await rulesService.getQueryResponse(queryId);
      if (response) {
        setCurrentResponse(response);
      } else {
        throw new Error('Response not found');
      }
    } catch (error) {
      console.error('Error viewing response:', error);
      setError(error instanceof Error ? error.message : 'Failed to load response');
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load response',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-6 w-6" />
          Golf Rules Assistant
        </CardTitle>
        <CardDescription>
          Get instant answers to your golf rules questions from our AI-powered assistant
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ask">Ask a Question</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ask" className="space-y-4">
            {/* Query Input Section */}
            <div className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <Input
                  placeholder="Ask about any golf rule..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value as RuleCategory)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(RuleCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleSubmitQuery}
                  disabled={isLoading || !query.trim() || !isConnected}
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
              
              {/* Remaining Queries Info */}
              {isConnected && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Progress value={(remainingQueries / (tier === 'PRO' ? 100 : tier === 'PREMIUM' ? 25 : 5)) * 100} className="w-[60px]" />
                  {remainingQueries} queries remaining this month
                </div>
              )}
            </div>
            
            {/* Popular Queries Section */}
            {!currentResponse && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Popular Questions</h3>
                <ScrollArea className="h-[300px]">
                  {popularQueries.map((query) => (
                    <Card key={query.id} className="mb-2 cursor-pointer hover:bg-accent" onClick={() => handleViewResponse(query.id)}>
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{query.query}</CardTitle>
                            <CardDescription>{query.previewText}</CardDescription>
                          </div>
                          <Badge variant="secondary">{query.category}</Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </ScrollArea>
              </div>
            )}
            
            {/* Response Section */}
            {currentResponse && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Answer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-base">{currentResponse.response}</p>
                  
                  {/* Rule References */}
                  <div className="space-y-2">
                    <h4 className="font-semibold">Official Rule References:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {currentResponse.officialRuleReferences.map((ref) => (
                        <li key={ref.ruleNumber}>
                          <a
                            href={ref.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Rule {ref.ruleNumber} - {ref.ruleTitle}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Related Queries */}
                  <div className="space-y-2">
                    <h4 className="font-semibold">Related Questions:</h4>
                    <ul className="space-y-1">
                      {currentResponse.relatedQueries.map((query, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                          onClick={() => setQuery(query)}
                        >
                          <ChevronRight className="h-4 w-4" />
                          {query}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            {isConnected ? (
              <ScrollArea className="h-[500px]">
                {queryHistory.length > 0 ? (
                  <div className="space-y-2">
                    {queryHistory.map((query) => (
                      <Card key={query.id} className="cursor-pointer hover:bg-accent" onClick={() => handleViewResponse(query.id)}>
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{query.query}</CardTitle>
                              <CardDescription>
                                {new Date(query.timestamp).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary">{query.category}</Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No questions asked yet
                  </div>
                )}
              </ScrollArea>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Wallet Required</AlertTitle>
                <AlertDescription>
                  Please connect your wallet to view your question history
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Answers are provided based on the official Rules of Golf from R&A and USGA
        </div>
      </CardFooter>
    </Card>
  );
};

export default RulesAssistant; 