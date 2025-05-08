export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'players' | 'teams' | 'history' | 'rules' | 'trivia';
}

const footballQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Which player has won the most Ballon d\'Or awards?',
    options: ['Cristiano Ronaldo', 'Lionel Messi', 'Michel Platini', 'Johan Cruyff'],
    correctAnswer: 'Lionel Messi',
    difficulty: 'easy',
    category: 'players'
  },
  {
    id: 'q2',
    text: 'Which country won the first FIFA World Cup in 1930?',
    options: ['Brazil', 'Uruguay', 'Argentina', 'Italy'],
    correctAnswer: 'Uruguay',
    difficulty: 'medium',
    category: 'history'
  },
  {
    id: 'q3',
    text: 'Which player scored the "Hand of God" goal?',
    options: ['Pelé', 'Diego Maradona', 'Zinedine Zidane', 'Roberto Baggio'],
    correctAnswer: 'Diego Maradona',
    difficulty: 'easy',
    category: 'history'
  },
  {
    id: 'q4',
    text: 'Which club has won the most UEFA Champions League/European Cup titles?',
    options: ['AC Milan', 'Bayern Munich', 'Liverpool', 'Real Madrid'],
    correctAnswer: 'Real Madrid',
    difficulty: 'easy',
    category: 'teams'
  },
  {
    id: 'q5',
    text: 'How many players are there in a standard football team on the field?',
    options: ['9', '10', '11', '12'],
    correctAnswer: '11',
    difficulty: 'easy',
    category: 'rules'
  },
  {
    id: 'q6',
    text: 'Which player is known as "The Phenomenon"?',
    options: ['Ronaldo Nazário', 'Ronaldinho', 'Cristiano Ronaldo', 'Neymar'],
    correctAnswer: 'Ronaldo Nazário',
    difficulty: 'medium',
    category: 'players'
  },
  {
    id: 'q7',
    text: 'Which country has won the most FIFA World Cup titles?',
    options: ['Germany', 'Brazil', 'Italy', 'Argentina'],
    correctAnswer: 'Brazil',
    difficulty: 'easy',
    category: 'teams'
  },
  {
    id: 'q8',
    text: 'Who is the all-time top scorer in the UEFA Champions League?',
    options: ['Lionel Messi', 'Cristiano Ronaldo', 'Raúl', 'Robert Lewandowski'],
    correctAnswer: 'Cristiano Ronaldo',
    difficulty: 'easy',
    category: 'players'
  },
  {
    id: 'q9',
    text: 'In which year was the Premier League founded?',
    options: ['1988', '1990', '1992', '1995'],
    correctAnswer: '1992',
    difficulty: 'medium',
    category: 'history'
  },
  {
    id: 'q10',
    text: 'Which club did Pep Guardiola manage first?',
    options: ['Barcelona B', 'Barcelona', 'Bayern Munich', 'Manchester City'],
    correctAnswer: 'Barcelona B',
    difficulty: 'hard',
    category: 'teams'
  },
  {
    id: 'q11',
    text: 'How long is a standard football match?',
    options: ['80 minutes', '90 minutes', '100 minutes', '120 minutes'],
    correctAnswer: '90 minutes',
    difficulty: 'easy',
    category: 'rules'
  },
  {
    id: 'q12',
    text: 'Which player has the record for most goals in a single calendar year?',
    options: ['Cristiano Ronaldo', 'Lionel Messi', 'Gerd Müller', 'Robert Lewandowski'],
    correctAnswer: 'Lionel Messi',
    difficulty: 'medium',
    category: 'players'
  },
  {
    id: 'q13',
    text: 'What is the maximum number of substitutions allowed in a standard competitive match?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '3',
    difficulty: 'easy',
    category: 'rules'
  },
  {
    id: 'q14',
    text: 'Which country hosted the 2014 FIFA World Cup?',
    options: ['Germany', 'South Africa', 'Brazil', 'Russia'],
    correctAnswer: 'Brazil',
    difficulty: 'easy',
    category: 'history'
  },
  {
    id: 'q15',
    text: 'Which player is nicknamed "The Egyptian King"?',
    options: ['Mohamed Salah', 'Ahmed Hassan', 'Mohamed Aboutrika', 'Mahmoud El-Khatib'],
    correctAnswer: 'Mohamed Salah',
    difficulty: 'easy',
    category: 'players'
  },
  {
    id: 'q16',
    text: 'Which of these clubs has never been relegated from the Premier League?',
    options: ['Manchester United', 'Chelsea', 'Arsenal', 'Liverpool'],
    correctAnswer: 'Arsenal',
    difficulty: 'medium',
    category: 'teams'
  },
  {
    id: 'q17',
    text: 'Which player scored the fastest hat-trick in Premier League history?',
    options: ['Robbie Fowler', 'Sadio Mané', 'Sergio Agüero', 'Harry Kane'],
    correctAnswer: 'Sadio Mané',
    difficulty: 'hard',
    category: 'trivia'
  },
  {
    id: 'q18',
    text: 'How many World Cup tournaments did Pelé win?',
    options: ['1', '2', '3', '4'],
    correctAnswer: '3',
    difficulty: 'medium',
    category: 'players'
  },
  {
    id: 'q19',
    text: 'What is the name of Barcelona\'s stadium?',
    options: ['Santiago Bernabéu', 'Camp Nou', 'Wanda Metropolitano', 'San Siro'],
    correctAnswer: 'Camp Nou',
    difficulty: 'easy',
    category: 'teams'
  },
  {
    id: 'q20',
    text: 'Which African country was the first to reach the World Cup quarter-finals?',
    options: ['Nigeria', 'Cameroon', 'Senegal', 'Ghana'],
    correctAnswer: 'Cameroon',
    difficulty: 'hard',
    category: 'history'
  },
  {
    id: 'q21',
    text: 'Who won the Golden Boot at the 2018 FIFA World Cup?',
    options: ['Cristiano Ronaldo', 'Kylian Mbappé', 'Harry Kane', 'Antoine Griezmann'],
    correctAnswer: 'Harry Kane',
    difficulty: 'medium',
    category: 'players'
  },
  {
    id: 'q22',
    text: 'Which of these teams has never won the UEFA Champions League?',
    options: ['Chelsea', 'Manchester City', 'Arsenal', 'Borussia Dortmund'],
    correctAnswer: 'Arsenal',
    difficulty: 'medium',
    category: 'teams'
  },
  {
    id: 'q23',
    text: 'How many points are awarded for a win in most football leagues?',
    options: ['1', '2', '3', '4'],
    correctAnswer: '3',
    difficulty: 'easy',
    category: 'rules'
  },
  {
    id: 'q24',
    text: 'Who is the only player to score in every minute of a football match (1-90)?',
    options: ['Cristiano Ronaldo', 'Lionel Messi', 'Zlatan Ibrahimović', 'Robert Lewandowski'],
    correctAnswer: 'Cristiano Ronaldo',
    difficulty: 'hard',
    category: 'trivia'
  },
  {
    id: 'q25',
    text: 'Which goalkeeper holds the record for most clean sheets in Premier League history?',
    options: ['David de Gea', 'Petr Čech', 'Edwin van der Sar', 'Alisson Becker'],
    correctAnswer: 'Petr Čech',
    difficulty: 'medium',
    category: 'players'
  },
  {
    id: 'q26',
    text: 'What is the official size of a football pitch according to FIFA regulations?',
    options: ['90-120m × 45-90m', '100-110m × 64-75m', '105m × 68m', 'There is no standard size'],
    correctAnswer: '90-120m × 45-90m',
    difficulty: 'hard',
    category: 'rules'
  },
  {
    id: 'q27',
    text: 'Which English club is known as "The Gunners"?',
    options: ['Chelsea', 'Manchester United', 'Arsenal', 'Liverpool'],
    correctAnswer: 'Arsenal',
    difficulty: 'easy',
    category: 'teams'
  },
  {
    id: 'q28',
    text: 'Which Spanish club is known as "Los Blancos"?',
    options: ['Barcelona', 'Real Madrid', 'Atlético Madrid', 'Valencia'],
    correctAnswer: 'Real Madrid',
    difficulty: 'easy',
    category: 'teams'
  },
  {
    id: 'q29',
    text: 'Who was the first player to win the UEFA Champions League with three different clubs?',
    options: ['Cristiano Ronaldo', 'Xabi Alonso', 'Clarence Seedorf', 'Zlatan Ibrahimović'],
    correctAnswer: 'Clarence Seedorf',
    difficulty: 'hard',
    category: 'players'
  },
  {
    id: 'q30',
    text: 'What color card is shown to a player to indicate a caution?',
    options: ['Red', 'Yellow', 'Blue', 'Green'],
    correctAnswer: 'Yellow',
    difficulty: 'easy',
    category: 'rules'
  },
  {
    id: 'q31',
    text: 'Which club has won the most Premier League titles?',
    options: ['Liverpool', 'Chelsea', 'Manchester City', 'Manchester United'],
    correctAnswer: 'Manchester United',
    difficulty: 'easy',
    category: 'teams'
  },
  {
    id: 'q32',
    text: 'Which country won the 2023 FIFA Women\'s World Cup?',
    options: ['USA', 'England', 'Spain', 'Germany'],
    correctAnswer: 'Spain',
    difficulty: 'medium',
    category: 'history'
  },
  {
    id: 'q33',
    text: 'Who is the tallest outfield player to have played in the Premier League?',
    options: ['Peter Crouch', 'Jan Koller', 'Lacina Traoré', 'Nikola Žigić'],
    correctAnswer: 'Lacina Traoré',
    difficulty: 'hard',
    category: 'trivia'
  },
  {
    id: 'q34',
    text: 'Who scored the fastest goal in Premier League history?',
    options: ['Shane Long', 'Ledley King', 'Alan Shearer', 'Christian Eriksen'],
    correctAnswer: 'Shane Long',
    difficulty: 'hard',
    category: 'trivia'
  },
  {
    id: 'q35',
    text: 'Which player has made the most appearances in the Premier League?',
    options: ['Ryan Giggs', 'Gareth Barry', 'James Milner', 'Frank Lampard'],
    correctAnswer: 'Gareth Barry',
    difficulty: 'medium',
    category: 'players'
  },
  {
    id: 'q36',
    text: 'What is the offside rule in football?',
    options: [
      'A player is offside if closer to the opponent\'s goal than the ball',
      'A player is offside if closer to the opponent\'s goal than the second-last defender',
      'A player is offside if in the opponent\'s half when the ball is played',
      'A player is offside if closer to the opponent\'s goal than the last defender'
    ],
    correctAnswer: 'A player is offside if closer to the opponent\'s goal than the second-last defender',
    difficulty: 'medium',
    category: 'rules'
  },
  {
    id: 'q37',
    text: 'Which player has scored the most goals in a single Premier League season (38 games)?',
    options: ['Cristiano Ronaldo', 'Mohamed Salah', 'Alan Shearer', 'Luis Suárez'],
    correctAnswer: 'Mohamed Salah',
    difficulty: 'medium',
    category: 'players'
  },
  {
    id: 'q38',
    text: 'Which team won the first Premier League title?',
    options: ['Arsenal', 'Manchester United', 'Blackburn Rovers', 'Liverpool'],
    correctAnswer: 'Manchester United',
    difficulty: 'medium',
    category: 'history'
  },
  {
    id: 'q39',
    text: 'What was the original name of the UEFA Champions League?',
    options: ['European Cup', 'UEFA Cup', 'European Super Cup', 'UEFA Elite Trophy'],
    correctAnswer: 'European Cup',
    difficulty: 'medium',
    category: 'history'
  },
  {
    id: 'q40',
    text: 'Who was the youngest goalscorer in World Cup history?',
    options: ['Kylian Mbappé', 'Pelé', 'Michael Owen', 'Manuel Rosas'],
    correctAnswer: 'Pelé',
    difficulty: 'medium',
    category: 'history'
  },
];

export const getRandomQuestions = (count: number): Question[] => {
  const shuffled = [...footballQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getBingoQuestions = (): Question[] => {
  return getRandomQuestions(25);
};

export const getTicTacToeQuestions = (): Question[] => {
  return getRandomQuestions(9);
};

export default footballQuestions;
