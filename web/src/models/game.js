// @flow
const getName = (data/* , locale */) => {
    const [{name: title} = {name: ''}] = data;
    return String(title);
};

const getYear = (data/* , locale */) => {
    const {releaseDate: [{date} = {}]} = data;
    return String(date ? new Date(date).getFullYear() : '');
};

export const createGame = (data: any, locale: string = 'es_ES') => ({
    getTitle: () => getName(data.title, locale),
    getYear: () => getYear(data, locale),
    getDeveloper: () => getName(data.developer, locale),
    getPublisher: () => getName(data.publisher, locale),
});
