import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: []
    }
  }
  
  componentDidMount() {
    const topStories = 'https://hacker-news.firebaseio.com/v0/topstories.json';
    const storyUrlBase = 'https://hacker-news.firebaseio.com/v0/item/';
    
    //hit the topStories api
    fetch(topStories)
    //which returns an array of IDs, so we jsonify it, .json returns promise
      .then(data => data.json())
    //then we can map over the array of ids  
      .then(data => data.map(id => {
        const url = `${storyUrlBase}${id}.json`;
        //returning another api call
        return fetch(url).then(data => data.json());
      }))
      //now we have an array of the appropriate api calls with ids, so we use trusty Promise.all
      .then(promises => Promise.all(promises))
      ////which now is a nice array of stories
      .then(stories => this.setState({stories}))
  }
  
  render() {
    let views = <div>Loading...</div>;
    const {stories} = this.state;
    
    if (stories.length > 0){
      views = stories.map(s => (
        <p key={s.id}>
          <a href={s.url} target="_blank">{s.title}</a> by <strong>{s.by}</strong>.
        </p>
      ));
    }
    
    return(
      <div className="App">
        <h1>Hacker News Top Stories</h1>
        <h3>Hitting the HN API with React and Fetch</h3>
        {views}
      </div>  
    )
  }
}

export default App;
