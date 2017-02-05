// @flow
const getName = (data/* , locale */) => {
    const [{name: title} = {name: ''}] = Array.isArray(data) ? data : [data];
    return String(title);
};

export const createPlatform = (data: any, locale: any = 'es_ES') => ({
    getTitle: () => getName(data.title, locale),
    getImageUrl: () => Array.isArray(data.imageUrl) ? data.imageUrl[0] : data.imageUrl,
});
