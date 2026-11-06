/* Routine levels 1–4. Every level up swaps moves for harder versions — less
   support, one leg at a time, slower, longer levers, then weight and balance —
   not just longer holds. Level 2 is each routine's standard version (and where
   everyone starts). */

/* ---------- easier / harder versions ---------- */
EX_DB.push(
  { name: "Box Squat", pat: "squat", eq: "bw", flags: [] },
  { name: "Tempo Squat", pat: "squat", eq: "bw", flags: [] },
  { name: "Bulgarian Split Squat", pat: "lunge", eq: "bw", flags: ["knee"] },
  { name: "Goblet Reverse Lunge", pat: "lunge", eq: "kb", flags: ["knee"] },
  { name: "Knee Plank", pat: "core", eq: "bw", flags: ["floor"] },
  { name: "Knee Side Plank", pat: "core", eq: "bw", flags: ["floor"] },
  { name: "Side Plank Leg Lift", pat: "core", eq: "bw", flags: ["floor"] },
  { name: "Plank Shoulder Tap", pat: "core", eq: "bw", flags: ["floor"] },
  { name: "Long-Lever Dead Bug", pat: "core", eq: "bw", flags: ["floor"] },
  { name: "Single-Leg Hip Thrust", pat: "hip", eq: "bw", flags: [] },
  { name: "Feet-Elevated Push-up", pat: "pushH", eq: "bw", flags: [] },
  { name: "Tempo Push-up", pat: "pushH", eq: "bw", flags: [] },
  { name: "Close-Grip Push-up", pat: "pushH", eq: "bw", flags: [] },
  { name: "Diamond Push-up", pat: "pushH", eq: "bw", flags: [] },
  { name: "Hammer Curl", pat: "arms", eq: "db", flags: [] },
  { name: "Fire Hydrant", pat: "hip", eq: "bw", flags: ["floor"] }
);
Object.assign(POSE_OF, {
  "Box Squat": "boxSquat", "Tempo Squat": "squat", "Bulgarian Split Squat": "bulgarianSplitSquat", "Goblet Reverse Lunge": "gobletReverseLunge",
  "Knee Plank": "kneePlank", "Knee Side Plank": "kneeSidePlank", "Side Plank Leg Lift": "sidePlankLegLift", "Plank Shoulder Tap": "plankShoulderTap",
  "Long-Lever Dead Bug": "longLeverDeadBug", "Single-Leg Hip Thrust": "singleLegHipThrust", "Feet-Elevated Push-up": "feetElevatedPushUp",
  "Tempo Push-up": "pushUp", "Close-Grip Push-up": "pushUp", "Diamond Push-up": "pushUp", "Hammer Curl": "bicepsCurl", "Fire Hydrant": "fireHydrant"
});
Object.assign(CUE_LIB, {
  "box squat": ["Chair or box behind you", "Sit back until you just touch it", "Stand up without rocking"],
  "tempo squat": ["Take 3 slow seconds to lower", "Pause for a beat at the bottom", "Stand up at normal speed"],
  "bulgarian split squat": ["Back foot up on a chair or couch", "Drop straight down on the front leg", "Front knee tracks over your toes"],
  "goblet reverse lunge": ["Hold the bell at your chest", "Step back and lower your back knee", "Push through the front heel to stand"],
  "knee plank": ["Forearms and knees down", "Straight line from head to knees", "Squeeze your glutes, brace your belly"],
  "knee side plank": ["On your side, elbow under shoulder, knees bent", "Lift your hips off the floor", "Keep a straight line head to knees"],
  "side plank leg lift": ["Side plank, hips high", "Lift the top leg slowly", "Don't let the bottom hip sag"],
  "long-lever dead bug": ["Low back pressed into the floor", "Reach your arm and leg out long and low", "Only go as low as your back stays down"],
  "single-leg hip thrust": ["Shoulders on a couch, one foot down", "Other knee up toward your chest", "Drive the hips up, pause at the top"],
  "feet-elevated push-up": ["Feet up on a chair or couch", "Body in one straight line", "Lower your chest between your hands"],
  "tempo push-up": ["Take 3 slow seconds to lower", "Pause just above the floor", "Push up at normal speed"],
  "close-grip push-up": ["Hands just under your shoulders", "Elbows brush your sides", "Knees down is fine"],
  "diamond push-up": ["Hands together under your chest, thumbs and fingers touching", "Elbows back, not out", "Knees down if you need to"],
  "hammer curl": ["Palms face each other", "Elbows pinned to your sides", "Lower slowly"],
  "fire hydrant": ["On hands and knees, back flat", "Lift one knee out to the side, keeping it bent", "Pause, lower slowly — don't tip your hips"],
  "bodyweight squat": ["Feet shoulder-width, toes slightly out", "Sit back and down, chest up", "Knees track over your toes", "Stand tall and squeeze your glutes"],
  "band pull-apart": ["Arms straight out in front, band at chest height", "Pull the band apart until it touches your chest", "Squeeze your shoulder blades, return slowly"]
});

/* ---------- the ladders ---------- */
var ROUTINE_LEVELS = {
  core: [
    [["Dead Bug", "30s"], ["Bird Dog", "30s"], ["Knee Side Plank", "20s / side"], ["Knee Plank", "30s"], ["Glute Bridge", "40s"], ["Dead Bug", "30s"]],
    null,   // level 2 = the routine's own moves
    [["Long-Lever Dead Bug", "40s"], ["Bird Dog", "40s"], ["Side Plank Leg Lift", "20s / side"], ["Plank Shoulder Tap", "30s"], ["Standing Anti-Rotation Press", "30s / side"], ["Single-Leg Glute Bridge", "30s / side"]],
    [["Long-Lever Dead Bug", "45s"], ["Bear Crawl", "40s"], ["Copenhagen Plank", "20s / side"], ["Ab Wheel Rollout", "30s"], ["Plank Shoulder Tap", "40s"], ["Single-Leg Glute Bridge", "40s / side"]]
  ],
  glutes: [
    [["Glute Bridge", "40s"], ["Clamshell", "30s / side"], ["Lying Leg Abduction", "30s / side"], ["Kickbacks", "30s / side"], ["Glute Bridge", "30s"]],
    null,
    [["Banded Glute Bridge", "45s"], ["Banded Lateral Walk", "45s"], ["Kickbacks", "40s / side"], ["Standing Hip Abduction", "30s / side"], ["Single-Leg Glute Bridge", "30s / side"], ["Glute Bridge Spread", "45s"]],
    [["Single-Leg Hip Thrust", "30s / side"], ["Banded Lateral Walk", "45s"], ["Standing Hip Abduction", "40s / side"], ["Kickbacks", "40s / side"], ["Copenhagen Plank", "20s / side"], ["Glute Bridge Spread", "45s"]]
  ],
  planks: [
    [["Knee Plank", "20s"], ["Knee Side Plank", "15s / side"], ["Bird Dog", "30s"], ["Knee Plank", "20s"]],
    [["Plank", "30s"], ["Side Plank", "20s / side"], ["Bird Dog", "30s"], ["Plank", "30s"]],
    [["Plank", "45s"], ["Side Plank Leg Lift", "20s / side"], ["Plank Shoulder Tap", "30s"], ["Mountain Climber", "30s"], ["Plank", "45s"]],
    [["Plank", "60s"], ["Copenhagen Plank", "20s / side"], ["Plank Shoulder Tap", "40s"], ["Bear Crawl", "40s"], ["Side Plank Leg Lift", "30s / side"], ["Plank", "60s"]]
  ],
  legs: [
    [["Box Squat", "40s"], ["Split Squat", "20s / side"], ["Wall Sit", "20s"], ["Calf Raise", "40s"], ["Glute Bridge", "40s"], ["Box Squat", "30s"]],
    null,
    [["Tempo Squat", "40s"], ["Bulgarian Split Squat", "30s / side"], ["Lateral Lunge", "30s / side"], ["Single-Leg Calf Raise", "30s / side"], ["Single-Leg Glute Bridge", "30s / side"], ["Wall Sit", "45s"]],
    [["Goblet Squat", "45s"], ["Bulgarian Split Squat", "40s / side"], ["Lateral Step-Down", "30s / side"], ["Single-Leg Romanian Deadlift", "30s / side"], ["Single-Leg Calf Raise", "40s / side"], ["Wall Sit", "60s"]]
  ],
  upperq: [
    [["Incline Push-up", "40s"], ["Band Row", "40s"], ["Band Pull-Apart", "40s"], ["Wall Angels", "40s"], ["Incline Push-up", "30s"], ["Band Row", "40s"]],
    null,
    [["Tempo Push-up", "45s"], ["Negative Pull-up", "30s"], ["Pike Push-up", "40s"], ["Band Row", "45s"], ["Band Face Pull", "45s"], ["Push-up", "40s"]],
    [["Feet-Elevated Push-up", "45s"], ["Pull-up", "30s"], ["Pike Push-up", "45s"], ["Band Row", "45s"], ["Diamond Push-up", "40s"], ["Dead Hang", "40s"]]
  ],
  arms: [
    [["Band Biceps Curl", "40s"], ["Band Overhead Triceps Extension", "40s"], ["Incline Push-up", "30s"], ["Band Biceps Curl", "30s"], ["Band Overhead Triceps Extension", "30s"]],
    null,
    [["Hammer Curl", "40s"], ["Overhead Triceps Extension", "40s"], ["Close-Grip Push-up", "30s"], ["DB Biceps Curl", "40s"], ["Band Overhead Triceps Extension", "30s"], ["Hammer Curl", "30s"]],
    [["DB Biceps Curl", "45s"], ["Overhead Triceps Extension", "45s"], ["Diamond Push-up", "30s"], ["Hammer Curl", "40s"], ["Chin-up", "30s"], ["Band Overhead Triceps Extension", "30s"]]
  ],
  shoulders: [
    [["Chin Tucks", "40s"], ["Band Pull-Apart", "40s"], ["Wall Angels", "45s"], ["Doorway Pec Stretch", "30s / side"], ["Band Pull-Apart", "30s"]],
    null,
    [["Band Pull-Apart", "40s"], ["Band Face Pull", "45s"], ["KB Halo", "30s"], ["Band Overhead Press", "45s"], ["Wall Angels", "45s"], ["Dead Hang", "30s"]],
    [["Band Face Pull", "45s"], ["KB Halo", "40s"], ["Pike Push-up", "30s"], ["Overhead Carry", "30s / side"], ["Dead Hang", "40s"], ["Wall Angels", "45s"]]
  ],
  abs: [
    [["Dead Bug", "40s"], ["Knee Plank", "30s"], ["Bird Dog", "30s"], ["Knee Side Plank", "20s / side"], ["Dead Bug", "30s"]],
    null,
    [["Long-Lever Dead Bug", "45s"], ["Bear Crawl", "40s"], ["Plank Shoulder Tap", "40s"], ["Side Plank Leg Lift", "25s / side"], ["Seated Pike Leg Lift", "40s"], ["Mountain Climber", "45s"]],
    [["Ab Wheel Rollout", "30s"], ["Bear Crawl", "40s"], ["Copenhagen Plank", "20s / side"], ["Seated Pike Leg Lift", "40s"], ["Mountain Climber", "45s"], ["Long-Lever Dead Bug", "45s"]]
  ],
  kb: [
    [["KB Deadlift", "40s"], ["Goblet Squat", "40s"], ["KB Row", "30s / side"], ["KB Halo", "30s"], ["Suitcase March", "30s / side"], ["KB Deadlift", "30s"]],
    null,
    [["Goblet Squat", "45s"], ["Single-Leg Romanian Deadlift", "30s / side"], ["KB Row", "40s / side"], ["Half Turkish Get-up", "30s / side"], ["Suitcase Carry", "40s / side"], ["KB Halo", "30s"]],
    [["Goblet Reverse Lunge", "30s / side"], ["Single-Leg Romanian Deadlift", "40s / side"], ["Half Turkish Get-up", "40s / side"], ["Single-Arm KB Press", "40s / side"], ["Overhead Carry", "30s / side"], ["Goblet Squat", "45s"]]
  ],
  express: [
    [["Box Squat", "40s"], ["Incline Push-up", "30s"], ["Split Squat", "20s / side"], ["Band Row", "40s"], ["Glute Bridge", "40s"], ["Knee Plank", "30s"]],
    null,
    [["Tempo Squat", "40s"], ["Tempo Push-up", "30s"], ["Reverse Lunge", "40s / side"], ["Band Row", "45s"], ["Single-Leg Glute Bridge", "30s / side"], ["Plank Shoulder Tap", "30s"]],
    [["Goblet Squat", "45s"], ["Feet-Elevated Push-up", "40s"], ["Bulgarian Split Squat", "30s / side"], ["Band Row", "45s"], ["Single-Leg Romanian Deadlift", "30s / side"], ["Bear Crawl", "40s"]]
  ],
  kot: [
    [["Backward Walk", "60s"], ["Tibialis Raise", "40s"], ["Calf Raise", "40s"], ["Patrick Step", "30s / side"], ["Split Squat", "30s / side"], ["Box Squat", "30s"], ["Kneeling Hip Flexor Stretch", "30s / side"], ["Seated Pike Leg Lift", "20s"]],
    [["Backward Walk", "60s"], ["Tibialis Raise", "40s"], ["KOT Calf Raise", "40s"], ["Patrick Step", "30s / side"], ["ATG Split Squat", "30s / side"], ["Slant Board Squat", "30s"], ["Kneeling Hip Flexor Stretch", "30s / side"], ["Seated Pike Leg Lift", "30s"]],
    [["Backward Walk", "75s"], ["Tibialis Raise", "45s"], ["KOT Calf Raise", "45s"], ["Lateral Step-Down", "40s / side"], ["ATG Split Squat", "40s / side"], ["Reverse Nordic", "40s"], ["Couch Stretch", "40s / side"], ["Seated Pike Leg Lift", "40s"]],
    [["Backward Walk", "90s"], ["Tibialis Raise", "50s"], ["Poliquin Step-Up", "40s / side"], ["ATG Split Squat", "45s / side"], ["Nordic Curl", "30s"], ["Reverse Nordic", "45s"], ["Couch Stretch", "45s / side"], ["Seated Pike Leg Lift", "45s"]]
  ],
  functional: [
    [["KB Halo", "30s"], ["KB Deadlift", "40s"], ["Dead Bug", "40s"], ["Bird Dog", "40s"], ["Glute Bridge", "40s"], ["Standing Anti-Rotation Press", "30s / side"]],
    [["KB Halo", "30s"], ["KB Deadlift", "40s"], ["Suitcase March", "30s / side"], ["Dead Bug", "40s"], ["Farmer Carry", "40s"], ["Bird Dog", "40s"]],
    [["KB Halo", "30s"], ["KB Deadlift", "45s"], ["Farmer Carry", "40s"], ["Bear Crawl", "30s"], ["Half-Kneeling Band Chop", "30s / side"], ["Suitcase Carry", "30s / side"]],
    [["KB Halo", "40s"], ["Single-Leg Romanian Deadlift", "40s / side"], ["Half Turkish Get-up", "40s / side"], ["Overhead Carry", "30s / side"], ["Bear Crawl", "45s"], ["Copenhagen Plank", "20s / side"]]
  ],
  power: [
    [["Bodyweight Squat", "40s"], ["Step-Up", "30s / side"], ["KB Deadlift", "40s"], ["Incline Push-up", "30s"], ["Glute Bridge", "40s"], ["Standing Knee Raise", "30s"]],
    [["Squat-to-Stand Pulse", "40s"], ["Fast Step-Up", "30s / side"], ["KB Deadlift", "40s"], ["Push-up", "30s"], ["Mountain Climber", "30s"], ["Glute Bridge", "40s"]],
    [["Pogo Hops", "20s"], ["Fast Step-Up", "30s / side"], ["KB Deadlift", "45s"], ["A-Skip", "30s"], ["Bear Crawl", "40s"], ["Squat-to-Stand Pulse", "40s"], ["Pogo Hops", "20s"]],
    [["Pogo Hops", "30s"], ["A-Skip", "30s"], ["Skater Hop", "40s"], ["Broad Jump", "30s"], ["Fast Step-Up", "40s / side"], ["Push-up", "30s"]]
  ]
};
var ROUTINE_BLURBS = {
  legs: "Squats and lunges — Level 4 adds a weight",
  upperq: "Push-ups and bands — a pull-up bar from Level 3",
  power: "Get springy — Levels 1 and 2 have no jumping"
};
/* Glute Activation: stretch the glutes, then switch them on — before a run, leg
   day, or whenever the hips and SI feel stiff. Sits near the top of Stretch. */
ROUTINES.splice(1, 0, { id: "gluteact", kind: "stretch", title: "Glute Activation", pose: "fireHydrant", bg: "#D8B44E",
  blurb: "Stretch and switch on your glutes — great before a run or leg day",
  levels: [
    [["Knees to Chest", "40s"], ["Glute Bridge", "40s"], ["Figure-4 Stretch", "30s / side"], ["Clamshell", "30s / side"], ["Lying Leg Abduction", "30s / side"], ["Child's Pose", "40s"]],
    [["Figure-4 Stretch", "30s / side"], ["Glute Bridge", "45s"], ["Clamshell", "30s / side"], ["Fire Hydrant", "30s / side"], ["Kickbacks", "30s / side"], ["90/90 Hip Stretch", "30s / side"]],
    [["Pigeon Stretch", "40s / side"], ["Banded Glute Bridge", "45s"], ["Banded Lateral Walk", "40s"], ["Fire Hydrant", "40s / side"], ["Single-Leg Glute Bridge", "30s / side"], ["90/90 Hip Stretch", "40s / side"]],
    [["Pigeon Stretch", "45s / side"], ["Single-Leg Hip Thrust", "30s / side"], ["Banded Lateral Walk", "45s"], ["Standing Hip Abduction", "40s / side"], ["Single-Leg Romanian Deadlift", "30s / side"], ["90/90 Hip Stretch", "45s / side"]]
  ] });
ROUTINES[1].moves = ROUTINES[1].levels[1];
ROUTINES.forEach(function (r) {
  var L = ROUTINE_LEVELS[r.id]; if (!L) return;
  r.levels = L.map(function (lv) { return lv || r.moves; });
  r.moves = r.levels[1];
  if (ROUTINE_BLURBS[r.id]) r.blurb = ROUTINE_BLURBS[r.id];
});
