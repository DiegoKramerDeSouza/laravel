/**
 * Classe voltada à definição básica de salas criadas pelo apresentador
 * 
 * Instancia:
 * RoomView
 */
class RoomController {

    constructor() {

        this._roomView = new RoomView();

        this._inputMateria = doc.TAG(dom.MATERIA);
        this._inputAssunto = doc.TAG(dom.ASSUNTO);
        this._numberOfViewers = doc.TAG(dom.NUMBER_VIEWS);
        this.audioList = doc.TAG(dom.LIST_AUDIO);
        this.videoList = doc.TAG(dom.LIST_VIDEO);
    }

    /**
     * Concatena os valores coletados na seleção de cursos permitidos na criação de uma sala
     * @returns {String}
     */
    createList() {

        this._inputCursos = $(dom.CURSO_LIST).val();
        return this._inputCursos.join(';');
    }

    /**
     * Concatena valores e forma rash utilizado como identificador de sala
     * @returns {String}
     */
    _createHash(userid) {

        let timestamp = +new Date();
        return `${ this.createList() }|${ userid }|${ timestamp }`;
    }

    /**
     * Define e apresenta o card representando o cabeçalho da sala
     * @param {String} icon Ícone a ser utilizado
     * @param {String} classe Nome da matéria abordada
     * @param {String} assunto Nome do tema abordado
     */
    setRoomLabel(icon, classe, assunto) {

        this._roomView.createRoomLabel(icon, classe, assunto);
    }

    /**
     * Verifica se os dispositívos de áudio e vídeo foram selecionados
     * @returns {Boolean} 
     */
    checkDevices() {

        return (this.audioList.value != '' && this.videoList.value != '');
    }

    /**
     * Valida a definição dos campos "Matéria", "Assunto" e "Cursos" devidamente preenchidos
     * @returns {Boolean}
     */
    validade() {

        return (this.createList() != '' && (this._inputMateria.value != '' && this._inputAssunto.value != ''));
    }

    /**
     * Instancia um novo Objeto Room()
     * @returns {Obj} Instância de Room()
     */
    initiateRoom(userData) {

        return new Room(userData.name, userData.turmaId, this._inputMateria.value, this._inputAssunto.value, this.createList(), this._createHash(userData.userId));
    }

    /**
     * Apaga qualquer elemento HTML dentro do elemento informado 
     * @param {Obj} list Elemento HTML 
     */
    cleanRoomList(list) {

        this._roomView.cleanRoomList(list);
    }

    /**
     * Constrói e apresenta em tela o card referente à sala criada com suas devidas informações
     * @param {String} classe 
     * @param {String} assunto 
     * @param {String} apresentador 
     * @param {String} viwer 
     * @param {String} moderador 
     * @returns {String}
     */
    constructAccessList(classe, assunto, apresentador, viwer, moderador) {

        return this._roomView.createRoomCard(classe, assunto, apresentador, viwer, moderador);
    }

    /**
     * Define informações referentes ao card criado para a sala iniciada
     * Define os identificadores e atributos do botão de ingresso na sala
     * @param {String} moderatorId Identificador do apresentador (Broadcaster ou moderador)
     * @param {String} label Texto referente ao cabeçalho da sala
     * @param {Obj} container Elemento HTML que receberá o cabeçalho 
     * @param {Obj} obj Elemento HTML que será o botão de acesso à sala
     * @param {Number} type Tipo de usuário que está efetuando o acesso (0 ou 1) 
     */
    initiateRoomCard(moderatorId, label, container, obj, type) {

        this._roomView.setRoomCard(moderatorId, label, container, obj, type);
    }

    /**
     * Apresenta a mensagem de nenhuma sala aberta/iniciada
     */
    noRooms() {

        this._roomView.noRooms();
    }

    /**
     * Limpa listagem de card de salas criadas
     */
    clearConList() {

        this._roomView.clearLabelCon();
    }

    /**
     * Cria listagem de espectadores conectados à sala
     * @param {String} userid Identificador do espectador
     * @param {String} username Nome do espectador 
     * @param {String} announce Identificador da conexão do espectador
     * @param {Boolean} itsMe Determina qual é a conexão do espectador
     */
    constructConnectionList(userid, username, announce, itsMe) {

        let deleteButton;
        userid = userid.split('-')[0];
        itsMe ?
            deleteButton = this._roomView.setDisabledConBtn(userid, username, announce) :
            deleteButton = this._roomView.setRemoveConBtn(userid, username, announce);
        this._roomView.newLabelCon(userid, username, deleteButton, itsMe);
    }

    /**
     * Coleta e apresenta lista de espectadores conectados à sala
     */
    inputConList() {

        this._roomView.putList();
    }

    /**
     * Reconstrói lista de espectadores conectados à sala retirando o nome de qualquer espectador removido
     * @param {String} exp Identificador da conexão do espectador que deve ser removido
     */
    constructConnectionExpList(exp) {

        let announce;
        let removeBtn;
        let liList = doc.ALL(dom.DISCONNECT_BTN);
        this._roomView.clearLabelCon();

        liList.forEach(elem => {
            announce = elem.getAttribute('data-announced');
            if (announce != exp) {
                removeBtn = this._roomView.setRemoveConBtn(elem.id, elem.name, announce);
                this._roomView.newLabelCon(elem.id, elem.name, removeBtn);
            }
        });
        this._roomView.putList();
    }

    /**
     * Identifica se a quantidade de espectadores informada no modal de acesso à sala um número válido
     * @returns {Boolean}  
     */
    validateViews() {

        return this._numberOfViewers.value >= 0 && this._numberOfViewers.value < 99999;
    }

    /**
     * Identifica se o valor de espectadores informado no modal de acesso à sala está válido
     * @returns {Boolean}  
     */
    checkViews() {

        return this._numberOfViewers.value != "" && this.validateViews();
    }

    /**
     * Apresenta a quantidade total de espectadores conectados à sala
     * @param {Number} viwers 
     */
    changeCounter(viwers) {

        this._roomView.changeCounter(viwers);
    }

}