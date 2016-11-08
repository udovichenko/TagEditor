(function() {

    var TagEditor = function(options) {
        //if (!(this instanceof TagEditor)) return new TagEditor(T.params);

        var T = this;

        T.defaults = {
            separator: ',',
            buttonClass: 'te-button'
            //el: '.accordion'
        };

        T.controls = {
            format: {
                text: 'Format',
                action: 'ioFormat'
            },
            spaceToComma: {
                text: '_ > ,',
                action: 'spaceToComma'
            }
        };

        T.options = $.extend({}, T.defaults, options);

        T.tags = [];
        T.separator = T.options.separator;

        T.init = function() {
            T.ioArea = $(T.options.ioArea);
            T.labelArea = $(T.options.labelArea);
            T.controlPanel = $(T.options.controlPanel);
            T.buttonCheck = $('.tags-check');

            T.buildControls();

            T.restore();
            T.textAreaResize();
            T.count();
            T.tags = T.getTagsFromText(T.ioText());

            T.attachEvents();
        };

        T.buildControls = function() {
            for (var i in T.controls) {
                var thisControl = T.controls[i];
                if (!thisControl.action) return;

                var trigger = thisControl.trigger || 'click';
                var controlTpl = $('<button>');
                controlTpl
                    .addClass(T.options.buttonClass)
                    .text(thisControl.text);

                if (typeof T[thisControl.action] == "function") {
                    controlTpl.on(trigger, T[thisControl.action]);
                }

                T.controlPanel.append(controlTpl);
            }
        };

        T.unique = function(list) {
            return list.filter(function(value, index, self) {
                return self.indexOf(value) === index;
            });
        };

        T.getTagsFromText = function(text) {
            // var text = This.textArea.val();
            var textTags = text.split(T.separator);
            var textTagsClean = [];

            $.each(textTags, function(i) {
                //console.log(i);
                var tagTrimmed = $.trim(textTags[i]);
                if (tagTrimmed != '') {
                    textTagsClean.push(tagTrimmed);
                }
            });

            return textTagsClean;
        };

        T.updateTags = function() {
            T.tags = T.getTagsFromText(T.ioText());
        };

        T.textUnique = function() {
            var text = T.ioText();
            var textTags = T.getTagsFromText(text);
            textTags = T.unique(textTags);
            T.ioArea.val(textTags.join(T.separator + ' '));
            console.log(T.separator);
        };

        T.textCheck = function() {
            var text = T.ioArea.val();
            var textTagsClean = T.getTagsFromText(text);

            text = textTagsClean.join(T.separator + ' ');
            T.ioArea.val(text);
        };

        T.ioText = function(text) {
            if (typeof text == "undefined") {
                return T.ioArea.val();
            } else {
                return T.ioArea.val(text);
            }
        };

        T.ioFormat = function() {
            T.ioText(T.textFormat());
        };

        T.textFormat = function() {
            var text = T.ioText();
            if (T.separator == ',') {
                text = text.replace(/(\;|\,|\n){1,}/g, T.separator);
            }

            // removes spaces before separator
            text = text.replace(/ (\,|\;){1,}/g, ",");

            // text = text.replace(/ {1,}/g, ",");

            // removes double spaces
            text = text.replace(/ {1,}/g, " ");


            // add spaces after separator
            text = text.replace(/(\,|\;){1,}\s{0,}/g, "$1 ")

            // text = text.replace(/ {1,}/g, " ");

            return text;
        };

        T.spaceToComma = function() {
            //console.log(T.ioArea.val().replace(/(\,)/g, ' '));

            var text = T.ioArea.val().replace(/\s{0,}(\,{1,})\s{0,}/g, ' ');
            text = text.replace(/\s/g, ', ');
            T.ioArea.val(text);
            // T.separator = ' ';
            T.updateTags();
            // T.setSeparator(',');
        };

        T.setSeparator = function(separator) {
            //console.log('spaceToComma');
            T.separator = separator;

            var newSeparator = (separator == ' ')
                ? separator
                : separator + ' ';

            var outputText = T.tags.join(newSeparator);
            T.ioArea.val(outputText);
        };

        T.textAreaResize = function() {
            autosize(T.ioArea);
        };

        T.textChange = function() {
            var text = T.ioArea.val();
            var formatedText = T.textFormat(text);
            T.ioArea.val(formatedText);
        };

        T.count = function() {
            var text = T.ioArea.val();
            var textTags = T.getTagsFromText(text);
            $('.tags-count').text(textTags.length);
        };

        T.saveTagsFromIo = function() {
            T.tags = T.getTagsFromText(T.ioArea.val());
        };

        T.save = function() {
            Cookies.set('text', T.ioArea.val());
        };

        T.restore = function() {
            var text = Cookies.get('text');
            T.ioArea.val(text);
        };

        T.ioKeyup = function() {
            T.textChange();
            T.textAreaResize();
            T.count();
            T.save();
        };

        // T.build = function() {
        //
        // };

        T.attachEvents = function() {
            $(T.ioArea).on('keyup', T.ioKeyup);

            // $(T.buttonCheck).on('click', function() {
            //     T.textCheck();
            //     T.textUnique();
            //     T.count();
            //     T.save();
            // });

            $(window).on('load', function() {

            });
        };

        T.init();
    };

    window.TagEditor = TagEditor;
})();