class App {

    constructor() {


    }

    static jsonFile() {

        $.getJSON(`http://localhost/js/conf/config.json`, json => {
            return json;
        });
    }
}