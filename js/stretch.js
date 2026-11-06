/* Stretches, Bend-style routines, cool-downs and the exercise → drawing map. */

// stretch / mobility moves: drawing + 2–3 plain-English cues
var STRETCHES = {
  "Cat-Cow": { pose: "catCow", cues: ["Round your back up as you breathe out", "Let your belly drop and look up as you breathe in", "Move slowly with your breath"] },
  "Child's Pose": { pose: "childsPose", cues: ["Knees wide, big toes together", "Sink your hips back toward your heels", "Reach long and breathe into your back"] },
  "Kneeling Hip Flexor Stretch": { pose: "hipFlexor", cues: ["Back knee down, front foot flat", "Squeeze the back glute and tuck your tailbone", "Shift forward until the front of the hip stretches"] },
  "Figure-4 Stretch": { pose: "figure4", cues: ["On your back, cross one ankle over the other knee", "Pull the bottom thigh toward your chest", "Keep your head and shoulders relaxed"] },
  "Knees to Chest": { pose: "kneesToChest", cues: ["Hug both knees in", "Let your low back sink into the floor", "Rock gently side to side if it feels good"] },
  "Lying Twist": { pose: "supineTwist", cues: ["Knees bent, let them fall to one side", "Keep both shoulders on the floor", "Go only as far as feels easy"] },
  "Lying Hamstring Stretch": { pose: "lyingHamstring", cues: ["Band or towel around one foot", "Raise the straight leg until you feel the back of the thigh", "Keep the other leg relaxed"] },
  "Pigeon Stretch": { pose: "pigeon", cues: ["Front shin across, back leg long", "Keep your hips square", "Use a pillow under the hip if it's tight"] },
  "Butterfly Stretch": { pose: "butterfly", cues: ["Soles of the feet together", "Sit tall and let your knees drop", "Hinge forward a little for more"] },
  "World's Greatest Stretch": { pose: "worldsGreatest", cues: ["Step into a deep lunge", "Hand down inside the front foot", "Rotate and reach the other arm to the ceiling"] },
  "Thread the Needle": { pose: "threadNeedle", cues: ["From hands and knees, slide one arm under you", "Rest your shoulder and head down", "Breathe into the upper back"] },
  "Doorway Pec Stretch": { pose: "doorwayPec", cues: ["Forearm on the door frame at shoulder height", "Step through gently", "Keep your ribs down — feel it across the chest"] },
  "Sphinx": { pose: "sphinx", cues: ["Lie on your stomach, up on your forearms", "Let your low back relax", "Shoulders down away from your ears"] },
  "Standing Forward Fold": { pose: "forwardFold", cues: ["Soft knees, fold from the hips", "Let your head and arms hang", "Sway gently side to side"] },
  "Standing Quad Stretch": { pose: "quadStretch", cues: ["Hold a wall for balance", "Pull your heel toward your glute", "Knees together, stand tall"] },
  "Calf Stretch": { pose: "calfStretch", cues: ["Hands on a wall, one leg back", "Back heel down, back knee straight", "Lean in until the calf stretches"] },
  "Downward Dog": { pose: "downDog", cues: ["Hips up and back", "Press the floor away", "Bend your knees if your hamstrings are tight"] },
  "Happy Baby": { pose: "happyBaby", cues: ["On your back, hold the outsides of your feet", "Knees wide toward your armpits", "Rock gently"] },
  "90/90 Hip Stretch": { pose: "ninetyNinety", cues: ["Both knees bent at 90°", "Sit tall over the front leg", "Lean forward a little for more"] },
  "Legs Up the Wall": { pose: "legsUpWall", cues: ["Scoot your hips close to a wall", "Rest your legs up the wall", "Slow, deep breaths"] },
  "Deep Breathing": { pose: "breathing", cues: ["Lie flat and get comfortable", "Breathe in for 4, out for 6", "Let your whole body get heavy"] },
  "Pelvic Tilts": { pose: "pelvicTilt", cues: ["On your back, knees bent", "Gently flatten your low back, then release", "Small, slow and easy"] },
  "Open Book": { pose: "openBook", cues: ["Lie on your side, knees stacked", "Open the top arm across like a book", "Follow your hand with your eyes"] },
  "Standing Side Stretch": { pose: "sideStretch", cues: ["Reach one arm overhead", "Lean gently to the side", "Keep both feet grounded"] },
  "Chin Tucks": { pose: "chinTuck", cues: ["Sit tall", "Slide your chin straight back — make a double chin", "Hold 2 seconds, relax, repeat"] },
  "Neck Side Stretch": { pose: "neckStretch", cues: ["Sit tall, shoulders down", "Tilt your ear toward your shoulder", "Rest your hand on your head — no pulling"] },
  "Wall Angels": { pose: "wallAngel", cues: ["Back, head and arms against the wall", "Slide your arms up and down slowly", "Keep your low back gently on the wall"] },
  "Leg Swings": { pose: "legSwing", cues: ["Hold something for balance", "Swing one leg forward and back", "Start small, get bigger"] },
  "Arm Circles": { pose: "armCircles", cues: ["Arms straight out to the sides", "Small circles, getting bigger", "Switch direction halfway"] },
  "Hip Circles": { pose: "hipCircles", cues: ["Hands on hips, feet hip-width", "Draw big slow circles with your hips", "Switch direction halfway"] },
  "Thoracic Rotation": { pose: "thoracicRotation", cues: ["On hands and knees, one hand behind your head", "Rotate your elbow up to the ceiling", "Follow it with your eyes"] }
};

// Bend-style routines. scheme: "45s" or "30s / side". Minutes are worked out from the moves.
var ROUTINES = [
  { id: "wake", kind: "stretch", title: "Morning Wake-Up", pose: "hipFlexor", bg: "#4E8C8C",
    blurb: "Loosen up hips, back and shoulders",
    moves: [["Cat-Cow", "45s"], ["World's Greatest Stretch", "30s / side"], ["Standing Side Stretch", "20s / side"], ["Standing Forward Fold", "40s"], ["Kneeling Hip Flexor Stretch", "30s / side"]] },
  { id: "hips", kind: "stretch", title: "Hips & SI Joint", pose: "figure4", bg: "#93688A",
    blurb: "Gentle moves that calm the SI joint",
    moves: [["Pelvic Tilts", "45s"], ["Knees to Chest", "45s"], ["Figure-4 Stretch", "30s / side"], ["Kneeling Hip Flexor Stretch", "30s / side"], ["90/90 Hip Stretch", "30s / side"], ["Butterfly Stretch", "45s"], ["Child's Pose", "45s"]] },
  { id: "back", kind: "stretch", title: "Low Back Relief", pose: "kneesToChest", bg: "#A89A8A",
    blurb: "Ease a tight or achy low back",
    moves: [["Pelvic Tilts", "45s"], ["Knees to Chest", "45s"], ["Lying Twist", "30s / side"], ["Cat-Cow", "45s"], ["Child's Pose", "60s"], ["Sphinx", "30s"], ["Lying Hamstring Stretch", "30s / side"]] },
  { id: "posture", kind: "stretch", title: "Posture Reset", pose: "doorwayPec", bg: "#9AA36A",
    blurb: "Undo hunching — chest, neck, upper back",
    moves: [["Chin Tucks", "40s"], ["Doorway Pec Stretch", "30s / side"], ["Thread the Needle", "30s / side"], ["Wall Angels", "45s"], ["Open Book", "30s / side"], ["Cat-Cow", "40s"]] },
  { id: "run", kind: "stretch", title: "After a Run", pose: "calfStretch", bg: "#6E9CC4",
    blurb: "Calves, quads, hamstrings and hips",
    moves: [["Standing Quad Stretch", "30s / side"], ["Calf Stretch", "30s / side"], ["Lying Hamstring Stretch", "30s / side"], ["Kneeling Hip Flexor Stretch", "30s / side"], ["Figure-4 Stretch", "30s / side"]] },
  { id: "bed", kind: "stretch", title: "Bedtime Wind-Down", pose: "childsPose", bg: "#5560A8",
    blurb: "Slow stretches to switch off",
    moves: [["Child's Pose", "60s"], ["Lying Twist", "30s / side"], ["Happy Baby", "45s"], ["Butterfly Stretch", "45s"], ["Legs Up the Wall", "60s"], ["Deep Breathing", "60s"]] },
  { id: "full", kind: "stretch", title: "Full-Body Flexibility", pose: "downDog", bg: "#D8B44E",
    blurb: "Head to toe in ten minutes",
    moves: [["Cat-Cow", "45s"], ["Downward Dog", "40s"], ["World's Greatest Stretch", "30s / side"], ["Pigeon Stretch", "30s / side"], ["Lying Hamstring Stretch", "30s / side"], ["Butterfly Stretch", "45s"], ["Thread the Needle", "30s / side"], ["Standing Side Stretch", "20s / side"], ["Standing Forward Fold", "40s"], ["Child's Pose", "45s"]] },
  { id: "core", kind: "strength", title: "Core", pose: "deadBug", bg: "#7C8FB8",
    blurb: "Back-friendly core, no crunches",
    moves: [["Dead Bug", "40s"], ["Bird Dog", "40s"], ["Side Plank", "20s / side"], ["Plank", "30s"], ["Glute Bridge", "40s"], ["Dead Bug", "40s"]] },
  { id: "glutes", kind: "strength", title: "Glutes", pose: "gluteBridge", bg: "#A08BD6",
    blurb: "Booty band burner",
    moves: [["Glute Bridge", "40s"], ["Clamshell", "30s / side"], ["Banded Lateral Walk", "40s"], ["Kickbacks", "30s / side"], ["Lying Leg Abduction", "30s / side"], ["Single-Leg Glute Bridge", "20s / side"], ["Glute Bridge Spread", "40s"]] },
  { id: "planks", kind: "strength", title: "Planks", pose: "sidePlank", bg: "#93688A",
    blurb: "A rock-solid middle — level up as you go",
    moves: [["Plank", "20s"], ["Side Plank", "15s / side"], ["Bird Dog", "30s"], ["Plank", "20s"]],
    levels: [
      [["Plank", "20s"], ["Side Plank", "15s / side"], ["Bird Dog", "30s"], ["Plank", "20s"]],
      [["Plank", "30s"], ["Side Plank", "20s / side"], ["Bird Dog", "30s"], ["Plank", "40s"]],
      [["Plank", "45s"], ["Side Plank", "30s / side"], ["Mountain Climber", "30s"], ["Bird Dog", "40s"], ["Plank", "45s"]],
      [["Plank", "60s"], ["Side Plank", "40s / side"], ["Mountain Climber", "40s"], ["Dead Bug", "40s"], ["Side Plank", "30s / side"], ["Plank", "60s"]]
    ] },
  { id: "legs", kind: "strength", title: "Legs", pose: "splitSquat", bg: "#5560A8",
    blurb: "Bodyweight legs, anywhere",
    moves: [["Bodyweight Squat", "40s"], ["Reverse Lunge", "30s / side"], ["Wall Sit", "30s"], ["Calf Raise", "40s"], ["Glute Bridge", "40s"], ["Bodyweight Squat", "30s"]] },
  { id: "upperq", kind: "strength", title: "Upper Body", pose: "pushUp", bg: "#6E9A8B",
    blurb: "Push-ups and bands, anywhere",
    moves: [["Push-up", "40s"], ["Band Row", "40s"], ["Band Overhead Press", "40s"], ["Band Pull-Apart", "40s"], ["Kneeling Push-up", "30s"], ["Band Row", "40s"]] },
  { id: "arms", kind: "strength", title: "Arms", pose: "bicepsCurl", bg: "#D8B44E",
    blurb: "Biceps and triceps finisher",
    moves: [["DB Biceps Curl", "40s"], ["Overhead Triceps Extension", "40s"], ["Band Biceps Curl", "30s"], ["Band Overhead Triceps Extension", "30s"], ["Kneeling Push-up", "30s"], ["DB Biceps Curl", "30s"]] },
  { id: "shoulders", kind: "strength", title: "Shoulders & Posture", pose: "facePull", bg: "#4E8C8C",
    blurb: "Stand taller — bands only",
    moves: [["Band Pull-Apart", "40s"], ["Band Face Pull", "40s"], ["Band Overhead Press", "40s"], ["Wall Angels", "45s"], ["Band Pull-Apart", "30s"]] },
  { id: "abs", kind: "strength", title: "Abs", pose: "mountainClimber", bg: "#9AA36A",
    blurb: "Six minutes, no crunches",
    moves: [["Dead Bug", "40s"], ["Mountain Climber", "30s"], ["Plank", "30s"], ["Standing Anti-Rotation Press", "30s / side"], ["Side Plank", "20s / side"], ["Bird Dog", "30s"]] },
  { id: "kb", kind: "strength", title: "Kettlebell 10", pose: "suitcaseCarry", bg: "#A08BD6",
    blurb: "One kettlebell, whole body",
    moves: [["Goblet Squat", "40s"], ["KB Row", "30s / side"], ["Romanian Deadlift", "40s"], ["Single-Arm KB Press", "30s / side"], ["Suitcase Carry", "30s / side"], ["Goblet Squat", "30s"]] },
  { id: "express", kind: "strength", title: "Full Body Express", pose: "squat", bg: "#7C8FB8",
    blurb: "Short on time? Hit everything",
    moves: [["Bodyweight Squat", "40s"], ["Push-up", "30s"], ["Reverse Lunge", "30s / side"], ["Band Row", "40s"], ["Glute Bridge", "40s"], ["Plank", "30s"]] }
];

// short cool-down added to the end of each plan session (skippable in the player)
var COOLDOWNS = {
  "anthony:a": [["Kneeling Hip Flexor Stretch", "30s / side"], ["Figure-4 Stretch", "30s / side"], ["Child's Pose", "40s"]],
  "anthony:b": [["Knees to Chest", "40s"], ["Lying Hamstring Stretch", "30s / side"], ["Figure-4 Stretch", "30s / side"]],
  "anthony:c": [["Kneeling Hip Flexor Stretch", "30s / side"], ["Thread the Needle", "30s / side"], ["Child's Pose", "40s"]],
  "anthony:push": [["Thread the Needle", "30s / side"], ["Child's Pose", "40s"]],
  "anthony:pull": [["Child's Pose", "40s"], ["Thread the Needle", "30s / side"], ["Knees to Chest", "40s"]],
  "anthony:legs": [["Kneeling Hip Flexor Stretch", "30s / side"], ["Figure-4 Stretch", "30s / side"], ["Child's Pose", "40s"]],
  "anthony:lower": [["Knees to Chest", "40s"], ["Lying Hamstring Stretch", "30s / side"], ["Figure-4 Stretch", "30s / side"]],
  "anthony:upper": [["Doorway Pec Stretch", "30s / side"], ["Child's Pose", "40s"]],
  "anthony:core": [["Knees to Chest", "40s"], ["Kneeling Hip Flexor Stretch", "30s / side"], ["Child's Pose", "40s"]],
  "her:a": [["Figure-4 Stretch", "30s / side"], ["Kneeling Hip Flexor Stretch", "30s / side"]],
  "her:c": [["Doorway Pec Stretch", "30s / side"], ["Child's Pose", "40s"]],
  "default:strength": [["Kneeling Hip Flexor Stretch", "30s / side"], ["Child's Pose", "40s"]]
};

// which routine "Today's stretch" suggests, by person (cycles by day)
var STRETCH_PICKS = {
  anthony: ["hips", "wake", "posture", "back"],
  her: ["wake", "full", "hips", "bed"],
  "default": ["wake", "full", "posture", "bed"]
};

// exercise name → drawing
var POSE_OF = {
  "Ab Wheel Rollout": "abWheel", "Adductor Squeeze": "adductorSqueeze", "Assisted Chin-up": "pullUp", "Back Extension": "backExtension",
  "Band Biceps Curl": "bicepsCurl", "Band Face Pull": "facePull", "Band Lat Pulldown": "latPulldown", "Band Overhead Press": "standingPress",
  "Band Overhead Triceps Extension": "tricepsOverhead", "Band Pull-Apart": "pullApart", "Band Row": "bandRow", "Banded Glute Bridge": "bandedBridge",
  "Banded Lateral Walk": "lateralWalk", "Barbell Bench Press": "benchPressBar", "Barbell Hip Thrust": "hipThrustBar", "Barbell Romanian Deadlift": "rdl",
  "Bird Dog": "birdDog", "Cable Face Pull": "facePull", "Cable Kickback": "cableKickback", "Chest-Supported Machine Row": "chestSupportedRow",
  "Chin-up": "pullUp", "Clamshell": "clamshell", "DB Bench Press": "benchPress", "DB Biceps Curl": "bicepsCurl", "DB Hip Thrust": "hipThrust",
  "DB Romanian Deadlift": "rdl", "Dead Bug": "deadBug", "Doorway Pec Stretch": "doorwayPec", "Double Pulse Squat": "squat", "Glute Bridge": "gluteBridge",
  "Glute Bridge Spread": "bandedBridge", "Goblet Squat": "gobletSquat", "Incline DB Press": "inclinePress", "Isolated Hip Thrust": "hipThrust",
  "KB Row": "oneArmRow", "Kickbacks": "donkeyKick", "Kneeling Push-up": "kneelingPushUp", "Lat Pulldown": "latPulldown", "Leg Press": "legPress",
  "Lying Leg Abduction": "lyingAbduction", "Machine Chest Press": "machineChestPress", "Machine Shoulder Press": "seatedShoulderPress",
  "One-Arm DB Row": "oneArmRow", "Overhead Triceps Extension": "tricepsOverhead", "Pull-up": "pullUp", "Push-up": "pushUp",
  "Seated Cable Row": "seatedCableRow", "Seated DB Shoulder Press": "seatedShoulderPress", "Side Plank": "sidePlank",
  "Single-Leg Glute Bridge": "singleLegBridge", "Split Squat": "splitSquat", "Squat Side Step": "lateralWalk", "Standing Anti-Rotation Press": "pallofPress",
  "ATG Split Squat": "splitSquat", "Band Chest Press": "pallofPress", "Band-Assisted Pull-up": "pullUp", "Barbell Back Squat": "squat",
  "Barbell Deadlift": "deadlift", "Barbell Overhead Press": "standingPress", "Bent-Over Band Row": "bandRow", "Bent-Over KB Row": "oneArmRow",
  "Bodyweight Squat": "squat", "Burpee": "mountainClimber", "Calf Raise": "calfRaise", "DB Overhead Press": "standingPress", "DB Row": "oneArmRow",
  "Doorway Row": "bandRow", "Fast Step-Up": "stepUp", "High Knees": "run", "Incline Push-up": "pushUp", "Inverted Row": "bandRow", "Jump Squat": "squat",
  "KB Swing": "kbSwing", "KB Swing (finisher)": "kbSwing", "KOT Calf Raise": "calfRaise", "Lateral Lunge": "lateralLunge", "Machine Row": "seatedCableRow",
  "Mountain Climber": "mountainClimber", "Negative Pull-up": "pullUp", "Pike Push-up": "downDog", "Plank": "plank", "Renegade Row": "pushUp",
  "Reverse Lunge": "reverseLunge", "Romanian Deadlift": "rdl", "Scap Pull-up": "pullUp", "Seated Calf Raise": "calfRaise",
  "Single-Arm KB Press": "standingPress", "Single-Leg Calf Raise": "calfRaise", "Single-Leg Romanian Deadlift": "rdl", "Slant Board Squat": "squat",
  "Squat-to-Stand Pulse": "squat", "Standing Hip Abduction": "standingAbduction", "Standing Knee Raise": "walk", "Step-Up": "stepUp",
  "Suitcase Carry": "suitcaseCarry", "Table Row": "bandRow", "Torso Twists": "torsoTwist", "Treadmill walk": "walk", "Wall Sit": "wallSit"
};
// last resort for names not listed: match the movement
var POSE_RULES = [
  [/stretch|fold|pose/i, "hipFlexor"], [/goblet/i, "gobletSquat"], [/squat|sit/i, "squat"], [/deadlift|rdl|hinge|good morning/i, "rdl"],
  [/incline/i, "inclinePress"], [/bench|chest press|fly/i, "benchPress"], [/push-?up/i, "pushUp"], [/pull-?up|chin/i, "pullUp"],
  [/pulldown/i, "latPulldown"], [/face pull/i, "facePull"], [/row/i, "bandRow"], [/press/i, "standingPress"], [/curl/i, "bicepsCurl"],
  [/tricep|extension/i, "tricepsOverhead"], [/lunge|step/i, "reverseLunge"], [/thrust/i, "hipThrust"], [/bridge/i, "gluteBridge"],
  [/plank/i, "plank"], [/calf/i, "calfRaise"], [/bug/i, "deadBug"], [/abduct|clam/i, "lyingAbduction"], [/run|jog|sprint/i, "run"],
  [/walk|march|carry/i, "walk"]
];

/* ---------- Knees Over Toes, functional strength and power moves ----------
   Added from two research passes. Jumps carry the "impact" flag so they never
   show up as swaps; anything that loads a rounded spine was left out. */
EX_DB.push(
  { name: "Lateral Step-Down", pat: "lunge", eq: "bw", flags: [] },
  { name: "Patrick Step", pat: "lunge", eq: "bw", flags: [] },
  { name: "Poliquin Step-Up", pat: "lunge", eq: "bw", flags: [] },
  { name: "Tibialis Raise", pat: "calf", eq: "bw", flags: [] },
  { name: "Backward Walk", pat: "cond", eq: "bw", flags: [] },
  { name: "Backward Sled Drag", pat: "cond", eq: "machine", flags: [] },
  { name: "Nordic Curl", pat: "hinge", eq: "bw", flags: [] },
  { name: "Reverse Nordic", pat: "squat", eq: "bw", flags: [] },
  { name: "Seated Pike Leg Lift", pat: "core", eq: "bw", flags: [] },
  { name: "KB Halo", pat: "core", eq: "kb", flags: [] },
  { name: "Suitcase March", pat: "core", eq: "kb", flags: [] },
  { name: "Farmer Carry", pat: "core", eq: "db", flags: [] },
  { name: "Overhead Carry", pat: "core", eq: "db", flags: ["overhead"] },
  { name: "KB Deadlift", pat: "hinge", eq: "kb", flags: [] },
  { name: "Half Turkish Get-up", pat: "core", eq: "kb", flags: ["overhead"] },
  { name: "Bear Crawl", pat: "core", eq: "bw", flags: ["floor"] },
  { name: "Half-Kneeling Band Chop", pat: "core", eq: "band", flags: [] },
  { name: "Copenhagen Plank", pat: "hip", eq: "bw", flags: [] },
  { name: "Dead Hang", pat: "pullV", eq: "bar", flags: [] },
  { name: "Pogo Hops", pat: "cond", eq: "bw", flags: ["impact"] },
  { name: "A-Skip", pat: "cond", eq: "bw", flags: ["impact"] },
  { name: "Skater Hop", pat: "cond", eq: "bw", flags: ["impact"] },
  { name: "Broad Jump", pat: "cond", eq: "bw", flags: ["impact"] },
  { name: "Med-Ball Chest Pass", pat: "pushH", eq: "machine", flags: [] },
  { name: "Sled Push", pat: "cond", eq: "machine", flags: [] }
);
STRETCHES["Couch Stretch"] = { pose: "couchStretch", cues: ["Back knee down by a wall, shin up the wall", "Squeeze the back glute and tuck your pelvis", "Stay tall — no arching your low back"] };
STRETCHES["Elephant Walk"] = { pose: "elephantWalk", cues: ["Fold forward, palms on the floor (or a bench)", "Bend one knee as the other straightens", "Keep it slow and easy on the hamstrings"] };
Object.assign(CUE_LIB, {
  "lateral step-down": ["Stand side-on on a step", "Slowly lower until your heel just kisses the floor — 3 seconds", "Knee tracks over your second toe", "Push back up through the standing foot"],
  "patrick step": ["Stand on a low step, heel stays down", "Drive your knee forward past your toes", "Free leg straight — tap its heel in front"],
  "poliquin step-up": ["Front heel propped up on a wedge or plate", "Push the knee forward, then straighten fully", "Lower slowly"],
  "tibialis raise": ["Back against a wall, heels 1–2 feet out", "Pull your toes up toward your shins", "Pause at the top, lower slowly"],
  "backward walk": ["Walk backward reaching onto your toes", "Chest up, short steps", "Feel the front of your thighs work"],
  "backward sled drag": ["Hold the straps with long arms, lean back slightly", "Walk backward on your toes", "Knees travel forward over your toes"],
  "nordic curl": ["Ankles locked under the pad, squeeze your glutes", "Straight line from knees to head", "Lower as slowly as you can — catch yourself with your hands"],
  "reverse nordic": ["Kneel tall, glutes tight", "Lean back in one straight line — no bending at the hips", "Only go as far as you can control"],
  "seated pike leg lift": ["Sit tall, legs straight, hands beside your knees", "Lift both heels an inch off the floor", "Toes pointed — small lifts are plenty"],
  "kb halo": ["Hold the bell upside-down by the horns", "Circle it slowly around your head, close to your head", "Ribs down, glutes tight — 5 each way"],
  "suitcase march": ["One bell at your side, stand tall", "Lift a knee to hip height, slowly", "Don't lean toward the bell"],
  "farmer carry": ["A weight in each hand, stand tall", "Shoulders down and back", "Short, quiet steps"],
  "overhead carry": ["Lock the weight straight overhead, biceps by your ear", "Ribs down — don't lean back", "Walk slowly"],
  "kb deadlift": ["Bell between your feet", "Hips back, flat back, grab the handle", "Stand up by squeezing your glutes"],
  "half turkish get-up": ["Arm straight up, eyes on the bell", "Roll to your elbow, then to your hand", "Reverse slowly"],
  "bear crawl": ["Hands and toes, knees an inch off the floor", "Back flat as a table", "Move opposite hand and foot slowly"],
  "band chop": ["Half-kneeling, band from a high anchor", "Pull high to low across your body", "Hips and chest stay square — only the arms move"],
  "copenhagen plank": ["Side plank with the top knee on a bench", "Straight line from head to knee", "Start short — 10 to 15 seconds"],
  "dead hang": ["Full grip on the bar", "Let your body hang long, breathe", "Drop down before your grip fails"],
  "pogo hops": ["Small, quick bounces off the balls of your feet", "Stiff ankles, soft and quiet", "Stop if your back or knees complain"],
  "a-skip": ["Knee to hip height, toes up", "Land under your hip on the ball of the foot", "Opposite arm drives forward"],
  "skater hop": ["Push off sideways onto one leg", "Hold the landing for a second", "Knee over toes, chest forward"],
  "broad jump": ["Swing your arms and jump out, not up", "Land soft with bent knees", "Hold the landing 2 seconds, walk back"],
  "chest pass": ["Stand facing a wall", "Step and push the ball hard from your chest", "Catch soft and reset"],
  "sled push": ["Hands on the poles, body at 45°", "Long arms, drive your knees", "Short powerful steps"]
});
// no matching demo video yet: show the "Find a video" link instead of a wrong one
["lateral step-down", "patrick step", "poliquin step-up", "tibialis raise", "backward walk", "backward sled drag", "nordic curl", "reverse nordic",
 "seated pike leg lift", "kb halo", "suitcase march", "farmer carry", "overhead carry", "kb deadlift", "half turkish get-up", "bear crawl", "band chop",
 "copenhagen plank", "dead hang", "pogo hops", "a-skip", "skater hop", "broad jump", "med-ball chest pass", "sled push", "couch stretch", "elephant walk"]
  .forEach(function (k) { if (!VIDEO_LIB[k]) VIDEO_LIB[k] = []; });
Object.assign(POSE_OF, {
  "Lateral Step-Down": "lateralStepDown", "Patrick Step": "patrickStep", "Poliquin Step-Up": "stepUp", "Tibialis Raise": "tibialisRaise",
  "Backward Walk": "backwardWalk", "Backward Sled Drag": "sledDrag", "Nordic Curl": "nordicCurl", "Reverse Nordic": "reverseNordic",
  "Seated Pike Leg Lift": "seatedPike", "KB Halo": "kbHalo", "Suitcase March": "suitcaseMarch", "Farmer Carry": "suitcaseCarry",
  "Overhead Carry": "overheadCarry", "KB Deadlift": "rdl", "Half Turkish Get-up": "halfTGU", "Bear Crawl": "bearCrawl",
  "Half-Kneeling Band Chop": "bandChop", "Copenhagen Plank": "copenhagen", "Dead Hang": "deadHang", "Pogo Hops": "pogo",
  "A-Skip": "aSkip", "Skater Hop": "skater", "Broad Jump": "broadJump", "Med-Ball Chest Pass": "medballPass", "Sled Push": "sledPush"
});
ROUTINES.push(
  { id: "kot", kind: "strength", title: "Knees Over Toes", pose: "lateralStepDown", bg: "#6E9CC4",
    blurb: "Bulletproof knees, ankles and hips",
    moves: [["Backward Walk", "60s"], ["Tibialis Raise", "40s"], ["KOT Calf Raise", "40s"], ["Patrick Step", "30s / side"], ["ATG Split Squat", "30s / side"], ["Slant Board Squat", "30s"], ["Kneeling Hip Flexor Stretch", "30s / side"], ["Seated Pike Leg Lift", "30s"]],
    levels: [
      [["Backward Walk", "60s"], ["Tibialis Raise", "40s"], ["KOT Calf Raise", "40s"], ["Patrick Step", "30s / side"], ["ATG Split Squat", "30s / side"], ["Slant Board Squat", "30s"], ["Kneeling Hip Flexor Stretch", "30s / side"], ["Seated Pike Leg Lift", "30s"]],
      [["Backward Walk", "60s"], ["Tibialis Raise", "40s"], ["KOT Calf Raise", "40s"], ["Lateral Step-Down", "30s / side"], ["ATG Split Squat", "30s / side"], ["Reverse Nordic", "30s"], ["Couch Stretch", "30s / side"], ["Seated Pike Leg Lift", "30s"]],
      [["Backward Walk", "75s"], ["Tibialis Raise", "45s"], ["KOT Calf Raise", "45s"], ["Lateral Step-Down", "40s / side"], ["ATG Split Squat", "40s / side"], ["Reverse Nordic", "40s"], ["Couch Stretch", "40s / side"], ["Seated Pike Leg Lift", "40s"]],
      [["Backward Walk", "90s"], ["Tibialis Raise", "50s"], ["KOT Calf Raise", "50s"], ["Poliquin Step-Up", "40s / side"], ["ATG Split Squat", "45s / side"], ["Reverse Nordic", "45s"], ["Couch Stretch", "45s / side"], ["Seated Pike Leg Lift", "45s"]]
    ] },
  { id: "functional", kind: "strength", title: "Functional Strength", pose: "kbHalo", bg: "#D8B44E",
    blurb: "Carry, brace and move well",
    moves: [["KB Halo", "30s"], ["KB Deadlift", "40s"], ["Suitcase March", "30s / side"], ["Dead Bug", "40s"], ["Farmer Carry", "40s"], ["Bird Dog", "40s"]],
    levels: [
      [["KB Halo", "30s"], ["KB Deadlift", "40s"], ["Suitcase March", "30s / side"], ["Dead Bug", "40s"], ["Farmer Carry", "40s"], ["Bird Dog", "40s"]],
      [["KB Halo", "30s"], ["KB Deadlift", "40s"], ["Farmer Carry", "40s"], ["Bear Crawl", "30s"], ["Half-Kneeling Band Chop", "30s / side"], ["Suitcase Carry", "30s / side"]],
      [["KB Halo", "40s"], ["KB Deadlift", "45s"], ["Half Turkish Get-up", "40s / side"], ["Suitcase Carry", "30s / side"], ["Bear Crawl", "40s"], ["Copenhagen Plank", "20s / side"]],
      [["KB Halo", "40s"], ["KB Deadlift", "50s"], ["Half Turkish Get-up", "45s / side"], ["Overhead Carry", "30s / side"], ["Bear Crawl", "45s"], ["Copenhagen Plank", "25s / side"]]
    ] },
  { id: "power", kind: "strength", title: "Power", pose: "broadJump", bg: "#93688A",
    blurb: "Get springy — Level I has no jumping",
    moves: [["Squat-to-Stand Pulse", "40s"], ["Fast Step-Up", "30s / side"], ["KB Deadlift", "40s"], ["Push-up", "30s"], ["Mountain Climber", "30s"], ["Glute Bridge", "40s"]],
    levels: [
      [["Squat-to-Stand Pulse", "40s"], ["Fast Step-Up", "30s / side"], ["KB Deadlift", "40s"], ["Push-up", "30s"], ["Mountain Climber", "30s"], ["Glute Bridge", "40s"]],
      [["Pogo Hops", "20s"], ["Fast Step-Up", "30s / side"], ["KB Deadlift", "40s"], ["A-Skip", "30s"], ["Bear Crawl", "30s"], ["Pogo Hops", "20s"]],
      [["Pogo Hops", "30s"], ["A-Skip", "30s"], ["Skater Hop", "30s"], ["Fast Step-Up", "30s / side"], ["Bear Crawl", "40s"], ["Mountain Climber", "30s"]],
      [["Pogo Hops", "30s"], ["Skater Hop", "40s"], ["Broad Jump", "30s"], ["Fast Step-Up", "40s / side"], ["Push-up", "30s"], ["Mountain Climber", "40s"]]
    ] }
);
