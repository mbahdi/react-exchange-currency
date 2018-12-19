import React, { Component } from 'react';
// import ReactDOM  from 'react-dom';
// import  ReactDOMServer from 'react-dom/server';
// import logo from './logo.svg';
// import './App.css';
import axios from 'axios';
import _ from 'lodash';
import NumberFormat from 'react-number-format';

import {
  Container,
  Col,
  Button,
  Table,
  Card, 
  CardHeader, 
  CardText, 
  CardBody, 
  CardTitle, 
  CardSubtitle, 
  InputGroup, 
  InputGroupAddon
} from 'reactstrap';

const currList = {
  "USD":{"code":"USD", "name":"United State Dollar"},
  "CAD":{"code":"CAD", "name":"Canadian Dollar"},
  "IDR":{"code":"IDR", "name":"Indonesian Rupiah"},
  "GBP":{"code":"GBP", "name":"Pound Sterling"},
  "CHF":{"code":"CHF", "name":"Swiss Franc"},
  "SGD":{"code":"SGD", "name":"Singapore Dollar"},
  "INR":{"code":"INR", "name":"Indian Rupee"},
  "MYR":{"code":"MYR", "name":"Malaysian Ringgit"},
  "JPY":{"code":"JPY", "name":"Japan Yen"},
  "KRW":{"code":"KRW", "name":"South Korean Won"},
  "EUR":{"code":"EUR", "name":"Euro"}
}
const currCodes =_.keys(currList);

const copyCodes = [...currCodes];
let usd = _.indexOf(copyCodes, 'USD');
if (usd !== -1) {
  copyCodes.splice(usd, 1);
}
// const selected = ['IDR', 'GBP', 'EUR', 'SGD'];

// main
class App extends Component {  
  constructor(props) {
    super(props);
    this.state = {
      base: 'USD',
      basenum: 1,
      selected: ['IDR', 'GBP', 'EUR', 'SGD'],
      rates: {},
      show: false,
      choose: ''
    };
    this.deleteList = this.deleteList.bind(this);
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNew = this.handleNew.bind(this);
  }
  handleChange(e) {
    this.setState({choose: e.target.value});    
    // console.log('new', e.target.value);
  }
  inputChangedHandler = values => {
    this.setState({ basenum: values.value });
  }
  deleteList(e) {
    // console.log('value', e.target.value);
    var array = [...this.state.selected]; 
    var index = _.indexOf(array, e.target.value);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({selected: array});
    }
  }
  handleToggleClick() {
    this.setState(prevState => ({
      show: !prevState.show
    }));
  }
  handleNew(e) {
    e.preventDefault();
    // console.log('Your favorite flavor is', e.target.value);
    // this.state.selected.push(e.target.value);

    var array = [...this.state.selected];
    array.push(e.target.value);
    array = _.uniq(_.compact(array));
    this.setState({selected: array});
  }
  componentDidMount(){
    axios.get('https://api.exchangeratesapi.io/latest?base=USD')
    .then(response => {
      this.setState({ rates: response.data.rates });

      // console.log('rates', this.state.rates);
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  render() {
    const base = this.state.base;
    const basenum = parseFloat(this.state.basenum).toFixed(2);
    const rates = this.state.rates;
    const selected = this.state.selected;
    const show = this.state.show;
    const chooseList = _.differenceWith(copyCodes, selected, _.isEqual);
    const choose =(this.state.choose ? this.state.choose : chooseList[0]);    

    const addForm = 
    <InputGroup color={show ? 'warning' : 'secondary'}>
      <select style={{width:'74%'}} onChange={this.handleChange}>
        {chooseList.map(function(code, i){
          return <option value={code} key={code}>{code}</option>
        })}
      </select>
      <InputGroupAddon addonType="append"><Button onClick={this.handleNew} value={choose} >submit</Button></InputGroupAddon>                
    </InputGroup>;    
    // console.log('state', this.state);

    return (
      <div>
        <Container className="pt-4 pb-4">
          <Card>
            <CardHeader>
              {currList.USD.code} - {currList.USD.name}

              <InputGroup className="mt-4">
                <InputGroupAddon addonType="prepend">{currList.USD.code}</InputGroupAddon>
                <NumberFormat className="text-right pr-2" style={{width:'79%'}} thousandSeparator={true} prefix={''} fixedDecimalScale={true} decimalSeparator={'.'} decimalScale={2} value={basenum} onValueChange={this.inputChangedHandler} />
              </InputGroup>
            </CardHeader>
            <CardBody>

              {selected.map(function(code){
                let tcode = code;
                let trate = parseFloat(rates[code]).toFixed(2);
                let tratetot = parseFloat(basenum * trate).toFixed(2);

                return(
                  <Table bordered key={code}>
                    <tbody>
                      <tr>
                        <td style={{width:'80%'}}>
                        <Card className="border-0">
                          <CardTitle className="row pb-1">
                            <Col sm={2}>{tcode}</Col>
                            <Col sm={4} className="text-right">
                              <NumberFormat value={tratetot} thousandSeparator={','} displayType={'text'}  prefix={''} fixedDecimalScale={true} decimalSeparator={'.'} decimalScale={2} />
                            </Col>
                          </CardTitle>
                          <CardSubtitle className="small font-weight-bold">{currList[tcode].code} - {currList[tcode].name}
                          </CardSubtitle>
                          <CardText className="small font-italic">
                            {'1'} {base} = {tcode} <NumberFormat value={trate} thousandSeparator={','} displayType={'text'}  prefix={''} fixedDecimalScale={true} decimalSeparator={'.'} decimalScale={2} />
                          </CardText>
                        </Card>
                        </td>
                        <td className="text-center" style={{width:'10%', verticalAlign:'middle'}}>
                          <Button onClick={this.deleteList} value={code}>-</Button>
                        </td>
                      </tr>
                      </tbody>
                  </Table>
                )
              }, this)}

              <div>
                {/* <ShowAdd show={show} selected={selected}/> */}

                {show ? addForm : null}
                

                <br/>
                <Button color={show ? 'warning' : 'secondary'} className="mb-2" onClick={this.handleToggleClick}>
                  {show ? '(x) Cancel More Currencies' : '(+) Add More Currencies'}        
                </Button>                
              </div>

              {/* <NewCurrency show={false} selected={selected} /> */}
            </CardBody>
          </Card>
      </Container>
    </div>
    )
  }
}

export default App;
