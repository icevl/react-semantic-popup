import React, { Component } from "react";
import ReactDOM from "react-dom";
import PopupHint from "./PopupHint";
import "./styles.css";

class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShown: false,
            styles: {},
            align: "top left"
        };

        this.alignList = ["top left", "top center", "top right", "right center", "left center", "bottom left", "bottom center", "bottom right"];
        this.arrowPixelsFromEdge = 20;
        this.trigger = this.props.click ? "click" : "hover";
    }

    componentDidMount() {
        this.pointer = this.getDOMElement(this.pointerRef);

        if (this.trigger === "hover") {
            this.pointer.addEventListener("mouseover", this.onTriggerStart.bind(this));
            this.pointer.addEventListener("mouseout", this.onTriggerLeave.bind(this));
        }

        if (this.trigger === "click") {
            this.pointer.addEventListener("click", this.onTriggerStart.bind(this));
            document.addEventListener("click", this.onClickOutsidePointer.bind(this, this.pointer));
        }
    }

    componentWillUnmount() {
        if (this.trigger === "hover") {
            this.pointer.removeEventListener("mouseover", this.onTriggerStart.bind(this));
            this.pointer.removeEventListener("mouseout", this.onTriggerLeave.bind(this));
        }

        if (this.trigger === "click") {
            this.pointer.removeEventListener("click", this.onTriggerStart.bind(this));
            document.removeEventListener("click", this.onClickOutsidePointer.bind(this, this.pointerRef));
        }
    }

    getDOMElement(element) {
        if (element.refs) {
            element = ReactDOM.findDOMNode(element);
        }
        return element;
    }

    getElementPosition(element) {
        const domElement = this.getDOMElement(element);

        const position = domElement.getBoundingClientRect();
        const style = window.getComputedStyle(domElement);
        position.margin = {
            left: parseInt(style.getPropertyValue("margin-left")),
            top: parseInt(style.getPropertyValue("margin-top"))
        };

        return position;
    }

    /**
     * Отступ от края
     * Если элемент указателя на popup по ширине больше (this.arrowPixelsFromEdge * 2),
     * то left попапа будет равно left указателя без отступа.
     *
     * Либо pop выравнивается относительно центра указателя.
     */
    getOffset(align, target) {
        if (target.width >= this.arrowPixelsFromEdge * 2) {
            return 0;
        }

        let offset = 0;

        switch (align) {
            case "top left":
            case "bottom left":
                offset += target.width / 2;
                offset -= this.arrowPixelsFromEdge;
                break;

            case "top right":
            case "bottom right":
                offset -= target.width / 2;
                offset += this.arrowPixelsFromEdge;
                break;
        }

        return offset;
    }

    getDirection(align) {
        const target = this.getElementPosition(this.pointerRef);
        const popup = this.popupRef.getBoundingClientRect();

        const offset = this.getOffset(align, target);

        switch (align) {
            case "top left":
                return {
                    top: target.top + window.pageYOffset - popup.height - 10,
                    left: target.left + offset,
                    bottom: "auto",
                    right: "auto"
                };

            case "top right":
                return {
                    top: target.top + window.pageYOffset - popup.height - 15,
                    right: window.innerWidth - target.left - target.width - offset,
                    bottom: "auto",
                    left: "auto"
                };

            case "top center":
                return {
                    top: target.top + window.pageYOffset - popup.height - 15,
                    left: target.left - popup.width / 2 + target.width / 2,
                    bottom: "auto",
                    right: "auto"
                };

            case "right center":
                return {
                    top: target.top + window.pageYOffset + target.height / 2 - popup.height / 2,
                    left: target.left + target.width,
                    bottom: "auto",
                    right: "auto"
                };

            case "left center":
                return {
                    top: target.top + window.pageYOffset - target.margin.top + target.height / 2 - popup.height / 2,
                    right: window.innerWidth - target.left - target.margin.left + 5,
                    left: "auto",
                    bottom: "auto"
                };

            case "bottom left":
                return {
                    top: target.top + window.pageYOffset + target.height + 10,
                    left: target.left + offset,
                    bottom: "auto",
                    right: "auto"
                };

            case "bottom center":
                return {
                    top: target.top + window.pageYOffset + target.height + target.margin.top,
                    left: target.left + target.width / 2 - popup.width / 2 + offset,
                    bottom: "auto",
                    right: "auto"
                };

            case "bottom right":
                return {
                    top: target.top + window.pageYOffset + target.height,
                    right: window.innerWidth - target.left - target.width - offset,
                    bottom: "auto",
                    left: "auto"
                };

            default:
                return {
                    top: "auto",
                    bottom: "auto",
                    left: "auto",
                    right: "auto"
                };
        }
    }

    getAlign() {
        const offset = 10; // отступ от края
        const popup = this.popupRef.getBoundingClientRect();

        const alignList = this.alignList.slice();
        if (this.props.align) {
            alignList.unshift(this.props.align);
        }

        for (let i in alignList) {
            const align = alignList[i];
            const style = this.getDirection(align);

            const allowLeft = typeof style.left === "number" && style.left + popup.width < window.innerWidth - offset && style.left >= 0;

            const allowRight = typeof style.right === "number" && style.right + popup.width < window.innerWidth + offset && style.right >= 0;

            const allowTop = typeof style.top === "number" && style.top + popup.height - window.pageYOffset < window.innerHeight && style.top - window.pageYOffset >= 45; //45 пикселей высота навбара. не выше навбара!

            // Bottom всегда auto

            if ((allowLeft || allowRight) && allowTop) {
                return align;
            }
        }

        return alignList[0];
    }

    setPosition() {
        const align = this.getAlign();
        this.setState({ styles: this.getDirection(align), align }, () => {});
    }

    onTriggerStart() {
        if (this.state.isShown || !this.props.text) {
            return false;
        }

        this.setState({ isShown: true, styles: {} }, () => {
            this.setPosition();
        });
    }

    onTriggerLeave() {
        this.setState({ isShown: false });
    }

    onClickOutsidePointer(element, e) {
        const handler = event => {
            if (!element.contains(event.target) && this.state.isShown) {
                this.onTriggerLeave();
            }
        };

        return handler(e);
    }

    isHintReady() {
        return this.state.isShown && Object.keys(this.state.styles).length > 0;
    }

    render() {
        const children = React.Children.map(this.props.children, element =>
            React.cloneElement(element, {
                ref: ref => (this.pointerRef = ref)
            })
        );

        const styles = { ...this.state.styles, zIndex: 9999999 };
        let classNames = `ui popup ${this.state.align} `;

        if (this.state.isShown) {
            classNames += "visible";
        }

        return (
            <React.Fragment>
                <PopupHint isShown={this.state.isShown}>
                    <div ref={ref => (this.popupRef = ref)} className={classNames} style={styles} data-tooltip={this.props.text} data-position={this.state.align}>
                        {this.props.text}
                    </div>
                </PopupHint>

                {children}
            </React.Fragment>
        );
    }
}

export default Popup;
