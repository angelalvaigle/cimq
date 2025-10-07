import Stat from './stat-model.js';

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

export const addStatController = async (req, res) => {
  try {
    // Check if required fields are present in the request body
    validateRequiredFields(req, [
      'gameId',
      'questionId',
      'right',
      'time',
      'points',
    ]);

    const newStat = new Stat({
      userId: req.user.userId,
      gameId: req.body.gameId,
      questionId: req.body.questionId,
      right: req.body.right,
      time: req.body.time,
      points: req.body.points,
    });

    await newStat.save();
    res.json(newStat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getStatsController = async (req, res) => {
  try {
    const stats = await Stat.find(); // Fetch all questions
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserStatsControler = async (req, res) => {
  const userId = req.user.userId;
  try {
    const stats = await Stat.find({ userId });

    if (stats.length === 0) {
      // Si no hay registros, devolver estadísticas predeterminadas
      return res.json({
        totalGames: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        totalTime: 0,
      });
    }

    // Calcular estadísticas manualmente
    const totalGames = new Set(stats.map((stat) => stat.gameId)).size; // Juegos únicos
    const correctAnswers = stats.filter((stat) => stat.right).length; // Respuestas correctas
    const wrongAnswers = stats.filter((stat) => !stat.right).length; // Respuestas incorrectas
    const totalPoints = stats.reduce((sum, stat) => sum + stat.points, 0); // Puntos totales
    const totalTime = stats.reduce((sum, stat) => sum + stat.time, 0); // Tiempo total

    // Devolver estadísticas calculadas
    res.json({
      totalGames,
      correctAnswers,
      wrongAnswers,
      totalPoints,
      totalTime,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRankingController = async (req, res) => {
  try {
    const stats = await Stat.find();
    // Agrupar las estadísticas por gameId y userId
    const gamesMap = stats.reduce((acc, stat) => {
      const key = `${stat.gameId}-${stat.userId}`;
      if (!acc[key]) {
        acc[key] = {
          gameId: stat.gameId,
          userId: stat.userId.toString(),
          totalPoints: 0,
          totalTime: 0,
        };
      }
      acc[key].totalPoints += stat.points;
      acc[key].totalTime += stat.time;
      return acc;
    }, {});

    // Convertir el mapa en un array y ordenar
    const ranking = Object.values(gamesMap).sort((a, b) => {
      if (b.totalPoints === a.totalPoints) {
        // Si los puntos son iguales, ordenar por tiempo ascendente
        return a.totalTime - b.totalTime;
      }
      return b.totalPoints - a.totalPoints;
    });
    // Limitar a los 10 primeros
    const topRanking = ranking.slice(0, 10);
    res.status(200).json({
      topRanking,
    });
  } catch (error) {
    console.error('Error al generar el ranking:', error);
    res.status(500).json({
      msg: 'Error al generar el ranking',
    });
  }
};
