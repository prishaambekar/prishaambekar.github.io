import React, { Component, MouseEvent, ChangeEvent} from "react";
import { card, splitString } from "./deck";
import  './style.css';
type PlayDeckProps = {
    deck: string
    deckName : string
    onFinish: (deckName: string, userName: string, score: number) => void;
}

type PlayDeckState = {
    cards: Array<card> | undefined
    index : number
    isFlipped : boolean;
    correct: number;
    incorrect: number;
    user: string;
}
/** UI to play a deck of flashcards*/
export class PlayDeck extends Component<PlayDeckProps, PlayDeckState>{
    constructor(props: PlayDeckProps) {
        super(props);
        this.state = {cards : splitString(this.props.deck), index : 0,
            isFlipped : false,  correct: 0, incorrect: 0, user : ""};
        
    }

    /** displays the card, and then the page to save score once the deck finishes */
    render = (): JSX.Element =>{
        if(this.state.cards !== undefined){
            if(this.state.index < this.state.cards.length){
                return <div>
                    <h3>{this.props.deckName}</h3>
                    <h4>Correct: {this.state.correct} | Incorrect: {this.state.incorrect}</h4>
                    {this.renderCard()}
                    <button onClick = {this.doFlipClick}>Flip</button>   
                    <button onClick = {this.doCorrectClick}>Correct</button>
                    <button onClick = {this.doIncorrectClick}>Incorrect</button>
                    </div>
                } else{
                    return <div>
                    <h3>{this.props.deckName}</h3>
                    <h4>Correct: {this.state.correct} | Incorrect: {this.state.incorrect}</h4>
                    <p>End of quiz</p>
                    {this.renderNewScore()}
                    </div>
                }
        } else{
            return <p className="error"> The file was not saved properly : due to input not being in correct format</p>
        }
        
    }

    /** renders either the front or the back of a card based on whether it is flipped */
    renderCard = (): JSX.Element => {
        if(this.state.cards !== undefined){
            if(!this.state.isFlipped){
                return <p className = "card">{this.state.cards[this.state.index].front}</p>;
            } else{
                return <p className = "card">{this.state.cards[this.state.index].back}</p>
            }
        } else{
            return <div></div>
        }
    }

    renderNewScore = (): JSX.Element => {
        return <div>
            <p>Name:</p>
            <input type = "text" value = {this.state.user} onChange={this.doUserChange}/>
            <button onClick = {this.doFinishClick}>Finish</button>
        </div>

    }

    doFlipClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.setState({isFlipped : !this.state.isFlipped});
    }

    doCorrectClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.setState({correct : this.state.correct +1, index: this.state.index + 1, isFlipped: false});
    }

    doIncorrectClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.setState({incorrect : this.state.incorrect + 1, index: this.state.index + 1, isFlipped: false})
    }

    doUserChange = (_evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({user : _evt.target.value});
    }

    //calculates the score (as a percentage) and saves it 
    doFinishClick = (): void => {
        const score =  Math.round((this.state.correct/(this.state.correct + this.state.incorrect))*100);
        this.props.onFinish(this.props.deckName, this.state.user, score);
    }
}