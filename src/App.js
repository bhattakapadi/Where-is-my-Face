import React, { Component } from 'react'; 
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';
import Register from './components/Register/Register';





const particlesOptions = {
  particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800
        }
      }
  }

}

const initalState = {
     input: '',
      imageUrl:'',
      box: {},
      route:'signin',
      isSignedIn: false,
      user: 
      {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }

}

class App extends Component {

  constructor() 
  {
    super();
    this.state = 
    {
      input: '',
      imageUrl:'',
      box: {},
      route:'signin',
      isSignedIn: false,
      user: 
      {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }


loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }
/*
componentDidMount() {
    fetch('http://localhost:3001/')
    .then(response => response.json())
    .then(console.log)
  }
  */

calculateFaceLocation = (data) => {
    const clarifaiFace =data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }

}





displayFaceBox = (prop) => {
  this.setState({box: prop});
}
  onInputChange= (event) => {
    this.setState({input: event.target.value});
  }

// url ====>  https://guarded-garden-00378.herokuapp.com
onButtonSubmit= (event) => {
    this.setState({imageUrl: this.state.input});
    fetch("https://guarded-garden-00378.herokuapp.com/imageurl", {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
               input: this.state.input
            })
        })
    .then(response => response.json())
    .then(response => {
      if(response)
      {
         fetch("https://guarded-garden-00378.herokuapp.com/image", {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
               id: this.state.user.id
            })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
        .catch(err => console.log("I am right"))
      }

      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }


  onRouteChange = (status) => {
    if (status === 'signout') {
        this.setState(initalState);
    }else if (status === 'home') {
      this.setState({isSignedIn: true});
    } 
    this.setState({route: status}) ;
  }

  render() {
    return ( 
      <div className="App">
        <Particles className='particles'
            params = {particlesOptions}
        />
          < Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
          { this.state.route === 'home' 
          ? <div>
                <Logo />
                <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
           </div>
            : ( this.state.route === 'signin' ?
                   <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                : <Register loadUser= {this.loadUser} onRouteChange= {this.onRouteChange} />

            )
              
         
          }
      </div>
    );
  }
 
}

export default App;
