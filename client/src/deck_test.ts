import * as assert from "assert";
import { splitString, splitArray} from "./deck";

describe('deck', function() {
    it('splitString', function() {
        //first branch, straight line code
        assert.deepStrictEqual(splitString(""), []);

        //second branch, straight line code 
        assert.deepStrictEqual(splitString("apple|red"), [{front : "apple", back: "red"}]);
        const s2 : string = "1|1\n2|4\n3|9"
        assert.deepStrictEqual(splitString(s2), [{front: "1", back: "1"}, {front: "2", back: "4"}, {front: "3", back: "9"}]);

        //testing undefined
        assert.deepStrictEqual(splitString("error case"), undefined);
        assert.deepStrictEqual(splitString("error 2"), undefined);

    });

    it('splitArray', function() {
        //testing for 0 iterations 
        assert.deepStrictEqual(splitArray([]), []);

        //testing for 1 iteration
        assert.deepStrictEqual(splitArray(["sky|blue"]), [{front : "sky", back: "blue"}]);
        assert.deepStrictEqual(splitArray(["apple|red"]), [{front : "apple", back: "red"}]);

        //testing for multiple iterations
        assert.deepStrictEqual(splitArray(["1|1", "2|4"]), [{front: "1", back: "1"}, {front: "2", back: "4"}]);
        assert.deepStrictEqual(splitArray(["1|1", "2|4", "3|9"]), [{front: "1", back: "1"}, {front: "2", back: "4"}, {front: "3", back: "9"}]);

        //testing error case
        assert.deepStrictEqual(splitArray(["error case"]), undefined);
        assert.deepStrictEqual(splitArray(["error 2"]), undefined);


    })
});