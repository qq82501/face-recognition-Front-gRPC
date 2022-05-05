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
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: 'f16ef33efb474f13a3ec7475ce88aff2'
 });
const particlesInit = async (main) => {
  console.log(main);

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
  // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
  // starting from v2 you can add only the features you need reducing the bundle size
  await loadFull(tsParticles);
};

const particlesLoaded = (container) => {
  console.log(container);

  
};


const particlesOptions ={

  interactivity: {
    detect_on: 'window',
    events: {
      onClick: { 
        enable: true,
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
      speed: 3,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 1000,
      },
      value: 70,
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

class App extends Component {
  constructor(){
    super();
    this.state={
      input:'',
      imageURL:'',
      box: {},
      route: 'signin',
      isSignIn: false
    }
  }

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height,clarifaiFace);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }

  }

  displayFaceBox = (box) => {
    console.log('box',box);
    this.setState({box: box});
  }

  onInputChange = (event) =>{
    this.setState({input:event.target.value})
  } 

  onButtonSubmit = () =>{
    console.log('submit');
    this.setState({imageURL:this.state.input})
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
  .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
  .catch(error=>console.log('1',error));
  }

  onRouteChange = (route) =>{
    if (route === 'home'){
      this.setState({isSignIn: true})
    }else{
      this.setState({isSignIn: false})
    }
    this.setState({route: route});
  }
  render(){
    const {input, imageURL, box, route, isSignIn} = this.state;

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
          ? (<SignIn onRouteChange = {this.onRouteChange} />)
          :( 
              route === 'register' 
                ? ( <Register onRouteChange={this.onRouteChange}/>)
                :
                  <div>
                    <Logo />
                    <Rank />
                    <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                    <FaceRecognition box={box} imageURL={imageURL} />
                  </div>
        )}
      </div>
    );
  }
}

export default App;
