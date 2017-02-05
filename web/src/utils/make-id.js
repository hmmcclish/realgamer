/**
 * Creates id from string
 * Example:
 *      Neo Geo Pocker Color => neo-geo-pocket-color
 *      GameCube => gamecube
 */
export default s => s
    .toLowerCase()
    .replace(/[^\w]+/g, '-');
