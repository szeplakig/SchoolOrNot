const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeTable = {
  Monday: {
    School: [{ from: "12:00:00", to: "16:00:00" }],
    Work: [{ from: "08:00:00", to: "12:00:00" }],
  },
  Tuesday: {
    School: [
      { from: "08:00:00", to: "10:00:00" },
      { from: "13:00:00", to: "15:00:00" },
    ],
    Work: [
      { from: "10:00:00", to: "13:00:00" },
      { from: "13:00:00", to: "15:00:00", tentative: true },
      { from: "15:00:00", to: "17:00:00" },
    ],
  },
  Wednesday: {
    School: [{ from: "08:00:00", to: "19:15:00" }],
    Work: [{ from: "14:00:00", to: "16:00:00", tentative: true }],
  },
  Thursday: {
    School: [{ from: "12:00:00", to: "16:00:00" }],
    Work: [
      { from: "08:00:00", to: "12:00:00" },
      { from: "12:00:00", to: "14:00:00", tentative: true },
    ],
  },
  Friday: {
    School: [{ from: "08:00:00", to: "12:00:00" }],
    Work: [{ from: "12:00:00", to: "17:00:00" }],
  },
  Saturday: {
    School: [],
    Work: [],
  },
  Sunday: {
    School: [],
    Work: [],
  },
};

function draw() {
  const now = moment();
  const today = moment().format("dddd");
  const activities = days
    .slice(days.indexOf(today))
    .concat(days.slice(0, days.indexOf(today)))
    .flatMap((day, offset) =>
      Object.keys(timeTable[day]).flatMap((activityType) =>
        timeTable[day][activityType].flatMap((range) => ({
          from: moment(range.from, "HH:mm:ss").add(offset, "days"),
          to: moment(range.to, "HH:mm:ss").add(offset, "days"),
          tentative: range.tentative,
          type: activityType,
        }))
      )
    )
    .sort((a, b) => a.from.unix() - b.from.unix());

  const time = document.getElementById("time");
  time.innerHTML = `<h1>${now.format("Do MMMM YYYY, HH:mm:ss")}</h1>`;
  
  const seenTypes = [];
  const info = document.getElementById("info");
  const text = activities
  .filter((act) => {
    if (act.to.diff(now) <= 0) return false;
    let seen = seenTypes.filter((t) => t == act.type).length < 1;
    if (seen) seenTypes.push(act.type);
    return seen;
  })
  .map((act) => {
    if (now.isBetween(act.from, act.to)) {
      return `<h3>${act.tentative ? "<u>(Tentative)</u> " : ""}Doing '${
        act.type
      }' right now for ${act.to.fromNow(true)}!</h3><h5>${act.from.calendar()} to ${act.to.calendar()}</h5>`;
    } else {
      return `<h4>${act.tentative ? "<u>(Tentative)</u> " : ""}'${
        act.type
      }' ${now.to(act.from)}, ${act.from.calendar()}</h4><h5>${act.from.calendar()} to ${act.to.calendar()}</h5>`;
    }
  })
  .join("<br>")
  if(info.innerHTML != text){
    info.innerHTML = text;
  }
}

draw();
setInterval(draw, 1000);
