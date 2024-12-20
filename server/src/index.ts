import express, { Express } from "express";
import { listDecks, listScore, loadCards, save, saveScore } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.listen(port, () => console.log(`Server listening on ${port}`));
app.post("/api/save", save);
app.post("/api/saveScore", saveScore);
app.get("/api/loadCards", loadCards);
app.get("/api/listDecks", listDecks);
app.get("/api/listScore", listScore);
