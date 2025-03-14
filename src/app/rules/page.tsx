'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { BookOpen, Send, Search, MessageSquare, Info, HelpCircle, Bookmark, RotateCw, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { GolfRulesHub } from '@/components/rules/GolfRulesHub';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Common rule categories with descriptions
const ruleCategories = [
  {
    title: 'Tee Box Rules',
    description: 'Learn about proper tee box procedures and placement.',
    icon: <BookOpen className="h-4 w-4" />,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
    questions: ['Where can I tee my ball?', 'Can I clean my ball on the tee box?']
  },
  {
    title: 'Hazards & Obstacles',
    description: 'How to handle water, bunkers, and other course obstacles.',
    icon: <HelpCircle className="h-4 w-4" />,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
    questions: ['What are the rules for a ball in a water hazard?', 'Can I remove loose impediments from a bunker?']
  },
  {
    title: 'Ball Interactions',
    description: 'Rules covering when balls interact with other objects.',
    icon: <MessageSquare className="h-4 w-4" />,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
    questions: ['What happens if my ball hits another player\'s ball on the green?', 'What if my ball moves after I address it?']
  },
  {
    title: 'Course Relief',
    description: 'Proper procedures for taking relief on the course.',
    icon: <Bookmark className="h-4 w-4" />,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
    questions: ['How do I take relief from an immovable obstruction?', 'What are the rules for an unplayable lie?']
  }
];

export default function RulesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('qa');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await response.json();
      
      // Add assistant response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (error) {
      console.error('Error getting rules answer:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try asking your question again.' 
      }]);
    }

    setLoading(false);
  };

  const askQuestion = (question: string) => {
    setInput(question);
    handleSubmit(new Event('submit') as any);
  };

  // Filter categories based on search term
  const filteredCategories = searchTerm 
    ? ruleCategories.filter(category => 
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.questions.some(q => q.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : ruleCategories;

  return (
    <>
      <PageHeader
        title="Golf Rules Assistant"
        description="Get expert answers to all your golf rules questions and learn through interactive tools."
        icon={BookOpen}
        gradient
      />
      
      <Section>
        <div className="max-w-6xl mx-auto mb-8">
          <Tabs defaultValue="qa" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="qa" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Rules Q&A</span>
              </TabsTrigger>
              <TabsTrigger value="hub" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>Interactive Tools</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qa" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left sidebar - rules categories */}
                <div className="col-span-1">
                  <Card className="sticky top-24 shadow-md border-gray-100 dark:border-gray-800">
                    <CardHeader className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl font-bold">Rule Categories</CardTitle>
                      </div>
                      <CardDescription>
                        Browse common golf rules or search topics
                      </CardDescription>
                      <div className="relative mt-2">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          type="search"
                          placeholder="Search rules topics..."
                          className="pl-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="space-y-3">
                        {filteredCategories.map((category, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card className="overflow-hidden border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                              <CardHeader className={cn("py-3 px-4", category.color)}>
                                <div className="flex items-center gap-2">
                                  {category.icon}
                                  <CardTitle className="text-sm font-medium">{category.title}</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent className="p-3 text-sm space-y-2">
                                <p className="text-gray-500 dark:text-gray-400 text-xs">{category.description}</p>
                                <div className="pt-1 space-y-1.5">
                                  {category.questions.map((question, qIndex) => (
                                    <motion.button
                                      key={qIndex}
                                      onClick={() => askQuestion(question)}
                                      className="text-left w-full p-1.5 px-2 text-xs rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                      whileHover={{ x: 3 }}
                                    >
                                      &raquo; {question}
                                    </motion.button>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right side - main chat area */}
                <div className="col-span-1 lg:col-span-2">
                  <Card className="shadow-md border-gray-100 dark:border-gray-800 overflow-hidden">
                    <CardHeader className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl font-bold">Rules Q&A</CardTitle>
                      </div>
                      <CardDescription>
                        Ask any question about golf rules and get an instant expert answer.
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                      {/* Messages display */}
                      <div className="bg-gray-50 dark:bg-gray-900/20 min-h-[300px] max-h-[500px] overflow-y-auto p-5 space-y-4">
                        {messages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-60 text-center text-gray-500 dark:text-gray-400 space-y-4">
                            <div className="bg-primary/10 rounded-full p-4">
                              <Info className="h-8 w-8 text-primary" />
                            </div>
                            <div className="max-w-sm">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                                Ask any golf rules question
                              </h3>
                              <p>
                                Whether you're on the course or preparing for a round, get expert answers to any rules situation.
                              </p>
                            </div>
                          </div>
                        ) : (
                          messages.map((message, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={cn(
                                  "p-4 rounded-xl max-w-[85%] shadow-sm",
                                  message.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                    : 'bg-white dark:bg-gray-800 rounded-tl-none border border-gray-100 dark:border-gray-700'
                                )}
                              >
                                <div className="flex items-start gap-2">
                                  {message.role === 'assistant' && (
                                    <BookOpen className="h-5 w-5 text-primary mt-1 shrink-0" />
                                  )}
                                  <div className="text-sm whitespace-pre-line">
                                    {message.content}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input form */}
                      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                        <form onSubmit={handleSubmit} className="flex gap-3">
                          <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about any golf rule or situation..."
                            disabled={loading}
                            className="flex-1"
                          />
                          <Button type="submit" disabled={loading} className="group">
                            {loading ? (
                              <>
                                <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                                Thinking...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                Ask
                              </>
                            )}
                          </Button>
                        </form>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Popular topics */}
                  <Card className="mt-6 bg-primary/5 dark:bg-primary/10 border-primary/20 shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-medium">Popular Golf Rules Topics</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <motion.button
                          onClick={() => askQuestion("What's considered a lost ball and what are my options?")}
                          className="text-left p-2 rounded hover:bg-primary/10 transition-colors"
                          whileHover={{ x: 3 }}
                        >
                          • Lost balls and provisional balls
                        </motion.button>
                        <motion.button
                          onClick={() => askQuestion("How do I handle an unplayable lie?")}
                          className="text-left p-2 rounded hover:bg-primary/10 transition-colors"
                          whileHover={{ x: 3 }}
                        >
                          • Unplayable lies and relief options
                        </motion.button>
                        <motion.button
                          onClick={() => askQuestion("Can I repair marks on the green before putting?")}
                          className="text-left p-2 rounded hover:bg-primary/10 transition-colors"
                          whileHover={{ x: 3 }}
                        >
                          • Green repairs and marking procedures
                        </motion.button>
                        <motion.button
                          onClick={() => askQuestion("What are the rules on free drops from cart paths?")}
                          className="text-left p-2 rounded hover:bg-primary/10 transition-colors"
                          whileHover={{ x: 3 }}
                        >
                          • Cart paths and man-made obstructions
                        </motion.button>
                        <motion.button
                          onClick={() => askQuestion("Can I move my ball away from a sprinkler head near the green?")}
                          className="text-left p-2 rounded hover:bg-primary/10 transition-colors"
                          whileHover={{ x: 3 }}
                        >
                          • Sprinkler heads and ground under repair
                        </motion.button>
                        <motion.button
                          onClick={() => askQuestion("What penalties are there for hitting out of bounds?")}
                          className="text-left p-2 rounded hover:bg-primary/10 transition-colors"
                          whileHover={{ x: 3 }}
                        >
                          • Out of bounds and penalty areas
                        </motion.button>
                      </div>
                    </CardContent>
                  </Card>
      </div>
    </div>
            </TabsContent>

            <TabsContent value="hub" className="mt-0">
              <GolfRulesHub />
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </>
  );
} 