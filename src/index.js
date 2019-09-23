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

        if (!this.pointer) {
            return false;
        }

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
        if (element && element.refs) {
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
     * Margin from the edge
     * If the popup pointer element is wider then *this.arrowPixelsFromEdge * 2*,
     * the left popup will be equal to the left pointer without margin.
     *
     * Or popup is aligned with the center of the pointer.
     */
    getOffset(align, target) {
        if (target.width >= this.arrowPixelsFromEdge * 2) {
            return 0;
        }

        let offset;

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

            default:
                offset = 0;
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

            /** Bottom always auto */

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
        if (this.state.isShown || !this.props.content) {
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

    onClose() {
        this.setState({ isShown: false });
    }

    isHintReady() {
        return this.state.isShown && Object.keys(this.state.styles).length > 0;
    }

    getChildren() {
        return React.Children.map(this.props.children, element => {
            if (typeof element === "object") {
                return React.cloneElement(element, {
                    ref: ref => (this.pointerRef = ref)
                });
            } else {
                return <span ref={ref => (this.pointerRef = ref)}>{element}</span>;
            }
        });
    }

    getClassNames() {
        const classNames = ["ui", "popup", this.state.align];

        if (this.props.inverted) {
            classNames.push("inverted");
        }

        if (this.state.isShown) {
            classNames.push("visible");
        }

        return classNames.join(" ");
    }

    render() {
        if (!this.props.children) {
            return null;
        }

        const styles = { ...this.state.styles, zIndex: 9999999 };

        return (
            <React.Fragment>
                <PopupHint isShown={this.state.isShown} onClose={this.onClose.bind(this)}>
                    <div ref={ref => (this.popupRef = ref)} className={this.getClassNames()} style={styles}>
                        {this.props.content}
                    </div>
                </PopupHint>

                {this.getChildren()}
            </React.Fragment>
        );
    }
}

export default Popup;
