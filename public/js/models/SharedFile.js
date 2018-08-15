class SharedFile {

    constructor(name, extension, size, sendTo, received) {

        this._name = name;
        this._extension = extension;
        this._size = size;
    }

    get name() {

        return this._name;
    }

    set name(name) {

        this._name = name;
    }

    get extension() {

        return this._extension;
    }

    set extension(ext) {

        this._extension = ext;
    }

    get size() {

        return this._size;
    }

    set size(size) {

        this._size = size;
    }

}