
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  BookOpen, 
  Trophy, 
  Target, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  Star,
  Award,
  Zap
} from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  completed: boolean;
  concepts: string[];
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  concept: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
}

export const LearningMode = () => {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userProgress, setUserProgress] = useState(65);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const tutorialRef = useRef<HTMLDivElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  // Mock data
  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'Understanding React Hooks',
      description: 'Learn the fundamentals of React Hooks and how to use them effectively',
      difficulty: 'beginner',
      duration: '15 min',
      completed: true,
      concepts: ['useState', 'useEffect', 'Custom Hooks']
    },
    {
      id: '2',
      title: 'Advanced JavaScript Patterns',
      description: 'Explore design patterns and advanced concepts in JavaScript',
      difficulty: 'advanced',
      duration: '30 min',
      completed: false,
      concepts: ['Closures', 'Prototypes', 'Async/Await']
    },
    {
      id: '3',
      title: 'TypeScript Best Practices',
      description: 'Master TypeScript with real-world examples and best practices',
      difficulty: 'intermediate',
      duration: '25 min',
      completed: false,
      concepts: ['Types', 'Interfaces', 'Generics']
    }
  ];

  const quizzes: Quiz[] = [
    {
      id: '1',
      question: 'What is the primary purpose of the useEffect hook in React?',
      options: [
        'To manage component state',
        'To handle side effects in functional components',
        'To create custom hooks',
        'To optimize performance'
      ],
      correctAnswer: 1,
      explanation: 'useEffect is designed to handle side effects like API calls, subscriptions, and DOM manipulation in functional components.',
      concept: 'React Hooks'
    },
    {
      id: '2',
      question: 'Which of the following is NOT a benefit of using TypeScript?',
      options: [
        'Static type checking',
        'Better IDE support',
        'Faster runtime performance',
        'Enhanced code documentation'
      ],
      correctAnswer: 2,
      explanation: 'TypeScript provides compile-time benefits but does not improve runtime performance as it compiles to JavaScript.',
      concept: 'TypeScript'
    }
  ];

  const mockAchievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first tutorial',
      icon: '🎯',
      unlocked: true,
      progress: 100
    },
    {
      id: '2',
      title: 'Quiz Master',
      description: 'Answer 10 quiz questions correctly',
      icon: '🧠',
      unlocked: false,
      progress: 70
    },
    {
      id: '3',
      title: 'Code Explorer',
      description: 'Analyze 5 different code snippets',
      icon: '🔍',
      unlocked: false,
      progress: 40
    }
  ];

  useEffect(() => {
    setAchievements(mockAchievements);
  }, []);

  useEffect(() => {
    if (selectedTutorial) {
      gsap.from(tutorialRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
    }
  }, [selectedTutorial]);

  useEffect(() => {
    if (currentQuiz) {
      gsap.from('.quiz-option', {
        x: -30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }
  }, [currentQuiz]);

  const startTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    
    // Tutorial start animation
    gsap.from('.tutorial-content', {
      scale: 0.9,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });
  };

  const startQuiz = () => {
    setCurrentQuiz(quizzes[Math.floor(Math.random() * quizzes.length)]);
    setQuizAnswer(null);
    setShowExplanation(false);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setQuizAnswer(answerIndex);
    
    // Answer selection animation
    gsap.to(`.quiz-option-${answerIndex}`, {
      scale: 1.05,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });

    setTimeout(() => {
      setShowExplanation(true);
      
      // Celebration or feedback animation
      if (answerIndex === currentQuiz?.correctAnswer) {
        gsap.to('.quiz-result', {
          scale: 1.1,
          duration: 0.3,
          ease: 'elastic.out(1, 0.5)'
        });
      }
    }, 500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const renderTutorials = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tutorials.map((tutorial) => (
        <Card
          key={tutorial.id}
          className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-blue-500/50"
          onClick={() => startTutorial(tutorial)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Badge className={getDifficultyColor(tutorial.difficulty)}>
                {tutorial.difficulty}
              </Badge>
              {tutorial.completed && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
            </div>
            
            <h3 className="text-white font-semibold text-lg mb-2">{tutorial.title}</h3>
            <p className="text-slate-300 text-sm mb-4">{tutorial.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">⏱️ {tutorial.duration}</span>
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {tutorial.concepts.map((concept, index) => (
                <Badge key={index} variant="outline" className="border-slate-600/50 text-slate-300 text-xs">
                  {concept}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTutorialContent = () => {
    if (!selectedTutorial) return null;

    return (
      <div ref={tutorialRef} className="tutorial-content space-y-6">
        <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">{selectedTutorial.title}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTutorial(null)}
                className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
              >
                Back to Tutorials
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedTutorial.concepts.map((concept, index) => (
                <Card key={index} className="bg-slate-700/30 border-slate-600/50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Lightbulb className="w-6 h-6 text-yellow-400" />
                      <div>
                        <h4 className="text-white font-semibold">{concept}</h4>
                        <p className="text-slate-300 text-sm">Interactive explanation</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/50">
              <h4 className="text-white font-semibold mb-4">Tutorial Content</h4>
              <p className="text-slate-300 mb-4">
                This tutorial will guide you through {selectedTutorial.title.toLowerCase()}. 
                You'll learn practical examples and best practices that you can apply in real projects.
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Start Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderQuiz = () => {
    if (!currentQuiz) {
      return (
        <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
          <CardContent className="p-8 text-center">
            <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-4">Ready for a Challenge?</h3>
            <p className="text-slate-300 mb-6">Test your knowledge with AI-generated questions based on your code analysis.</p>
            <Button onClick={startQuiz} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Target className="w-4 h-4 mr-2" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card ref={quizRef} className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>Quiz Challenge</span>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
              {currentQuiz.concept}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <h3 className="text-white text-lg font-semibold">{currentQuiz.question}</h3>
          
          <div className="space-y-3">
            {currentQuiz.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className={`quiz-option quiz-option-${index} w-full text-left justify-start h-auto p-4 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 ${
                  quizAnswer === index
                    ? index === currentQuiz.correctAnswer
                      ? 'border-green-500/50 bg-green-500/20 text-green-300'
                      : 'border-red-500/50 bg-red-500/20 text-red-300'
                    : showExplanation && index === currentQuiz.correctAnswer
                    ? 'border-green-500/50 bg-green-500/20 text-green-300'
                    : ''
                }`}
                onClick={() => !showExplanation && handleQuizAnswer(index)}
                disabled={showExplanation}
              >
                <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>

          {showExplanation && (
            <div className="quiz-result bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <div className="flex items-center space-x-2 mb-3">
                {quizAnswer === currentQuiz.correctAnswer ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={`font-semibold ${
                  quizAnswer === currentQuiz.correctAnswer ? 'text-green-400' : 'text-red-400'
                }`}>
                  {quizAnswer === currentQuiz.correctAnswer ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-slate-300 mb-4">{currentQuiz.explanation}</p>
              <Button onClick={startQuiz} className="bg-blue-600 hover:bg-blue-700">
                Next Question
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderAchievements = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {achievements.map((achievement) => (
        <Card
          key={achievement.id}
          className={`bg-slate-800/50 backdrop-blur-lg border-slate-700/50 transition-all duration-300 ${
            achievement.unlocked ? 'border-yellow-500/50' : ''
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${achievement.unlocked ? 'text-yellow-300' : 'text-slate-400'}`}>
                  {achievement.title}
                </h4>
                <p className="text-slate-400 text-sm">{achievement.description}</p>
              </div>
              {achievement.unlocked && <Trophy className="w-5 h-5 text-yellow-400" />}
            </div>
            <Progress value={achievement.progress} className="h-2" />
            <p className="text-slate-400 text-xs mt-2">{achievement.progress}% complete</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Learning Progress */}
      <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>Learning Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <Progress value={userProgress} className="h-3" />
            </div>
            <span className="text-white font-semibold">{userProgress}%</span>
          </div>
          <p className="text-slate-300 text-sm">Great progress! You're on your way to mastering code analysis.</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="tutorials" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
          <TabsTrigger value="tutorials" className="data-[state=active]:bg-slate-600">
            <BookOpen className="w-4 h-4 mr-2" />
            Tutorials
          </TabsTrigger>
          <TabsTrigger value="quiz" className="data-[state=active]:bg-slate-600">
            <Brain className="w-4 h-4 mr-2" />
            Quiz
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-slate-600">
            <Award className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tutorials" className="space-y-6">
          {selectedTutorial ? renderTutorialContent() : renderTutorials()}
        </TabsContent>

        <TabsContent value="quiz" className="space-y-6">
          {renderQuiz()}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Your Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              {renderAchievements()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
