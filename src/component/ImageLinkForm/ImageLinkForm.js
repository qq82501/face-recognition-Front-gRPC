import react from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ({onInputChange, onButtonSubmit}) =>{
    return(
      <div>
        <p>{`This magic brain will detect faces in your pictures. Give it a try.`}</p>
        <div className='center'>
          <div className='form pa4 br3 shadow-5 center'>
            <input className='f4 pa2 w-70 center' type='text' onChange={onInputChange}/>
            <button className='w-30 grow f4 ph3 pv2 dib white bg-light-purple' onClick={onButtonSubmit} >Detect</button>
          </div>
        </div>
      </div>
    )
  }

export default ImageLinkForm;
