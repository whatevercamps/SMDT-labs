import React, { Component } from 'react';
import {ForceGraph2D} from 'react-force-graph';

class Graph extends Component {

    state = {
        data: {
            nodes: [
                {
                    id: 0
                },
                {
                    id: 1
                },
                {
                    id: 2
                },
                {
                    id: 3
                },
                {
                    id: 4
                },
                {
                    id: 5
                },
                {
                    id: 6
                },
                {
                    id: 7
                },
                {
                    id: 8
                },
                {
                    id: 9
                }
            ],
            links: [
                {
                    source: 1, target: 0
                },
                {
                    source: 2, target: 0
                },
                {
                    source: 3, target: 0
                },
                {
                    source: 4, target: 1
                },
                {
                    source: 5, target: 3
                },
                {
                    source: 6, target: 5
                },
                {
                    source: 7, target: 5
                },
                {
                    source: 8, target: 0
                },
                {
                    source: 9, target: 0
                }
            ]
        }
    }

    render() {
        return (
            <div>
                <ForceGraph2D
                    width={this.props.width}
                    height={this.props.height}
                    graphData={this.state.data}
                />
            </div>
        );
    }
}

export default Graph;