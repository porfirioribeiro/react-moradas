import React from 'react';

import { List, ItemList, ListItem } from './List';
import AutoComplete from './AutoComplete';
import { fetchJSON } from '../utils/ajax';

import './Demo.css';


const dataSource1 = [
  { text: 'Hello' },
  { text: 'World' },
];

const dataSource2 = {
  a: { text: 'Hello' },
  b: { text: 'World' },
};


const log = (i, d) => console.log(i, d);

export default () => (
  <div className="Demo">
    <List className="Demo_List">
      <ListItem onClick={log}>Hello</ListItem>
      <ListItem onClick={log}>World</ListItem>
    </List>
    <ItemList
      className="Demo_List"
      dataSource={dataSource1}
      focusedIndex={0}
      itemProps={{ onMouseEnter: () => console.log('focus') }}
    />
    <ItemList
      className="Demo_List"
      dataSource={dataSource2}
      focusedIndex="a"
      itemProps={{ onMouseEnter: () => console.log('focus') }}
    />
    <AutoComplete
      className="Demo_List"
      index="parish"
      loadOptions={q => fetchJSON(`search?parish=${q}`)}
    />
  </div>
);
