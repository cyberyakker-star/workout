/* Baby & Me: one strength and one stretch routine to do with a 9-month-old.
   Safety rules baked in: nothing jumps, lunges or balances on one leg while
   holding the baby; held moves keep baby centred on your chest (easy on the
   back and SI joint); the overhead lift is done kneeling. */
var BABY_CUES = {
  "baby squat hold": ["Hold baby close at the middle of your chest", "Sit halfway down and hold", "Breathe — sing them a song"],
  "slow baby squat": ["Hold baby close at the middle of your chest", "Take 3 slow seconds down, pause at the bottom", "Stand up at normal speed"],
  "baby squat": ["Hold baby close at the middle of your chest", "Sit back like there's a chair behind you", "Stand tall — a squeeze or a kiss at the top"],
  "peekaboo push-up": ["Baby on their back under your face", "Lower down and say peekaboo (or give a kiss)", "Knees down is fine — up on your toes when you're ready"],
  "peekaboo plank": ["Baby sits or lies in front of you", "Hold a plank on your forearms", "Peekaboo every few seconds"],
  "slow baby bridge": ["Lie back, knees bent, baby sitting on your hips", "Lift your hips and hold 3 seconds at the top", "Lower slowly, hands on baby the whole time"],
  "baby bridge": ["Lie back, knees bent, baby sitting on your hips", "Hold baby's sides with both hands", "Lift your hips, squeeze, lower slowly"],
  "kneeling baby lift": ["Kneel tall, hands under baby's arms", "Slowly lift baby overhead and back down", "Stay kneeling — slow and controlled"],
  "wall sit with baby": ["Back on the wall, knees bent to 90°", "Baby sits on your thighs facing you", "Hold baby's sides and breathe"],
  "baby airplane": ["Lie back, knees up, baby on your shins", "Hold their hands or under their arms", "Pull your knees in and out — baby flies"],
  "kiss-the-baby sit-up": ["Baby sits on your legs facing you", "Sit up and give them a kiss", "Lower back down slowly"]
};
Object.assign(CUE_LIB, BABY_CUES);
Object.assign(POSE_OF, {
  "Baby Squat": "babySquat", "Slow Baby Squat": "babySquat", "Baby Squat Hold": "babySquat", "Peekaboo Push-up": "peekabooPushUp",
  "Peekaboo Plank": "peekabooPlank", "Baby Bridge": "babyBridge", "Slow Baby Bridge": "babyBridge", "Kneeling Baby Lift": "babyLift",
  "Wall Sit with Baby": "babyWallSit", "Baby Airplane": "babyAirplane", "Kiss-the-Baby Sit-up": "babySitup"
});
Object.assign(STRETCHES, {
  "Peekaboo Cat-Cow": { pose: "peekabooCatCow", baby: true, cues: ["Hands and knees, baby sitting in front of you", "Round your back up, then let your belly drop", "Peekaboo every time your head comes up"] },
  "Peekaboo Child's Pose": { pose: "peekabooChild", baby: true, cues: ["Baby sits in front of you", "Sink your hips back, arms long", "Peek up and say hi"] },
  "Butterfly with Baby": { pose: "butterflyBaby", baby: true, cues: ["Soles of your feet together", "Baby sits in front of you or in the diamond of your legs", "Sit tall and let your knees drop"] },
  "Straddle with Baby": { pose: "straddleBaby", baby: true, cues: ["Sit with your legs wide, baby between them", "Roll a ball back and forth", "Lean forward from your hips as you reach"] },
  "Neck Stretch with Baby": { pose: "neckStretchBaby", baby: true, cues: ["Sit tall, baby on your lap, one arm around them", "Tilt your ear toward your shoulder", "Rest your hand on your head — no pulling"] },
  "Happy Baby with Baby": { pose: "happyBabyBaby", baby: true, cues: ["Lie next to baby, both on your backs", "Hold the outsides of your feet, knees wide", "Rock gently — baby will probably grab their feet too"] },
  "Wrist & Thumb Stretch": { pose: "wristStretch", cues: ["Arm straight out, palm up", "Gently pull your fingers back with the other hand", "Then tuck your thumb into a loose fist and tip your hand down gently"] }
});
ROUTINES.push(
  { id: "babystrength", kind: "strength", baby: true, title: "Baby & Me Strength", pose: "babySquat", bg: "#A08BD6",
    blurb: "Your baby is the weight",
    levels: [
      [["Box Squat", "45s"], ["Peekaboo Push-up", "40s"], ["Glute Bridge", "45s"], ["Wall Sit", "30s"], ["Dead Bug", "40s"], ["Box Squat", "40s"]],
      [["Baby Squat", "60s"], ["Peekaboo Push-up", "40s"], ["Baby Bridge", "60s"], ["Kneeling Baby Lift", "40s"], ["Wall Sit with Baby", "45s"], ["Baby Airplane", "45s"], ["Kiss-the-Baby Sit-up", "45s"], ["Baby Squat", "45s"]],
      [["Slow Baby Squat", "60s"], ["Peekaboo Push-up", "45s"], ["Slow Baby Bridge", "60s"], ["Kneeling Baby Lift", "45s"], ["Wall Sit with Baby", "60s"], ["Baby Airplane", "45s"], ["Kiss-the-Baby Sit-up", "45s"], ["Slow Baby Squat", "45s"]],
      [["Baby Squat", "60s"], ["Peekaboo Plank", "45s"], ["Slow Baby Bridge", "60s"], ["Kneeling Baby Lift", "60s"], ["Baby Squat Hold", "40s"], ["Baby Airplane", "60s"], ["Kiss-the-Baby Sit-up", "60s"], ["Peekaboo Push-up", "45s"]]
    ] },
  { id: "babystretch", kind: "stretch", baby: true, title: "Baby & Me Stretch", pose: "butterflyBaby", bg: "#9AA36A",
    blurb: "Baby plays on the blanket while you stretch",
    moves: [["Peekaboo Cat-Cow", "45s"], ["Peekaboo Child's Pose", "45s"], ["Butterfly with Baby", "45s"], ["Straddle with Baby", "45s"],
      ["Figure-4 Stretch", "30s / side"], ["Thread the Needle", "30s / side"], ["Wrist & Thumb Stretch", "30s / side"],
      ["Neck Stretch with Baby", "20s / side"], ["Happy Baby with Baby", "45s"]] }
);
ROUTINES[ROUTINES.length - 2].moves = ROUTINES[ROUTINES.length - 2].levels[1];
