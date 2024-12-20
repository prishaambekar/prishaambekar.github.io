import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { save, resetDecksForTesting, saveScore, loadCards, listDecks, resetScores, listScore} from './routes';


describe('routes', function() {


  it('save', function() {
    // First branch, straight line code, error case 
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {cards: "some stuff"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "name" was missing');

    const req2 = httpMocks.createRequest(
       {method: 'POST', url: '/save', body: {cards: "some stuff"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), 'required argument "name" was missing');

    // Second branch, straight line code, error case 
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "A"}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
        'required argument "cards" was missing');

    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "B"}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);
    
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(),
        'required argument "cards" was missing');

    //Third Branch, error case
    const req5 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", cards: "some stuff"}});
    const res5 = httpMocks.createResponse();
    save(req5, res5);

    const req6 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", cards: "different stuff"}});
    const res6 = httpMocks.createResponse();
    save(req6, res6);

    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(), "There's already a deck saved with this name");
    resetDecksForTesting();
    
    const req7 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "B", cards: "some stuff"}});
    const res7 = httpMocks.createResponse();
    save(req7, res7);

    const req8 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "B", cards: "different stuff"}});
    const res8 = httpMocks.createResponse();
    save(req8, res8);

    assert.strictEqual(res8._getStatusCode(), 400);
    assert.deepStrictEqual(res8._getData(), "There's already a deck saved with this name");
    resetDecksForTesting();

    // Fourth branch, straight line code

    const req9 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "C", cards: "some stuff"}});
    const res9 = httpMocks.createResponse();
    save(req9, res9);

    assert.strictEqual(res9._getStatusCode(), 200);
    assert.deepStrictEqual(res9._getData(), {success: true});

    const req10 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "D", cards: "different stuff"}});
    const res10 = httpMocks.createResponse();
    save(req10, res10);

    assert.strictEqual(res10._getStatusCode(), 200);
    assert.deepStrictEqual(res10._getData(), {success: true});

    resetDecksForTesting();
  });

  it("saveScore", function(){
      // First branch, straight line code, error case 
      const req1 = httpMocks.createRequest(
          {method: 'POST', url: '/saveScore', body: {user: "Jaela"}});
      const res1 = httpMocks.createResponse();
      saveScore(req1, res1);
  
      assert.strictEqual(res1._getStatusCode(), 400);
      assert.deepStrictEqual(res1._getData(),
          'required argument "name" was missing');
  
      const req2 = httpMocks.createRequest(
         {method: 'POST', url: '/saveScore', body: {score: 30}});
      const res2 = httpMocks.createResponse();
      saveScore(req2, res2);
  
      assert.strictEqual(res2._getStatusCode(), 400);
      assert.deepStrictEqual(res2._getData(), 'required argument "name" was missing');

      // Second branch, straight line code, error case 
      const req3 = httpMocks.createRequest(
          {method: 'POST', url: '/saveScore', body: {name: "A"}});
      const res3 = httpMocks.createResponse();
      saveScore(req3, res3);

      assert.strictEqual(res3._getStatusCode(), 400);
      assert.deepStrictEqual(res3._getData(),
          'required argument "user" was missing');

      const req4 = httpMocks.createRequest(
          {method: 'POST', url: '/saveScore', body: {name: "B", score: 70}});
      const res4 = httpMocks.createResponse();
      saveScore(req4, res4);
      
      assert.strictEqual(res4._getStatusCode(), 400);
      assert.deepStrictEqual(res4._getData(),
          'required argument "user" was missing');

    // Third branch, straight line code, error case 
    const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/saveScore', body: {name: "A", user:"Anjali"}});
    const res5 = httpMocks.createResponse();
    saveScore(req5, res5);

    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(),
        'required argument "score" was missing');

    const req6 = httpMocks.createRequest(
        {method: 'POST', url: '/saveScore', body: {name: "B", user: "Katherine", score: "70"}});
    const res6 = httpMocks.createResponse();
    saveScore(req6, res6);
    
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
        'required argument "score" was missing');


    // Fourth branch, straight line code

    const req9 = httpMocks.createRequest({method: 'POST', url: '/saveScore',
        body: {name: "C", user: "Michelle", score: 77}});
    const res9 = httpMocks.createResponse();
    saveScore(req9, res9);

    assert.strictEqual(res9._getStatusCode(), 200);
    assert.deepStrictEqual(res9._getData(), {success: true});

    const req10 = httpMocks.createRequest({method: 'POST', url: '/saveScore',
        body: {name: "D", user: "Gargi", score: 80}});
    const res10 = httpMocks.createResponse();
    saveScore(req10, res10);

    assert.strictEqual(res10._getStatusCode(), 200);
    assert.deepStrictEqual(res10._getData(), {success: true});

    resetScores();

  });

  it('loadCards', function() {
    //checking first branch (only one possible input)
    const loadReq0 = httpMocks.createRequest(
     {method: 'GET', url: '/loadCards', query: {}});
 const loadRes0 = httpMocks.createResponse();
 loadCards(loadReq0, loadRes0);
 assert.strictEqual(loadRes0._getStatusCode(), 400);
 assert.deepStrictEqual(loadRes0._getData(), 'required argument "name" was missing');

 resetDecksForTesting();

 //checking second branch (if files does not contain name)
 //test 1
 const loadReq1 = httpMocks.createRequest(
     {method: 'GET', url: '/loadCards', query: {name: "Math"}});
 const loadRes1 = httpMocks.createResponse();
 loadCards(loadReq1, loadRes1);
 assert.strictEqual(loadRes1._getStatusCode(), 404);
 assert.deepStrictEqual(loadRes1._getData(), 'there are no saved decks with this name');

 resetDecksForTesting();
 
 //test 2
 const loadReq2 = httpMocks.createRequest(
     {method: 'GET', url: '/loadCards', query: {name: "xyz"}});
 const loadRes2 = httpMocks.createResponse();
 loadCards(loadReq2, loadRes2);
 assert.strictEqual(loadRes2._getStatusCode(), 404);
 assert.deepStrictEqual(loadRes2._getData(), 'there are no saved decks with this name');

 resetDecksForTesting();

 //testing third branch
 const saveReq1 = httpMocks.createRequest({method: 'POST', url: '/save',
     body: {name: "A", cards: "deck"}});
 const saveResp1 = httpMocks.createResponse();
 save(saveReq1, saveResp1);
 const loadReq3 = httpMocks.createRequest(
     {method: 'GET', url: '/loadCards', query: {name: "A"}});
 const loadRes3 = httpMocks.createResponse();
 loadCards(loadReq3, loadRes3);
 assert.strictEqual(loadRes3._getStatusCode(), 200);
 assert.deepStrictEqual(loadRes3._getData(), {deck: "deck"});

 resetDecksForTesting();

 const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/save',
     body: {name: "B", cards: "deck2"}});
 const saveResp2 = httpMocks.createResponse();
 save(saveReq2, saveResp2);
 const loadReq4 = httpMocks.createRequest(
     {method: 'GET', url: '/loadCards', query: {name: "B"}});
 const loadRes4 = httpMocks.createResponse();
 loadCards(loadReq4, loadRes4);
 assert.strictEqual(loadRes4._getStatusCode(), 200);
 assert.deepStrictEqual(loadRes4._getData(), {deck: "deck2"});

 resetDecksForTesting();
 });

 it('listScore', function(){
  //straight line code with only one branch
  const listReq0 = httpMocks.createRequest({method: 'GET', url: '/listScore'});
  const listRes0 = httpMocks.createResponse();
  listScore(listReq0, listRes0);
  assert.strictEqual(listRes0._getStatusCode(), 200);
  assert.deepStrictEqual(listRes0._getData(), {list: []})

  const saveReq = httpMocks.createRequest({method: 'POST', url: '/saveScore',
    body: {name: "Math", user: "Jaela", score: 100}});
  const saveRes = httpMocks.createResponse();
  saveScore(saveReq, saveRes);
  const listReq = httpMocks.createRequest({method: 'GET', url: '/listScore'});
  const listRes = httpMocks.createResponse();
  listScore(listReq, listRes);

  assert.strictEqual(listRes._getStatusCode(), 200);
  assert.deepStrictEqual(listRes._getData(), {list: ["Jaela, Math: 100"]});


  const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/saveScore',
    body: {name: "CS", user: "Zachary", score: 80}});
  const saveRes2 = httpMocks.createResponse();
  saveScore(saveReq2, saveRes2);
  const listReq2 = httpMocks.createRequest({method: 'GET', url: '/listScore'});
  const listRes2 = httpMocks.createResponse();
  listScore(listReq2, listRes2);

  assert.strictEqual(listRes2._getStatusCode(), 200);
  assert.deepStrictEqual(listRes2._getData(), {list: ["Jaela, Math: 100", "Zachary, CS: 80"]});

});

it('listDecks', function(){
  //straight line code with only one branch
  const listReq0 = httpMocks.createRequest({method: 'GET', url: '/listDecks'});
  const listRes0 = httpMocks.createResponse();
  listDecks(listReq0, listRes0);
  assert.strictEqual(listRes0._getStatusCode(), 200);
  assert.deepStrictEqual(listRes0._getData(), {list: []})

  const saveReq = httpMocks.createRequest({method: 'POST', url: '/save',
    body: {name: "A", cards: "file"}});
  const saveRes = httpMocks.createResponse();
  save(saveReq, saveRes);
  const listReq = httpMocks.createRequest({method: 'GET', url: '/listDecks'});
  const listRes = httpMocks.createResponse();
  listDecks(listReq, listRes);

  assert.strictEqual(listRes._getStatusCode(), 200);
  assert.deepStrictEqual(listRes._getData(), {list: ["A"]});


  const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/save',
    body: {name: "B", cards: "another file"}});
  const saveRes2 = httpMocks.createResponse();
  save(saveReq2, saveRes2);
  const listReq2 = httpMocks.createRequest({method: 'GET', url: '/listDecks'});
  const listRes2 = httpMocks.createResponse();
  listDecks(listReq2, listRes2);

  assert.strictEqual(listRes2._getStatusCode(), 200);
  assert.deepStrictEqual(listRes2._getData(), {list: ["A", "B"]});

});

});
