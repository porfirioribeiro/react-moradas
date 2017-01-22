import React, {Component} from "react";
import AutoComplete from "./components/AutoComplete";
import Card from "./components/Card";
import List from "./components/ItemList";
import "./NewApp.css";

import {fetchJSON} from './utils/ajax';

export default class NewApp extends Component {
    state = {
        parish: '',
        county: '',
        district: ''
    };

    handleParishChange=parish=>this.setState({parish});
    handleCountyChange=county=>this.setState({county});
    handleDistrictChange=district=>this.setState({district});

    handleParishSelect=({county, district})=>this.setState({county, district});
    handleCountySelect=({district})=>this.setState({district});

    render() {
        return <div className="app App_auto-completes">
            <Card>
                <div className="App_auto-complete">
                    Freguesia
                    <AutoComplete
                        value={this.state.parish} index="parish"
                        onChange={this.handleParishChange} onSelectItem={this.handleParishSelect}
                        loadCompletions={ q => fetchJSON(`search?parish=${q}`)}
                    />
                </div>
                <div className="App_auto-complete">
                    Concelho
                    <AutoComplete
                        value={this.state.county} index="county"
                        onChange={this.handleCountyChange} onSelectItem={this.handleCountySelect}
                        loadCompletions={ q => fetchJSON(`search?county=${q}`)}
                    />
                </div>
                <div className="App_auto-complete">
                    Destricto
                    <AutoComplete
                        value={this.state.district} onChange={this.handleDistrictChange}
                        loadCompletions={ q => fetchJSON(`search/simple?district=${q}`)}
                    />
                </div>
            </Card>
            <Card>
                <List dataSource={["asdsd","aSsdsfrfrg"]} onItemClick={console.log}/>
            </Card>
            <Card>
                <List dataSource={[{text: "asdsd"},{text: "aSsdsfrfrg"}]}/>
            </Card>
        </div>
    }
}

