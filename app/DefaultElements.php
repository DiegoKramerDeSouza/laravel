<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DefaultElements extends Model
{

    public function __construct()
    {
        // Arquivos de imagens
        $this->bgImage = 'img/bg.jpg';
        $this->playImg = 'img/play_btn.png';
        // Definição do nome da aplicação
        $this->logo = 'WebTV';
        $this->mainLogo = '<b class="white-text"><span class="blue-text">Web</span>Tv</b>';
        // Extensão de navegador para compartilhamento de tela
        $this->chromeExt = 'https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk';
        $this->firefoxExt = 'https://addons.mozilla.org/en-US/firefox/addon/enable-screen-capturing/';
        $this->mediaChromeExt = 'https://chrome.google.com/webstore/detail/ant-media-server-screen-s/jaefaokkgpkkjijgddghhcncipkebpnb';
        // Definição de ícones para todas as views
        // -> Ícones utilizados: FontAwesome e MaterializeCSS
        // MaterializeCSS Icons:
        $this->controlLargeIcon =           "<i class='material-icons large'>more_horiz</i>";
        $this->blueExtension =              "<i class='material-icons blue-text'>extension</i>";
        $this->checkIcon =                  "<i class='material-icons'>check</i>";
        $this->checkLeftIcon =              "<i class='material-icons left'>check</i>";
        $this->chevronRightLeft =           "<i class='material-icons'>keyboard_arrow_right</i>";
        $this->chevronLeftLeft =            "<i class='material-icons left'>keyboard_arrow_left</i>";
        $this->fileDownloadIcon =           "<i class='material-icons'>file_download</i>";
        $this->fileDownloadLeftIcon =       "<i class='material-icons left'>file_download</i>";
        $this->forumIcon =                  "<i class='material-icons'>forum</i>";
        $this->fullscreenExitLargeIcon =    "<i class='material-icons large'>fullscreen_exit</i>";
        $this->fullscreenIcon =             "<i class='material-icons'>fullscreen</i>";
        $this->micIcon =                    "<i class='material-icons'>mic</i>";
        $this->offLargeRedIcon =            "<i class='material-icons large red-text text-darken-3'>highlight_off</i>";
        $this->panToolBlueIcon =            "<i class='material-icons blue-text'>pan_tool</i>";
        $this->panToolIcon =                "<i class='material-icons'>pan_tool</i>";
        $this->peopleIcon =                 "<i class='material-icons'>people_outline</i>";
        $this->peopleIconLeft =             "<i class='material-icons left'>people_outline</i>";
        $this->peopleLargeIcon =            "<i class='material-icons large'>people_outline</i>";
        $this->playLargeIcon =              "<i class='material-icons large'>play_circle_outline</i>";
        $this->searchIcon =                 "<i class='material-icons'>search</i>";
        $this->scheduleIcon =               "<i class='material-icons large'>schedule</i>";
        $this->screenShareIcon =            "<i class='material-icons'>screen_share</i>";
        $this->sendIcon =                   "<i class='material-icons'>send</i>";
        $this->shareIcon =                  "<i class='material-icons'>share</i>";
        $this->shareLargeIcon =             "<i class='material-icons large'>share</i>";
        $this->sizeIcon =                   "<i class='material-icons'>zoom_out_map</i>";
        $this->swapIcon =                   "<i class='material-icons'>swap_horiz</i>";
        $this->timeIconLeft =               "<i class='material-icons left'>query_builder</i>";
        $this->transmitLargeIcon =          "<i class='material-icons large'>wifi_tethering</i>";
        $this->tvBlueIcon =                 "<i class='material-icons blue-text'>live_tv</i>";
        $this->tvIcon =                     "<i class='material-icons'>live_tv</i>";
        $this->tvLargeIcon =                "<i class='material-icons large'>live_tv</i>";
        $this->tokenUsb =                   "<i class='material-icons left'>usb</i>";
        $this->ulListLeftIcon =             "<i class='material-icons left'>format_list_bulleted</i>";
        $this->userVideoBlueIcon =          "<i class='material-icons blue-text'>ondemand_video</i>";
        $this->videocamIcon =               "<i class='material-icons'>videocam</i>";
        $this->videocamLargeIcon =          "<i class='material-icons large'>videocam</i>";
        $this->videocamoffLargeIcon =       "<i class='material-icons large'>videocam_off</i>";
        $this->videocamoffLargeBlueIcon =   "<i class='material-icons large blue-text'>videocam_off</i>";
        $this->videocamoffLargeRedIcon =    "<i class='material-icons large red-text text-darken-3'>videocam_off</i>";
        $this->volumeUpIcon =               "<i class='material-icons'>volume_up</i>";
        $this->volumeDownIcon =             "<i class='material-icons'>volume_off</i>";
        // FontAwesome Icons:
        $this->acessosIcon =            "<i class='fa fa-shield fa-lg'></i>";
        $this->applyIcon =              "<i class='fa fa-check'></i>";
        $this->blueCloudDownload =      "<i class='fa fa-cloud-download'></i>";
        $this->blueCloudDownloadLg =    "<i class='fa fa-cloud-download fa-2x'></i>";
        $this->blueCloudUpload =        "<i class='fa fa-cloud-upload'></i>";
        $this->blueCloudUploadLg =      "<i class='fa fa-cloud-upload fa-2x'></i>";
        $this->bookBlueIcon =           "<i class='fa fa-book blue-text'></i>";
        $this->bookIcon =               "<i class='fa fa-book'></i>";
        $this->bookmarkIcon =           "<i class='fa fa-bookmark'></i>";
        $this->camIcon =                "<i class='fa fa-video-camera fa-lg'></i>";
        $this->cancelIcon =             "<i class='fa fa-times'></i>";
        $this->cancelRedIcon =          "<i class='fa fa-times red-text text-darken-3'></i>";
        $this->checkListIcon =          "<i class='fa fa-check-square-o'></i>";
        $this->chromeIcon =             "<i class='fa fa-chrome'></i>";
        $this->circleRedIcon =          "<span class='fa fa-circle red-text'></span>";
        $this->closeIcon =              "<i class='fa fa-times-circle'></i>";
        $this->closeLargeIcon =         "<i class='fa fa-times-circle fa-3x'></i>";
        $this->copyRightIcon =          "<i class='fa fa-copyright'></i>";
        $this->configBlueIcon =         "<i class='fa fa-cog blue-text'></i>";
        $this->configIcon =             "<i class='fa fa-cog'></i>";
        $this->cursosIcon =             "<i class='fa fa-cubes'></i>";
        $this->cursosLargeIcon =        "<i class='fa fa-cubes fa-2x'></i>";
        $this->deleteIcon =             "<i class='fa fa-trash-o'></i>";
        $this->descricaoIcon =          "<i class='fa fa-commenting-o fa-lg'></i>";
        $this->downloadIcon =           "<i class='fa fa-download'></i>";
        $this->editIcon =               "<i class='fa fa-pencil'></i>";
        $this->enderecoIcon =           "<i class='fa fa-map-marker fa-lg'></i>";
        $this->envelopeIcon =           "<i class='fa fa-envelope-o fa-lg'></i>";
        $this->exitRoom =               "<i class='fa fa-sign-out fa-2x'></i>";
        $this->exitTransmition =        "<i class='fa fa-times fa-2x'></i>";
        $this->firefoxIcon =            "<i class='fa fa-firefox'></i>";
        $this->globoIcon =              "<i class='fa fa-globe fa-lg'></i>";
        $this->homeBlueIcon =           "<span class='fa fa-home fa-lg blue-text'></span>";
        $this->homeIcon =               "<i class='fa fa-home fa-lg'></i>";
        $this->institutionIcon =        "<i class='fa fa-institution'></i>";
        $this->institutionLargeIcon =   "<i class='fa fa-institution fa-2x'></i>";
        $this->lockIcon =               "<i class='fa fa-lock fa-lg'></i>";
        $this->loginIcon =              "<i class='fa fa-user-circle fa-lg'></i>";
        $this->loginBlueIcon =          "<i class='fa fa-user-circle fa-lg blue-text'></i>";
        $this->manageBlueIcon =         "<span class='fa fa-cogs fa-lg blue-text'></span>";
        $this->manageIcon =             "<span class='fa fa-cogs'></span>";
        $this->manageWhiteIcon =        "<span class='fa fa-cogs white-text'></span>";
        $this->mapIcon =                "<i class='fa fa-map-o fa-lg'></i>";
        $this->menuIcon =               "<i class='fa fa-bars fa-2x'></i>";
        $this->microphoneIcon =         "<i class='fa fa-microphone fa-lg'></i>";
        $this->modulosIcon =            "<i class='fa fa-database'></i>";
        $this->modulosLargeIcon =       "<i class='fa fa-database fa-2x'></i>";
        $this->novoIcon =               "<i class='fa fa-plus-circle fa-lg'></i>";
        $this->numeroIcon =             "<i class='fa fa-tag fa-lg'></i>";
        $this->perfisIcon =             "<i class='fa fa-vcard-o'></i>";
        $this->perfisLargeIcon =        "<i class='fa fa-vcard-o fa-2x'></i>";
        $this->playButtomIcon =         "<i class='fa fa-play-circle'></i>";
        $this->plusIcon =               "<i class='fa fa-plus-square-o fa-lg'></i>";
        $this->roomsBlueIcon =          "<span class='fa fa-television fa-lg blue-text'></span>";
        $this->roomsIcon =              "<span class='fa fa-television'></span>";
        $this->signInIcon =             "<i class='fa fa-sign-in fa-lg'></i>";
        $this->signOutRedIcon =         "<i class='fa fa-sign-out fa-lg red-text'></i>";
        $this->turmasIcon =             "<i class='fa fa-graduation-cap'></i>";
        $this->turmasLargeIcon =        "<i class='fa fa-graduation-cap fa-2x'></i>";
        $this->timeIcon =               "<i class='fa fa-clock-o fa-lg'></i>";
        $this->ulListBlueIcon =         "<span class='fa fa-list-ul blue-text'></span>";
        $this->usuariosIcon =           "<i class='fa fa-users fa-lg'></i>";
        $this->usuariosBlueIcon =       "<i class='fa fa-users fa-lg blue-text'></i>";
        $this->usuariosDefaultIcon =    "<i class='fa fa-users'></i>";
        $this->usuariosLargeIcon =      "<i class='fa fa-users fa-2x'></i>";
        $this->userIcon =               "<i class='fa fa-user fa-lg'></i>";
        $this->userOIcon =              "<i class='fa fa-user-o fa-lg'></i>";
        $this->usersOIcon =             "<i class='fa fa-users fa-lg'></i>";
        $this->userPlusBlueIcon =       "<span class='fa fa-user-plus fa-lg blue-text'></span>";
        $this->warningIcon =            "<i class='fa fa-exclamation-triangle fa-lg'></i>";
        // Ícones que necessitam da classe prefix
        $this->prefixCommentingIcon =   "<i class='fa fa-commenting-o fa-1x prefix'></i>";
        $this->prefixSearchIcon =       "<i class='material-icons prefix'>search</i>";
        // Ícone + texto para links
        $this->gobackLink =             "<i class='material-icons left'>keyboard_backspace</i>voltar";
        $this->homeLink =               "<i class='material-icons left'>undo</i>desfazer";

        // Pre-Loader
        $this->preLoader =              '<div class="preloader-wrapper big active">
                                            <div class="spinner-layer spinner-teal-only">
                                                <div class="circle-clipper left">
                                                    <div class="circle"></div>
                                                </div>
                                                <div class="gap-patch">
                                                    <div class="circle"></div>
                                                </div>
                                                <div class="circle-clipper right">
                                                    <div class="circle"></div>
                                                </div>
                                            </div>
                                        </div>';
        
        $this->preLoaderSmall =         '<div class="preloader-wrapper small active">
                                            <div class="spinner-layer spinner-teal-only">
                                                <div class="circle-clipper left">
                                                    <div class="circle"></div>
                                                </div>
                                                <div class="gap-patch">
                                                    <div class="circle"></div>
                                                </div>
                                                <div class="circle-clipper right">
                                                    <div class="circle"></div>
                                                </div>
                                            </div>
                                        </div>';
        // Definição de UFs em array
        $this->ufs = ['AC'=>'Acre','AL'=>'Alagoas','AP'=>'Amapá','AM'=>'Amazonas','BA'=>'Bahia','CE'=>'Ceará',
        'DF'=>'Distrito Federal','ES'=>'Espírito Santo','GO'=>'Goiás','MA'=>'Maranhão','MT'=>'Mato Grosso',
        'MS'=>'Mato Grosso do Sul','MG'=>'Minas Gerais','PA'=>'Pará','PB'=>'Paraíba','PR'=>'Paraná',
        'PE'=>'Pernambuco','PI'=>'Piauí','RJ'=>'Rio de Janeiro','RN'=>'Rio Grande do Norte',
        'RS'=>'Rio Grande do Sul','RO'=>'Rondônia','RR'=>'Roraima','SC'=>'Santa Catarina','SP'=>'São Paulo',
        'SE'=>'Sergipe','TO'=>'Tocantins'];

        //Textos
        $this->connecting = "Conectando...";
    }
}
