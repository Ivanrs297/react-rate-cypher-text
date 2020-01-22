import React, { Component } from 'react';
import './App.css';
import { getCodesFromText, encode, decode, getEntropyOfText, getFrequency } from './huffmanjs.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion, Card, Alert, Spinner, FormControl, InputGroup, ListGroup, Toast, ButtonToolbar, Container, Row, Col, Form, Button } from 'react-bootstrap';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      R: null, 
      r: null,
      D: null,
      entropyUncoded: null,
      entropyHuffman: null,
      informationAmount: null,
      toast: false,
      loading: false,
      codedText: '',
      fileInput: React.createRef(),
      error: false,
      huffmanCodes: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.fileInput = React.createRef();

  }

  handleChange(event) {
    this.setState({text: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({toast: true})
    try {
      this.runHuffman(this.state.text)
      this.setState({success: true})
      setTimeout(() => { 
        this.setState({success: false})
      }, 5000);
    } catch {
      this.setState({error: true})
      setTimeout(() => { 
        this.setState({error: false})
      }, 5000);
    }
  }

  showFile = async (e) => {
    e.preventDefault()
    this.setState({loading: true})
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
      console.log(text)
      this.runHuffman(text)
      this.setState({text})
      this.setState({loading: false})

    };
    reader.readAsText(e.target.files[0])
    
  }

  getEntropy(text, huffmanCodes, frequency) {
    const n = text.length
    let entropy = 0

    frequency.forEach((char) => {
      const probability = char[1]/n
      const value = probability/huffmanCodes.get(char[0]).length
      entropy += value
      console.log("VALUE: ", char[0], probability, value)
    })

    return entropy
  }

  runHuffman(text) {

    let huffmanCodes = getCodesFromText(text)
    let codedText = encode(text, huffmanCodes)
    let frequency = getFrequency(text)
    
    let entropyUncoded = getEntropyOfText(codedText)
    let entropyHuffman = this.getEntropy(text, huffmanCodes, frequency)
    console.log("Entropy 1: ", entropyUncoded)
    console.log("Entropy 2: ", entropyHuffman)

    
    const alphabet = frequency.length
    let R = Math.log2(alphabet);
    let r = entropyHuffman/frequency.length
    let D = R - r
    const n = text.length
    let informationAmount = [...frequency]
    let probability = null

    for (let i = 0; i < informationAmount.length; i++) {
      probability = informationAmount[i][1] / n
      informationAmount[i].push(-1 * Math.log2(probability))
    }

    this.setState({
      entropyUncoded,
      entropyHuffman,
      R,
      r,
      D,
      informationAmount,
      codedText: codedText.join(''),
      huffmanCodes
    })
    
  }

  _renderInfoAmount(data) {
    if (data) {
      return (
        data.map((value) => {
          return (
            <ListGroup.Item key={value[0]}><span style={{fontWeight: 700}}>"{value[0]}":</span>  {value[2]}</ListGroup.Item>

          )
        })
        
      )
    } else {
      return []
    }
  }

  _renderCodeList() {
    let codes = []
    if (this.state.huffmanCodes) {
      this.state.huffmanCodes.forEach((code, char) => {
          codes.push (
            <ListGroup.Item key={code}> <span style={{fontWeight: 700}}>{char}:</span> {code}</ListGroup.Item>
          )
        })
        return codes
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
                  <Form.Label><span style={{fontWeight: 700}}>From file *.txt</span></Form.Label>
                  <br/>
                  <input 
                    type="file"
                    accept="text/plain"
                    onChange={(e) => this.showFile(e)}
                    ref={this.state.fileInput}
                  />
                </Form.Group>
                <br/>

                {this.state.loading &&
                  <div style={{textAlign: "center"}}>
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  </div>
                }

                

                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label><span style={{fontWeight: 700}}>Text</span></Form.Label>
                  <Form.Control placeholder="Insert your text..." as="textarea" rows="10" value={this.state.text} onChange={this.handleChange}/>
                </Form.Group>

                <ButtonToolbar style={{marginBottom: 20}}>
                  <Button variant="success" type="submit" style={{marginRight: 10}} disabled={!this.state.text}>
                    Submit
                  </Button>

                  <Button variant="warning" type="button" style={{marginRight: 10}} onClick={() => this.setState({text: "", codedText: ""})}>
                    Clear
                  </Button>

                  <Button variant="danger" type="button" onClick={() => { this.setState({codedText: "", text: "", R: "", r: "", D: "", entropy: "", informationAmount: ""}) }}>
                    Reset
                  </Button>
                </ButtonToolbar>


              </Form>

              {this.state.error &&
                <Alert onClose={() => this.setState({error: false})} dismissible  variant={'danger'}>
                  Error, you must insert 2 different characters at least.
                </Alert>
              }

            </Col>
            <Col>

              <Accordion style={{marginBottom: 20}}>
              <Card style={{maxWidth: 540}}>
                <Accordion.Toggle as={Card.Header} eventKey="000"><span style={{fontWeight: 700}}>Huffman Code:</span></Accordion.Toggle>
                <Accordion.Collapse eventKey="000">
                  <Card.Body>
                    <Card.Text >
                      <p>{this.state.codedText}</p>
                    </Card.Text>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="00"><span style={{fontWeight: 700}}>Huffman Codes List:</span></Accordion.Toggle>
                <Accordion.Collapse eventKey="00">
                  <Card.Body>
                    <ListGroup>
                      {this._renderCodeList(this.state.huffmanCodes)}
                    </ListGroup>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0"><span style={{fontWeight: 700}}>Entropy (H):</span></Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>{this.state.entropyUncoded}</Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="1"><span style={{fontWeight: 700}}>Entropy w/Huffman (H):</span></Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>{this.state.entropyHuffman}</Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="2"><span style={{fontWeight: 700}}>Absolute Rate (R):</span></Accordion.Toggle>
                <Accordion.Collapse eventKey="2">
                  <Card.Body>{this.state.R}</Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="3"><span style={{fontWeight: 700}}>Real Rate (r):</span></Accordion.Toggle>
                <Accordion.Collapse eventKey="3">
                  <Card.Body>{this.state.r}</Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="4"><span style={{fontWeight: 700}}>Redundancy (D):</span></Accordion.Toggle>
                <Accordion.Collapse eventKey="4">
                  <Card.Body>{this.state.D}</Card.Body>
                </Accordion.Collapse>
              </Card>


              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="5"><span style={{fontWeight: 700}}>Information Amount (C):</span></Accordion.Toggle>
                <Accordion.Collapse eventKey="5">
                  <Card.Body>
                    <ListGroup>
                      {this._renderInfoAmount(this.state.informationAmount)}
                    </ListGroup>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

            </Accordion>

            {this.state.success &&
              <Alert onClose={() => this.setState({success: false})} dismissible variant={'success'}>
                Success, check the information above.
              </Alert>
            }
            
            </Col>

          </Row>

          {/* <Row style={{position: "absolute", bottom: 20, left: "5%" }}>
            <Col><p style={{color: "gray"}}>Iván Reyes A. - CINVESTAV GDL 2020</p></Col>
          </Row> */}

        </Container>

        

        

         
      </div>
    );
  }
}

export default App;
