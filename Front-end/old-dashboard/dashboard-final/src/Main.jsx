import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Tweets from './Tweets/Tweets';
import Graph from './Graph';
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tweets: [{
                'fullname': 'Diego Sierra',
                'likes': 0,
                'new_query': 'gorro AND pequeño',
                'query': 'condon AND pequeño',
                'text': '@AleVillafaneM xD era para ver si tenías un gorro de tela pequeño que mi hermanita nota uno',
                'timestamp': '21-Jun-2013',
                'user_id': 121282899,
                'tweet_url': '/Dieguito_1456/status/347893314755907584'
            },
            {
                'fullname': 'Mayo Cuello',
                'likes': 0,
                'new_query': 'forro AND pequeño',
                'query': 'condon AND pequeño',
                'text': 'IPhone 6 de 16gb dorado pequeño detalles en vacover nada q un forro… https://www.instagram.com/p/BL9S-A9gyg-69fd78zY4WVsvynbC-eTuG3iTiQ0/\xa0…',
                'timestamp': '24-Oct-2016',
                'user_id': 409721398,
                'tweet_url': '/mayocuello22/status/790639252598063104'
            },
            {
                'fullname': 'Kéyla.',
                'likes': 0,
                'new_query': 'forro AND pequeño',
                'query': 'condon AND pequeño',
                'text': 'Mi celular sin forro que pequeño se siente jjjjj',
                'timestamp': '01-Aug-2014',
                'user_id': 287968384,
                'tweet_url': '/KeyJaner/status/495215976313806848'
            },
            {
                'fullname': 'MiLu♡',
                'likes': 0,
                'new_query': 'forrito AND pequeño',
                'query': 'condon AND pequeño',
                'text': 'El forrito lo compre porque es pitufo pequeño como yo;$',
                'timestamp': '04-Oct-2012',
                'user_id': 197915750,
                'tweet_url': '/JoselinPerezO/status/253931296328392706'
            },
            {
                'fullname': '❾¾⚯͛ 🤯',
                'likes': 0,
                'new_query': 'goma AND pequeño',
                'query': 'condon AND pequeño',
                'text': 'La confianza es como una goma de borrar, se hace más y más pequeño después de cada error.',
                'timestamp': '09-Jun-2014',
                'user_id': 823831892,
                'tweet_url': '/Danielaa_BM21/status/475834056362295296'
            }],

            graphDimensions: null
        }

        this.graphContainerRef = React.createRef();
    }

    updateDimensions = () => {
        this.setState({ graphDimensions: this.graphContainerRef.current ? { width: this.graphContainerRef.current.offsetWidth, height: this.graphContainerRef.current.offsetHeight } : { width: 0, height: 0 } })
    };

    componentDidUpdate = () => {
        if (!this.state.graphDimensions && this.tweetContainerRef.current)
            this.updateDimensions()
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    render() {
        return (
            <Container>
                <Row className="Graph" style={{ height: '50vh' }}>
                    <Col ref={this.graphContainerRef}>
                        {this.state.graphDimensions ? <Graph width={this.state.graphDimensions.width} height={this.state.graphDimensions.height} /> : <></>}
                    </Col>
                    <Col>
                        <NodeInfo/>
                    </Col>
                </Row>
                <Row className="Tweets" style={{ height: '50vh' }}>
                    <Col>
                        <Tweets title="boli" tweets={this.state.tweets} />
                    </Col>
                    <Col>
                        <Tweets title="coca" tweets={this.state.tweets} />
                    </Col>
                    <Col>
                        <Tweets title="pastillas" tweets={this.state.tweets} />
                    </Col>
                    <Col>
                        <Tweets title="menstruación" tweets={this.state.tweets} />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Main;