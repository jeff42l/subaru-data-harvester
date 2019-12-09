# Subaru Data Harvester
Chrome extension and supporting code to make a personal offline backup of STIS documentation

Use at your own risk, this includes no warranty or guarantee of any sort. This was just hacked together over a weekend without any attention given to polish.

This will assist in creating a local offline backup copy (in MHTML format) of Subaru technical documentation available from the STIS subscription service, where that documentation is only available as live HTML.

Local offline backup can be useful where you don't have good network access in your garage, etc. This will still take a long time to create a copy, and requires interaction due to browser security, but it's better than right-click "save as".

How to use:
* Clone this repository
* Load the extension into your repository in development mode (unless you feel like packaging it), and enable
* Sign into the STIS site and load the HTML documentation you're after
* Select the documentation section you wish to download (you should see the top level categories in the left column)
* Click the extension's toolbar icon (just a simple "S"), and select "Start Collection"
* If you need to resume the detail collection due to an interruption, put the last URL downloaded (just the relative part as you'll find in menudata.json for that section) into the resume input

Known Issues:
* It's not tab-safe, so you'll need to keep the target tab in focus while collecting
* Files will save as .txt, so you'll need to rename them all to .mht, this is inconvenient
* Haven't been able to find a way to coerce chrome into saving without opening the Save dialog, so you still have to click Save for every file (and there will be a lot)

TODO: 
* Add documentation on file extension bulk changes
* Create a navigation page based on the menudata.json structure
