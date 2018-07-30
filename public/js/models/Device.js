class Device {

    constructor(audioId, audioLabel, audioGroup, videoId, videoLabel, videoGroup) {

        this._audioId = audioId;
        this._audioLabel = audioLabel;
        this._audioGroup = audioGroup;
        this._videoId = videoId;
        this._videoLabel = videoLabel;
        this._videoGroup = videoGroup;
    }

    get audioId() {

        return this._audioId;
    }
    set audioId(audioId) {

        this._audioId = audioId;
    }

    get audioLabel() {

        return this._audioLabel;
    }
    set audioLabel(audioLabel) {

        this._audioLabel = audioLabel;
    }

    get audioGroup() {

        return this._audioGroup;
    }
    set audioGroup(audioGroup) {

        this._audioGroup = audioGroup;
    }

    get videoId() {

        return this._videoId;
    }
    set videoId(videoId) {

        this._videoId = videoId;
    }

    get videoLabel() {

        return this._videoLabel;
    }
    set videoLabel(videoLabel) {

        this._videoLabel = videoLabel;
    }

    get videoGroup() {

        return this._videoGroup;
    }
    set videoGroup(videoGroup) {

        this._videoGroup = videoGroup;
    }


}