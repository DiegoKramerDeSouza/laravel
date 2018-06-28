class Document {

    constructor() {

        this.tag = document.querySelector.bind(document);
        this.allTags = document.querySelectorAll.bind(document);
        this.createTag = document.createElement.bind(document);
    }

    getTag(obj) {

        return this.tag(obj);
    }

    getAllTags(obj) {

        return this.allTags(obj);
    }

    createTag(obj) {

        return this.createTag(obj);
    }
}