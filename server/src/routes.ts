import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

const decks: Map<string, string> = new Map();

const scores : Array<string> = new Array();


/** Handles the request for "/save" by saving the given deck */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if(name === undefined || typeof name !== "string"){
    res.status(400).send('required argument "name" was missing');
    return;
  } else if(decks.has(name)){
    res.status(400).send("There's already a deck saved with this name");
    return;
  }
  const deck = req.body.cards;
  if (deck === undefined || typeof deck !== "string") {
    res.status(400).send('required argument "cards" was missing');
    return;
  } 
  res.send({success: true});  
  decks.set(name, deck);
}

/**
 * Handles the request for "/saveScore" by recording the score 
 */
export const saveScore = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  const user = req.body.user;
  const score = req.body.score;
  if(name === undefined || typeof name !== "string"){
    res.send(400).send('required argument "name" was missing');
    return;
  } else if(user === undefined || typeof user !== "string"){
    res.send(400).send('required argument "user" was missing');
    return
  }
  else if(score === undefined || typeof score !== "number"){
    res.send(400).send('required argument "score" was missing');
    return;
  }
  const scoreString: string = user + ", " + name + ": " + score;
  scores.push(scoreString);
  res.send({success: true});
}

/** Handles the request for "/loadCards" by returning the cards withing a deck */
export const loadCards = (req: SafeRequest, res: SafeResponse): void =>{
  const name = first(req.query.name);
  if(name === undefined || typeof name !== "string"){
    res.send(400).send('required argument "name" was missing');
    return;
  }
  if(!decks.has(name)){
    res.send(404).send("there are no saved decks with this name");
    return;
  }
  res.send({deck: decks.get(name)});
}

/**
 * Handles the request for "/listScore" by returning a list of all the scores
 */
export const listScore = (_req: SafeRequest, res: SafeResponse): void =>{
  res.send({list: scores});
}

/** Handles the request for "/listDecks" by returning a list of all the decks */
export const listDecks = (_req: SafeRequest, res: SafeResponse): void =>{
  const deckNames = Array.from(decks.keys());
  res.send({list: deckNames});
}
/**
 * resets the decks for testing
 */
export const resetDecksForTesting = (): void => {
  decks.clear();
};

/** resets the scores for testing */
export const resetScores = (): void => {
  scores.length = 0;
}

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
