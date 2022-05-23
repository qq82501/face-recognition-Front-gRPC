import './App.css';
import Navigation from './component/Navigation/Navigation';
import Logo from './component/Logo/Logo';
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './component/FaceRecognition/FaceRecognition';
import Rank from './component/Rank/Rank';
import SignIn from './component/SignIn/SignIn';
import Register from './component/Register/Register';
import 'tachyons';
import Particles from 'react-tsparticles';
import {loadFull} from 'tsparticles';
import {tsParticles} from 'tsparticles-engine';
import { Component } from 'react';


const particlesInit = async (main) => {

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
  // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
  // starting from v2 you can add only the features you need reducing the bundle size
  await loadFull(tsParticles);
};

const particlesLoaded = (container) => {

  
};


const particlesOptions ={

  interactivity: {
    detect_on: 'window',
    events: {
      onClick: { 
        enable: false,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 10,
      },
      repulse: {
        distance: 150,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: ["#ffffff","#7469c7"]
    },
    links: {
      color: ["#cfde99","#69c5c7","#df8cdf","#f2de05"],
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 2,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 1000,
      },
      value: 150,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "triangle",
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
  detectRetina: true,
}
const initailState = {
  input:'',
      imageURL:'',
      box: {},
      route: 'signin',
      isSignIn: false,
      user:{
        id: '',
        name: '',
        email: '',
        imageSent: true,
        entries: '',
        joined: ''
      }
  
}
class App extends Component {
  constructor(){
    super();
    this.state= initailState
  }

  // componentDidMount(){
  //   fetch('http://localhost:3001/')
  //     .then(res=>res.json())
  //     .then(data=>console.log(data))
  // }

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }

  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  loadUser = (theUser) =>{
    // fetch(`http://localhost:3001/profile/${u.id}`)
    // .then(res => res.json())
    // .then(theUser =>{
      this.setState({
        user:{
          id: theUser.id,
          name: theUser.name,
          email: theUser.email,
          entries: theUser.entries,
          imageSent: theUser.imageSent,
          joined: theUser.joined
        }
      })
      console.log(theUser);
    // })

  }


  onInputChange = (event) =>{
    this.setState({input:event.target.value})
  } 

  onButtonSubmit = () =>{
    if(!this.state.input.match(/http|www|jpg|png|https/gi)){
      console.log('please enter valid URL')
    }else{
      this.setState({imageURL:this.state.input})
      fetch('https://face-recognition-api-grpc.herokuapp.com/imageurl',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify({
          imageURL: this.state.input
        })
      })
    .then(response => response.json())
    .then(response => {
      if(response){
        fetch('https://face-recognition-api-grpc.herokuapp.com/image',{
          method:'PUT',
          headers:{'Content-Type': 'application/json'},
          body:JSON.stringify({
                  id: this.state.user.id
          })
        })
        .then(res => res.json())
        .then(count => {
          this.setState(Object.assign(this.state.user,{entries: count}))
        })
        .catch(console.log);
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
  })

    }

  }

  onRouteChange = (route) =>{
    if (route === 'home'){
      this.setState({isSignIn: true})
    }
    else if (route === 'signin'){
      this.setState(initailState)
    }
    this.setState({route: route});
  }
  render(){
    const {input, imageURL, box, route, isSignIn, user, isLogOut} = this.state;

    return (
      <div className="App">
        <Particles params={particlesOptions}
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        className="particles"
      />
       
        <Navigation isSignIn={isSignIn} onRouteChange={this.onRouteChange} />
        { route === 'signin' 
          ? (<SignIn loadUser={this.loadUser} onRouteChange = {this.onRouteChange} />)
          :( 
              route === 'register' 
                ? ( <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>)
                :
                  <div>
                    <Logo />
                    <Rank loadedUserName = {user.name} loadedUserEntries = {user.entries}/>
                    <ImageLinkForm isSignIn={isSignIn} isLogOut={isLogOut} onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                    <FaceRecognition box={box} imageURL={imageURL}/>
                  </div>
        )}
      </div>
    );
  }
}

export default App;
