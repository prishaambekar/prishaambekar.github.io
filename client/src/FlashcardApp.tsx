import React, { Component, MouseEvent } from "react";
import { isRecord } from './record';
import { CreateDeck } from "./createDeck";
import { PlayDeck } from "./playDeck";

type FlashcardAppState = {
  screen : "home" | "create" | "loadDeck" 
  deckList : string[];
  deckName? : string;
  deckToShow? : string;
  scores : string[];
}


/** Displays the UI of the Flashcard application. */
export class FlashcardApp extends Component<{}, FlashcardAppState> {

  constructor(props: {}) {
    super(props);
    this.state = {screen: "home", deckList: [], scores: []};
  }
  
  componentDidMount = (): void =>{
    this.doListDeckClick();
    this.doListScoreClick();
  }

  render = (): JSX.Element => {
    if(this.state.screen === "home"){
      return this.renderHome();
    } else if(this.state.screen === "create"){
      return this.renderCreateDeck();
    } else{
      return this.renderLoadDeck();
    }
    
  };

  renderHome = (): JSX.Element => {
     return <div>
      <h2>List</h2>
      <ul> {this.state.deckList.map(this.renderDeckList)}</ul>
      <button onClick={this.doNewClick}>New</button>
      <h2>Scores</h2>
      <ul> {this.state.scores.map(this.renderScoreList)}</ul>
    </div>
  }

  doNewClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.setState({screen: "create", deckList: this.state.deckList, scores: this.state.scores});
  }

  renderCreateDeck = (): JSX.Element =>{
    return <CreateDeck onAdd={this.doAddClick} onBack={this.doBackClick}/>
  }

  renderLoadDeck = (): JSX.Element => {
    if(this.state.deckName !== undefined && this.state.deckToShow !== undefined){
      return <PlayDeck deckName = {this.state.deckName} deck = {this.state.deckToShow} onFinish={this.doFinishClick}/>
    } else {
      return <div></div>
    }
  }

  renderDeckList = (file: string): JSX.Element => {
    return <li key = {file}> <a href="#" onClick={() => this.doLoadDeckClick(file)}>{file}</a> </li>
  }

  renderScoreList = (file: string): JSX.Element =>{
    return <li key = {file}>{file}</li>
  }

  doAddClick = (name: string, cards:string) : void => {
    fetch("/api/save?name=" + name, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
      name: name,
      cards: cards}),
      })
      .then(this.doAddResp)
      .catch(() => this.doAddError("failed to connect"))
  
  }

  doAddResp = (res: Response): void =>{
    if(res.status === 200){
      res.json().then(this.doAddJson)
     .catch(() => this.doAddError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      //throws an alert message if there is already a deck saved with this name 
        res.text().then((msg) => alert(msg))
        res.text().then(this.doAddError)
        .catch(() => this.doAddError("400 response is not text"));
    } else {
       this.doAddError(`bad status code: ${res.status}`);
    }
  }

  doAddJson = (val: Response): void => {
    if(!(isRecord(val) && typeof val.success==='boolean')){
      this.doAddError('bad data from /api/Add : not a record');
    }
  }

  doAddError = (error: String): void => {
    console.log("Error fetching /api/Add " + error);
  }

  doBackClick = (): void => {
    this.doListDeckClick();
    this.doListScoreClick();
    this.setState({screen : "home"})
  }

  doListDeckClick = (): void =>{
    fetch('/api/listDecks')
    .then(this.doListDeckResp)
    .catch(() => this.doListDeckError("failed to connect"));
  }

  doListDeckResp = (res: Response):void => {
    if(res.status === 200){
      res.json().then(this.doListDeckJson)
        .catch(() => this.doListDeckError("200 response is not valid JSON"))
    } else if(res.status === 400){
      res.text().then(this.doListDeckError)
        .catch(() => this.doListDeckError("200 response is not calid JSON"))
    } else{
      this.doListDeckError("bad status code: " +res.status);
    }
  }

  doListDeckJson = (val : unknown): void =>{
    if(isRecord(val) && Array.isArray(val.list)){
      this.setState({deckList : val.list});
    } else {
      this.doListDeckError("bad data type from /api/listDecks");
    }
  }

  doListDeckError = (error: string): void =>{
    console.log("Error fetching /api/listDecks " + error);
  }

  doLoadDeckClick = (deckName: string): void => {
    this.setState({deckName : deckName})
    fetch("/api/loadCards?name=" + deckName)
    .then(this.doLoadDeckResp)
    .catch(() => this.doLoadDeckError("failed to connect"))
  }

  doLoadDeckResp = (res: Response): void =>{
    if(res.status === 200){
      res.json().then(this.doLoadDeckJson)
        .catch(() => this.doLoadDeckError("200 response is not valid JSON"))
    } else if(res.status === 400){
      res.text().then(this.doLoadDeckError)
        .catch(() => this.doLoadDeckError("400 response is not text"))
    } else{
      this.doLoadDeckError("bad status code: " + res.status);
    }
  }

  doLoadDeckJson = (val: unknown):void => {
    if(isRecord(val) && typeof val.deck === "string"){
      this.setState({deckToShow : val.deck, screen: "loadDeck"});
    }
  }

  doLoadDeckError = (error: string):void => {
    console.log("Error fetching /api/load " + error)
  }

  doFinishClick = (deckName: string, userName: string, score: number): void =>{
    this.doListScoreClick();
    this.setState({screen : "home"});
    fetch("/api/saveScore?name=" + userName, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
      name: deckName,
      user: userName,
      score: score}),
      })
      .then(this.doAddResp)
      .catch(() => this.doAddError("failed to connect"))
  }

  doFinishResp = (res: Response): void =>{
    if(res.status === 200){
      res.json().then(this.doAddJson)
     .catch(() => this.doAddError("200 response is not valid JSON"));
    } else if (res.status === 400) {
        res.text().then(this.doAddError)
        .catch(() => this.doAddError("400 response is not text"));
    } else {
       this.doAddError(`bad status code: ${res.status}`);
    }
  }

  doFinishJson = (val: Response): void => {
    if(!(isRecord(val) && typeof val.success !=='boolean')){
      this.doAddError('bad data from /api/saveScore : not a record');
    }
  }

  doFinishError = (error: String): void => {
    console.log("Error fetching /api/saveScore " + error);
  }

  doListScoreClick = (): void =>{
    fetch('/api/listScore')
    .then(this.doListScoreResp)
    .catch(() => this.doListScoreError("failed to connect"));
  }

  doListScoreResp = (res: Response):void => {
    if(res.status === 200){
      res.json().then(this.doListScoreJson)
        .catch(() => this.doListScoreError("200 response is not valid JSON"))
    } else if(res.status === 400){
      res.text().then(this.doListScoreError)
        .catch(() => this.doListScoreError("200 response is not calid JSON"))
    } else{
      this.doListScoreError("bad status code: " + res.status);
    }
  }

  doListScoreJson = (val : unknown): void =>{
    if(isRecord(val) && Array.isArray(val.list)){
      this.setState({scores : val.list});
    } else {
      this.doListScoreError("bad data type from /api/listDecks");
    }
  }

  doListScoreError = (error: string): void =>{
    console.log("Error fetching /api/listScores " + error);
  }
  

  
}