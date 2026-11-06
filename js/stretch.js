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
    blurb: "Four minutes, rock-solid middle",
    moves: [["Plank", "30s"], ["Side Plank", "20s / side"], ["Bird Dog", "30s"], ["Plank", "40s"]] },
  { id: "legs", kind: "strength", title: "Legs", pose: "splitSquat", bg: "#5560A8",
    blurb: "Bodyweight legs, anywhere",
    moves: [["Bodyweight Squat", "40s"], ["Reverse Lunge", "30s / side"], ["Wall Sit", "30s"], ["Calf Raise", "40s"], ["Glute Bridge", "40s"], ["Bodyweight Squat", "30s"]] }
];

// short cool-down added to the end of each plan session (skippable in the player)
var COOLDOWNS = {
  "anthony:a": [["Kneeling Hip Flexor Stretch", "30s / side"], ["Figure-4 Stretch", "30s / side"], ["Child's Pose", "40s"]],
  "anthony:b": [["Knees to Chest", "40s"], ["Lying Hamstring Stretch", "30s / side"], ["Figure-4 Stretch", "30s / side"]],
  "anthony:c": [["Kneeling Hip Flexor Stretch", "30s / side"], ["Thread the Needle", "30s / side"], ["Child's Pose", "40s"]],
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
