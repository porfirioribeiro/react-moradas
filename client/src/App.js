import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Select from 'react-select'
import 'react-select/dist/react-select.css'

import LabeledSelect from './components/LabeledSelect'

import _ from 'lodash'

let origin=process.env.NODE_ENV!=="production"?"http://0.0.0.0:8080":location.origin;


const fetchJSON= (url)=>fetch(origin+"/"+url).then(r=>r.json());

const stringListToOptions= sl=>sl.map((item)=>({label:item,value:item}));

const adressToString=({distrito, concelho, freguesia, lugar})=> distrito+" / "+concelho+" / "+freguesia+" / "+lugar;

const unwrapValue=option=>
    (option==null)?
        null:
        (typeof option.value==="undefined")?
            option:
            option.value;


import PromiseUtils from './utils/PromiseUtils';


class App extends Component {
    state={
        distrito:"",
        distritos:[],
        concelho:"",
        concelhos:[],
        freguesia:"",
        freguesias:[],
        lugar:"",
        lugares:[],
    };

    componentDidMount(){
        fetchJSON("distritos")
            .then(distritos=>this.setState({distritos:stringListToOptions(distritos)}));
    }

    doSearch=(input)=>{
        if (!input) return Promise.resolve();
        console.log(input);
        return fetchJSON("procura/"+input).then(r=>{
            let opts=r.map(value=>({label:adressToString(value),value}));
            return Promise.resolve({options:opts})
        });
    };

    handleSearch=(option)=>{
      console.log(option.value);
      if (option!=null){
          const {distrito, concelho, freguesia/*, lugar*/}=option.value;

          PromiseUtils.keys({
              "concelhos": fetchJSON("concelhos/" + distrito),
              "freguesias":fetchJSON("freguesias/"+ distrito + "/" + concelho),
              "lugares":   fetchJSON("lugares/"   + distrito + "/" + concelho + "/" + freguesia),
        }).then(r=>this.setState({...option.value,...(_.mapValues(r,stringListToOptions))}));
      }
    };


    setDistrito=(distrito)=>{
        console.log("setDistrito",distrito);
        distrito=unwrapValue(distrito);

        this.setState({distrito,concelho:"",concelhos:[],freguesia:"",freguesias:[],lugar:"",lugares:[]});
        if (distrito!=null)
            fetchJSON("concelhos/"+distrito)
                .then(concelhos=>this.setState({concelhos:stringListToOptions(concelhos)}));
    };
    setConcelho=(concelho)=>{
        console.log("setConcelho",concelho);
        concelho=unwrapValue(concelho);
        this.setState({concelho,freguesia:"",freguesias:[],lugar:"",lugares:[]});
        if (concelho!=null)
            fetchJSON("freguesias/"+this.state.distrito+"/"+concelho)
                .then(freguesias=>this.setState({freguesias:stringListToOptions(freguesias)}));
    };
    setFreguesia=(freguesia)=>{
        console.log("setFreguesia",freguesia);
        freguesia=unwrapValue(freguesia);
        this.setState({freguesia,lugar:"",lugares:[]});
        if (freguesia!=null)
            fetchJSON("lugares/"+this.state.distrito+"/"+this.state.concelho+"/"+freguesia)
                .then(lugares=>this.setState({lugares:stringListToOptions(lugares)}));
    };
    setLugar=(lugar)=>{
        console.log("setLugar",lugar);
        lugar=unwrapValue(lugar);
        this.setState({lugar});
    };
  render() {

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Moradas e localidades</h2>
        </div>
        <p className="App-intro">
          Pesquisa de localidades
        </p>
          <div className="App-selects">
              <LabeledSelect label={"Distrito:"}  className={"Select_address"} options={this.state.distritos} value={this.state.distrito} onChange={this.setDistrito}/>
              <LabeledSelect label={"Concelho:"}  className={"Select_address"} options={this.state.concelhos} value={this.state.concelho} onChange={this.setConcelho}/>
              <LabeledSelect label={"Freguesia:"}  className={"Select_address"} options={this.state.freguesias} value={this.state.freguesia} onChange={this.setFreguesia}/>
              <LabeledSelect label={"Lugar:"}  className={"Select_address"} options={this.state.lugares} value={this.state.lugar} onChange={this.setLugar}/>

              <LabeledSelect label={"Pesquisar local:"} component={Select.Async} className={"Select_address Select_search"}
                            loadOptions={this.doSearch}
                            autoLoad={false}
                            onChange={this.handleSearch}
                            placeholder={"Pesquisar localidade..."}
                            loadingPlaceholder={"A pesquisar localidade..."}
                            noResultsText={"Sem localidades que correspondam á pesquisa..."}
                            searchPromptText={"searchPromptText"}/>
          </div>
      </div>
    );
  }
}

export default App;
