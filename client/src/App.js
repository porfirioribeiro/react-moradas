import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import _ from 'lodash';

import logo from './logo.svg';
import './App.css';
import LabeledSelect from './components/LabeledSelect';
import PromiseUtils from './utils/PromiseUtils';


const origin = process.env.NODE_ENV !== 'production' ? 'http://0.0.0.0:8080' : location.origin;


const fetchJSON = url => fetch(`${origin}/${url}`).then(r => r.json());

const stringListToOptions = sl => sl.map(item => ({ label: item, value: item }));

const adressToString = ({ district, county, parish, place }) => `${district} / ${county} / ${parish} / ${place}`;

const unwrapValue = option =>
    (option === null ?
        null :
        (typeof option.value === 'undefined' ?
            option :
            option.value));


class App extends Component {
  state={
    district: '',
    districts: [],
    county: '',
    countys: [],
    parish: '',
    parishs: [],
    place: '',
    places: [],
  };

  componentDidMount() {
    fetchJSON('districts')
            .then(districts => this.setState({ districts: stringListToOptions(districts) }));
  }

  doSearch=(input) => {
    if (!input) return Promise.resolve();
    console.log(input);
    return fetchJSON(`procura/${input}`).then((r) => {
      const opts = r.map(value => ({ label: adressToString(value), value }));
      return Promise.resolve({ options: opts });
    });
  };

  handleSearch=(option) => {
    console.log(option.value);
    if (option !== null) {
      const { district, county, parish/* , place*/ } = option.value;

      PromiseUtils.keys({
        countys: fetchJSON(`countys/${district}`),
        parishs: fetchJSON(`parishs/${district}/${county}`),
        places: fetchJSON(`places/${district}/${county}/${parish}`),
      }).then(r => this.setState({ ...option.value, ...(_.mapValues(r, stringListToOptions)) }));
    }
  };


  setDistrito=(district) => {
    console.log('setDistrito', district);
    district = unwrapValue(district);

    this.setState({ district, county: '', countys: [], parish: '', parishs: [], place: '', places: [] });
    if (district != null)
      fetchJSON(`countys/${district}`)
                .then(countys => this.setState({ countys: stringListToOptions(countys) }));
  };
  setConcelho=(county) => {
    console.log('setConcelho', county);
    county = unwrapValue(county);
    this.setState({ county, parish: '', parishs: [], place: '', places: [] });
    if (county != null)
      fetchJSON(`parishs/${this.state.district}/${county}`)
                .then(parishs => this.setState({ parishs: stringListToOptions(parishs) }));
  };
  setFreguesia=(parish) => {
    console.log('setFreguesia', parish);
    parish = unwrapValue(parish);
    this.setState({ parish, place: '', places: [] });
    if (parish != null)
      fetchJSON(`places/${this.state.district}/${this.state.county}/${parish}`)
                .then(places => this.setState({ places: stringListToOptions(places) }));
  };
  setLugar=(place) => {
    console.log('setLugar', place);
    place = unwrapValue(place);
    this.setState({ place });
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
          <LabeledSelect label={'Distrito:'} className={'Select_address'} options={this.state.districts} value={this.state.district} onChange={this.setDistrito} />
          <LabeledSelect label={'Concelho:'} className={'Select_address'} options={this.state.countys} value={this.state.county} onChange={this.setConcelho} />
          <LabeledSelect label={'Freguesia:'} className={'Select_address'} options={this.state.parishs} value={this.state.parish} onChange={this.setFreguesia} />
          <LabeledSelect label={'Lugar:'} className={'Select_address'} options={this.state.places} value={this.state.place} onChange={this.setLugar} />

          <LabeledSelect
            label={'Pesquisar local:'} component={Select.Async} className={'Select_address Select_search'}
            loadOptions={this.doSearch}
            autoLoad={false}
            onChange={this.handleSearch}
            placeholder={'Pesquisar localidade...'}
            loadingPlaceholder={'A pesquisar localidade...'}
            noResultsText={'Sem localidades que correspondam á pesquisa...'}
            searchPromptText={'searchPromptText'}
          />
        </div>
      </div>
    );
  }
}

export default App;
