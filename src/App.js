import React, {useState, useEffect} from 'react';
import './App.scss';
import ColorCard from "./components/ColorCard";
import timeout from "./help"

function App() {
   const [isOn, setIsOn] = useState(false);

   const colorList = ["green","red","yellow","blue"];
   const initPlay = {
       isDisplay:false,
       colors:[],
       score:0,
       userState:false,
       userColors:[]
   }

   const [play, setPlay] = useState(initPlay);
   const [flashColor, setFlashColor] = useState("")

   function startHandle(){
       setIsOn(true)
    }

    useEffect(()=>{
        if (isOn){
            setPlay({...initPlay,isDisplay: true})
        } else {
            setPlay(initPlay)
        }
    },[isOn]);

   useEffect(()=>{
       if(isOn && play.isDisplay){
           let newColour = colorList[Math.floor(Math.random()*3)]
           const copyColors = [...play.colors]
           copyColors.push(newColour)
           setPlay({...play, colors: copyColors})
       }
   }, [isOn, play.isDisplay])


    useEffect(()=>{
        if(isOn&&play.isDisplay&&play.colors.length){
            displayColors()
        }
    }, [isOn, play.isDisplay, play.colors.length])

    async function displayColors(){
        for (let i =0;i<play.colors.length; i++){
            setFlashColor(play.colors[i])
            await timeout(1000)
            setFlashColor("")
            await timeout(1000)

            if (i === play.colors.length-1){
                const copyColors = [...play.colors];

                setPlay({...play,
                    isDisplay: false,
                    userPlay: true,
                    userColors: copyColors.reverse(),
                })
            }
        }
    }
    async function cardClickHandle(color){
       if(!play.isDisplay && play.userPlay){
           const copyUserColors = [...play.userColors]
           const lastColour = copyUserColors.pop();
           setFlashColor(color);

           if (color === lastColour) {
            if (copyUserColors.length){
                setPlay({...play, userColors: copyUserColors})
            } else {
                await timeout(1000);
                setPlay({...play, isDisplay:true, userPlay:false, score:play.colors.length, userColors:[]})

           }   }else {
            await timeout(1000);
           setPlay({...initPlay, score:play.colors.length})
       }
       await timeout(1000)
       setFlashColor("")}
    }

    function closeHandle(){
       setIsOn(true)
    }
    return (
    <div className="App">
      <header className="App-header">
        <div className="cardWrapper">
            {colorList &&
            colorList.map((v,i)=>(
                    <ColorCard onClick={()=>{cardClickHandle(v)}} flash={flashColor===v} color={v}/>
                        ))}
        </div>
          {isOn && !play.isDisplay && !play.userPlay && play.score && (
              <div className={"lost"}>
                  <div> FINal score: {play.score}</div>
                  <button onClick={closeHandle}>close</button>
              </div>
          )}
          { !isOn && !play.score && (
              <button onClick={startHandle} className={"startButton"}>Start</button>
          )}
            {      isOn && play.isDisplay  && (
                <div className={"score"}>
                    {play.score}</div>
    )}
      </header>
    </div>
  );
}

export default App;
