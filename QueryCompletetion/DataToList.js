        // extend string function : https://stackoverflow.com/questions/8392035/add-method-to-string-class
        String.prototype.indeOfAll = function(word) {
            let index = -1,
                location = [];
            // the loop change the index to loop all the text isntead of stopping when it find it, check indexOf.
            do {
                // return -1 if not found, thats why we pop it at the end, cause it will break the loop
                index = this.indexOf(word, index + 1);

                // add location (if found, otherwise it will be -1 and popped out.)
                location.push(index)
                    // no word found.
            } while (index !== -1);
            // remove the last one.
            location.pop();
            return location

        }

        // to find the word, you can either :
        // find the word from clean text and use the index for the non clean one... or clean the text during your search, to ignore characters add it as parameter on search method.
        // it will be like word, target, ignoreCase.
        // array that hold an array of verses of each sura.
        let sura = [];
        let chars = {
            harakat: {
                kasra: `ِ`
            },
            letters: []
        }
        let lastSura = 0;
        const URL = "https://a0m0rajab.github.io/findJs/"
        const quran = "quran.txt"
        const qurClean = "quran-simple-clean.txt"
        let QurClean = "https://a0m0rajab.github.io/findJs/quran-simple-clean.txt"
        let testURL = "https://a0m0rajab.github.io/findJs/QueryCompletetion/quran.txt"
            // need to add target array to make this global and even add read function at the end.... instead of dataToArray
        function readExternal(url, target, callBack) {
            console.log("reading external data from " + url)
            fetch(url)
                .then(r => r.text()) //response
                .then(t => callBack(t, target)); //text
        }

        function dataToArray(t, targetArray) {
            // split the file to line, which downloaded from Tanzil.
            let lines = t.split("\n");
            console.log("Quran Verses= " + lines.length);
            // temp to hold the number of sura, so we can use it to trigger the next sura and empty the verses array.
            let versesArray = [];
            for (let line of lines) {
                line = line.split("|");
                let suraN = line[0] - 1;
                if (targetArray[suraN] == undefined) {
                    targetArray[suraN] = [];
                }
                targetArray[suraN].push(line[2])
            }
            displaySura(dataShow, sura[0])
        }
        let n = 0;

        function setSura(h = 0) {
            h = Number(h)
                //console.log(h);
            if (h > 113 || h < 0)
                setSur(lastSura)
                // return dataShow.innerText = "Please Choose a number between 1-114"
            lastSura = h
            page.value = h + 1;
            displaySura(dataShow, sura[h])
        }

        function nextSura() {
            n++;
            if (n == 114) {
                n = 0;
            }
            setSura(n)
        }

        function preSura() {
            n--;
            if (n == -1)
                n = 113;
            setSura(n)
        }

        function displaySura(target, arr) {
            let text = "";
            arr.forEach(e => {
                text += e + "\n"
            });
            target.innerText = text;
        }

        function init() {
            page.value = 1;

            readExternal(URL + qurClean, sura, dataToArray);

        }
        // get the sura and verses that has this word and the word location.
        function search(word) {
            let index = -1,
                loc = [];

            // loop all of suras.
            for (i = 0; i < sura.length; i++) {
                // loop verses of each sura.
                for (let j = 0; j < sura[i].length; j++) {
                    let locs = sura[i][j].indexOf(word)
                    if (locs !== -1) {
                        loc.push([i, j, locs])
                    }
                }
            }
            return loc;
        }
        // get the next word location from the search based on length of the word itself... 
        // check if the word is at the ened of aya...
        function nextWordLoc(word) {
            let wordLoc = search(word);
            let nxtwrd, suraN, aya;
            for (let i = 0; i < wordLoc.length; i++) {
                nxtwrd = wordLoc[i][2] + word.length
                suraN = wordLoc[i][0]
                aya = wordLoc[i][1]
                    // check if ened of verse 
                if (sura[suraN][aya].length < nxtwrd) {
                    aya++;
                    // check if the vers is the last at the sura
                    if (sura[suraN].length < aya) {
                        aya = 0;
                        suraN++;
                    }
                }
                wordLoc[i] = [suraN, aya, nxtwrd]
            }
            return wordLoc;
        }

        function nextWordList(word) {
            let wordlocation = nextWordLoc(word);
            // sugwrd = suggestion word, ns= number sura, na = number aya, wls = world list.
            let wls = new Set(),
                als = new Set(),
                lastindex,
                sugwrd, ns, na, aya;
            for (let i = 0; i < wordlocation.length; i++) {
                ns = wordlocation[i][0];
                na = wordlocation[i][1];
                aya = sura[ns][na];
                lastindex = aya.indexOf(" ", wordlocation[i][2] + 1);
                if (lastindex == -1) {
                    lastindex = aya.length;
                }
                sugwrd = aya.substring(wordlocation[i][2], lastindex);
                // if end of aya, then check next aya, from the beging
                if (sugwrd.length <= 1) {
                    wordlocation[i][1] += 1;
                    wordlocation[i][2] = -1;
                    i--;
                    continue;

                }
                wls.add(sugwrd)
                als.add(aya)
            }

            return [wls, als];
        }
        init();
        // for future self.
        // for the suggestion list, use set instead of array to eliminate the duplicated word.
        // add end of aya case ... to check the next aya, then add end of sura case.
        // each harakat is a letter...
        // change the array concept to json for easier data reading and code modifying.. after finishing the next location methods.