export const createPlatform = data => ({
    id: data.id,
    developer: data.manufacturer,
    name: data.name,
    generation: data.generation,
    year: data.year,
    image: data.image,
    isHandheld: data.isHandheld,
});
