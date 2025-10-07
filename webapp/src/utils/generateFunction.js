import SPARQLQueryDispatcher from './SPARQLQueryDispatcher.js';

const endpointUrl = 'https://query.wikidata.org/sparql';
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);

const getRandomAnswers = (allAnswers, correctAnswer, count) => {
  const filteredAnswers = allAnswers.filter(
    (answer) => answer !== correctAnswer && !answer.startsWith('http')
  );
  const randomAnswers = [];
  while (randomAnswers.length < count) {
    const randomAnswer =
      filteredAnswers[Math.floor(Math.random() * filteredAnswers.length)];
    if (!randomAnswers.includes(randomAnswer)) {
      randomAnswers.push(randomAnswer);
    }
  }
  return randomAnswers;
};

export const generateArtworks = async (query) => {
  const response = await queryDispatcher.query(query);
  const bindings = response.results.bindings;
  const allCreators = bindings.map((result) => result.creatorLabel.value);
  const questions = [];

  for (const result of bindings) {
    const name = result.workLabel.value; // Título de la obra
    const path = result.image.value; // URL de la imagen
    const right = result.creatorLabel.value; // Nombre del creador
    const wrongCreators = getRandomAnswers(allCreators, right, 3);

    // Añade las preguntas al array
    if (!name.startsWith('http') && !right.startsWith('http')) {
      questions.push({
        type: 'artwork',
        name: name,
        path: path,
        right: right,
        wrong1: wrongCreators[0],
        wrong2: wrongCreators[1],
        wrong3: wrongCreators[2],
      });
    }
  }
  return questions;
};

export const generateCities = async (query) => {
  const response = await queryDispatcher.query(query);
  const bindings = response.results.bindings;
  const allCities = bindings.map((result) => result.cityLabel.value);
  const questions = [];

  for (const result of bindings) {
    const path = result.image.value; // URL de la imagen
    const population = result.maxPopulation.value;
    const country = result.countryLabel.value;
    const right = result.cityLabel.value; // Nombre de la ciudad
    const wrongCities = getRandomAnswers(allCities, right, 3);

    // Añade las preguntas al array
    if (!right.startsWith('http') && !right.startsWith('http')) {
      questions.push({
        type: 'city',
        path: path,
        hint1: population,
        hint2: country,
        right: right,
        wrong1: wrongCities[0],
        wrong2: wrongCities[1],
        wrong3: wrongCities[2],
      });
    }
  }
  return questions;
};
