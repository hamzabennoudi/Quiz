import './App.css';
import React, { useState, useEffect } from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vraagNr: 0,
      score: 0,
      stop: false,
      jsonData: [], 
      jsonLoaded: false, 
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    fetch('http://localhost:8080/quiz/api-get')
      .then(res => res.json())
      .then(data => {
        this.setState({
          jsonData: data,
          jsonLoaded: true, 
        });
      })
      .catch(console.log);
  }

  handleAnswerOptionClick(isCorrect) {
    console.log("Button clicked");

    if (isCorrect) {
      console.log("Antwoord is goed!");
      this.setState({ score: this.state.score + 1 });
    } else {
      console.log("Antwoord is fout!");
    }

    if (this.state.vraagNr < this.state.jsonData.length - 1) {
      this.setState({ vraagNr: this.state.vraagNr + 1 });
    } else {
      this.setState({ stop: true });
    }
  }

  render() {
    if (!this.state.jsonLoaded) {
      return <div className="app">Loading...</div>;
    }
    var questions = this.state.jsonData;

    var antwoorden = this.state.jsonData[this.state.vraagNr]?.answerOptions || [];
    const isLaatsteVraag = this.state.vraagNr === this.state.jsonData.length - 1;

    return (
      <div className="app">
        {this.state.stop ? (
          <div className="score">
            Jouw score is {this.state.score} van de {this.state.jsonData.length}
          </div>
        ) : (
          <>
            <div className="column">
              <span>Vraag {this.state.vraagNr + 1} van {this.state.jsonData.length}</span>
              <span className="question">{this.state.jsonData[this.state.vraagNr]?.questionText}</span>
            </div>

            <div className="column uitlijnen">
              {antwoorden.map((antwoord, index) => (
                <button key={index} onClick={() => this.handleAnswerOptionClick(antwoord.isCorrect)}>
                  {antwoord.answerText} {antwoord.isCorrect.toString()}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default App;