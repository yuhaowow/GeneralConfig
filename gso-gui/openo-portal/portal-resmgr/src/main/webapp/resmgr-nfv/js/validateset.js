$(function () {
    $.validator.setDefaults({
        onkeyup: null,
        success: function (label) {
            label.text('').addClass('valid');
        },
        onfocusin: function (element) {
            this.lastActive = element;
            this.addWrapper(this.errorsFor(element)).hide();
            var tip = $(element).attr('tip');
            if (tip && $(element).parent().children(".tip").length === 0) {
                $(element).parent().append("<label class='tip'>" + tip + "</label>");
            }
            $(element).addClass('highlight');
            if (this.settings.focusCleanup) {
                if (this.settings.unhighlight) {
                    this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
                }
                this.hideThese(this.errorsFor(element));
            }
        },
        onfocusout: function (element) {
            $(element).parent().children(".tip").remove();
            $(element).removeClass('highlight');
            this.element(element);
        }
    });
});