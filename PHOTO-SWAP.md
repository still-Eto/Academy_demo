# Photo swap — the shot list

**Generated from `content/images.ts` and `content/photo-briefs.ts`. Do not edit
this file by hand.** Run `npm run photo-doc` after changing either.

40 image slots. **12 carry a photograph today;
28 are wordless graded blocks** waiting for one.

---

## What is in the slots right now

12 slots hold free-license stock, graded into one look by
`npm run photos:build`. The originals are committed under
`public/photos/_source`; nothing is hotlinked, so the site cannot load broken
on a prospect's office WiFi.

Every remaining slot renders a **wordless** block in the brand palette. No
captions, no dimensions, no "photograph to come" — a placeholder that announces
itself in words is worse than an empty one, because it tells the visitor the
rest of the page is provisional too.

### Licensing

| Source | Licence | Attribution |
|---|---|---|
| Pexels | Pexels License — free for commercial use | Not required |
| Unsplash | Unsplash License — free for commercial use | Not required |
| Pixabay | Pixabay Content License | Not required |

Four shortlisted images were **rejected** rather than used. The reasons are
recorded in `scripts/fetch-photography.mjs` and are worth reading before
sourcing the next batch: one was Unsplash+ (a paid licence, not the free one),
one showed a masked child, one carried another preschool's logo across every
shirt in frame, and one was too small with legible foreign-language signage.

## How a swap works

1. Put the real file in `public/photos/_source`.
2. Open `content/images.ts`, find the slot, point `photo.source` at it.
3. Correct `alt` — it describes what is in the frame, for a parent using a
   screen reader. Not the shot brief.
4. `npm run photos:build`.

The container already holds the aspect ratio, so nothing on the page moves when
a block becomes a photograph. Measured: CLS 0.0000 across the swap.

**Aspect ratios are not suggestions.** They are locked at the container. A file
delivered at a different ratio is cropped to fit by `object-fit: cover` — it
will not break the layout, but it will lose whatever is at the edges.

## Direction

Rooms, light through windows, hands, materials on a table, the playground, a
teacher mid-sentence. Faces of children only where they read as authentic and
non-identifying. No posed group shots. Candid and documentary framing always
beats posed.

**Reject rather than include:** visible logos or branding (including another
school's uniform), wall calendars or signage with legible text, dated interiors,
face masks, and the over-lit grinning-model look that reads as stock on sight.

---

## THE GAP — what to source next, in priority order

**Every photograph on this site shows children doing an activity. Not one shows
a room.** For this niche that is backwards. Safety and cleanliness outrank
curriculum and cost for most parents, and the two pages carrying that argument
— `/safety` and the building section of `/about` — have no photography at all.
A director evaluating this demo will look for a picture of the space, because
that is what her own parents ask her for.

Four shots close it. All four are findable on the same free-license sources.

| Priority | Shot | Slot it fills | Why |
|---|---|---|---|
| **1** | An empty, clean, well-lit classroom — low tables, cubbies, natural light, no people | `room.acorn.1` or `building.corridor` | The single most valuable missing image on the site |
| **2** | The entrance or a secure door with a keypad | `building.entry` | Carries the whole safety argument in one frame |
| **3** | An outdoor playground, empty, soft surfacing visible | `building.playground` | The question every parent asks second |
| **4** | A nap room or cot area, empty and tidy | `room.acorn.2` | Answers the infant-room question the activity shots cannot |

**Staff portraits: four slots, no source images, and deliberately left empty.**
Cropping a child's face out of an activity shot into a teacher portrait is
obvious and it damages the page it sits on. The blocks stay; the name, role,
credential and tenure beside them carry the trust, and the face is a bonus. If
portraits are sourced later they must share one light temperature, or the page
will look like six different websites stitched together.

---

## Hero — 2 file

| Slot | Status | Aspect | Time of day | The shot to take |
|---|---|---|---|---|
| `hero` | stock: `teacher-reading-with-children.jpg` | **32:15** (2560×1200) | Morning, 9:00–10:00am, low sun on the window side | One teacher and three children over a book or a tray, close range, no eye contact with the camera. Light from a single window on one side of the group, the far side left in shadow. Expose for the faces and let the background go. Shoot wide — the same frame is cropped 16:9 and 3:4. **— LCP element. Supply it optimized.** |
| `hero.mobile` | stock: `teacher-reading-with-children.jpg` | **3:4** (1080×1440) | Same frame as the hero | No separate shot. The 3:4 phone crop of the hero frame above, made at build time from the same exposure. |

**Optional video.** Set `site.media.hero.video` in `content/site.config.ts` to a
path like `/video/morning.mp4` and the hero plays it above 768px, only when the
connection has not asked to save data and the visitor has not asked for reduced
motion. 6–10 seconds, muted, no cuts, no music.

## Classrooms — 13 files

The first photograph of each pair also appears beside the parent quotes on the
home page, so make it the stronger of the two.

| Slot | Status | Aspect | Time of day | The shot to take |
|---|---|---|---|---|
| `band.breath` | stock: `hands-blocks-warm-table.jpg` | **16:5** (2400×750) | Any, window light, no flash | Hands and wooden materials, shot from above, close. No face in the frame. This band carries no words at all, so the photograph has to be worth a screen on its own. |
| `room.acorn.1` | **empty — needs a shot** | **3:2** (1200×800) | Mid-morning, during first nap, blinds half drawn | Acorn Room, 6 weeks – 15 months — the window bench and the six cribs along the far wall |
| `room.acorn.2` | **empty — needs a shot** | **3:2** (1200×800) | Mid-morning, floor time | Acorn Room, 6 weeks – 15 months — treasure baskets and the floor mirror on the mat |
| `room.sunflower.1` | stock: `toddler-with-wooden-toys.jpg` | **3:2** (1200×800) | Morning, before 9:15 outdoor time | Sunflower Room, 15 – 24 months — the low climbing platform and the reading corner |
| `room.sunflower.2` | **empty — needs a shot** | **3:2** (1200×800) | Mid-morning, 10:15 sensory block | Sunflower Room, 15 – 24 months — the sensory table, dry oats and scoops |
| `room.maple.1` | stock: `girl-painting.jpg` | **3:2** (1200×800) | Late morning, small-group time | Maple Room, 2 – 3 years — the block area, low shelves, tape lines on the mat |
| `room.maple.2` | stock: `teacher-on-the-floor-with-children.jpg` | **3:2** (1200×800) | Any, empty room, lights on | Maple Room, 2 – 3 years — three child-height sinks with a step at each one |
| `room.oak.1` | stock: `child-cutting-with-help.jpg` | **3:2** (1200×800) | Mid-morning, 9:45 project block, work in progress | Oak Room, 3 – 4 years — the project table with a half-built cardboard ramp on it |
| `room.oak.2` | stock: `teacher-and-children-painting.jpg` | **3:2** (1200×800) | Any, natural light from the window side | Oak Room, 3 – 4 years — the library corner, books faced out on low shelves |
| `room.summit.1` | **empty — needs a shot** | **3:2** (1200×800) | Early afternoon, 1:00 journal block | Summit Room, 4 – 5 years — the writing table, journals and pencil cups |
| `room.summit.2` | **empty — needs a shot** | **3:2** (1200×800) | Morning, 9:00 literacy groups | Summit Room, 4 – 5 years — the small-group corner and the magnetic letter board |
| `room.after-school.1` | stock: `children-cutting-paper.jpg` | **3:2** (1200×800) | Afternoon, 3:15 homework hour | After-School Club, 5 – 10 years — four homework tables, club shelves behind |
| `room.after-school.2` | **empty — needs a shot** | **3:2** (1200×800) | Afternoon, 4:15, before the children come in | The gym, set up for the after-school hour |

## The building — 6 files

| Slot | Status | Aspect | Time of day | The shot to take |
|---|---|---|---|---|
| `band.safety` | stock: `empty-room-daylight.jpg` | **8:3** (2400×900) | Morning, 7:15–7:45am, before the first child arrives | A room with nobody in it — chairs still down, materials on the shelf, one window doing the lighting. Shot from the doorway at adult standing height, the way a parent first sees it on the tour. |
| `band.closing` | stock: `playground-golden-hour.jpg` | **2:1** (2400×1200) | Evening, the last 40 minutes before 6:00pm pickup ends | The playground at the end of the day, empty, sun low and behind the structure. Backlit, everything else in shadow. This sits under 'come and see the room your child would be in'. |
| `building.entry` | **empty — needs a shot** | **3:2** (1200×800) | Morning, 7:30–8:30am drop-off | The entry vestibule — sign-in desk, keypad on the inner door. Shot from just inside the outer door. |
| `building.corridor` | **empty — needs a shot** | **3:2** (1200×800) | Any, empty, lights on | The corridor, classroom doors and cubbies along one wall, looking the full length |
| `building.playground` | stock: `playground-golden-hour.jpg` | **3:2** (1200×800) | Mid-morning, 9:15–10:00, low sun | The main playground — climbing structure over poured rubber surfacing, fence visible |
| `building.kitchen` | **empty — needs a shot** | **3:2** (1200×800) | Late morning, 10:30, lunch prep under way | The kitchen — stainless prep counter, menu board above it |

## Staff portraits — 17 slots, all empty

Square crop, head and shoulders. Shoot all 17 in one
session, same background, same light — a page of portraits taken on different
days looks like a page of stock. Marisol Vega's carries the most
weight: it appears on `/book-a-tour`, `/about`, `/staff` and inside the tour
confirmation.

| Slot | Status | Aspect | Time of day | The shot to take |
|---|---|---|---|---|
| `staff.marisol-vega` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Marisol Vega, Director — head and shoulders |
| `staff.ellen-brzozowski` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Ellen Brzozowski, Office Manager — head and shoulders |
| `staff.tanya-okafor` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Tanya Okafor, Lead Teacher, Acorn Room, 6 weeks – 15 months — head and shoulders |
| `staff.priya-raghavan` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Priya Raghavan, Teacher, Acorn Room, 6 weeks – 15 months — head and shoulders |
| `staff.renata-alvarez` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Renata Alvarez, Lead Teacher, Sunflower Room, 15 – 24 months — head and shoulders |
| `staff.jo-feldman` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Jo Feldman, Teacher, Sunflower Room, 15 – 24 months — head and shoulders |
| `staff.camille-boyd` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Camille Boyd, Lead Teacher, Maple Room, 2 – 3 years — head and shoulders |
| `staff.hector-salas` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Hector Salas, Teacher, Maple Room, 2 – 3 years — head and shoulders |
| `staff.nadia-haddad` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Nadia Haddad, Lead Teacher, Oak Room, 3 – 4 years — head and shoulders |
| `staff.will-turnbull` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Will Turnbull, Teacher, Oak Room, 3 – 4 years — head and shoulders |
| `staff.grace-yun` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Grace Yun, Lead Teacher, Summit Room, 4 – 5 years — head and shoulders |
| `staff.marcus-bell` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Marcus Bell, Teacher, Summit Room, 4 – 5 years — head and shoulders |
| `staff.deion-pratt` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Deion Pratt, After-School Coordinator — head and shoulders |
| `staff.sofia-nakamura` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Sofia Nakamura, After-School Teacher — head and shoulders |
| `staff.angie-prokop` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Angie Prokop, Floating Teacher — head and shoulders |
| `staff.sam-whitaker` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Sam Whitaker, Floating Teacher — head and shoulders |
| `staff.rosa-delgado` | **empty — needs a shot** | **1:1** (600×600) | One session, all seventeen, same background and same light | Rosa Delgado, Cook — head and shoulders |

## Other — 2 files

| Slot | Status | Aspect | Time of day | The shot to take |
|---|---|---|---|---|
| `map` | **empty — needs a shot** | **5:3** (1200×720) | n/a | Static map export centered on 1420 Sheldon Avenue. Deliberately not an embedded iframe — it is wrapped in a link that opens the visitor's own maps app. A Google Static Maps or Mapbox export at 2x is fine. |
| `signature` | **empty — needs a shot** | **10:3** (320×96) | n/a | A scan of the director's actual signature, black on white, background removed |

## App icon

`app/icon.svg` (64×64) is generated from the brand palette by
`npm run placeholders`. Replace it with the center's real mark if they have
one; otherwise leave it, since it re-skins automatically.
