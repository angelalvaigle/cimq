const citiesQuery = `SELECT ?city ?cityLabel ?countryLabel ?image (MAX(?population) AS ?maxPopulation) ?sitelinks WHERE {
  # Filtrar solo entidades de tipo ciudad
  ?city wdt:P31 wd:Q515.  # Instancia de: Ciudad
  
  # La ciudad debe estar asociada con un país
  ?city wdt:P17 ?country.
  
  # La ciudad debe tener una imagen
  ?city wdt:P18 ?image.
  
   # La ciudad debe tener la población
  ?city wdt:P1082 ?population.
  
  # Contar el número de enlaces en Wikipedia
  ?city wikibase:sitelinks ?sitelinks.
  
  # Asegurarse de que la ciudad esté asociada con un único país
  FILTER NOT EXISTS {
    ?city wdt:P17 ?otherCountry.
    FILTER(?otherCountry != ?country)
  }
  
  # Etiquetas en español, con respaldo en inglés
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,[AUTO_LANGUAGE],en". }
}
# Agrupar por ciudad y país para obtener la población máxima
GROUP BY ?city ?cityLabel ?countryLabel ?image ?sitelinks
# Ordenar por número de enlaces en Wikipedia (popularidad) y limitar el número de resultados
ORDER BY DESC(?sitelinks)
LIMIT 300
`;

export default citiesQuery;
