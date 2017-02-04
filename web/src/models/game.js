export const createGame = data => ({
    id: data.id,
    platformId: data.platformId,
    title: data.title,
    developer: data.developer,
    publisher: data.publisher,
    year: data.year,
});
