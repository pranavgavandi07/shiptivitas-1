import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';

import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    const clients = this.getClients().map(client => ({
      ...client,
      status: 'backlog',
    }));

    this.state = {
      clients: {
        backlog: clients,
        inProgress: [],
        complete: [],
      },
    };

    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };

    this.drake = null;
    this.handleDrop = this.handleDrop.bind(this);
  }

  getClients() {
    return [
      ['1', 'Stark, White and Abbott', 'Cloned Optimal Architecture'],
      ['2', 'Wiza LLC', 'Exclusive Bandwidth-Monitored Implementation'],
      ['3', 'Nolan LLC', 'Vision-Oriented 4Thgeneration Graphicaluserinterface'],
      ['4', 'Thompson PLC', 'Streamlined Regional Knowledgeuser'],
      ['5', 'Walker-Williamson', 'Team-Oriented 6Thgeneration Matrix'],
      ['6', 'Boehm and Sons', 'Automated Systematic Paradigm'],
      ['7', 'Runolfsson, Hegmann and Block', 'Integrated Transitional Strategy'],
      ['8', 'Schumm-Labadie', 'Operative Heuristic Challenge'],
      ['9', 'Kohler Group', 'Re-Contextualized Multi-Tasking Attitude'],
      ['10', 'Romaguera Inc', 'Managed Foreground Toolset'],
      ['11', 'Reilly-King', 'Future-Proofed Interactive Toolset'],
      ['12', 'Emard, Champlin and Runolfsdottir', 'Devolved Needs-Based Capability'],
      ['13', 'Fritsch, Cronin and Wolff', 'Open-Source 3Rdgeneration Website'],
      ['14', 'Borer LLC', 'Profit-Focused Incremental Orchestration'],
      ['15', 'Emmerich-Ankunding', 'User-Centric Stable Extranet'],
      ['16', 'Willms-Abbott', 'Progressive Bandwidth-Monitored Access'],
      ['17', 'Brekke PLC', 'Intuitive User-Facing Customerloyalty'],
      ['18', 'Bins, Toy and Klocko', 'Integrated Assymetric Software'],
      ['19', 'Hodkiewicz-Hayes', 'Programmable Systematic Securedline'],
      ['20', 'Murphy, Lang and Ferry', 'Organized Explicit Access'],
    ].map(([id, name, description]) => ({
      id,
      name,
      description,
      status: 'backlog',
    }));
  }

  componentDidMount() {
    const containers = [
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current,
    ];

    this.drake = Dragula(containers);
    this.drake.on('drop', this.handleDrop);
  }

  componentWillUnmount() {
    if (this.drake) {
      this.drake.off('drop', this.handleDrop);
      this.drake.destroy();
      this.drake = null;
    }
  }

  handleDrop() {
    const laneStatus = {
      backlog: 'backlog',
      inProgress: 'in-progress',
      complete: 'complete',
    };

    const laneNames = Object.keys(this.swimlanes);

    // Read the desired card order after Dragula moves the card.
    const desiredOrder = {};

    laneNames.forEach(laneName => {
      const container = this.swimlanes[laneName].current;

      desiredOrder[laneName] = Array.from(container.children)
        .map(element => element.dataset.id);
    });

    // Keep a lookup of every card's DOM element.
    const elementsById = {};

    laneNames.forEach(laneName => {
      const container = this.swimlanes[laneName].current;

      Array.from(container.children).forEach(element => {
        elementsById[element.dataset.id] = element;
      });
    });

    // Restore the DOM to React's previous order before updating state.
    // This prevents React from removing a card from the wrong parent.
    laneNames.forEach(laneName => {
      const previousClients = this.state.clients[laneName];
      const container = this.swimlanes[laneName].current;

      previousClients.forEach(client => {
        const element = elementsById[client.id];

        if (element) {
          container.appendChild(element);
        }
      });
    });

    // Now React can safely render the new lane and card order.
    const allClients = [
      ...this.state.clients.backlog,
      ...this.state.clients.inProgress,
      ...this.state.clients.complete,
    ];

    const clientsById = {};

    allClients.forEach(client => {
      clientsById[client.id] = client;
    });

    const updatedClients = {};

    laneNames.forEach(laneName => {
      updatedClients[laneName] = desiredOrder[laneName]
        .map(id => clientsById[id])
        .filter(Boolean)
        .map(client => ({
          ...client,
          status: laneStatus[laneName],
        }));
    });

    this.setState({
      clients: updatedClients,
    });
  }

  renderSwimlane(name, clients, status, ref) {
    return (
      <Swimlane
        name={name}
        clients={clients}
        status={status}
        dragulaRef={ref}
      />
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane(
                'Backlog',
                this.state.clients.backlog,
                'backlog',
                this.swimlanes.backlog
              )}
            </div>

            <div className="col-md-4">
              {this.renderSwimlane(
                'In Progress',
                this.state.clients.inProgress,
                'in-progress',
                this.swimlanes.inProgress
              )}
            </div>

            <div className="col-md-4">
              {this.renderSwimlane(
                'Complete',
                this.state.clients.complete,
                'complete',
                this.swimlanes.complete
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
