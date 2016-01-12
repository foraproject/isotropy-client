import React from "react";

class MyComponent extends React.Component {
    render() {
        return (
            <div>
                Hello {this.props.ship ? this.props.ship.name : this.props.id}
            </div>
        );
    }
}

export default MyComponent;
