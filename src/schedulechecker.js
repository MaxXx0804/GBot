const { EmbedBuilder } = require("@discordjs/builders");

function convertTimeStringToDate(timeStr, baseDate = new Date()) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const result = new Date(baseDate);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

function GetCurrentSchedule() {
  let sched = CurrentSchedule();
  if (!sched || sched.length === 0) {
    return new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("No classes today")
      .setDescription("Enjoy your free time!");
  }

  const now = new Date();

  for (let subject of sched) {
    const start = convertTimeStringToDate(subject.Start, now);
    const end = convertTimeStringToDate(subject.End, now);

    if (now >= start && now <= end) {
      const timeLeftMs = end - now;
      const mins = Math.floor(timeLeftMs / (1000 * 60)) % 60;
      const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
      const timeLeftStr = `${hours > 0 ? `${hours}h ` : ''}${mins}m`;

      return SetCurrentSchedule(subject, `Ongoing: ${subject.SubjectName} ends in ${timeLeftStr}`);
    }

    if (now < start) {
      const timeLeftMs = start - now;
      const mins = Math.floor(timeLeftMs / (1000 * 60)) % 60;
      const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
      const timeLeftStr = `${hours > 0 ? `${hours}h ` : ''}${mins}m`;

      return SetCurrentSchedule(subject, `Next class in ${timeLeftStr}: ${subject.SubjectName}`);
    }
  }

  return new EmbedBuilder()
    .setColor(0xffcc00)
    .setTitle("All classes done for today")
    .setDescription("You’ve finished all scheduled classes for today.");
}


function SetCurrentSchedule(subject, titleText) {
  return new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(titleText)
    .addFields(
      { name: "Subject", value: subject.SubjectName, inline: false },
      { name: "Type", value: subject.Type, inline: false },
      { name: "Start", value: subject.Start, inline: false },
      { name: "End", value: subject.End, inline: false },
      { name: "Professor", value: subject.Prof, inline: false }
    );
}

function CurrentSchedule() {
  const days = ["Monday", "Tuesday", "Off", "Off", "Friday", "Saturday", "Off"];
  const schedules = {
    Monday: [
      {
        SubjectName: "Elective 3",
        Type: "Online Class",
        Start: "12:00 PM",
        End: "2:00 PM",
        Prof: "Unknown",
      },
      {
        SubjectName: "Thesis 1",
        Type: "Online Class",
        Start: "3:00 PM",
        End: "5:00 PM",
        Prof: "Unknown",
      },
      {
        SubjectName: "SOCIPP",
        Type: "Online Class",
        Start: "5:00 PM",
        End: "8:00 PM",
        Prof: "Unknown",
      },
    ],
    Tuesday: [
      {
        SubjectName: "Elective 4",
        Type: "Online Class",
        Start: "10:00 AM",
        End: "12:00 PM",
        Prof: "Unknown",
      },
      {
        SubjectName: "Elective 3",
        Type: "F2F",
        Start: "1:30 PM",
        End: "4:30 PM",
        Prof: "Unknown",
      },
      {
        SubjectName: "Elective 5",
        Type: "Online Class",
        Start: "6:00 PM",
        End: "8:00 PM",
        Prof: "Unknown",
      },
    ],
    Friday: [
      {
        SubjectName: "Elective 4",
        Type: "F2F",
        Start: "9:00 AM",
        End: "12:00 PM",
        Prof: "Unknown",
      },
      {
        SubjectName: "Thesis 1",
        Type: "F2F",
        Start: "1:30 PM",
        End: "4:30 PM",
        Prof: "Unknown",
      },
    ],
    Saturday: [
      {
        SubjectName: "ADEPT",
        Type: "F2f",
        Start: "1:30 PM",
        End: "4:30 PM",
        Prof: "Unknown",
      },
      {
        SubjectName: "Elective 5",
        Type: "F2F",
        Start: "6:00 PM",
        End: "9:00 PM",
        Prof: "Unknown",
      },
      
    ],
  };

  const dateToday = new Date();
  const todayName = days[dateToday.getDay() - 1];
  if (todayName === "Off" || !schedules[todayName]) {
    return null;
  }

  return schedules[todayName];
}

function GetNextSchedule() {
    // Your logic to get the next schedule
    // Return an EmbedBuilder instance for the next schedule
}

module.exports = { GetCurrentSchedule, GetNextSchedule };
