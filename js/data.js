/* Plan data, exercise database, coaching cues, demo videos and the custom-plan
   generator — carried over from the original app so plans and history keep working. */
/* ==================================================================
   PLAN DATA - EDIT HERE
   ================================================================== */
/* Celina's plan: three ~20 min sessions that rotate A -> B -> C on whatever
   days she trains. Priority 1 is looking great, so two of the three are
   strength (glutes twice a cycle, plus shoulders, back and arms); the run
   levels up toward a strong 5K. Strength is done in pairs (alternate the two
   moves) to fit real training into 20 minutes. Back/joint friendly: no
   jumping, no heavy carries or loaded twisting.
   name/scheme/note = HOME version; `gym` = YMCA swap, `min` = bands and
   bodyweight only. The run's `levels` move up every 3 completed runs. */
function glowSessions(){
  var THRUST_CUES=["Upper back on the edge of the bench","Weight on your hips, feet flat","Drive through your heels, ribs down",
    "Squeeze glutes at the top — don't arch your low back"];
  var PAIR="alternate the two · rest 30–45s";
  function walk(w,c){ return { kind:"walkrun", warm:w||"3 min brisk walk", cool:c||"2–3 min easy walk" }; }
  function lvl(title,dur,main,run){ var r=run||walk(); r.extra=main; return { title:title, dur:dur, run:r }; }
  var days=[
    { key:"a", label:"Session A", type:"strength", title:"Glutes & Legs", dur:"20 min",
      groups:[
        { label:"Warm-up · booty band", items:[
          { name:"Banded Glute Bridge", scheme:"× 15", note:"Band above knees · squeeze 2s at the top" },
          { name:"Squat Side Step", scheme:"10 steps / side", note:"Stay low, small steps" } ]},
        { label:"Pair 1 · "+PAIR, items:[
          { name:"Goblet Squat", scheme:"3 × 10–15", note:"KB or one DB · 3s down · only as deep as feels good",
            gym:{ name:"Leg Press", scheme:"3 × 10–15", note:"Feet high on the plate for more glutes" },
            min:{ name:"Double Pulse Squat", scheme:"3 × 12", note:"Booty band above knees" } },
          { name:"One-Arm DB Row", scheme:"3 × 10–12 / side", note:"Hand and knee on the bench, flat back",
            gym:{ name:"Seated Cable Row", scheme:"3 × 10–12", note:"" },
            min:{ name:"Band Row", scheme:"3 × 15", note:"Band around a post or door anchor" } } ]},
        { label:"Pair 2 · "+PAIR, items:[
          { name:"DB Hip Thrust", scheme:"3 × 12–15", note:"Upper back on the bench, DB on your hips", cues:THRUST_CUES,
            gym:{ name:"Barbell Hip Thrust", scheme:"3 × 10–12", note:"Pad on the bar · or the hip thrust machine" },
            min:{ name:"Isolated Hip Thrust", scheme:"3 × 15", note:"Booty band above knees · pause 2s at the top" } },
          { name:"Dead Bug", scheme:"3 × 8 / side", note:"Low back stays flat" } ]},
        { label:"Finisher", items:[
          { name:"Kickbacks", scheme:"2 × 15 / side", note:"Booty band · slow and squeeze",
            gym:{ name:"Cable Kickback", scheme:"2 × 12 / side", note:"" } } ]}
      ]},
    { key:"b", label:"Session B", type:"run", title:"Run", dur:"~25 min", perLevel:3,
      levels:[
        lvl("Run · Level 1","~25 min","Jog 1 min / walk 2 min × 6"),
        lvl("Run · Level 2","~25 min","Jog 2 min / walk 2 min × 5"),
        lvl("Run · Level 3","~25 min","Jog 3 min / walk 2 min × 4"),
        lvl("Run · Level 4","~25 min","Jog 5 min / walk 2 min × 3"),
        lvl("Run · Level 5","~25 min","Jog 8 min / walk 2 min × 2"),
        lvl("Run · Level 6","~25 min","Jog 20 min, easy — you can still talk"),
        lvl("Run · Level 7","~25 min","6 × (1 min faster / 2 min easy)",walk("5 min easy jog","Easy jog or walk 3 min")),
        lvl("Run · Level 8","~25 min","Tempo: 5 min easy, 10 min comfortably hard, 5 min easy",walk("Easy jog 3 min","Walk 3 min"))
      ]},
    { key:"c", label:"Session C", type:"strength", title:"Upper Body & Glutes", dur:"20 min",
      groups:[
        { label:"Warm-up · booty band", items:[
          { name:"Band Pull-Apart", scheme:"× 15" },
          { name:"Lying Leg Abduction", scheme:"× 12 / side", note:"Booty band" },
          { name:"Side Plank", scheme:"20s / side", note:"Knees down is fine" } ]},
        { label:"Pair 1 · "+PAIR, items:[
          { name:"Push-up", scheme:"3 × 8–12", note:"Knees down or hands on the bench is fine",
            gym:{ name:"Machine Chest Press", scheme:"3 × 10–12", note:"" },
            min:{ name:"Kneeling Push-up", scheme:"3 × 8–12", note:"" } },
          { name:"Band Lat Pulldown", scheme:"3 × 12–15", note:"Band over the pull-up bar · elbows to your ribs",
            gym:{ name:"Lat Pulldown", scheme:"3 × 10–12", note:"" },
            min:{ note:"Band over a door anchor or sturdy bar" } } ]},
        { label:"Pair 2 · "+PAIR, items:[
          { name:"DB Romanian Deadlift", scheme:"3 × 10–12", note:"Light · hips back, flat back · if your back complains, do Hip Thrusts instead",
            min:{ name:"Single-Leg Glute Bridge", scheme:"3 × 10 / side", note:"" } },
          { name:"Seated DB Shoulder Press", scheme:"3 × 10–12", note:"Seated with back support",
            gym:{ name:"Machine Shoulder Press", scheme:"3 × 10–12", note:"" },
            min:{ name:"Band Overhead Press", scheme:"3 × 12–15", note:"" } } ]},
        { label:"Finisher · arms", items:[
          { name:"DB Biceps Curl", scheme:"2 × 12", note:"Elbows pinned to your sides",
            cues:["Elbows stay at your sides","Curl up, squeeze, lower for 3 seconds","No swinging — go lighter if you need to","Wrists straight"],
            min:{ name:"Band Biceps Curl", scheme:"2 × 15", note:"Stand on the band" } },
          { name:"Overhead Triceps Extension", scheme:"2 × 12", note:"One DB, both hands, seated",
            cues:["Hold one DB overhead with both hands","Lower behind your head, elbows pointing up","Extend all the way, squeeze the back of your arms","Ribs down, don't arch your back"],
            min:{ name:"Band Overhead Triceps Extension", scheme:"2 × 15", note:"Band anchored under your foot" } } ]}
      ]}
  ];
  // 10-min version: one warm-up move, then both pairs at 2 sets
  days[0].quick=[[0,0],[1,0,2],[1,1,2],[2,0,2],[2,1,2]];
  days[2].quick=[[0,0],[1,0,2],[1,1,2],[2,0,2],[2,1,2]];
  return days;
}

/* Anthony's plan: three ~45 min full-body sessions that rotate A -> B -> C on
   whatever days you train. Every session = an SI/hip/core warm-up (so it never
   gets skipped), a leg/hip lift, one push and two pulls (extra pulling for
   posture), then a short finisher. SI-friendly: two-legged lifts first, short
   strides, no heavy one-sided loads.
   Each item's name/scheme/note is the HOME version (bench, pull-up bar, back
   extension, bands, booty bands, ab wheel, 25 lb KB, 30 lb DBs); `gym` holds
   the YMCA swap (a name, or {name, scheme, note}). Returns fresh objects. */
function fullBodySessions(){
  var BACK_EXT_CUES=["Pad just below your hip bones","Round your upper back slightly and squeeze your glutes to rise",
    "Stop at a straight line — don't arch past it","Lower slowly"];
  var THRUST_CUES=["Upper back on the edge of the bench","Weight on your hips, feet flat","Drive through your heels, ribs down",
    "Squeeze glutes at the top — don't arch your low back"];
  function prep(items){ return { label:"Warm-up · hips, core & posture", items:items }; }
  function sessions(){ return [
    { key:"a", label:"Session A", type:"strength", title:"Squat & Bench", dur:"45 min",
      groups:[
        prep([
          { name:"Bird Dog", scheme:"2 × 6 / side", note:"Slow · hold 2s · hips stay level" },
          { name:"Side Plank", scheme:"2 × 20s / side", note:"Knees down is fine" },
          { name:"Clamshell", scheme:"2 × 12 / side", note:"Booty band above knees" },
          { name:"Glute Bridge", scheme:"2 × 12", note:"Squeeze 2s at the top" },
          { name:"Band Pull-Apart", scheme:"2 × 15" } ]),
        { label:"Strength · 3 sets each", items:[
          { name:"Goblet Squat", scheme:"3 × 10–15", note:"KB or one DB · 3s down · only as deep as feels good",
            gym:{ name:"Leg Press", scheme:"3 × 10–12", note:"Moderate depth — keep your hips down on the pad" } },
          { name:"DB Bench Press", scheme:"3 × 10–15", note:"When 15 is easy, pause 2s at the bottom",
            gym:{ name:"Barbell Bench Press", scheme:"3 × 6–10", note:"" } },
          { name:"Pull-up", scheme:"3 × max", note:"Stop 1–2 reps short of failure · band-assisted if needed",
            gym:{ name:"Lat Pulldown", scheme:"3 × 10–12", note:"" } },
          { name:"One-Arm DB Row", scheme:"3 × 10–15 / side", note:"Hand and knee on the bench, flat back",
            gym:{ name:"Seated Cable Row", scheme:"3 × 10–12", note:"" } } ]},
        { label:"Finisher", items:[
          { name:"Back Extension", scheme:"2 × 12–15", note:"Glute-focused · bodyweight to start", cues:BACK_EXT_CUES },
          { name:"Band Face Pull", scheme:"2 × 15", gym:{ name:"Cable Face Pull", note:"" } },
          { name:"Doorway Pec Stretch", scheme:"2 × 30s / side", note:"Opens up the chest for posture" } ]}
      ]},
    { key:"b", label:"Session B", type:"strength", title:"Hinge & Overhead", dur:"45 min",
      groups:[
        prep([
          { name:"Dead Bug", scheme:"2 × 8 / side", note:"Low back stays flat" },
          { name:"Side Plank", scheme:"2 × 20s / side", note:"Knees down is fine" },
          { name:"Banded Lateral Walk", scheme:"2 × 10 steps / side", note:"Booty band · small steps" },
          { name:"Adductor Squeeze", scheme:"5 × 10s hold", note:"Ball or pillow between your knees" },
          { name:"Band Pull-Apart", scheme:"2 × 15" } ]),
        { label:"Strength · 3 sets each", items:[
          { name:"DB Romanian Deadlift", scheme:"3 × 10–15", note:"Hips back, flat back, DBs close to your legs",
            gym:{ name:"Barbell Romanian Deadlift", scheme:"3 × 8–10", note:"Moderate weight — stop before your back rounds" } },
          { name:"Seated DB Shoulder Press", scheme:"3 × 10–12", note:"Seated with back support — easier on the SI joint than standing",
            gym:{ name:"Machine Shoulder Press", scheme:"3 × 10–12", note:"" } },
          { name:"Chin-up", scheme:"3 × max", note:"Palms facing you · band-assisted if needed",
            gym:{ name:"Assisted Chin-up", scheme:"3 × 8–10", note:"Assist machine — less help as you get stronger" } },
          { name:"Band Row", scheme:"3 × 15", note:"Band anchored at chest height · squeeze shoulder blades",
            gym:{ name:"Chest-Supported Machine Row", scheme:"3 × 10–12", note:"" } } ]},
        { label:"Finisher", items:[
          { name:"DB Hip Thrust", scheme:"2 × 12–15", note:"Upper back on the bench, DB on your hips", cues:THRUST_CUES,
            gym:{ name:"Barbell Hip Thrust", scheme:"2 × 10–12", note:"Pad on the bar" } },
          { name:"Standing Anti-Rotation Press", scheme:"2 × 10 / side", note:"Pallof press · band at chest height",
            gym:{ note:"Pallof press · cable at chest height" } },
          { name:"Band Face Pull", scheme:"2 × 15", gym:{ name:"Cable Face Pull", note:"" } } ]}
      ]},
    { key:"c", label:"Session C", type:"strength", title:"Split Squat & Push", dur:"45 min",
      groups:[
        prep([
          { name:"Bird Dog", scheme:"2 × 6 / side", note:"Slow · hold 2s · hips stay level" },
          { name:"Side Plank", scheme:"2 × 20s / side", note:"Knees down is fine" },
          { name:"Lying Leg Abduction", scheme:"2 × 12 / side", note:"Booty band for more" },
          { name:"Glute Bridge Spread", scheme:"2 × 12", note:"Booty band · press knees out at the top" },
          { name:"Band Pull-Apart", scheme:"2 × 15" } ]),
        { label:"Strength · 3 sets each", items:[
          { name:"Split Squat", scheme:"3 × 8–10 / side", note:"Short stance · hold the bench for balance · if your SI complains, do Goblet Squats",
            gym:{ note:"Hold DBs when bodyweight is easy · short stance" } },
          { name:"Push-up", scheme:"3 × 10–20", note:"Feet on the bench when 20 is easy",
            gym:{ name:"Incline DB Press", scheme:"3 × 8–12", note:"" } },
          { name:"Pull-up", scheme:"3 × max", note:"Wide grip today · band-assisted if needed",
            gym:{ name:"Lat Pulldown", scheme:"3 × 10–12", note:"" } },
          { name:"KB Row", scheme:"3 × 12–15 / side", note:"25 lb KB · hand on the bench",
            gym:{ name:"Seated Cable Row", scheme:"3 × 10–12", note:"" } } ]},
        { label:"Finisher", items:[
          { name:"Back Extension", scheme:"2 × 12–15", note:"Glute-focused · hold a weight when bodyweight is easy", cues:BACK_EXT_CUES },
          { name:"Ab Wheel Rollout", scheme:"2 × 8", note:"From your knees · short range — skip if your back or SI complains" },
          { name:"Doorway Pec Stretch", scheme:"2 × 30s / side", note:"Opens up the chest for posture" } ]}
      ]}
  ]; }
  // 20-min version: first 3 warm-up moves (1 set), then the 4 main lifts at 2 sets
  return sessions().map(function(d){
    d.quick=[[0,0,1],[0,1,1],[0,2,1],[1,0,2],[1,1,2],[1,2,2],[1,3,2]];
    return d;
  });
}

/* Anthony's plan, by muscle group (his choice over full body). Six sessions; how
   many rotate depends on how many days a week he picks (Me → Your plan):
   2: Upper · Lower   3: Push · Pull · Legs   4: Push · Legs · Pull · Lower
   5: + Upper   6: + Core & Glutes. Legs twice from 4 days (squat day + hinge day).
   Every session keeps the SI-joint warm-up (hips, core, posture) and avoids
   heavy spinal loading / twisting under load. `gym` = YMCA version. */
function splitSessions(){
  var BACK_EXT_CUES=["Pad just below your hip bones","Round your upper back slightly and squeeze your glutes to rise",
    "Stop at a straight line — don't arch past it","Lower slowly"];
  var THRUST_CUES=["Upper back on the edge of the bench","Weight on your hips, feet flat","Drive through your heels, ribs down",
    "Squeeze glutes at the top — don't arch your low back"];
  function prep(items){ return { label:"Warm-up · hips, core & posture", items:items }; }
  var PULLAPART={ name:"Band Pull-Apart", scheme:"2 × 15" };
  var BIRDDOG={ name:"Bird Dog", scheme:"2 × 6 / side", note:"Slow · hold 2s · hips stay level" };
  var SIDEPLANK={ name:"Side Plank", scheme:"2 × 20s / side", note:"Knees down is fine" };
  var DEADBUG={ name:"Dead Bug", scheme:"2 × 8 / side", note:"Low back stays flat" };
  var days=[
    { key:"push", label:"Push", type:"strength", title:"Push Day", focus:"Chest, shoulders & triceps", dur:"45 min",
      groups:[
        prep([PULLAPART, BIRDDOG, SIDEPLANK, { name:"Glute Bridge", scheme:"2 × 12", note:"Squeeze 2s at the top" }]),
        { label:"Strength · 3 sets each", items:[
          { name:"DB Bench Press", scheme:"3 × 10–15", note:"When 15 is easy, pause 2s at the bottom",
            gym:{ name:"Barbell Bench Press", scheme:"3 × 6–10", note:"" } },
          { name:"Seated DB Shoulder Press", scheme:"3 × 10–12", note:"Seated with back support — easier on the SI joint than standing",
            gym:{ name:"Machine Shoulder Press", scheme:"3 × 10–12", note:"" } },
          { name:"Push-up", scheme:"3 × 10–20", note:"Feet on the bench when 20 is easy",
            gym:{ name:"Incline DB Press", scheme:"3 × 8–12", note:"" } },
          { name:"Overhead Triceps Extension", scheme:"3 × 10–12", note:"One DB, both hands · elbows point up" } ]},
        { label:"Finisher", items:[
          { name:"Band Face Pull", scheme:"2 × 15", note:"Keeps the shoulders healthy on push days", gym:{ name:"Cable Face Pull", note:"" } },
          DEADBUG,
          { name:"Doorway Pec Stretch", scheme:"2 × 30s / side", note:"Opens up the chest for posture" } ]}
      ]},
    { key:"pull", label:"Pull", type:"strength", title:"Pull Day", focus:"Back & biceps", dur:"45 min",
      groups:[
        prep([PULLAPART, DEADBUG, SIDEPLANK, { name:"Clamshell", scheme:"2 × 12 / side", note:"Booty band above knees" }]),
        { label:"Strength · 3 sets each", items:[
          { name:"Pull-up", scheme:"3 × max", note:"Stop 1–2 reps short of failure · band-assisted if needed",
            gym:{ name:"Lat Pulldown", scheme:"3 × 10–12", note:"" } },
          { name:"One-Arm DB Row", scheme:"3 × 10–15 / side", note:"Hand and knee on the bench, flat back",
            gym:{ name:"Seated Cable Row", scheme:"3 × 10–12", note:"" } },
          { name:"Band Row", scheme:"3 × 15", note:"Band anchored at chest height · squeeze shoulder blades",
            gym:{ name:"Chest-Supported Machine Row", scheme:"3 × 10–12", note:"" } },
          { name:"DB Biceps Curl", scheme:"3 × 10–12", note:"Elbows stay by your sides" } ]},
        { label:"Finisher", items:[
          { name:"Back Extension", scheme:"2 × 12–15", note:"Glute-focused · bodyweight to start", cues:BACK_EXT_CUES },
          { name:"Band Face Pull", scheme:"2 × 15", gym:{ name:"Cable Face Pull", note:"" } },
          { name:"Standing Anti-Rotation Press", scheme:"2 × 10 / side", note:"Pallof press · band at chest height", gym:{ name:"Standing Anti-Rotation Press", note:"Cable at chest height" } } ]}
      ]},
    { key:"legs", label:"Legs", type:"strength", title:"Leg Day", focus:"Squat, glutes & hips", dur:"45 min",
      groups:[
        prep([{ name:"Clamshell", scheme:"2 × 12 / side", note:"Booty band above knees" },
          { name:"Banded Lateral Walk", scheme:"2 × 10 steps / side", note:"Booty band · small steps" },
          { name:"Adductor Squeeze", scheme:"5 × 10s hold", note:"Ball or pillow between your knees" }, BIRDDOG]),
        { label:"Strength · 3 sets each", items:[
          { name:"Goblet Squat", scheme:"3 × 10–15", note:"KB or one DB · 3s down · only as deep as feels good",
            gym:{ name:"Leg Press", scheme:"3 × 10–12", note:"Moderate depth — keep your hips down on the pad" } },
          { name:"Split Squat", scheme:"3 × 8–10 / side", note:"Short stance · hold the bench for balance · if your SI complains, do Goblet Squats" },
          { name:"DB Hip Thrust", scheme:"3 × 12–15", note:"Upper back on the bench, DB on your hips", cues:THRUST_CUES,
            gym:{ name:"Barbell Hip Thrust", scheme:"3 × 10–12", note:"Pad on the bar" } },
          { name:"Calf Raise", scheme:"3 × 15", note:"Slow up, slow down · hold a DB for more" } ]},
        { label:"Finisher", items:[ SIDEPLANK, DEADBUG ]}
      ]},
    { key:"lower", label:"Lower", type:"strength", title:"Hinge Day", focus:"Hamstrings, glutes & low back", dur:"45 min",
      groups:[
        prep([{ name:"Glute Bridge", scheme:"2 × 12", note:"Squeeze 2s at the top" },
          { name:"Banded Lateral Walk", scheme:"2 × 10 steps / side", note:"Booty band · small steps" }, BIRDDOG, SIDEPLANK]),
        { label:"Strength · 3 sets each", items:[
          { name:"DB Romanian Deadlift", scheme:"3 × 10–15", note:"Hips back, flat back, DBs close to your legs",
            gym:{ name:"Barbell Romanian Deadlift", scheme:"3 × 8–10", note:"Moderate weight — stop before your back rounds" } },
          { name:"Step-Up", scheme:"3 × 8–10 / side", note:"Bench or sturdy box · drive through the front heel" },
          { name:"Single-Leg Glute Bridge", scheme:"3 × 10 / side", note:"Hips stay level" },
          { name:"Back Extension", scheme:"3 × 12–15", note:"Glute-focused · hold a weight when bodyweight is easy", cues:BACK_EXT_CUES } ]},
        { label:"Finisher", items:[
          { name:"Standing Anti-Rotation Press", scheme:"2 × 10 / side", note:"Pallof press · band at chest height" },
          { name:"Lying Leg Abduction", scheme:"2 × 12 / side", note:"Booty band for more" } ]}
      ]},
    { key:"upper", label:"Upper", type:"strength", title:"Upper Day", focus:"Chest, back & arms", dur:"45 min",
      groups:[
        prep([PULLAPART, BIRDDOG, SIDEPLANK, DEADBUG]),
        { label:"Strength · 3 sets each", items:[
          { name:"DB Bench Press", scheme:"3 × 10–15", note:"Pause 2s at the bottom when 15 is easy",
            gym:{ name:"Incline DB Press", scheme:"3 × 8–12", note:"" } },
          { name:"Chin-up", scheme:"3 × max", note:"Palms facing you · band-assisted if needed",
            gym:{ name:"Assisted Chin-up", scheme:"3 × 8–10", note:"Assist machine — less help as you get stronger" } },
          { name:"KB Row", scheme:"3 × 12–15 / side", note:"25 lb KB · hand on the bench",
            gym:{ name:"Seated Cable Row", scheme:"3 × 10–12", note:"" } },
          { name:"Seated DB Shoulder Press", scheme:"3 × 10–12", note:"Seated with back support",
            gym:{ name:"Machine Shoulder Press", scheme:"3 × 10–12", note:"" } } ]},
        { label:"Finisher", items:[
          { name:"DB Biceps Curl", scheme:"2 × 12" },
          { name:"Overhead Triceps Extension", scheme:"2 × 12" },
          { name:"Band Face Pull", scheme:"2 × 15", gym:{ name:"Cable Face Pull", note:"" } } ]}
      ]},
    { key:"core", label:"Core", type:"strength", title:"Core & Glutes", focus:"Abs, glutes & back care", dur:"30 min",
      groups:[
        { label:"Warm-up · loosen up", items:[
          { name:"Cat-Cow", scheme:"45s" }, { name:"Pelvic Tilts", scheme:"45s" } ]},
        { label:"Strength · 3 sets each", items:[
          { name:"Dead Bug", scheme:"3 × 8 / side", note:"Low back stays flat" },
          { name:"Side Plank", scheme:"3 × 25s / side", note:"Knees down is fine" },
          { name:"DB Hip Thrust", scheme:"3 × 12–15", note:"Upper back on the bench, DB on your hips", cues:THRUST_CUES,
            gym:{ name:"Barbell Hip Thrust", scheme:"3 × 10–12", note:"Pad on the bar" } },
          { name:"Standing Anti-Rotation Press", scheme:"3 × 10 / side", note:"Pallof press · band at chest height" } ]},
        { label:"Finisher", items:[
          { name:"Ab Wheel Rollout", scheme:"2 × 8", note:"From your knees · short range — skip if your back or SI complains" },
          { name:"Banded Lateral Walk", scheme:"2 × 10 steps / side", note:"Booty band · small steps" } ]}
      ]}
  ];
  // 20-min version: first 2 warm-up moves (1 set), then the 4 main lifts at 2 sets
  return days.map(function(d){ d.quick=[[0,0,1],[0,1,1],[1,0,2],[1,1,2],[1,2,2],[1,3,2]]; return d; });
}

var ATHLETES = {

  anthony: {
    meta:{ name:"ANTHONY", tag:"", goal:"Full body · strong hips · posture" },
    theme:"tactical",
    mode:"phase",
    rotation:true,   // sessions run in order (A → B → C) on whatever days you train
    perWeek:3,
    quickMin:20,     // the short-on-time version
    check:"SI joint", checkTag:"SI", // quick check-in after each session
    locations:{ home:"Home", gym:"YMCA" },
    programWeeks:0,
    phases:[
      { key:"split", label:"Any days", range:"Rotation", name:"Push · Pull · Legs", from:1, to:999 }
    ],
    phaseDays:{ split:splitSessions() },
    // which sessions rotate for each number of days a week (Me → Your plan)
    splits:{ 2:["upper","lower"], 3:["push","pull","legs"], 4:["push","legs","pull","lower"],
             5:["push","legs","pull","lower","upper"], 6:["push","legs","pull","lower","upper","core"] },
    foot:"<b>Effort, not pain.</b> Lifts should feel like work; SI pain should stay at mild (4/10 or less) — if a move pinches, swap it. Progress by adding reps until the top of the range, then add weight or slow the lowering. Missed a day? The next session just waits for you."
  },

  her: {
    meta:{ name:"CELINA", tag:"", goal:"Look amazing · strong 5K" },
    theme:"fem",
    mode:"phase",
    rotation:true,   // sessions run in order (A → B → C) on whatever days she trains
    perWeek:3,
    quickMin:10,
    check:"back & joints", checkTag:"JOINTS", // quick check-in after each session
    locations:{ home:"Home", gym:"YMCA", min:"Minimal" },
    programWeeks:0,
    phases:[
      { key:"glow", label:"3 × 20 min · any days", range:"Rotation", name:"Strength & 5K", from:1, to:999 }
    ],
    phaseDays:{ glow:glowSessions() },
    foot:"<b>Short and steady wins.</b> Add a rep each time until you reach the top of the range, then go a little heavier. Stroller walks and runs count — log them for your week. Running with baby: a jogging stroller with a locking front wheel, smooth paths, and most guidance says baby 6+ months. Effort is good; joint pain isn't — swap anything that hurts."
  }
};

/* ==================================================================
   CUSTOM PLAN GENERATOR
   Builds an ATHLETES-shaped object (phase mode, one weekly template)
   from the builder selections. Reuses the whole session/player engine.
   ================================================================== */
var EX_DB = [
  // squat
  {name:"Bodyweight Squat",pat:"squat",eq:"bw",flags:[]},
  {name:"Slant Board Squat",pat:"squat",eq:"bw",flags:[]},
  {name:"Wall Sit",pat:"squat",eq:"bw",flags:[]},
  {name:"Goblet Squat",pat:"squat",eq:"db",flags:["knee"]},
  {name:"Barbell Back Squat",pat:"squat",eq:"barbell",flags:["knee"]},
  {name:"Leg Press",pat:"squat",eq:"machine",flags:[]},
  // hinge
  {name:"Single-Leg Romanian Deadlift",pat:"hinge",eq:"db",flags:[]},
  {name:"Romanian Deadlift",pat:"hinge",eq:"db",flags:["spinal"]},
  {name:"KB Swing",pat:"hinge",eq:"kb",flags:["spinal","impact"]},
  {name:"Glute Bridge",pat:"hinge",eq:"bw",flags:["floor"]},
  {name:"Barbell Deadlift",pat:"hinge",eq:"barbell",flags:["spinal"]},
  {name:"Back Extension",pat:"hinge",eq:"machine",flags:[]},
  // lunge
  {name:"Reverse Lunge",pat:"lunge",eq:"bw",flags:["knee"]},
  {name:"Split Squat",pat:"lunge",eq:"bw",flags:["knee"]},
  {name:"ATG Split Squat",pat:"lunge",eq:"bw",flags:["knee"]},
  {name:"Lateral Lunge",pat:"lunge",eq:"bw",flags:["knee"]},
  {name:"Step-Up",pat:"lunge",eq:"db",flags:[]},
  // horizontal push
  {name:"Push-up",pat:"pushH",eq:"bw",flags:[]},
  {name:"Incline Push-up",pat:"pushH",eq:"bw",flags:[]},
  {name:"Kneeling Push-up",pat:"pushH",eq:"bw",flags:[]},
  {name:"DB Bench Press",pat:"pushH",eq:"db",flags:[]},
  {name:"Band Chest Press",pat:"pushH",eq:"band",flags:[]},
  {name:"Barbell Bench Press",pat:"pushH",eq:"barbell",flags:[]},
  {name:"Machine Chest Press",pat:"pushH",eq:"machine",flags:[]},
  // vertical push (all overhead)
  {name:"Pike Push-up",pat:"pushV",eq:"bw",flags:["overhead"]},
  {name:"Single-Arm KB Press",pat:"pushV",eq:"kb",flags:["overhead"]},
  {name:"DB Overhead Press",pat:"pushV",eq:"db",flags:["overhead"]},
  {name:"Band Overhead Press",pat:"pushV",eq:"band",flags:["overhead"]},
  {name:"Barbell Overhead Press",pat:"pushV",eq:"barbell",flags:["overhead"]},
  {name:"Machine Shoulder Press",pat:"pushV",eq:"machine",flags:["overhead"]},
  // horizontal pull (row)
  {name:"Table Row",pat:"pullH",eq:"bw",flags:[]},
  {name:"Inverted Row",pat:"pullH",eq:"bar",flags:[]},
  {name:"DB Row",pat:"pullH",eq:"db",flags:[]},
  {name:"Bent-Over KB Row",pat:"pullH",eq:"kb",flags:["spinal"]},
  {name:"Bent-Over Band Row",pat:"pullH",eq:"band",flags:["spinal"]},
  {name:"Renegade Row",pat:"pullH",eq:"db",flags:["floor"]},
  {name:"Seated Cable Row",pat:"pullH",eq:"cable",flags:[]},
  {name:"Machine Row",pat:"pullH",eq:"machine",flags:[]},
  // vertical pull
  {name:"Doorway Row",pat:"pullV",eq:"bw",flags:[]},
  {name:"Pull-up",pat:"pullV",eq:"bar",flags:["overhead"]},
  {name:"Chin-up",pat:"pullV",eq:"bar",flags:["overhead"]},
  {name:"Negative Pull-up",pat:"pullV",eq:"bar",flags:["overhead"]},
  {name:"Band-Assisted Pull-up",pat:"pullV",eq:"band",flags:["overhead"]},
  {name:"Band Lat Pulldown",pat:"pullV",eq:"band",flags:["overhead"]},
  {name:"Lat Pulldown",pat:"pullV",eq:"machine",flags:["overhead"]},
  // hip
  {name:"Single-Leg Glute Bridge",pat:"hip",eq:"bw",flags:["floor"]},
  {name:"Isolated Hip Thrust",pat:"hip",eq:"bw",flags:["floor"]},
  {name:"Clamshell",pat:"hip",eq:"bw",flags:["floor"]},
  {name:"Standing Hip Abduction",pat:"hip",eq:"bw",flags:[]},
  {name:"Banded Lateral Walk",pat:"hip",eq:"band",flags:[]},
  {name:"Cable Kickback",pat:"hip",eq:"cable",flags:[]},
  // core
  {name:"Plank",pat:"core",eq:"bw",flags:["floor"]},
  {name:"Side Plank",pat:"core",eq:"bw",flags:["floor"]},
  {name:"Dead Bug",pat:"core",eq:"bw",flags:["floor"]},
  {name:"Bird Dog",pat:"core",eq:"bw",flags:["floor"]},
  {name:"Ab Wheel Rollout",pat:"core",eq:"bw",flags:["floor"]},
  {name:"Standing Knee Raise",pat:"core",eq:"bw",flags:[]},
  {name:"Suitcase Carry",pat:"core",eq:"db",flags:[]},
  {name:"Standing Anti-Rotation Press",pat:"core",eq:"band",flags:[]},
  // calf
  {name:"Calf Raise",pat:"calf",eq:"bw",flags:[]},
  {name:"Single-Leg Calf Raise",pat:"calf",eq:"bw",flags:[]},
  {name:"KOT Calf Raise",pat:"calf",eq:"bw",flags:[]},
  {name:"Seated Calf Raise",pat:"calf",eq:"db",flags:[]},
  // conditioning finishers
  {name:"Fast Step-Up",pat:"cond",eq:"bw",flags:[]},
  {name:"Squat-to-Stand Pulse",pat:"cond",eq:"bw",flags:[]},
  {name:"Mountain Climber",pat:"cond",eq:"bw",flags:["floor"]},
  {name:"High Knees",pat:"cond",eq:"bw",flags:["impact"]},
  {name:"Jump Squat",pat:"cond",eq:"bw",flags:["impact","knee"]},
  {name:"Burpee",pat:"cond",eq:"bw",flags:["impact","floor"]},
  {name:"KB Swing (finisher)",pat:"cond",eq:"kb",flags:["spinal","impact"]}
];
var WARMUPS=["Leg Swings","Arm Circles","Hip Circles","World's Greatest Stretch","Torso Twists","Bodyweight Squat"];
// warm-up / mobility moves (own picker category) — kept apart from EX_DB so
// the generator never picks them as working sets, but the swap picker offers
// them when you swap a warm-up. Each has a video + cues like everything else.
var MOBILITY=[
  {name:"Leg Swings",pat:"warm",eq:"bw",flags:[]},
  {name:"Arm Circles",pat:"warm",eq:"bw",flags:[]},
  {name:"Hip Circles",pat:"warm",eq:"bw",flags:[]},
  {name:"Torso Twists",pat:"warm",eq:"bw",flags:[]},
  {name:"World's Greatest Stretch",pat:"warm",eq:"bw",flags:[]},
  {name:"Treadmill walk",pat:"warm",eq:"machine",flags:[]},
  {name:"Band Pull-Apart",pat:"warm",eq:"band",flags:[]},
  {name:"Scap Pull-up",pat:"warm",eq:"bar",flags:["overhead"]},
  {name:"Thoracic Rotation",pat:"warm",eq:"bw",flags:["floor"]}
];
var EQ_TIERS={bodyweight:["bw"],dumbbells:["bw","db"],home:["bw","db","kb","band","bar"],full:["bw","db","kb","band","bar","barbell","machine","cable"]};
var LIMIT_FLAGS={impact:["impact"],knee:["knee"],shoulder:["overhead"],floor:["floor","spinal"]};
var DAY_LABEL={mon:"Mon",tue:"Tue",wed:"Wed",thu:"Thu",fri:"Fri",sat:"Sat",sun:"Sun"};
var GOAL_LABEL={stronger:"Get stronger",muscle:"Build muscle",general:"General fitness",fatloss:"Lose fat",endurance:"Endurance"};
var EQUIP_LABEL={bodyweight:"Bodyweight",dumbbells:"Dumbbells",home:"Home gym",full:"Full gym"};
var MAIN_PATS={squat:1,hinge:1,pushH:1,pushV:1,pullH:1,pullV:1};
// muscles worked by each movement pattern — powers the "focus / emphasis" picker
var PAT_MUS={squat:["quads","glutes"],hinge:["hams","glutes","back"],lunge:["quads","glutes"],
  pushH:["chest","arms","shoulders"],pushV:["shoulders","arms"],pullH:["back","arms"],pullV:["back","arms"],
  hip:["glutes"],core:["core"],calf:["calves"],cond:["quads","core"],warm:[]};
function musOf(x){ return PAT_MUS[x.pat]||[]; }
// user-facing focus areas -> the muscles they cover
var FOCUS_AREAS=[["glutes","Glutes"],["legs","Legs"],["back","Back"],["chest","Chest"],["shoulders","Shoulders"],["arms","Arms"],["core","Core"]];
var AREA_MUS={glutes:["glutes"],legs:["quads","hams","calves"],back:["back"],chest:["chest"],shoulders:["shoulders"],arms:["arms"],core:["core"]};
// preferred movement patterns for each focus area (first = most targeted)
var AREA_PATS={glutes:["hip","hinge"],legs:["squat","lunge","hinge","calf"],back:["pullH","pullV"],
  chest:["pushH"],shoulders:["pushV"],arms:["pushV","pullV","pushH","pullH"],core:["core"]};
var AREA_LABEL={}; FOCUS_AREAS.forEach(function(a){ AREA_LABEL[a[0]]=a[1]; });
var CAT_LABEL={squat:"Squat",hinge:"Hinge / Deadlift",lunge:"Lunge",pushH:"Chest / Push",pushV:"Shoulders",
  pullH:"Back / Row",pullV:"Pull-up / Pulldown",hip:"Glutes / Hips",core:"Core",calf:"Calves",carry:"Carry",cond:"Conditioning",warm:"Warm-up / Mobility"};
var CAT_ORDER=["squat","hinge","lunge","pushH","pushV","pullH","pullV","hip","core","calf","carry","cond","warm"];
var PICK_POOL=EX_DB.concat(MOBILITY); // swap picker draws from lifts + mobility
var EQ_LABEL={bw:"Bodyweight",db:"Dumbbell",kb:"Kettlebell",band:"Band",bar:"Pull-up bar",barbell:"Barbell",machine:"Machine",cable:"Cable"};

function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function hashStr(s){ var h=2166136261; for(var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
function shuffle(arr,rand){ var a=arr.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(rand()*(i+1)); var t=a[i];a[i]=a[j];a[j]=t; } return a; }

function allowedPool(cfg){
  var tiers=EQ_TIERS[cfg.equip]||EQ_TIERS.full;
  var excl={}; (cfg.limits||[]).forEach(function(l){ (LIMIT_FLAGS[l]||[]).forEach(function(f){ excl[f]=1; }); });
  return EX_DB.filter(function(x){
    if(tiers.indexOf(x.eq)===-1) return false;
    for(var i=0;i<x.flags.length;i++){ if(excl[x.flags[i]]) return false; }
    return true;
  });
}
function schemeFor(goal,exp,main){
  var s;
  if(goal==='stronger') s=main?{sets:{beginner:3,intermediate:4,advanced:5}[exp],reps:'4\u20136'}:{sets:3,reps:'8\u201310'};
  else if(goal==='muscle') s=main?{sets:{beginner:3,intermediate:3,advanced:4}[exp],reps:'8\u201312'}:{sets:3,reps:'10\u201315'};
  else if(goal==='fatloss') s={sets:3,reps:'12\u201315'};
  else s=main?{sets:3,reps:'10\u201312'}:{sets:{beginner:2,intermediate:3,advanced:3}[exp],reps:'12'};
  return s.sets+' \u00d7 '+s.reps;
}
function noteFor(ex){ return (ex.eq==='bw') ? '' : 'Weight where the last 1\u20132 reps are tough'; }

var SPLITS={
  3:[["squat","pushH","pullH","hip","core","calf"],["hinge","pushV","pullV","lunge","core","calf"],["lunge","pushH","pullH","hip","core","calf"]],
  4:[["pushH","pullH","pushV","pullV","core"],["squat","hinge","lunge","hip","calf"],["pushV","pullV","pushH","pullH","core"],["hinge","squat","lunge","hip","calf"]],
  5:[["pushH","pushV","pushH","core"],["pullH","pullV","pullH","core"],["squat","hinge","lunge","hip","calf"],["pushH","pullH","pushV","pullV","core"],["hinge","squat","lunge","hip","calf"]],
  6:[["pushH","pushV","pushH","core"],["pullH","pullV","pullH","core"],["squat","hinge","lunge","hip","calf"],["pushV","pushH","pushH","core"],["pullV","pullH","pullH","core"],["hinge","squat","lunge","hip","calf"]],
  7:[["pushH","pushV","pushH","core"],["pullH","pullV","pullH","core"],["squat","hinge","lunge","hip","calf"],["pushV","pushH","pushH","core"],["pullV","pullH","pullH","core"],["hinge","squat","lunge","hip","calf"],["squat","pushH","pullH","hip","core","calf"]]
};
var SPLIT_TITLES={
  3:["Full Body A","Full Body B","Full Body C"],
  4:["Upper A","Lower A","Upper B","Lower B"],
  5:["Push","Pull","Legs","Upper","Lower"],
  6:["Push A","Pull A","Legs A","Push B","Pull B","Legs B"],
  7:["Push A","Pull A","Legs A","Push B","Pull B","Legs B","Full Body"]
};
var TRAIN_DAYS={3:["mon","wed","fri"],4:["mon","tue","thu","fri"],5:["mon","tue","wed","thu","fri"],6:["mon","tue","wed","thu","fri","sat"],7:["mon","tue","wed","thu","fri","sat","sun"]};

function buildCustomPlan(cfg){
  var rand=mulberry32(hashStr(cfg.seed||cfg.id||cfg.name||'x'));
  var exp=cfg.exp, goal=cfg.goal, freq=Math.max(3,Math.min(7,cfg.freq||3));
  var pool=allowedPool(cfg);
  var avoid=cfg.avoid||[]; if(avoid.length) pool=pool.filter(function(x){ return avoid.indexOf(x.name)===-1; });
  var byPat={}; pool.forEach(function(x){ (byPat[x.pat]=byPat[x.pat]||[]).push(x); });
  Object.keys(byPat).forEach(function(p){ byPat[p]=shuffle(byPat[p],rand); });
  var cursor={};
  function pick(pat){ var l=byPat[pat]; if(!l||!l.length) return null; var i=(cursor[pat]||0)%l.length; cursor[pat]++; return l[i]; }
  // pick the next exercise for a pattern whose name isn't already used this day
  function pickUnused(pat,used){
    var l=byPat[pat]; if(!l||!l.length) return null;
    for(var t=0;t<l.length;t++){ var i=(cursor[pat]||0)%l.length; cursor[pat]++;
      if(!used[l[i].name]){ used[l[i].name]=1; return l[i]; } }
    return null;
  }
  // pick an unused accessory for a focus area, preferring its most targeted pattern
  function pickByArea(area,used){
    var pats=AREA_PATS[area]||[];
    var cand=pool.filter(function(x){ return !used[x.name] && pats.indexOf(x.pat)!==-1; });
    if(!cand.length) return null;
    var best=cand.filter(function(x){ return x.pat===pats[0]; });
    var from=best.length?best:cand;
    var p=from[Math.floor(rand()*from.length)]; used[p.name]=1; return p;
  }
  var warms=shuffle(WARMUPS,rand);
  function warmGroup(i){ return { label:"Warm-up \u00b7 5 min", items:[
    { name:warms[i%warms.length], scheme:"1\u20132 min" },
    { name:warms[(i+1)%warms.length], scheme:"\u00d7 10 / side" } ]}; }
  // session length drives how many working movements each day gets
  var nMain={ '30':3, '45':4, '60':5, '75':6 }[cfg.duration] || {beginner:4,intermediate:5,advanced:6}[exp] || 5;
  var durLabel={ '30':'~30 min', '45':'~45 min', '60':'~55 min', '75':'~70 min' }[cfg.duration] || '40\u201350 min';
  var emph=cfg.focus||[];

  var week={};
  function restDay(key){ return { key:key, label:DAY_LABEL[key], type:"rest", title:"Rest / Recovery",
    rest:["Full rest, or an easy walk / light stretch","Mobility for anything tight"] }; }

  if(goal==='endurance'){
    var runInt = exp==='beginner'?"6\u00d7 (1 min hard / 2 min easy)":exp==='advanced'?"6\u00d7 (2 min hard / 90s easy)":"8\u00d7 (1 min hard / 90s easy)";
    var runEasy = exp==='advanced'?"30\u201340 min w/ 10 min tempo":"20\u201330 min easy";
    var runLong = exp==='beginner'?"Long: build 25 \u2192 45 min":"Long: build 35 \u2192 70 min";
    function runDay(key,kind,title,extra){ return { key:key,label:DAY_LABEL[key],type:"run",title:title,dur:"30\u201360 min",
      run:{ kind:kind, warm: kind==='speed'?"10 min easy jog + 4\u00d7 20s strides":"5\u201310 min easy jog",
        cool: kind==='long'?"10 min walk, full stretch":"5 min walk + hamstring/hip stretch", extra:extra } }; }
    function condDay(key,title){ // light full-body strength support
      var pats=["squat","pushH","pullH","hip","core"], mains=[], used={}, wg=warmGroup(0);
      wg.items.forEach(function(it){ used[it.name]=1; });
      for(var i=0;i<pats.length && mains.length<4;i++){ var ex=pickUnused(pats[i],used); if(!ex)continue;
        mains.push({name:ex.name,scheme:schemeFor('general',exp,!!MAIN_PATS[pats[i]]),note:noteFor(ex)}); }
      return { key:key,label:DAY_LABEL[key],type:"strength",title:title,dur:"30\u201340 min",
        groups:[ wg, { label:"Support strength", items:mains } ] }; }
    var sched={
      3:{tue:['run','speed','Intervals',runInt],thu:['run','tempo','Easy / Tempo',runEasy],sat:['run','long','Long Run',runLong]},
      4:{mon:['cond','Strength Support'],tue:['run','speed','Intervals',runInt],thu:['run','tempo','Easy / Tempo',runEasy],sat:['run','long','Long Run',runLong]},
      5:{mon:['cond','Strength Support'],tue:['run','speed','Intervals',runInt],thu:['run','tempo','Easy / Tempo',runEasy],fri:['cond','Strength Support'],sat:['run','long','Long Run',runLong]},
      6:{mon:['cond','Strength Support'],tue:['run','speed','Intervals',runInt],wed:['run','tempo','Easy Run',runEasy],thu:['cond','Strength Support'],fri:['run','tempo','Easy / Tempo',runEasy],sat:['run','long','Long Run',runLong]},
      7:{mon:['cond','Strength Support'],tue:['run','speed','Intervals',runInt],wed:['run','tempo','Easy Run',runEasy],thu:['cond','Strength Support'],fri:['run','tempo','Easy / Tempo',runEasy],sat:['run','long','Long Run',runLong],sun:['run','tempo','Recovery Jog',runEasy]}
    }[freq];
    ["mon","tue","wed","thu","fri","sat","sun"].forEach(function(k){
      var s=sched[k];
      if(!s){ week[k]=restDay(k); }
      else if(s[0]==='run'){ week[k]=runDay(k,s[1],s[2],s[3]); }
      else { week[k]=condDay(k,s[1]); }
    });
  } else {
    var split=SPLITS[freq], titles=SPLIT_TITLES[freq], trainDays=TRAIN_DAYS[freq];
    // "always include" picks, spread round-robin across the training days
    var prefer=(cfg.prefer||[]).filter(function(nm){ return pool.some(function(x){return x.name===nm;}); });
    var preferByDay={}; prefer.forEach(function(nm,ix){ var d=ix%trainDays.length; (preferByDay[d]=preferByDay[d]||[]).push(nm); });
    trainDays.forEach(function(key,di){
      var pats=split[di], mains=[], used={}, wg=warmGroup(di);
      wg.items.forEach(function(it){ used[it.name]=1; }); // no move repeats within a day
      (preferByDay[di]||[]).forEach(function(nm){
        var ex=pool.filter(function(x){return x.name===nm;})[0];
        if(ex && !used[nm]){ used[nm]=1; mains.push({ name:nm, scheme:schemeFor(goal,exp,!!MAIN_PATS[ex.pat]), note:noteFor(ex) }); }
      });
      for(var i=0;i<pats.length && mains.length<nMain;i++){
        var ex=pickUnused(pats[i],used); if(!ex) continue;
        mains.push({ name:ex.name, scheme:schemeFor(goal,exp,!!MAIN_PATS[pats[i]]), note:noteFor(ex) });
      }
      var groups=[ wg, { label:"Strength", items:mains } ];
      // emphasis: add targeted accessory work, rotating focus areas across days
      if(emph.length){
        var picks=[], nFocus=(cfg.duration==='75'?2:1);
        for(var fi=0;fi<nFocus;fi++){
          var area=emph[(di+fi)%emph.length];
          var fex=pickByArea(area,used);
          if(fex) picks.push({ name:fex.name, scheme: goal==='stronger'?'3 \u00d7 8':(goal==='fatloss'?'3 \u00d7 15':'3 \u00d7 12'), note:noteFor(fex) });
        }
        if(picks.length) groups.push({ label:"Focus \u00b7 "+emph.map(function(a){return AREA_LABEL[a];}).join(' / '), items:picks });
      }
      var core=pickUnused('core',used); var fin=[];
      if(core) fin.push({ name:core.name, scheme: goal==='fatloss'?'40s':'\u00d7 12' });
      if(goal==='fatloss'){ var c=pickUnused('cond',used); if(c) fin.push({ name:c.name, scheme:'40s on / 20s off \u00d7 4' }); }
      if(fin.length) groups.push({ label: goal==='fatloss'?"Finisher":"Core", items:fin });
      week[key]={ key:key, label:DAY_LABEL[key], type: goal==='fatloss'?"mixed":"strength",
        title: titles[di]||"Strength", dur:durLabel, groups:groups };
    });
    ["mon","tue","wed","thu","fri","sat","sun"].forEach(function(k){ if(!week[k]) week[k]=restDay(k); });
  }

  var days=["mon","tue","wed","thu","fri","sat","sun"].map(function(k){ return week[k]; });
  var pw=cfg.weeks||0; // 0 = continuous
  var gLabel=GOAL_LABEL[goal]||"Custom";
  return {
    meta:{ name:(cfg.name||"You").toUpperCase(), tag:"CUSTOM \u00b7 "+freq+"\u00d7/wk",
      goal: gLabel+" \u00b7 "+(EQUIP_LABEL[cfg.equip]||"")+" \u00b7 "+(pw?pw+" wk":"ongoing") },
    theme: cfg.sex==='male' ? 'tactical' : 'fem',
    sex: cfg.sex, custom:true, mode:"phase", programWeeks:pw,
    phases:[ { key:"prog", label:(pw?"Weeks 1\u2013"+pw:"Ongoing"), range:gLabel, name:gLabel, from:1, to:9999 } ],
    phaseDays:{ prog:days },
    foot:"<b>Consistency wins.</b> Add a rep or a little weight when the last set feels easy. Missed a day? Do the next one \u2014 never miss twice."
  };
}

/* load / persist custom users */
function customList(){ try{ return JSON.parse(localStorage.getItem('trainops:custom'))||[]; }catch(e){ return []; } }
function customSave(list){ try{ localStorage.setItem('trainops:custom',JSON.stringify(list)); }catch(e){} }
// built-in athletes the user has removed from their roster (allowed only once
// they have a custom plan; restored automatically if all customs are deleted)
function hiddenBuiltins(){ try{ return JSON.parse(localStorage.getItem('trainops:hidden'))||[]; }catch(e){ return []; } }
function hiddenSave(list){ try{ localStorage.setItem('trainops:hidden',JSON.stringify(list)); }catch(e){} }
function loadCustomAthletes(){
  customList().forEach(function(cfg){ try{ ATHLETES[cfg.id]=buildCustomPlan(cfg); }catch(e){} });
}

var CUE_LIB = {
  "goblet squat":["Bell tight to your chest, elbows in","Sit down between your knees","Knees track over toes","Drive up through mid-foot"],
  "single-leg romanian deadlift":["Hinge at the hip, soft standing knee","Back stays flat, hips square","Reach the bell toward the floor","Squeeze the glute to stand tall"],
  "romanian deadlift":["Soft knees, push hips back","Bell drags down the thighs","Feel the hamstring stretch","Stand tall, squeeze glutes"],
  "kb swing":["Hinge, don't squat the swing","Snap the hips forward hard","Arms are just ropes","Bell floats to chest height"],
  "swing":["Hinge, don't squat","Snap hips to drive the bell","Let the arms stay loose","Chest height, not overhead"],
  "atg split squat":["Front foot flat, drop straight down","Let the back knee kiss the floor","Keep the torso tall","Push through the front heel"],
  "split squat":["Drop straight down, tall torso","Back knee toward the floor","Front knee over the ankle","Drive up through the front heel"],
  "slant board squat":["Heels elevated, chest up","Sink deep, knees forward","Control the descent","Stand through mid-foot"],
  "banded lateral walk":["Band tension the whole time","Small controlled side steps","Stay low in a quarter squat","Don't let knees cave in"],
  "ab wheel rollout":["Brace your abs before you roll","Roll only as far as you control","Don't let your hips sag","Pull back with your core, not arms"],
  "suitcase carry":["Stand tall, don't lean","Brace the opposite side","Slow controlled steps","Grip hard, ribs down"],
  "side plank":["Elbow under shoulder","Stack the hips, lift high","Straight line head to heel","Don't let the hip drop"],
  "chin-up":["Underhand grip, hands shoulder-width","Pull the elbows down to your ribs","Chin over the bar","Lower all the way, controlled"],
  "negative pull-up":["Jump or step so your chin starts over the bar","Lower yourself as slowly as you can (3–5s)","Keep the shoulders packed down","Full stretch at the bottom, then reset"],
  "band-assisted pull-up":["Loop the band under a knee or foot","Overhand grip, hang with arms straight","Pull the chest toward the bar","Let the band help where it's hardest"],
  "pull-up":["Start from a dead hang","Pull elbows down to your sides","Chin clears the bar","Lower all the way, controlled"],
  "push-up":["Hands under shoulders","Body in one straight line","Lower chest to the floor","Push all the way up"],
  "kneeling push-up":["Knees down, straight line knee to head","Hands under shoulders","Lower chest with control","Full press to lockout"],
  "single-arm kb press":["Brace the core, ribs down","Press straight overhead","Don't lean away from the bell","Lower to the shoulder controlled"],
  "bent-over kb row":["Hinge forward, flat back","Pull the bell to your hip","Squeeze the shoulder blade","Lower with control"],
  "bent-over band row":["Hinge forward, flat back","Pull the band to your ribs","Squeeze shoulder blades","Control the return"],
  "kb row":["Flat back, hinge at hips","Row to the hip, elbow tight","Squeeze at the top","Lower slow, no swing"],
  "band face pull":["Pull toward your forehead","Elbows high and wide","Squeeze the rear delts","Slow return, stay tall"],
  "pike push-up":["Hips high, head between hands","Lower the crown toward the floor","Elbows track back","Press back up to the pike"],
  "renegade row":["Wide feet for a stable base","Row one bell, hips stay square","Don't rotate or pike","Set it down soft, alternate"],
  "plank shoulder tap":["Wide feet, locked plank","Tap opposite shoulder","Fight the hip rotation","Slow and controlled"],
  "med ball russian twist":["Sit tall, lean back slightly","Rotate from the torso","Tap the ball side to side","Keep the chest open"],
  "tibialis raise":["Heels planted, back to the wall","Pull the toes up toward shins","Squeeze the front of the shin","Lower slow and controlled"],
  "slant board fhl calf raise":["Full stretch at the bottom","Rise onto the balls of your feet","Pause at the top","Slow controlled descent"],
  "kot calf raise":["Full ankle bend at the bottom","Rise all the way up","Pause and squeeze","Lower slow through full range"],
  "single-leg calf raise":["Stand on one foot, hold for balance","Rise onto the ball of the foot","Full stretch at the bottom","Slow and controlled, no bouncing"],
  "seated calf raise":["Balls of the feet on a block, weight on the knees","Drop the heels for a full stretch","Drive up onto the toes","Pause and squeeze at the top"],
  "calf raise":["Full stretch at the bottom","Rise onto the balls of the feet","Pause and squeeze at the top","Slow descent"],
  "slant board reverse step-down":["Stand on the elevated leg","Lower the other heel slowly","Keep the knee tracking forward","Drive back up controlled"],
  "banded hip flexion":["Stand tall, band on the foot","Drive the knee up against tension","Keep the standing leg strong","Lower with control"],
  "standing anti-rotation press":["Band anchored to the side","Press straight out from the chest","Resist the pull to rotate","Return slow, stay square"],
  "clamshell":["Lie on your side, knees bent","Open the top knee against the band","Keep the hips stacked","Lower with control"],
  "doorway pec stretch":["Forearm on the door frame, elbow at shoulder height","Step through gently until you feel the chest open","Ribs down, don't arch your low back","Breathe slowly — easy stretch, no pain"],
  "face pull":["Rope at forehead height","Pull toward your face, elbows high and wide","Squeeze your shoulder blades together","Slow return, stay tall"],
  "hip thrust":["Upper back on the edge of the bench","Drive through your heels, ribs down","Squeeze glutes at the top \u2014 don't arch your low back","Chin tucked, eyes forward"],
  "band row":["Band anchored at chest height","Pull your elbows back past your ribs","Squeeze your shoulder blades together","Slow return"],
  "biceps curl":["Elbows stay at your sides","Curl up, squeeze, lower for 3 seconds","No swinging \u2014 go lighter if you need to","Wrists straight"],
  "triceps extension":["Elbows point up and stay close to your head","Lower behind your head with control","Extend all the way and squeeze","Ribs down, don't arch your back"],
  "adductor squeeze":["Lie on your back, knees bent, ball or pillow between your knees","Squeeze at about 70% effort and hold — keep breathing","Low back stays relaxed, no arching","Feel it in the inner thighs, never in the back"],
  "donkey kick":["On all fours, band in place","Drive the heel toward the ceiling","Squeeze the glute at the top","Keep the back flat"],
  "bird dog":["Opposite arm and leg extend","Keep the hips level","Reach long, don't arch","Return under control"],
  "glute bridge":["Feet flat, drive through heels","Squeeze glutes at the top","Ribs down, don't overarch","Lower with control"],
  "single-leg glute bridge":["One foot planted, drive through the heel","Lift the hips level","Squeeze the working glute","Lower slow, stay square"],
  "isolated hip thrust":["Shoulders elevated, band on knees","Drive hips up, push knees out","Squeeze hard at the top","Lower controlled"],
  "squat side step":["Stay low in a squat","Step wide against the band","Keep tension, knees out","Controlled steps both ways"],
  "double pulse squat":["Sink to depth","Two small pulses at the bottom","Chest up throughout","Drive up on the second pulse"],
  "dead bug":["Lower back pressed to the floor","Opposite arm and leg extend","Move slow, brace the core","Don't let the back arch"],
  "kickback":["On all fours, flat back","Extend the leg straight back","Squeeze the glute","Control the return"],
  "lying leg abduction":["Lie on your side, legs stacked","Lift the top leg up","Keep the toe pointed forward","Lower slow, controlled"],
  "glute bridge spread":["Bridge up, feet flat","Spread the knees against the band","Hold the top, squeeze","Lower under control"],
  // ---- warm-up / mobility ----
  "leg swings":["Hold something for balance","Swing the leg front-to-back, relaxed","Then side-to-side","Stay loose — don't force range"],
  "arm circles":["Big slow circles forward","Then reverse","Keep shoulders down","Loosen, don't strain"],
  "hip circles":["Hands on hips, feet planted","Draw big circles with the hips","Both directions","Smooth and controlled"],
  "torso twists":["Feet planted, soft knees","Rotate through the mid-back","Let the arms swing","Easy, rhythmic pace"],
  "world's greatest stretch":["Step into a deep lunge","Drop the same-side elbow inside the foot","Rotate and reach to the ceiling","One or two per side, slow"],
  "scap pull-up":["Hang from the bar, arms straight","Pull the shoulder blades down and back — no elbow bend","Small range, control the lower","Primes the lats for pulling"],
  "thoracic rotation":["On all fours, one hand behind your head","Rotate that elbow up to the ceiling","Follow with your eyes, hips still","Open the upper back both sides"],
  "squat-to-stand":["Grab your toes, hips down","Drive hips up keeping the grip","Then sink back into the squat","Feel the hamstrings and hips open"],
  // ---- conditioning ----
  "mountain climber":["Strong plank, hands under shoulders","Drive knees to chest, quick","Hips low and level","Keep a steady rhythm"],
  "high knees":["Run in place, drive knees high","Stay light on the balls of your feet","Arms pump","Quick cadence"],
  "jump squat":["Sink to a squat","Explode straight up","Land soft, knees tracking out","Reset each rep"],
  "burpee":["Squat, hands down, kick back","Chest to floor if you can","Jump feet in","Stand and hop"],
  "fast step-up":["Drive off the top foot","Quick up, controlled down","Alternate lead legs","Keep the chest tall"],
  // ---- new lifts ----
  "bench press":["Shoulder blades pinched, feet planted","Lower to mid-chest, elbows ~45°","Press up and slightly back","Don't bounce off the chest"],
  "chest press":["Set the seat so handles are at mid-chest","Press without shrugging","Full range, controlled","Squeeze the chest at the top"],
  "overhead press":["Brace, ribs down","Press straight overhead","Don't lean back","Lower to the shoulders controlled"],
  "shoulder press":["Back supported, core braced","Press overhead smoothly","Stop just short of lockout stress","Lower with control"],
  "db row":["Flat back, hinge, hand on a bench","Row the bell to the hip","Squeeze the shoulder blade","Lower slow, no twist"],
  "seated cable row":["Tall chest, slight lean back","Pull to the belly, elbows close","Squeeze the mid-back","Control the return"],
  "lat pulldown":["Tall chest, slight lean","Pull the bar to the collarbone","Drive elbows down and in","Control back up, full stretch"],
  "inverted row":["Body straight, heels down","Pull chest to the bar","Squeeze the shoulder blades","Lower with control"],
  "reverse lunge":["Step straight back","Drop the back knee toward the floor","Front knee over the ankle","Drive through the front heel"],
  "lateral lunge":["Step wide to the side","Sit back into that hip","Keep the other leg straight","Push back to center"],
  "step-up":["Whole foot on the box","Drive through the top heel","Stand tall, don't push off the back foot","Lower under control"],
  "leg press":["Feet mid-platform, shoulder-width","Lower until knees ~90°","Don't let the lower back round","Press without locking out hard"],
  "barbell back squat":["Bar on the upper back, brace","Sit down between the hips","Knees track over toes","Drive up through mid-foot"],
  "barbell deadlift":["Bar over mid-foot, flat back","Take the slack out, then push the floor","Bar drags up the legs","Lock out tall, hips and bar together"],
  "back extension":["Hinge at the hips, not the low back","Squeeze glutes to rise","Stop at a straight line","Lower with control"],
  "wall sit":["Back flat on the wall","Slide to thighs parallel","Knees over ankles","Hold and breathe"],
  "standing hip abduction":["Stand tall, hold for balance","Lift the leg out to the side","Keep the toe forward","Lower slow, no swinging"],
  "cable kickback":["Hinge slightly, brace","Drive the heel back and up","Squeeze the glute","Control the return"],
  "standing knee raise":["Stand tall, brace the core","Drive one knee up to hip height","Don't lean back","Lower with control, alternate"],
  "plank":["Elbows under shoulders","Straight line head to heels","Squeeze glutes and brace","Don't let the hips sag or pike"]
};
var DEFAULT_CUES=["Warm up before your working sets","Control the weight through full range","Keep your core braced","Stop a rep or two before failure"];

function autoCues(name){
  var n=name.toLowerCase();
  var keys=Object.keys(CUE_LIB).sort(function(a,b){return b.length-a.length;});
  for(var i=0;i<keys.length;i++){ if(n.indexOf(keys[i])!==-1) return CUE_LIB[keys[i]]; }
  return DEFAULT_CUES;
}


/* form-check videos (YouTube IDs), longest-substring match like autoCues.
   The first ID is the one the player shows; where NASM's "How to do a ___"
   series covers a move, that's the one used. Unmatched exercises fall back
   to a YouTube search link. */
var VIDEO_LIB = {
  "glute bridge spread":["4QyXyg_pg8M"],
  "banded glute bridge":["91uayvdKAQY"],
  "band overhead triceps extension":["8GVCO0oklnI"],
  "triceps extension":["dxdr8iSRLA8"],
  "band biceps curl":["oXAMW-LNX_Q"],
  "biceps curl":["ykJmrZ5v0Oo"],
  "adductor squeeze":["vF4Q-pQUQRo"],
  "doorway pec stretch":["069o76BafTk"],
  "incline db press":["JKnpHchOWPU"],
  "face pull":["eTCBSFlCJ_s"],
  "barbell romanian deadlift":["xgusDooVfKU"],
  "single-leg romanian deadlift":["6pEL3KxnlEo"],
  "romanian deadlift":["QFbZevA7dps"],
  "goblet squat":["nfX7IFK9UNI"],
  "atg split squat":["j9Jy5RRMTrw","qfpkwZlG-cs","4qPJUSczLcM"],
  "split squat":["jXSwAIu70sc"],
  "kb swing":["pAWaNCsncZA","alFXWtV3VcE","1Qi0NQW89Oc"],
  "swing":["pAWaNCsncZA","alFXWtV3VcE","1Qi0NQW89Oc"],
  "banded lateral walk":["y_bqFDQZSHQ","9MuZrYJddcQ","cbDudaLroVs"],
  "ab wheel":["NbudTqiwguk","ikkOq5mHaho","j6lR4u193gE"],
  "suitcase carry":["y-hn_Ha1-RE","WhxtwWqb2BQ","eM7u45iNOEU"],
  "carry":["y-hn_Ha1-RE","WhxtwWqb2BQ","eM7u45iNOEU"],
  "side plank":["44ND4bOB-T0"],
  "chin-up":["T78xCiw_R6g","c8G0_NEJ-yA","e1YSApl-QcM"],
  "band-assisted pull-up":["4yE-XGDWJPg","ZHllQTJf7eA"],
  "negative pull-up":["ELOKABEA1mU","IXBHLLl3hbg","DGSm56-FixA"],
  "pull-up":["9yVGh3XbJ34"],
  "pike push-up":["pHR5yG6xBps","paCOGgmLCA0","fXgou2W10ok"],
  "kneeling push-up":["PDr5B2jLUOw"],
  "incline push-up":["0JUrOH--Kdk","49jfZ_z7-us","cfns5VDVVvk"],
  "push-up":["WDIpL0pjun0"],
  "single-arm kb press":["bqDq1RXrTGg","gjr-QAdsq4o","X-uFqWtjpGI"],
  "renegade row":["F68p7cJFtOI","0ANhSr-Vk9M","4qEIChzM4ZA"],
  "bent-over kb row":["IyQAMOV0WAc","vjM-TVScoao","BTSSM1iEhug"],
  "kb row":["IyQAMOV0WAc","vjM-TVScoao","BTSSM1iEhug"],
  "bent-over band row":["tcMmJ3c5P8c","YJiwzLHHKp8","vR9KcvzLqVo"],
  "band row":["qykwviNOIyc"],
  "band face pull":["AlTGQrDOd98","OIMUU2Q-upU","DvjmJdEswQ4"],
  "tibialis raise":["O8ZcXfwFuqs","mmLnKYwdDMM","RXC7tE6IQcc"],
  "slant board fhl calf raise":["p4Nv3VBkWho","GDVlVr6yWbg"],
  "fhl calf raise":["p4Nv3VBkWho","GDVlVr6yWbg"],
  "kot calf raise":["06cqmzQY9r4","99E-EhDYrGY"],
  "seated calf raise":["ORY-ke6vcgk","M5Pb5C7PgPc","71lLP3aglGQ"],
  "single-leg calf raise":["qhGe_FynFnQ","mFTQo8k1IIU"],
  "calf raise":["97NbelB5yvQ","KRJIKsY02nE","SVtg-1loH4c"],
  "bird dog":["ZdAHe9_HeEw"],
  "dead bug":["bxn9FBrt4-A"],
  "single-leg glute bridge":["lHXShY-FivU"],
  "glute bridge":["Z3cY3d3BBo4"],
  "isolated hip thrust":["z8WwUC_UA4w","pF17m_CXfL0","pBH7pKHn-dI"],
  "hip thrust":["z8WwUC_UA4w","pF17m_CXfL0","pBH7pKHn-dI"],
  "donkey kick":["KgghFOMKnkE","pF9eoC4LGIc","sbE6kb7ZtTU"],
  "kickback":["KgghFOMKnkE","pF9eoC4LGIc","sbE6kb7ZtTU"],
  "clamshell":["Cn09FlW5Zfs"],
  // ---- custom library coverage ----
  "bodyweight squat":["P-yaD24bUE8","R0vJBTrzLac"],
  "slant board squat":["P-yaD24bUE8","R0vJBTrzLac"],
  "wall sit":["JaZNYM3zAP0","sT0jUNnb9dk"],
  "barbell back squat":["CWl0apMgshk","8PMjqgR8Wa8"],
  "leg press":["cDGOn-yfKJA"],
  "barbell deadlift":["NVpwlMFrB3I","VG64cp5KTNo"],
  "back extension":["F6xrarzGl-g"],
  "reverse lunge":["u_zSfK5ZFU4","94AXT7D3bKY"],
  "lateral lunge":["liFeq7swKfc","gwWv7aPcD88","qCA8E-dF8cI"],
  "step-up":["9ZknEYboBOQ","tqECKZxlCKE"],
  "db bench press":["AuNRCrdhquE"],
  "barbell bench press":["CayG6UYqL8g"],
  "band chest press":["4B6O2dHDjBw","F_A2aa9anT0"],
  "machine chest press":["sqNwDkUU_Ps","pLofEAcfsO8","zgP-UCKGe24"],
  "bench press":["5Y3VZsLb1Ys","pKZMNVbfUzQ"],
  "chest press":["sqNwDkUU_Ps","pLofEAcfsO8"],
  "db overhead press":["M2rwvNhTOu0","Did01dFR3Lk"],
  "barbell overhead press":["ZXpdJOLNoWw","wuFsq9tOsfs","iZq4yvgnajM"],
  "band overhead press":["0rLjkQweIDg","Zli1UXH9ZeE"],
  "machine shoulder press":["3R14MnZbcpw","e5gJP7quyGk","BAZkFGeUy5U"],
  "overhead press":["M2rwvNhTOu0","Did01dFR3Lk"],
  "shoulder press":["M2rwvNhTOu0","Did01dFR3Lk"],
  "db row":["nNpxG9fGHoM"],
  "table row":["EIFEKZe4Wm8","FKKZRwBJDxE","jjSaYXeKiNk"],
  "inverted row":["Fl0UMfdEzsE","ytFnYaoIkSg"],
  "doorway row":["g8wWFlr2gQU","ytEalkENNiQ"],
  "seated cable row":["0R9ZQd3aM6s"],
  "machine row":["k0cTJCfxa0Y"],
  "band lat pulldown":["SkT4rqrmH-M"],
  "lat pulldown":["CAwf7n6Luuc"],
  "standing hip abduction":["xUxWsvWj3Go","4qr26RNU3EQ"],
  "cable kickback":["NVcdnjBfOIE"],
  "standing knee raise":["D0GwAezTvtg","lR3cpCVBjPM"],
  "standing anti-rotation press":["dBAmQ9bx3JA","P16SQlmWj1o"],
  "plank":["A2b2EmIg0dA","mwlp75MS6Rg"],
  "squat-to-stand":["G5iP1-kE4-4","xWtrhKwUscU"],
  "jump squat":["tZSYZdtbONc","8Sl9h44XNJA"],
  "high knees":["lR3cpCVBjPM","82pdtHaANGk"],
  "mountain climber":["CQk4MHY2_Tc","gW-q50V6Z_0"],
  "burpee":["bTh6KWfW-r8","wGvBfVeCNko"],
  "leg swings":["difYoBtZi2s","D17eUtUt0zQ"],
  "arm circles":["tYo5ghpLksg","mwDgFY86zck","140RTNMciH8"],
  "hip circles":["JYqLwajOGjI","altA7815AGs","qkrJXGVj_OQ"],
  "torso twists":["QQMri8bsjy8","f4Qah0bQTIo","h6XyzlM8m24"],
  "world's greatest stretch":["T6j7BpxeqqU","-CiWQ2IvY34"],
  // ---- built-in plan (Anthony / Celina) coverage ----
  "band pull-apart":["smSSXITNpCI","LoBBo1dtY6I"],
  "scap pull-up":["-ZIpSoTRsuE","inxW0UX9b5A","AHsmKp5AK6k"],
  "thoracic rotation":["z2zv526I7M8","AzCghjjWt5k","3ZZpWdpYbTQ"],
  "plank shoulder tap":["gKA5LBy7WAI","sNmFn1qmT28"],
  "russian twist":["DLpMtMZnpy0","2_MsoqTpIJ8"],
  "lying leg abduction":["CTmFNSDJTR8","g9FtnmsIYgI"],
  "treadmill walk":["8i3Vrd95o2k","TSTrFpCBBNk"],
  "squat side step":["y_bqFDQZSHQ","9MuZrYJddcQ"],
  "double pulse squat":["P-yaD24bUE8","R0vJBTrzLac"],
  "banded hip flexion":["D0GwAezTvtg","lR3cpCVBjPM"],
  "slant board reverse step-down":["95gQB2YU0JA","Or4C-UQ63Xc"],
  "reverse step-down":["95gQB2YU0JA","Or4C-UQ63Xc"]
};
function videoIds(name){
  var n=name.toLowerCase();
  var keys=Object.keys(VIDEO_LIB).sort(function(a,b){return b.length-a.length;});
  for(var i=0;i<keys.length;i++){ if(n.indexOf(keys[i])!==-1) return VIDEO_LIB[keys[i]]; }
  return null;
}
function videoId(name){ var v=videoIds(name); return v?v[0]:null; }
