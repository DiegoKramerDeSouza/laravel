/**
 * Criação de métodos estáticos com finalidades específicas
 */
class RoomHelper {

    constructor() {
        throw new Error('RoomHelper apresenta apenas métodos estáticos.');
    }

    // Verifica a existência de dispositivos de vídeo
    /**
     * Param sourceInfos: dispositivos verificados
     */
    static getCameras(sourceInfos) {
        if (sourceInfos.length > 0) {
            cameras = true;
        }
    }

    // Verificação de classes para elementos html
    /**
     * Param element: elemento a ser verificado
     * Param cls: classe a ser verificada no elemento
     */
    static hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

}