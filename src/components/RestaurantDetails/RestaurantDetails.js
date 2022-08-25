import React from 'react'
import Header from '../Common/Header'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import{useParams} from 'react-router-dom'
import { useEffect,useState } from 'react';
import '../../Styles/details.css'
import Modal from 'react-modal'

Modal.setAppElement('#root')

export default function RestaurantDetails() {

  let {rName} = useParams()
  const[restaurant,setRestaurant]=useState({})
  const [isMenuModalOpen,setIsMenuModalOpen]=useState(false)
  const [menu,setMenu] = useState([])
  const [totalPrice,setTotalPrice]=useState(0)

useEffect(() => {
  fetch(`https://zomato-clone-22.herokuapp.com/restaurant/details/${rName}`,{method:'GET'})
  .then(response=>response.json())
  .then(data=>setRestaurant(data.data))
}, [])

const fetchMenu = ()=>{
  fetch(`https://zomato-clone-22.herokuapp.com/menu/${rName}`,{method:'GET'})
  .then(response=>response.json())
  .then(data=>setMenu(data.data))
}
// console.log(menu)

const calTotalPrice=(item)=>{
  let price = totalPrice + item.itemPrice;
  setTotalPrice(price)
}

const loadScript=(src)=>{
  return new Promise((resolve)=>{
    const script = document.createElement("script");
    script.src=src;
    script.onload=()=>{
      resolve(true)
    }
    script.onerror=()=>{
      resolve(false)
    }
    document.body.appendChild(script);
  })
}

const openRazorPay=async()=>{
   //create order in razorpay by calling backend api
   try{
    let orderData;
    orderData=await fetch('https://zomato-clone-22.herokuapp.com/pay',{
     method:'POST',
     headers:{'Content-type':'application/json'},
     body:JSON.stringify({amount:totalPrice})
   }).then(resp=>resp.json())
 
 //open razorpay window
   const options = {
     key:"rzp_test_JYXEggK9Ae6IpQ",
     name:"zomato food delivery app",
     amount: orderData.amount,
     currency:orderData.currency,
     order_id:orderData.id,
     prefill:{
      email:'',
      contact: ''
     },
     handler:function(response){
        //call api that would save transaction in db
        fetch('https://zomato-clone-22.herokuapp.com/pay/save',{
        method:'POST',
        headers:{'Content-type':'application/json'},
        body:JSON.stringify({
          razorpay_order_id:response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          razorpay_amount: orderData.amount
        })
      }).then(resp=>console.log(resp))
     }
   }

   const paymentWindow=new window.Razorpay(options);
   paymentWindow.open();

   }catch(error){
    console.log(error)
   }
  
}

const{name,thumb,cost,address,Cuisine}=restaurant;
let cuisineList=!(Cuisine==undefined) && Cuisine.length && Cuisine.map((item)=>item.name)

  return (
    <div>
        <Header></Header>
        <div>
          <img src={thumb} height="400px" width="100%"/>
        </div>
        <div>
        <h2>{name}</h2>
        <button className="btn btn-danger" 
         style={{float:'right'}} 
         onClick={()=>{
          setIsMenuModalOpen(true)
          fetchMenu();
          }}>
            
            Place Online Order
            
        </button>
        </div>
        <div>
            <Tabs>
              <TabList>
                <Tab>Overview</Tab>
                <Tab>Content</Tab>
              </TabList>
     
              <TabPanel>
                <div className='about'>About the place</div>
                <div className='head'>Cuisine</div>
                    {cuisineList}
                <div className='head'>Average Cost</div>
                <div className='value'>&#8377; {cost}</div>
              </TabPanel>
              <TabPanel>
                <div className='head'>Phone Number</div>
                <div className='value'>+91-123456889</div>
                <div className='head'>{name}</div>
                <div className='value'>{address}</div>
              </TabPanel>
          </Tabs>
        </div>
        <div>
          <Modal 
            isOpen={isMenuModalOpen}
            >
            <div>
                <div className='row'>
                    <div className='col-sm-9'>
                       <h2>Menu</h2>
                    </div>
                    <div className='col-sm-3'>
                      <button 
                        className='btn btn-danger float-end' 
                        onClick={()=>setIsMenuModalOpen(false)}>X</button>
                  </div>
                  </div>
                  <ul>
                    {
                      menu.length &&
                        menu.map((item,index)=><li key={index}>
                            <div>
                              {item.isVeg ? <span className="text-success">Veg</span> : <span className="text-danger">Non-veg</span>}
                            </div>
                            <div className='cuisines'>{item.itemName}</div>
                            <div className='cuisines'>&#8377;{item.itemPrice}</div>
                            <div className='cuisines'>{item.itemDescription}</div>
                            <div>
                              <button className='btn btn-primary' onClick={()=>calTotalPrice(item)}>Add</button>
                            </div>
                        </li>)
                    }
                  </ul>
                  <hr/>
                  <div>
                     <h3>
                      Total Price: {totalPrice}
                     
                     </h3>
                     <button className='btn btn-danger' onClick={()=>{setIsMenuModalOpen(false);loadScript('https://checkout.razorpay.com/v1/checkout.js');openRazorPay();}}>Pay Now</button>
                  </div>   
            </div>
          </Modal>
        </div>
    </div>
  )
}