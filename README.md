## React standalone Popup plugin based on Semantic UI

**How to use**

    import Popup from 'react-semantic-popup

    <Popup text='Text for popup'>
	    <div>
		    Some trigger element 
	    </div>
    </Popup>

**Options**

|prop  |value
|--|--|
|align  | *string* custom hint position: "*top left*", "*top center*", "*top right*", "*right center*", "*left center*", "*bottom left*", "*bottom center*", "*bottom right*" |
| click|default: false. Trigger popup by clicking on children element. 

**Example**

    <Popup text='Clicked' align='top right'click>
	    Click me
    </Popup>

