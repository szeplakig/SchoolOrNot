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
    School: [{ from: "08:00:00", to: "16:00:00" }],
    Work: [],
  },
  Tuesday: {
    School: [],
    Work: [{ from: "08:00:00", to: "16:00:00" }],
  },
  Wednesday: {
    School: [],
    Work: [{ from: "08:00:00", to: "16:00:00" }],
  },
  Thursday: {
    School: [],
    Work: [{ from: "08:00:00", to: "16:00:00" }],
  },
  Friday: {
    School: [{ from: "08:00:00", to: "16:00:00" }],
    Work: [],
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
      let seen = seenTypes.filter((t) => t == act.type).length < 2;
      if (seen) seenTypes.push(act.type);
      return seen;
    })
    .map((act) => {
      if (now.isBetween(act.from, act.to)) {
        return `<h3>${act.tentative ? "<u>(Tentative)</u> " : ""}Doing '${
          act.type
        }' right now for ${act.to.fromNow(
          true
        )}!</h3><h5>${act.from.calendar()} to ${act.to.calendar()}</h5>`;
      } else {
        return `<h4>${act.tentative ? "<u>(Tentative)</u> " : ""}'${
          act.type
        }' ${now.to(
          act.from
        )}, ${act.from.calendar()}</h4><h5>${act.from.calendar()} to ${act.to.calendar()}</h5>`;
      }
    })
    .join("<br>");
  if (info.innerHTML != text) {
    info.innerHTML = text;
  }
}

draw();
setInterval(draw, 1000);
