export const createGame = data => ({
    id: data.id,
    platform: data.platform,
    titles: data.titles,
    developers: data.developers,
    publishers: data.publishers,
    year: data.year,
});
