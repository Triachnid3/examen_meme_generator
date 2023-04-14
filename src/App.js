import React from 'react';
import Draggable from "react-draggable";
import html2canvas from 'html2canvas';
import downloadjs from 'downloadjs';
import styled from "styled-components";
import './App.css';

const Container = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
  margin-bottom: 10px;
  input[type="color"] {margin-right: 8px; -webkit-appearance: none; border: none; width: auto; height: auto; cursor: pointer; background: none;
    &::-webkit-color-swatch-wrapper {
      padding: 0;
      width: 80px;
      height: 14px;
    }
    &::-webkit-color-swatch {
      border: 1px solid #bfc9d9;
      border-radius: 4px;
      padding: 0;
    }
  }
`;
const ColorPicker = props => {
  return (
    <Container>
      <input type="color" {...props} />
    </Container>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      topText: "",
      topTextColor: "#ffffff",
      bottomText: "",
      bottomTextColor: "#ffffff",
      randomImg: "",
      rndImgWidth : 0,
      rndImgHeight : 0,
      allMemeImgs: [],
    }
    this.img = React.createRef()
    this.button = React.createRef()
    this.printRef = React.createRef()
  }
  componentDidMount() {
    fetch("https://api.imgflip.com/get_memes")
      .then(response => response.json())
      .then(response => {
        const {memes} = response.data
        this.setState({ allMemeImgs: memes })
        const randNum = Math.floor(Math.random() * this.state.allMemeImgs.length)
        if(this.state.allMemeImgs[randNum]) {
          this.setState({ randomImg: this.state.allMemeImgs[randNum].url  })
          this.setState({ rndImgWidth: this.state.allMemeImgs[randNum].width })
          this.setState({ rndImgHeight: this.state.allMemeImgs[randNum].height })
        } else  {
          this.setState({ randomImg: "https://i.imgflip.com/1bij.jpg" })
          this.setState({ rndImgWidth: 500 })
          this.setState({ rndImgHeight: 500 })
        }
      })   
  }
  handleClick = (event) => {
    event.preventDefault()
    const randNum = Math.floor(Math.random() * this.state.allMemeImgs.length)
    this.setState({ randomImg: this.state.allMemeImgs[randNum].url  })
    this.setState({ rndImgWidth: this.state.allMemeImgs[randNum].width })
    this.setState({ rndImgHeight: this.state.allMemeImgs[randNum].height })
  }
  handleInput = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };
  handleChange = (event) => {
    const {name, value} = event.target
    this.setState({ [name]: value })
  }
  handleDownloadImage = async (event) => {
    event.preventDefault()
    const canvas = await html2canvas(this.printRef.current, {useCORS: true,allowTaint: true,})
    const dataURL = canvas.toDataURL('image/png')
    downloadjs(dataURL, 'meme.png')
  }

  render() {
    return (
      <div className='container flex'>
        <div className="sidebar flex flex-col w-1/3 mr-5 bg-slate-900">
          <h1 className='mt-0 mb-2 text-5xl font-medium leading-tight text-white mx-auto'>Meme generator</h1>
          <form className="meme-form">
              <button onClick={this.handleClick} ref={this.button} className="rounded-2xl h-12 w-4/5 mt-5 block mx-auto justify-center bg-blue-500 font-bold text-lg text-white relative overflow-hidden">Générer une nouvelle image
                <div className="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded-2xl"></div>
              </button>
              <ColorPicker name="topTextColor" value={this.state.color} onChange={this.handleInput("topTextColor")}/>
              <textarea type="text" name="topText" placeholder="Top Text" value={this.state.topText} onChange={this.handleChange} className='block w-4/5 p-2.5 mx-auto text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 my-3'/>              
              <ColorPicker name="bottomTextColor" value={this.state.color} onChange={this.handleInput("bottomTextColor")}/>
              <textarea type="text" name="bottomText" placeholder="Bottom Text" value={this.state.bottomText} onChange={this.handleChange} className='block p-2.5 w-4/5 mx-auto text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
              <button onClick={this.handleDownloadImage} className='group rounded-2xl h-12 w-4/5 mt-5 block mx-auto justify-center bg-blue-500 font-bold text-lg text-white relative overflow-hidden'>Télécharger l'image</button>
          </form>
        </div>
        <div className="w-2/3 meme relative mt-12 mx-auto" ref={this.printRef} >
          <Draggable bounds={{left: 0, top: 0, right:500, bottom:500 }}>
            <p className="top memeText" style={{color: this.state.topTextColor}} >{this.state.topText}</p>
          </Draggable>
          <Draggable bounds={{left: 0, top: 0, right:500, bottom:500 }}>
            <p className="bottom memeText" style={{color: this.state.bottomTextColor}}>{this.state.bottomText}</p>
          </Draggable>
          <img id="memeImg" className='bg-black' src={this.state.randomImg} alt="" ref={this.img} />
        </div>
      </div>
    )
  }
}

export default App;