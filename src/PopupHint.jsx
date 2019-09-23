import React from "react";
import ReactDOM from "react-dom";

export default class PopupHint extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShown: false
        };
        this.onScroll = this.hide.bind(this);
    }

    componentDidUpdate() {}

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (this.props.isShown && !prevState.isShown) {
            this.show();
        }

        if (!this.props.isShown && prevState.isShown) {
            this.hide();
        }

        return {
            isShown: this.props.isShown
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isShown === prevState.isShown) {
            return null;
        }

        return {
            isShown: nextProps.isShown
        };
    }

    show() {
        this.setState({ isShown: true });
        window.addEventListener("scroll", this.onScroll);
    }

    hide() {
        window.removeEventListener("scroll", this.onScroll);
        this.props.onClose();
    }

    render() {
        if (this.state.isShown) {
            return ReactDOM.createPortal(this.props.children, document.body);
        }

        return null;
    }
}
