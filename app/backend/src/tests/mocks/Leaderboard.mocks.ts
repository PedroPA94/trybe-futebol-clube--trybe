export const mockFindAllTeamsHomeMatches = [
  {
    "id": 1,
    "teamName": "Avaí/Kindermann",
    "homeMatches": [{
      'id': 1,
      'homeTeam': 1,
      'homeTeamGoals': 2,
      'awayTeam': 3,
      'awayTeamGoals': 1,
    }]
  },
  {
    "id": 2,
    "teamName": "Bahia",
    "homeMatches": [{
      'id': 1,
      'homeTeam': 2,
      'homeTeamGoals': 1,
      'awayTeam': 3,
      'awayTeamGoals': 2,
    }]
  },
  {
    "id": 3,
    "teamName": "Botafogo",
    "homeMatches": [{
      'id': 1,
      'homeTeam': 3,
      'homeTeamGoals': 4,
      'awayTeam': 1,
      'awayTeamGoals': 1,
    }]
  },
]

export const mockReturnedHomeLeaderboard = [
  {
    name: "Botafogo",
    totalPoints: 3,
    totalGames: 1,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 4,
    goalsOwn: 1,
    goalsBalance: 3,
    efficiency: "100.00",
  },
  {
    name: "Avaí/Kindermann",
    totalPoints: 3,
    totalGames: 1,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 2,
    goalsOwn: 1,
    goalsBalance: 1,
    efficiency: "100.00",
  },
  {
    name: "Bahia",
    totalPoints: 0,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 1,
    goalsOwn: 2,
    goalsBalance: -1,
    efficiency: "0.00",
  }
]

export const mockFindAllTeamsAwayMatches = [
  {
    "id": 1,
    "teamName": "Avaí/Kindermann",
    "awayMatches": [{
      'id': 1,
      'homeTeam': 3,
      'homeTeamGoals': 2,
      'awayTeam': 1,
      'awayTeamGoals': 5,
    }]
  },
  {
    "id": 2,
    "teamName": "Bahia",
    "awayMatches": [{
      'id': 1,
      'homeTeam': 1,
      'homeTeamGoals': 2,
      'awayTeam': 2,
      'awayTeamGoals': 2,
    }]
  },
  {
    "id": 3,
    "teamName": "Botafogo",
    "awayMatches": [{
      'id': 1,
      'homeTeam': 2,
      'homeTeamGoals': 1,
      'awayTeam': 3,
      'awayTeamGoals': 1,
    }]
  },
]

export const mockReturnedAwayLeaderboard = [
  {
    name: "Avaí/Kindermann",
    totalPoints: 3,
    totalGames: 1,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 5,
    goalsOwn: 2,
    goalsBalance: 3,
    efficiency: "100.00",
  },
  {
    name: "Bahia",
    totalPoints: 1,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 1,
    totalLosses: 0,
    goalsFavor: 2,
    goalsOwn: 2,
    goalsBalance: 0,
    efficiency: "33.33",
  },
  {
    name: "Botafogo",
    totalPoints: 1,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 1,
    totalLosses: 0,
    goalsFavor: 1,
    goalsOwn: 1,
    goalsBalance: 0,
    efficiency: "33.33",
  },
]

export const mockReturnedFullLeaderboard = [
  {
    name: "Avaí/Kindermann",
    totalPoints: 6,
    totalGames: 2,
    totalVictories: 2,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 7,
    goalsOwn: 3,
    goalsBalance: 4,
    efficiency: "100.00",
  },
  {
    name: "Botafogo",
    totalPoints: 4,
    totalGames: 2,
    totalVictories: 1,
    totalDraws: 1,
    totalLosses: 0,
    goalsFavor: 5,
    goalsOwn: 2,
    goalsBalance: 3,
    efficiency: "66.67",
  },
  {
    name: "Bahia",
    totalPoints: 1,
    totalGames: 2,
    totalVictories: 0,
    totalDraws: 1,
    totalLosses: 1,
    goalsFavor: 3,
    goalsOwn: 4,
    goalsBalance: -1,
    efficiency: "16.67",
  },
]