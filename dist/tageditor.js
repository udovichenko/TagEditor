(function() {

    var TagEditor = function(options) {
        //if (!(this instanceof TagEditor)) return new TagEditor(T.params);

        var T = this;

        T.defaults = {
            separator: ',',
            buttonClass: 'te-button',
            counterClass: 'te-editor__count',
            labelClass: 'te-label',
            labelTextClass: 'te-label__text',
            labelRemoveClass: 'te-label__remove'
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

        // TODO Resize LABEL AREA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // TODO Копирование в буфер

        T.init = function() {
            T.ioArea = $(T.options.ioArea);
            T.labelArea = $(T.options.labelArea);
            T.controlPanel = $(T.options.controlPanel);
            T.counter = $('.' + T.options.counterClass);
            T.buttonCheck = $('.tags-check');

            T.buildControls();

            T.restore();
            T.textAreaResize();
            T.count();

            T.tags = T.getTagsFromText(T.ioText());

            T.labelsInit();
            T.labelsCreate();
            T.attachEvents();
        };

        T.labelsInit = function() {
            console.log(T.labelArea);
            T.sortable = new Sortable(T.labelArea[0], {
                // group: "name",  // or { name: "...", pull: [true, false, clone], put: [true, false, array] }
                // sort: true,  // sorting inside list
                // delay: 0, // time in milliseconds to define when the sorting should start
                // disabled: false, // Disables the sortable if set to true.
                // store: null,  // @see Store
                animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
                // handle: ".my-handle",  // Drag handle selector within list items
                // filter: ".ignore-elements",  // Selectors that do not lead to dragging (String or Function)
                // draggable: ".item",  // Specifies which items inside the element should be draggable
                ghostClass: "te-label_sortable-ghost",  // Class name for the drop placeholder
                chosenClass: "te-label_sortable-chosen",  // Class name for the chosen item
                dragClass: "te-label_sortable-drag",  // Class name for the dragging item

                //forceFallback: false  // ig
                onSort: function() {
                    T.labelsOnSort();
                }
            });
        };

        T.labelsCreate = function() {
            T.labelArea.html('');
            for (var i in T.tags) {
                T.labelAdd(T.tags[i]);
            }
        };

        T.labelsOnSort = function(text) {
            T.ioFromLabels();
        };

        T.labelAdd = function(text) {
            var newLabelText = $('<div>').addClass(T.options.labelTextClass).text(text);
            var newLabelRemove = $('<div>').addClass(T.options.labelRemoveClass);
            var newLabel = $('<li>').addClass(T.options.labelClass).append(newLabelText, newLabelRemove);
            T.labelArea.append(newLabel);
            $(newLabel).on('click', T.labelRemove);

            newLabelRemove
                .on('mouseover', function() {
                    newLabel.addClass('te-label_remove-hover');
                })
                .on('mouseout', function() {
                    newLabel.removeClass('te-label_remove-hover');
                });
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

        T.tagsFromLabels = function() {
            var labelTags = [];

            var labelList = T.labelArea.find('.' + T.options.labelClass);
            console.log(labelList + ' <- labelList');

            $(labelList).each(function(i) {
                var thisLabelText = $(this).find('.' + T.options.labelTextClass).text();
                thisLabelText = $.trim(thisLabelText);

                if (thisLabelText != '') {
                    labelTags.push(thisLabelText);
                }
            });

            T.tags = labelTags;
            return labelTags;
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

        T.updateTagsFromIo = function() {
            T.tags = T.getTagsFromText(T.ioText());
            T.count();
            T.labelsCreate();
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
            T.textCheck();
            T.textUnique();
            T.saveTagsFromIo();
            T.save();
            T.labelsCreate();
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
            T.updateTagsFromIo();
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
            T.counter.text(textTags.length);
        };

        T.saveTagsFromIo = function() {
            T.tags = T.getTagsFromText(T.ioArea.val());
            T.count();
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
            T.updateTagsFromIo();
            T.save();
            T.labelsCreate();
        };

        T.labelRemove = function(e) {
            var thisLabel = $(e.currentTarget).closest('.' + T.options.labelClass);
            thisLabel.remove();
            T.ioFromLabels();
        };

        T.ioFromTags = function() {
            var newText = T.tags.join(T.separator);
            T.ioText(newText);
        };

        T.ioFromLabels = function() {
            T.tagsFromLabels();
            T.ioFromTags();
            T.ioFormat();
        };

        // T.build = function() {
        //
        // };

        T.attachEvents = function() {
            $(T.ioArea).on('keyup', T.ioKeyup);

            $(window).on('load', function() {

            });
        };

        T.init();
    };

    window.TagEditor = TagEditor;
})();