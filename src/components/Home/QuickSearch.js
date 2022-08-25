import React, { Component } from 'react'
import Mealtype from './Mealtype';
import '../../Styles/wallpaper.css'

export default class extends Component {

constructor(){
  super();
  this.state={
    mealtypes:[]
  }
}

componentDidMount(){
  fetch('https://zomato-clone-22.herokuapp.com/mealtype',{method:'GET'})
  .then(response=>response.json())
  .then(data=>this.setState({mealtypes:data.data}))
}

  render() {

    let quickSearchList= this.state.mealtypes.length && this.state.mealtypes.map((item)=><Mealtype item={item} key={item.name}></Mealtype>)

    return (
      <div>
        <div className="quicksearch">
              <p className="quicksearchHeading">
                  Quick Searches
              </p>
              <p className="quicksearchSubHeading">
                  Discover restaurants by type of meal
              </p>
              <div className="container-fluid">
                  <div className="row">
                    {quickSearchList} 
                  </div>
              </div>
        </div>
      </div>
    )
  }
}