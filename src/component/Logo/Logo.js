import react from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';

const Logo = () =>{
    return(
        <div className='ma4 mt0'>
        <Tilt className="br2 shadow-2" style={{width:'100px' }} >
        <div className="pa3" style={{background:''  }}>
          <img alt='logo' src={brain} style={{paddingTop:'5px'}}/>
        </div>
      </Tilt>

        </div>


    )
}

export default Logo;