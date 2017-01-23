import React, { Component } from 'react';
import AutoComplete from './components/AutoComplete';
import Card from './components/Card';
import List from './components/ItemList';
import './NewApp.css';

import { fetchJSON } from './utils/ajax';

const parishRenderer = opt => (
  <div className="Address-renderer">
    <div className="Address-renderer--primary">{opt.parish}</div>
    <div className="Address-renderer--secondary">{opt.county} - {opt.district}</div>
  </div>
);

const countyRenderer = opt => (
  <div className="Address-renderer">
    <div className="Address-renderer--primary">{opt.county}</div>
    <div className="Address-renderer--secondary">{opt.district}</div>
  </div>
);


export default class NewApp extends Component {
  state = {
    parish: '',
    county: '',
    district: '',
    controlledParish: '',
    controlledParishOptions: [],
    controlledCounty: '',
    controlledCountyOptions: [],
    controlledDistrict: '',
    controlledDistrictOptions: [],

    controlledStatic: '',
  };

  handleParishChange = parish => this.setState({ parish });
  handleCountyChange = county => this.setState({ county });
  handleDistrictChange = district => this.setState({ district });

  handleParishSelect = ({ county, district }) => this.setState({ county, district });
  handleCountySelect = ({ district }) => this.setState({ district });

  handleControlledParishChange = controlledParish => this.setState({ controlledParish });
  handleControlledCountyChange = controlledCounty => this.setState({ controlledCounty });
  handleControlledDistrictChange = controlledDistrict => this.setState({ controlledDistrict });

  handleControlledParishSelect = ({ county, district }) =>
    this.setState({ controlledCounty: county, controlledDistrict: district });
  handleControlledCountySelect = ({ district }) => this.setState({ controlledDistrict: district });

  handleControlledStaticChange = controlledStatic => this.setState({ controlledStatic });


  searchParish = q => fetchJSON(`search?parish=${q}`);
  searchCounty = q => fetchJSON(`search?county=${q}`);
  searchDistrict = q => fetchJSON(`search/simple?district=${q}`);

  searchParishControlled = q => fetchJSON(`search?parish=${q}`)
    .then(controlledParishOptions => this.setState({ controlledParishOptions }));

  searchCountyControlled = q => fetchJSON(`search?county=${q}`)
    .then(controlledCountyOptions => this.setState({ controlledCountyOptions }));

  searchDistrictControlled = q => fetchJSON(`search/simple?district=${q}`)
    .then(controlledDistrictOptions => this.setState({ controlledDistrictOptions }));

  render() {
    return (<div className="app App_auto-completes">
      <Card>
        <div className="App_auto-complete">
          Freguesia
          <AutoComplete
            value={this.state.parish} index="parish"
            onChange={this.handleParishChange} onSelectItem={this.handleParishSelect}
            loadOptions={this.searchParish} optionRenderer={parishRenderer}
          />
        </div>
        <div className="App_auto-complete">
          Concelho
          <AutoComplete
            value={this.state.county} index="county"
            onChange={this.handleCountyChange} onSelectItem={this.handleCountySelect}
            loadOptions={this.searchCounty} optionRenderer={countyRenderer}
          />
        </div>
        <div className="App_auto-complete">
          Destricto
          <AutoComplete
            value={this.state.district} onChange={this.handleDistrictChange}
            loadOptions={this.searchDistrict}
          />
        </div>
      </Card>
      <Card>
        <div className="App_auto-complete">
          Freguesia - controlled
          <AutoComplete
            value={this.state.controlledParish} index="parish"
            onChange={this.handleControlledParishChange}
            onSelectItem={this.handleControlledParishSelect}
            onQueryInput={this.searchParishControlled}
            options={this.state.controlledParishOptions}
            optionRenderer={parishRenderer}
          />
        </div>
        <div className="App_auto-complete">
          Concelho - controlled
          <AutoComplete
            value={this.state.controlledCounty} index="county"
            onChange={this.handleControlledCountyChange}
            onSelectItem={this.handleControlledCountySelect}
            onQueryInput={this.searchCountyControlled}
            options={this.state.controlledCountyOptions}
            optionRenderer={countyRenderer}
          />
        </div>
        <div className="App_auto-complete">
          Destricto - controlled
          <AutoComplete
            value={this.state.controlledDistrict}
            onChange={this.handleControlledDistrictChange}
            onQueryInput={this.searchDistrictControlled}
            options={this.state.controlledDistrictOptions}
          />
        </div>
      </Card>
      <Card className="Card--address">
        <List
          dataSource={this.state.controlledParishOptions}
          itemRenderer={parishRenderer} onItemClick={console.log}
        />
      </Card>
      <Card>
        <List dataSource={[{ text: 'asdsd' }, { text: 'aSsdsfrfrg' }]} />
      </Card>
    </div>);
  }
}

