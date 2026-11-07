/* Strength through length (in the style of Elastaboy / Jake Blundell): don't just
   hang in a stretch, get strong in it. Stretches come in pairs (hold the
   stretch, then an active move in that same range); the higher levels add load.
     Level 1  Gentle — supported holds only
     Level 2  Stretch + activate (where everyone starts)
     Level 3  Loaded — light weight on the key stretches
     Level 4  Deep end — longer loaded holds, the advanced positions
   Bedtime, Glute Activation and Baby & Me Stretch keep their own style. */
Object.assign(STRETCHES, {
  "Couch Stretch Pulses": { pose: "couchStretch", cues: ["Set up in the couch stretch", "Squeeze the back glute hard and pulse your hips forward", "Small, slow pulses — stay tall"] },
  "90/90 Lift-offs": { pose: "ninetyLiftoff", cues: ["Sit in 90/90, both knees bent", "Sit tall and lift the back knee and foot off the floor", "Small, slow lifts — then switch sides"] },
  "Pancake Reach": { pose: "pancake", cues: ["Sit with your legs wide, knees and toes pointing up", "Tip forward from your hips, not your back", "Walk your hands out and breathe — sit on a cushion if it's tight"] },
  "Straddle Lift-offs": { pose: "straddleLift", cues: ["Sit tall with your legs wide, hands by your hips", "Lift one straight leg an inch off the floor, toes up", "Small, controlled lifts — then the other leg"] },
  "Weighted Pancake": { pose: "pancakeWeighted", eq: "db", cues: ["Legs wide, a light dumbbell in both hands", "Hinge forward and let the weight draw you deeper", "Flat back, slow — come up and go again"] },
  "Jefferson Curl": { pose: "jeffersonCurl", cues: ["Stand on a step, legs straight", "Roll down slowly, chin first, one vertebra at a time", "Hang at the bottom, then roll back up just as slowly"] },
  "Weighted Jefferson Curl": { pose: "jeffersonCurlWeighted", eq: "db", cues: ["Stand on a step holding a light dumbbell", "Roll down one vertebra at a time, weight close to your legs", "Start light and slow — roll back up the same way"] },
  "Bench Pigeon": { pose: "benchPigeon", cues: ["Front shin across a bench or table, back leg straight behind you", "Square your hips and lean your chest forward", "Breathe and let the hip sink a little more each breath"] },
  "Cossack Squat": { pose: "cossackSquat", cues: ["Feet very wide, toes slightly out", "Sit into one leg, the other straight with toes up", "Chest up — hold a kettlebell at your chest to sink deeper"] },
  "Horse Stance": { pose: "horseStance", cues: ["Feet wide, toes turned out", "Sink until your thighs are near level, knees pushed out", "Chest tall — breathe and hold"] },
  "Deep Squat Hold": { pose: "deepSquat", cues: ["Feet shoulder-width, heels down", "Sit all the way down, elbows pushing your knees out", "Hold onto something if you need to — breathe"] },
  "Goblet Deep Squat Hold": { pose: "gobletSquat", eq: "kb", cues: ["Hold a kettlebell at your chest", "Sit all the way down, heels on the floor", "Let the weight help you sink — breathe and hold"] }
});
["couch stretch pulses", "90/90 lift-offs", "pancake reach", "straddle lift-offs", "weighted pancake", "jefferson curl", "weighted jefferson curl",
 "bench pigeon", "cossack squat", "horse stance", "deep squat hold", "goblet deep squat hold"].forEach(function (k) { VIDEO_LIB[k] = []; });

var STRETCH_LEVELS = {
  wake: { blurb: "Wake up the hips and spine, then switch them on", levels: [
    [["Cat-Cow", "45s"], ["Child's Pose", "40s"], ["Standing Side Stretch", "20s / side"], ["Standing Forward Fold", "40s"], ["Hip Circles", "30s"]],
    [["Cat-Cow", "45s"], ["World's Greatest Stretch", "30s / side"], ["Kneeling Hip Flexor Stretch", "30s / side"], ["Couch Stretch Pulses", "20s / side"], ["Standing Forward Fold", "40s"], ["Deep Squat Hold", "40s"]],
    [["Cat-Cow", "45s"], ["World's Greatest Stretch", "40s / side"], ["Couch Stretch", "40s / side"], ["Couch Stretch Pulses", "20s / side"], ["Elephant Walk", "40s"], ["Goblet Deep Squat Hold", "40s"]],
    [["World's Greatest Stretch", "45s / side"], ["Couch Stretch", "45s / side"], ["Couch Stretch Pulses", "30s / side"], ["Thoracic Rotation", "30s / side"], ["Cossack Squat", "30s / side"], ["Goblet Deep Squat Hold", "45s"]]
  ] },
  hips: { blurb: "Open the hips, then switch on the glutes", levels: [
    [["Pelvic Tilts", "45s"], ["Knees to Chest", "45s"], ["Figure-4 Stretch", "40s / side"], ["Butterfly Stretch", "45s"], ["Child's Pose", "45s"]],
    [["Knees to Chest", "40s"], ["Figure-4 Stretch", "40s / side"], ["Glute Bridge", "40s"], ["Kneeling Hip Flexor Stretch", "30s / side"], ["Couch Stretch Pulses", "20s / side"], ["90/90 Hip Stretch", "40s / side"], ["90/90 Lift-offs", "20s / side"]],
    [["Figure-4 Stretch", "45s / side"], ["Clamshell", "30s / side"], ["Couch Stretch", "40s / side"], ["Couch Stretch Pulses", "30s / side"], ["Pigeon Stretch", "45s / side"], ["90/90 Lift-offs", "30s / side"], ["Bird Dog", "40s"]],
    [["Bench Pigeon", "60s / side"], ["Single-Leg Glute Bridge", "30s / side"], ["Couch Stretch", "60s / side"], ["Couch Stretch Pulses", "30s / side"], ["90/90 Lift-offs", "40s / side"], ["Copenhagen Plank", "20s / side"], ["Happy Baby", "45s"]]
  ] },
  back: { blurb: "Ease a tight low back, then build it up", levels: [
    [["Pelvic Tilts", "45s"], ["Knees to Chest", "45s"], ["Lying Twist", "30s / side"], ["Child's Pose", "60s"], ["Deep Breathing", "45s"]],
    [["Cat-Cow", "45s"], ["Sphinx", "40s"], ["Bird Dog", "40s"], ["Lying Hamstring Stretch", "40s / side"], ["Seated Pike Leg Lift", "30s"], ["Knees to Chest", "40s"], ["Child's Pose", "60s"]],
    [["Cat-Cow", "45s"], ["Sphinx", "45s"], ["Bird Dog", "40s"], ["Elephant Walk", "40s"], ["Jefferson Curl", "40s"], ["Kneeling Hip Flexor Stretch", "40s / side"], ["Child's Pose", "60s"]],
    [["Cat-Cow", "45s"], ["Couch Stretch", "45s / side"], ["Couch Stretch Pulses", "30s / side"], ["Weighted Jefferson Curl", "45s"], ["Pancake Reach", "45s"], ["Seated Pike Leg Lift", "40s"], ["Child's Pose", "60s"]]
  ] },
  posture: { blurb: "Open the chest, then strengthen the upper back", levels: [
    [["Chin Tucks", "40s"], ["Doorway Pec Stretch", "30s / side"], ["Neck Side Stretch", "20s / side"], ["Child's Pose", "40s"], ["Cat-Cow", "40s"]],
    [["Chin Tucks", "40s"], ["Doorway Pec Stretch", "30s / side"], ["Band Pull-Apart", "30s"], ["Thread the Needle", "30s / side"], ["Thoracic Rotation", "30s / side"], ["Wall Angels", "45s"]],
    [["Doorway Pec Stretch", "40s / side"], ["Band Pull-Apart", "40s"], ["Open Book", "40s / side"], ["Thoracic Rotation", "40s / side"], ["Downward Dog", "40s"], ["Wall Angels", "45s"], ["Dead Hang", "30s"]],
    [["Doorway Pec Stretch", "45s / side"], ["Band Face Pull", "45s"], ["Thoracic Rotation", "45s / side"], ["Downward Dog", "45s"], ["Pike Push-up", "30s"], ["Dead Hang", "45s"], ["Wall Angels", "45s"]]
  ] },
  run: { blurb: "Stretch the legs, then make them strong in that range", levels: [
    [["Standing Quad Stretch", "30s / side"], ["Calf Stretch", "30s / side"], ["Standing Forward Fold", "40s"], ["Figure-4 Stretch", "30s / side"]],
    [["Calf Stretch", "30s / side"], ["Tibialis Raise", "30s"], ["Kneeling Hip Flexor Stretch", "30s / side"], ["Couch Stretch Pulses", "20s / side"], ["Lying Hamstring Stretch", "30s / side"], ["Figure-4 Stretch", "30s / side"]],
    [["Calf Stretch", "40s / side"], ["Single-Leg Calf Raise", "30s / side"], ["Couch Stretch", "40s / side"], ["Couch Stretch Pulses", "20s / side"], ["Elephant Walk", "40s"], ["Pigeon Stretch", "40s / side"]],
    [["Couch Stretch", "45s / side"], ["Couch Stretch Pulses", "30s / side"], ["Elephant Walk", "45s"], ["Cossack Squat", "30s / side"], ["Bench Pigeon", "45s / side"], ["Reverse Nordic", "30s"], ["Deep Squat Hold", "45s"]]
  ] },
  full: { blurb: "Head to toe — stretch it, then own it", levels: [
    [["Cat-Cow", "45s"], ["Standing Side Stretch", "20s / side"], ["Standing Forward Fold", "40s"], ["Kneeling Hip Flexor Stretch", "30s / side"], ["Figure-4 Stretch", "30s / side"], ["Butterfly Stretch", "45s"], ["Lying Twist", "30s / side"], ["Child's Pose", "45s"]],
    [["Cat-Cow", "45s"], ["Downward Dog", "40s"], ["World's Greatest Stretch", "30s / side"], ["Pigeon Stretch", "30s / side"], ["90/90 Lift-offs", "20s / side"], ["Pancake Reach", "40s"], ["Straddle Lift-offs", "20s / side"], ["Thread the Needle", "30s / side"], ["Wall Angels", "40s"], ["Child's Pose", "45s"]],
    [["Cat-Cow", "45s"], ["Downward Dog", "45s"], ["World's Greatest Stretch", "40s / side"], ["Couch Stretch Pulses", "20s / side"], ["Pancake Reach", "45s"], ["Jefferson Curl", "40s"], ["Cossack Squat", "30s / side"], ["Thoracic Rotation", "30s / side"], ["Deep Squat Hold", "45s"], ["Child's Pose", "45s"]],
    [["World's Greatest Stretch", "45s / side"], ["Couch Stretch", "45s / side"], ["Couch Stretch Pulses", "30s / side"], ["Weighted Pancake", "45s"], ["Weighted Jefferson Curl", "45s"], ["Cossack Squat", "40s / side"], ["Horse Stance", "45s"], ["Dead Hang", "40s"], ["Goblet Deep Squat Hold", "45s"]]
  ] }
};
ROUTINES.forEach(function (r) {
  var S = STRETCH_LEVELS[r.id]; if (!S) return;
  r.levels = S.levels; r.moves = S.levels[1]; r.blurb = S.blurb;
});

// two signature routines, right after Glute Activation in the Stretch list
(function () {
  var at = ROUTINES.map(function (r) { return r.id; }).indexOf('gluteact') + 1 || 1;
  ROUTINES.splice(at, 0,
    { id: "deephips", kind: "stretch", title: "Deep Hips", pose: "cossackSquat", bg: "#6E9A8B",
      blurb: "Couch, pigeon, 90/90 and deep squats — get strong in them", levels: [
        [["Figure-4 Stretch", "45s / side"], ["Butterfly Stretch", "45s"], ["Kneeling Hip Flexor Stretch", "40s / side"], ["Happy Baby", "45s"], ["Child's Pose", "45s"]],
        [["Couch Stretch", "40s / side"], ["Couch Stretch Pulses", "20s / side"], ["90/90 Hip Stretch", "40s / side"], ["90/90 Lift-offs", "20s / side"], ["Pigeon Stretch", "45s / side"], ["Deep Squat Hold", "40s"]],
        [["Couch Stretch", "45s / side"], ["Couch Stretch Pulses", "30s / side"], ["Cossack Squat", "30s / side"], ["90/90 Lift-offs", "30s / side"], ["Bench Pigeon", "45s / side"], ["Goblet Deep Squat Hold", "45s"]],
        [["Couch Stretch", "60s / side"], ["Couch Stretch Pulses", "30s / side"], ["World's Greatest Stretch", "40s / side"], ["Cossack Squat", "40s / side"], ["Horse Stance", "45s"], ["Bench Pigeon", "60s / side"], ["Goblet Deep Squat Hold", "60s"]]
      ] },
    { id: "pancake", kind: "stretch", title: "Pancake & Hamstrings", pose: "pancake", bg: "#D8B44E",
      blurb: "Wide-leg folds, pike lifts and Jefferson curls", levels: [
        [["Lying Hamstring Stretch", "40s / side"], ["Butterfly Stretch", "45s"], ["Pancake Reach", "40s"], ["Standing Forward Fold", "40s"], ["Child's Pose", "40s"]],
        [["Pancake Reach", "45s"], ["Straddle Lift-offs", "20s / side"], ["Elephant Walk", "40s"], ["Seated Pike Leg Lift", "30s"], ["Lying Hamstring Stretch", "40s / side"], ["Butterfly Stretch", "45s"]],
        [["Pancake Reach", "45s"], ["Weighted Pancake", "45s"], ["Straddle Lift-offs", "30s / side"], ["Jefferson Curl", "45s"], ["Elephant Walk", "45s"], ["Seated Pike Leg Lift", "40s"], ["Butterfly Stretch", "45s"]],
        [["Weighted Pancake", "60s"], ["Straddle Lift-offs", "30s / side"], ["Weighted Jefferson Curl", "45s"], ["Horse Stance", "45s"], ["Cossack Squat", "30s / side"], ["Seated Pike Leg Lift", "45s"], ["Elephant Walk", "45s"]]
      ] });
  ROUTINES[at].moves = ROUTINES[at].levels[1];
  ROUTINES[at + 1].moves = ROUTINES[at + 1].levels[1];
})();
