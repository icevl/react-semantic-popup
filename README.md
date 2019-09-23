## React standalone Popup plugin based on Semantic UI

React component based on Semantic UI inline styles with auto and manual align popup position.

**Install**

    npm i react-semantic-popup

or

    yarn add react-semantic-popup


**Use**

    import Popup from 'react-semantic-popup';

    <Popup content='Text for popup'>
        <div>
    	    Some trigger element
        </div>
    </Popup>

**Options**

| prop  | value                                                                                                                                                               |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| content | *[string or JSX]*. Popup hint content. |
| align | *[string]*. Custom hint position: "_top left_", "_top center_", "_top right_", "_right center_", "_left center_", "_bottom left_", "_bottom center_", "_bottom right_" |
| inverted | *[boolean]* *default: false*. Inverted theme. |
| click | *[boolean]* *default: false*. Trigger popup by clicking on children element.                                                                                                      |

**Example**

    <Popup content='Clicked' align='top right' inverted click>
        Click me
    </Popup>
