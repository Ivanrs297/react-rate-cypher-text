import React, { Component } from 'react';
import './App.css';
import { getCodesFromText, encode, decode, getEntropyOfText, getFrequency } from './huffmanjs.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ListGroup, Toast, ButtonToolbar, Container, Row, Col, Form, Button } from 'react-bootstrap';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      R: null, 
      r: null,
      D: null,
      entropy: null,
      informationAmount: null,
      toast: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({text: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({toast: true})
    this.runHuffman(this.state.text)
      
    
  }


  runHuffman(text) {
    // let text = "Ivan "
    console.log("TEXT: ", text)
    
    let entropy = getEntropyOfText(text)
    let frequency = getFrequency(text)
    
    const alphabet = frequency.length
    console.log("alphabet: ", Math.log2(alphabet))
    let R = Math.log2(alphabet);
    console.log("Rango absoluto: ", R)

    let r = entropy/text.length
    console.log("Rango real: ", r)

    let D = R - r
    console.log("Redundancia: ", D)

    console.log("Entropia: ", entropy)

    const n = text.length
    let informationAmount = [...frequency]
    let probability = null

    for (let i = 0; i < informationAmount.length; i++) {
      probability = informationAmount[i][1] / n
      informationAmount[i].push(-1 * Math.log2(probability))
    }

    this.setState({
      entropy,
      R,
      r,
      D,
      informationAmount
    })
    
    console.log("informationAmount: ", informationAmount)
  }

  _renderInfoAmount(data) {
    if (data) {
      return (
        data.map((value) => {
          return (
            <div key={value[0]}>
              <p> <span style={{fontWeight: 700}}>"{value[0]}":</span>  {value[2]}</p>
            </div>
          )
        })
        
      )
    } else {
      return []
    }
  }

  render() {
    return (
      <div>

        <Container style={{marginTop: 100}}>
          <Row>
            <Col style={{marginBottom: 50}}>
              <h1>Homework I - Rate Cypher Text</h1>
              <h2>Cryptography</h2>
            </Col>
          </Row>
          <Row>
            <Col>

              <Form onSubmit={this.handleSubmit}>

                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label><span style={{fontWeight: 700}}>Text</span></Form.Label>
                  <Form.Control placeholder="Insert your text..." as="textarea" rows="3" value={this.state.text} onChange={this.handleChange}/>
                </Form.Group>

                <ButtonToolbar>
                  <Button variant="success" type="submit" style={{marginRight: 10}} disabled={!this.state.text}>
                    Submit
                  </Button>

                  <Button variant="warning" type="button" style={{marginRight: 10}} onClick={() => this.setState({text: ""})}>
                    Clear
                  </Button>

                  <Button variant="danger" type="button" onClick={() => this.setState({text: "", R: "", r: "", D: "", entropy: "", informationAmount: ""})}>
                    Reset
                  </Button>
                </ButtonToolbar>


              </Form>

            </Col>
            <Col>

            <ListGroup>
              <ListGroup.Item ><span style={{fontWeight: 700}}>Absolute Rate (R):</span> {this.state.R}</ListGroup.Item>
              <ListGroup.Item><span style={{fontWeight: 700}}>Real Rate (r):</span> {this.state.r}</ListGroup.Item>
              <ListGroup.Item><span style={{fontWeight: 700}}>Redundancy (D):</span> {this.state.D}</ListGroup.Item>
              <ListGroup.Item><span style={{fontWeight: 700}}>Entropy (H):</span> {this.state.entropy}</ListGroup.Item>
              <ListGroup.Item><span style={{fontWeight: 700}}>Information Amount (C):</span> {this._renderInfoAmount(this.state.informationAmount)}</ListGroup.Item>
            </ListGroup>
            </Col>

          </Row>

          <Row>
            <Col><p style={{color: "gray"}}>Iván Reyes A. - CINVESTAV GDL 2020</p></Col>
          </Row>

        </Container>

        

        

         
      </div>
    );
  }
}

export default App;
