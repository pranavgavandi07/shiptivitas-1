import React from "react";
import "./Card.css";

export default class Card extends React.Component {
  render() {
    const { id, name, description, status } = this.props;

    let className = "Card";

    if (status === "backlog") {
      className += " Card-grey";
    } else if (status === "in-progress") {
      className += " Card-blue";
    } else if (status === "complete") {
      className += " Card-green";
    }

    return (
      <div className={className} data-id={id} data-status={status}>
        <div className="Card-title">{name}</div>

        <div className="Card-description">{description}</div>
      </div>
    );
  }
}
