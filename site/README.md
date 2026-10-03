# A small friend

A standalone virtual friend (Tamagotchi-like), built from the findings in
`../virtual_attachment.md`. Zero dependencies, works offline once loaded.

## Run it

Any static server from this folder, e.g.

    python3 -m http.server 8901

then open http://localhost:8901/index.html

(`file://` will not work: browsers block ES modules on file URLs.)

## Daily rhythm

Check in a few times a day: feed, play, pet, tuck in at night.
It waits while the tab is closed (up to 12h of gentle simulated time),
greets you when you return, and grows through stages as care completes.
If it is ever truly neglected it fades gently — and a new egg waits,
keeping every keepsake, diary page, and remembered name.
