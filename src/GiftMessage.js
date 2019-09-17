const KEYCODES = {
    TOP: 38,
    BOTTOM: 40,
    LEFT: 37,
    RIGHT: 39,
    BACKSPACE: 8,
    ENTER: 13
};

const emojiRegex = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;


class GiftMessage {

    constructor(parent, maxLength, onUpdate, options = {}) {

        this.elements = parent.getElementsByTagName('input');
        this.lines = this.elements.length;
        this.maxLength = maxLength;
        this.regex = new RegExp(`(.{0,${this.maxLength}})(?:\\s|$)`, 'g');
        this.options = options;

        this.onFocus = this.onFocus.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        if (onUpdate) this.onUpdate = onUpdate;

        Array.from(this.elements).forEach((el) => {
            el.addEventListener('focus', this.onFocus);
            el.addEventListener('input', this.onInput);
            el.addEventListener('keydown', this.onKeyDown);
        })

    }

    setActiveIndex(line) {
        this.activeIndex = Math.max(0, Math.min(line, this.lines-1));
    }

    getLineValues() {

        const values = [];
        for (let i = 0; i<this.lines; i++) {
            values.push(this.elements[i].value);
        }

        return values;
    }

    adjustLines(values) {

        values = values.concat();

        return values.map((v, i) => {
            v = v.match(this.regex);
            if (i !== values.length-1)
                values[i+1] = (v[1] || '')+values[i+1];
            return v[0];
        })

    }

    setLines(values){

        for (let i=0; i<this.lines; i++) {
            this.elements[i].value = values[i];
        }

    }

    setCaretPosition(line, position, focus) {
        const element = this.elements[line];
        if (element) {
            if (focus) element.focus();
            element.selectionStart = position;
            element.selectionEnd = position;
        }
    }

    onFocus(e) {
        this.setActiveIndex( Array.from(this.elements).indexOf(e.target) );
    }

    onInput(e) {
        let caretPosition = this.elements[this.activeIndex].selectionStart;
        if (this.options.noEmojis) caretPosition = GiftMessage.removeEmojis(e, caretPosition);
        if (this.activeIndex < this.lines-1) {
            const values = this.getLineValues();
            const adjusted = this.adjustLines(values);

            this.setLines(adjusted);

            if (caretPosition > adjusted[this.activeIndex].length) {
                this.setActiveIndex(this.activeIndex+1);
                this.setCaretPosition(
                    this.activeIndex,
                    adjusted[this.activeIndex].length - values[this.activeIndex].length,
                    true
                );
            } else {
                this.setCaretPosition(this.activeIndex, caretPosition)
            }
        } else if(e.target.value.length > this.maxLength) {
            e.target.value = e.target.value.substr(0, this.maxLength);
            this.setCaretPosition(this.activeIndex, caretPosition)
        }

        if (typeof this.onUpdate === 'function') this.onUpdate(this.getLineValues());
    }

    onKeyDown(e) {
        switch(e.which) {
            case KEYCODES.TOP:
                e.preventDefault();
                this.setCaretPosition(this.activeIndex-1, this.maxLength, true);
                break;
            case KEYCODES.BACKSPACE:
            case KEYCODES.LEFT: {
                if (e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
                    e.preventDefault();
                    this.setCaretPosition(this.activeIndex-1, this.maxLength, true);
                }
                break;
            }
            case KEYCODES.RIGHT:
                if (this.activeIndex <= this.lines-1 && e.target.selectionStart === e.target.value.length) {
                    e.preventDefault();
                    this.setCaretPosition(this.activeIndex+1, 0, true);
                }
                break;
            case KEYCODES.ENTER:
                if(this.activeIndex === this.lines-1) {
                    return;
                }
            case KEYCODES.BOTTOM: {
                e.preventDefault();
                this.setCaretPosition(this.activeIndex+1, 0, true);
                break;
            }
        }
    }

    static removeEmojis(e, caretPosition) {
        const previousLength = e.target.value.length;
        e.target.value = e.target.value.replace(emojiRegex, '');
        return caretPosition + e.target.value.length- previousLength;
    }

    destroy() {
        Array.from(this.elements).forEach((el) => {
            el.removeEventListener('input', this.onInput);
            el.removeEventListener('keydown', this.onKeyDown);
        })
    }

}

export default GiftMessage;
