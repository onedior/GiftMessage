import React from 'react';
import PropTypes from 'prop-types';
import _GiftMessage from './GiftMessage';

class GiftMessage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            charactersTyped: 0,
            maxCharacters: props.lines * props.maxLength
        };

        this.updateCharactersTyped = this.updateCharactersTyped.bind(this);
        this.wrapperRef = React.createRef();
    }

    updateCharactersTyped(values) {
        this.setState({
            charactersTyped: values.reduce((acc, curr) => curr ? acc + curr.length : acc, 0)
        });

    }

    componentDidMount() {
        this.giftMessageInstance = new _GiftMessage(this.wrapperRef.current, this.props.maxLength, this.updateCharactersTyped);
    }

    componentWillUnmount() {
        this.giftMessageInstance.destroy();
    }

    render() {
        return <div id={this.props.id} className={this.props.className} ref={this.wrapperRef}>
            <div className={`${this.props.className}-lines`}>
                { this.renderFields()}
            </div>
            <div className={`${this.props.className}-total`}>
                {this.state.maxCharacters - this.state.charactersTyped} {this.props.remainingWording}
            </div>
        </div>
    }

    renderFields() {
        const fields = [];
        for (let i = 0; i<this.props.lines; i ++) {
            fields.push(
                <input key={i} />
            );
        }
        return fields;
    }
}

GiftMessage.propTypes = {
    maxLength: PropTypes.number.isRequired,
    lines: PropTypes.number.isRequired,
    className: PropTypes.string.isRequired,
    id: PropTypes.string,
    remainingWording: PropTypes.string
};

export default GiftMessage;
