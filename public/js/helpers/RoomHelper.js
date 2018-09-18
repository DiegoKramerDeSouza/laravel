/**
 * Métodos estáticos de verificação de elementos de salas
 */
class RoomHelper {

    constructor() {

        throw new Error('RoomHelper apresenta apenas métodos estáticos.');
    }

    static getCameras(sourceInfos) {

        if (sourceInfos.length > 0) {
            return true;
        }
        return false;
    }

}