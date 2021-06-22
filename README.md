**_How to Use_**

1. This was intended to be used as a script, since the instructions did not mention an API or corresponding front-end. With that in mind, data can be parsed simply by `cd`ing into this folder and running:
   `node app.js <PARSED_FILE_PATH>`
   for example:
   `node app.js /Users/myusername/Desktop/datafile.dat`
   It will then return an app named after the given file, with `_analyzed.txt` added to the end of it. It can be found in the same location as the given file, e.g. `/Users/myusername/Desktop/datafile_analyzed.txt`

   Please note that I had a couple of questions while making this -- some data was left out in the given file, so I will explain it below:

**_Limitations and Assumptions_**
This file was made under several assumptions, particularly since I was unable to clarify.

First, I made the assumption that all files would be formatted identically to the given `.dat` file. Specifically, this would mean:

1. Each row in the data will be styled the same, in plain text, with 6 columns, e.g.:
   `18-Jun-12 133.59 134.73 133.28 134.43 29353246`

2. Meaning that they should be as follows after parsing:
   `[ '18-Jun-12', '133.59', '134.73', '133.28', '134.43', '29353246' ]`

3. The first row in the file is full of data labels, e.g., so we can ignore it for our calculations:
   `[Date, Open, High, Low, Close, Volume]`

4. I assumed that the datasets will be given in descending order by date (most recent -> least recent), since that is how this dataset was given. All functions were created with that assumption.

5. That this should _not_ be an API or have a corresponding front-end, it should just be a nodejs script. Hence, it is just one single file with a shell command to run it.

6. re: "What is the maximum profit potential per share, and what day(s) would you have had to buy low and sell high to get this maximum profit?"

- I assumed that the maximum profit potential was referring to the greatest disparity between a single buy and sell (a single date-pair), meaning that an individual can not keep selling and buying the same share. Hence, I only provided one buy/sell date, unless multiple date-pairs had the same buy/sell disparity. If multiple pairs have the same buy and sell disparity, then the most recent date pair is given.
- Currently there is no way to tell if the daily high is _before_ or _after_ the daily low, so buy dates and sell dates must be different dates until we get more information. The exception is if the low is the same as the `close`. The functions kept this in mind, so it will not pass **_every_** test in the real world

7. Note that if you run this script, it will not over-write pre-existing files with the same name. Meaning that if you are modifying a file's data and retrying this script with it, that you should either modify the name of it first, or delete the old `_analyzed.txt` so that the correct file will download and open.
