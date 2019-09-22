import React from "react";
import ReactDOM from "react-dom";

export default class PopupHint extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShown: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isShown && nextProps.isShown !== this.props.isShown) {
            this.show();
        }

        if (!nextProps.isShown && nextProps.isShown !== this.props.isShown) {
            this.hide();
        }
    }

    show() {
        window.addEventListener("scroll", this.hide.bind(this));
        this.setState({ isShown: true });
    }

    hide() {
        window.removeEventListener("scroll", this.hide.bind(this));
        this.setState({ isShown: false });
    }

    render() {
        if (this.state.isShown) {
            return ReactDOM.createPortal(this.props.children, document.body);
        }

        return null;
    }
}
