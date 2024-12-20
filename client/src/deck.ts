export type card ={
    front: string;
    back: string;
}


/**
 * Splits the given string in the correct format into an array of cards 
 * @param input a string in the format "front|back front|back...",
 * where a | separates the front of the card from the back and each card is seperated by a line break
 * returns if input is not in format 
 * @returns the array that has all the cards from the input 
 */
export const splitString = (input: string): Array<card> | undefined=> {
    if(input === ""){
        return [];
    }
    const inputSplit : Array<string> = input.split("\n");
    return splitArray(inputSplit);
}

/**
 * converts the given array of strings into an array of cards
 * @param inputSplit an array of strinsg where each string represents a card
 * @returns the array that has all the cards from the inputSplit 
 */
export const splitArray = (inputSplit : Array<string>): Array<card> | undefined =>{
    const cardArray : Array<card> = [];
    for(const input of inputSplit){
        if(input.indexOf("|") === -1){
            return undefined;
        }
        const card = {
            front : input.split("|")[0],
            back : input.split("|")[1]
        }
        cardArray.push(card);
    }
    return cardArray;
}
