var DetectRTC = {};

var screenCallback;

DetectRTC.screen = {
    chromeMediaSource: 'screen',
    getSourceId: function(callback) {
        screenCallback = callback;
        window.postMessage('get-sourceId', '*');
    },
    getSourceIdWithAudio: function(callback) {
        screenCallback = callback;
        window.postMessage('audio-plus-tab', '*');
    },
    onMessageCallback: function(data) {
        // "cancel" button is clicked
        if (data == 'PermissionDeniedError') {
            DetectRTC.screen.chromeMediaSource = 'PermissionDeniedError';
            if (screenCallback) return screenCallback('PermissionDeniedError');
            else throw new Error('PermissionDeniedError');
        }

        // extension notified his presence
        if (data == 'rtcmulticonnection-extension-loaded') {
            DetectRTC.screen.chromeMediaSource = 'desktop';
        }

        // extension shared temp sourceId
        if (data.sourceId) {
            DetectRTC.screen.sourceId = data.sourceId;
            
            if (screenCallback) {
                screenCallback(DetectRTC.screen.sourceId, data.canRequestAudioTrack === true);
            }
        }
    },
    getChromeExtensionStatus: function(callback) {
        // https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk
        var extensionid = 'ajhifddimkapgcifgcodmmfdlknahffk';

        var image = document.createElement('img');
        image.src = 'chrome-extension://' + extensionid + '/icon.png';
        image.onload = function() {
            if (!DetectRTC.screen) DetectRTC.screen = {};
            if (!DetectRTC.screen.chromeMediaSource) DetectRTC.screen.chromeMediaSource = '';

            if (DetectRTC.screen.chromeMediaSource === 'desktop') {
                callback('installed-enabled');
                return;
            }

            DetectRTC.screen.chromeMediaSource = 'screen';
            window.postMessage('are-you-there', '*');
            setTimeout(function() {
                if (DetectRTC.screen.chromeMediaSource == 'screen') {
                    callback('installed-disabled');
                } else {
                    callback('installed-enabled');
                }
            }, 2000);
        };
        image.onerror = function() {
            callback('not-installed');
        };
    }
};

window.addEventListener('message', function(event) {
    if (!event.data || !(typeof event.data == 'string' || event.data.sourceId || event.data.captureSourceId || event.data.getChromeExtensionStatus || event.data.captureSourceIdWithAudio)) return;

    if (event.data.getChromeExtensionStatus) {
        DetectRTC.screen.getChromeExtensionStatus(function(status) {
            window.parent.postMessage({
                chromeExtensionStatus: status
            }, '*');
        });
        return;
    }

    if (event.data.captureSourceId) {
        captureSourceId();
    }

    if (event.data.captureSourceIdWithAudio) {
        captureSourceId('system_audio');
    }

    DetectRTC.screen.onMessageCallback(event.data);
});

function captureSourceId(system_audio) {
    // check if desktop-capture extension installed.
    DetectRTC.screen.getChromeExtensionStatus(function(status) {
        if (status != 'installed-enabled') {
            window.parent.postMessage({
                chromeExtensionStatus: status
            }, '*');
            return;
        }

        if(!system_audio) {
            DetectRTC.screen.getSourceId(function(sourceId) {
                window.parent.postMessage({
                    chromeMediaSourceId: sourceId
                }, '*');
            });
        }
        else {
            DetectRTC.screen.getSourceIdWithAudio(function(sourceId, canRequestAudioTrack) {
                window.parent.postMessage({
                    chromeMediaSourceId: sourceId,
                    canRequestAudioTrack: !!canRequestAudioTrack
                }, '*');
            });
        }
    });
}