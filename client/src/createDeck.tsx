import React, { Component, ChangeEvent, MouseEvent} from "react";
import { splitString } from "./deck";
import  './style.css';
type CreateProps = {
    onAdd: (name: string, cards: string) => void;
    onBack: () => void;
}

type CreateState = {
    name : string
    options : string
    errorMessage : string
}

/** UI for the form to create a new deck */
export class CreateDeck extends Component<CreateProps, CreateState>{
    constructor(props: CreateProps) {
        super(props);
        this.state = {name: "", options: "", errorMessage : ""};
    }

    render = (): JSX.Element =>{
        return <div>
            <p>Name:</p>
            <input type = "text" value = {this.state.name} onChange={this.doNameChange}/>
            <p>Options(one per line, formatted as front|back)</p>
            <br></br>
            <textarea id="textbox" rows={3} cols={40} value={this.state.options}
                        onChange={this.doOptionsChange}></textarea>
            <br></br>
            <button onClick = {this.doAddClick}>Add</button>   
            <button onClick = {() => this.props.onBack()}>Back</button>
            {this.renderError(this.state.errorMessage)}
        </div>
    }

    doNameChange = (_evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({name : _evt.target.value, options : this.state.options});
    }
    doOptionsChange = (_evt: ChangeEvent<HTMLTextAreaElement>): void => {
        this.setState({name : this.state.name, options : _evt.target.value});
    }

    /**checks if any of the inputs are empty and renders an 
     * error message onto the screen
     * If they are not empty, saves the new deck*/
    doAddClick = (_evt: MouseEvent<HTMLButtonElement>): void =>{
        if(this.state.name === ""){
            this.setState({errorMessage: "The name is empty"});
        } else if(this.state.options === ""){
            this.setState({errorMessage: "No cards"});
        } else if(splitString(this.state.options) === undefined){
            this.setState({errorMessage: "Cards are not in required format"});
        }
        else{
            this.setState({errorMessage: ""});
            this.props.onAdd(this.state.name, this.state.options);
        }
    }

    /** renders an error on to the screen, if any */
    renderError = (error?: string): JSX.Element => {
        if(error !== undefined){
            return <p className="error">{error}</p>
        }else{
            return <p></p>
        }
    }
}