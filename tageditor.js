var TagEditor = function(params) {
    if (!(this instanceof TagEditor)) return new TagEditor(params);

    var This = this;

    this.defaults = {
        separator: ','
        //el: '.accordion'
    };

    params = $.extend({}, this.defaults, params);

    This.separator = params.separator;

    this.unique = function(list) {
        return list.filter(function(value, index, self) {
            return self.indexOf(value) === index;
        });
    };

    this.getTagsFromText = function(text) {
        // var text = This.textArea.val();
        var textTags = text.split(This.separator);
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

    this.textUnique = function() {
        var text = This.textArea.val();
        var textTags = this.getTagsFromText(text);
        textTags = This.unique(textTags);
        This.textArea.val(textTags.join(This.separator + ' '));
        console.log(This.separator);
    };

    this.textCheck = function() {
        var text = This.textArea.val();
        var textTagsClean = this.getTagsFromText(text);

        text = textTagsClean.join(This.separator + ' ');
        This.textArea.val(text);
    };

    this.textFormat = function(text) {

        if (This.separator == ',') {
            text = text.replace(/(\;|\,|\n){1,}/g, This.separator);
        }

        // removes spaces before separator
        text = text.replace(/ (\,|\;){1,}/g, ",");
        // text = text.replace(/ {1,}/g, ",");

        // removes double spaces
        text = text.replace(/ {1,}/g, " ");

        return text;
    };

    this.textAreaResize = function() {
        // var textarea = This.textArea.get(0);
        // var paddingV = parseInt(This.textArea.css('padding-top')) + parseInt(This.textArea.css('padding-bottom'));
        // // console.log(paddingV);
        // // console.log(textarea.scrollHeight);
        //
        // var resultHeight = -paddingV - 4 + textarea.scrollHeight + 'px';
        // console.log(resultHeight);
        // This.textArea.scrollTop(0);
        // textarea.style.overflow = 'hidden';
        // textarea.style.height = resultHeight;
        // // console.log(textarea.scrollHeight);
        // // textarea.style.overflow = 'hidden';
        // // textarea.style.height = 0;
        // // textarea.style.height = this.scrollHeight + 'px';
        autosize(This.textArea);
    };

    this.textChange = function() {
        var text = This.textArea.val();
        var formatedText = This.textFormat(text);
        This.textArea.val(formatedText);
    };

    this.count = function() {
        var text = This.textArea.val();
        var textTags = this.getTagsFromText(text);
        $('.tags-count').text(textTags.length);
    };

    this.save = function() {
        Cookies.set('text', This.textArea.val());
    };

    this.restore = function() {
        var text = Cookies.get('text');
        This.textArea.val(text);
    };

    this.textArea = $(params.textArea);
    this.labelArea = $(params.labelArea);
    this.buttonCheck = $('.tags-check');

    $(this.textArea).on('keyup', function() {
        This.textChange();
        This.textAreaResize();
        This.count();
        This.save();
    });

    $(this.buttonCheck).on('click', function() {
        This.textCheck();
        This.textUnique();
        This.count();
        This.save();
    });

    $(window).on('load', function() {
        This.restore();
        This.textAreaResize();
        This.count();
    });


    //
    // $('.tags-button-separator').on('click', function() {
    //     var self = $(this);
    //     This.separator = self.text();
    //     self
    //         .addClass('active')
    //         .siblings()
    //         .removeClass('active');
    //
    //     This.textCheck();
    // });

};