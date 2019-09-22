## React standalone Popup plugin based on Semantic UI

React component based on Semantic UI inline styles with auto and manual align popup position.

**How to use**

    import Popup from 'react-semantic-popup';

    <Popup text='Text for popup'>
        <div>
    	    Some trigger element
        </div>
    </Popup>

**Options**

| prop  | value                                                                                                                                                               |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| align | _string_ custom hint position: "_top left_", "_top center_", "_top right_", "_right center_", "_left center_", "_bottom left_", "_bottom center_", "_bottom right_" |
| click | default: false. Trigger popup by clicking on children element.                                                                                                      |

**Example**

    <Popup text='Clicked' align='top right' click>
        Click me
    </Popup>

**Not yet implemented**

-   Dark (inverted) theme
