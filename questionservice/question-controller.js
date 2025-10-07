import Question from './question-model.js';

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

export const addQuestionsController = async (req, res) => {
  try {
    // Check if required fields are present in the request body
    validateRequiredFields(req, [
      'type',
      'path',
      'right',
      'wrong1',
      'wrong2',
      'wrong3',
    ]);

    const newQuestion = new Question({
      type: req.body.type,
      name: req.body.name,
      path: req.body.path,
      right: req.body.right,
      hint1: req.body.hint1,
      hint2: req.body.hint2,
      wrong1: req.body.wrong1,
      wrong2: req.body.wrong2,
      wrong3: req.body.wrong3,
    });

    await newQuestion.save();
    res.json(newQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getGameQuestionsController = async (req, res) => {
  try {
    const questions = await Question.aggregate([
      { $match: { type: 'vocabulary' } },
      { $sample: { size: 10 } },
    ]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGame1QuestionsController = async (req, res) => {
  try {
    const questions = await Question.aggregate([
      { $match: { type: 'artwork' } },
      { $sample: { size: 10 } },
    ]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGame2QuestionsController = async (req, res) => {
  try {
    const questions = await Question.aggregate([
      { $match: { type: 'city' } },
      { $sample: { size: 10 } },
    ]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getQuestionsController = async (req, res) => {
  try {
    const questions = await Question.find(); // Fetch all questions
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
