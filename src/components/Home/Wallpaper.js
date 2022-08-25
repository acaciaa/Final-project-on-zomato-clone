import React, {Component} from 'react'
import homepage from '../../assets/homepageimg.png'
import '../../Styles/wallpaper.css'
import { Link } from 'react-router-dom';

export default class  Wallpaper extends Component {
  
  constructor(){
    super();
    this.state={
      locations:[],
      restaurants:[]
    }
    // console.log("constructor is called")
  }

  componentDidMount(){
    fetch('https://zomato-clone-22.herokuapp.com/location',{method:'Get'})
    .then(response=>response.json())
    .then(data=>this.setState({locations:data.data}))
  }

  fetchRestaurants=(event)=>{
    console.log(event.target.value)
    fetch(`https://zomato-clone-22.herokuapp.com/restaurant/${event.target.value}`,{method:'Get'})
      .then(response=>response.json())
      .then(data=>this.setState({restaurants:data.data}))
  }
    
  static getDerivedStateFromProps(props,state){
    // console.log("getDerivedStateFromProps")
  return{}
  }


  shouldComponentUpdate(){
    return true;
  }
  getSnapshotBeforeUpdate(prevProps,prevState){
    // console.log(`getSnapshotBeforeUpdate is called with prev prop ${prevProps} and prev state${prevState}`)
    return null;
  }

  componentDidUpdate(){
    // console.log(`component did update`)
  }

  render(){
   let locationOptions = this.state.locations.length && this.state.locations.map((item)=><option key={item.name} value={item.city_id}>{item.name}</option>)
   let restaurantsList = this.state.restaurants.length && <ul> 
    {
      this.state.restaurants.map((item)=>
      <li key={item.name}>
      <Link to={`/details/${item.name}`}>
      {item.name}
      </Link>
      </li>)
    }
    </ul>
   
    return (
     <div>
       <div> 
        <img src={homepage} alt='' width='100%' height='450'/>
        <div className="logo">
            e!
        </div>
        
        <div className="headings">
            Find the best restaurants, cafés, bars
        </div>
        
        
        <div className="locationSelector">
           
            <select className="locationDropdown" onChange={this.fetchRestaurants}>
                <option value="0">Please select location</option>
                {locationOptions}
            </select>
            
            <div id="notebooks">
              <input className="restaurantsinput" type="text" placeholder="Search for restaurants" />
              {restaurantsList}
            </div>
        </div>
      </div>
     </div>
    
    )
  }
}