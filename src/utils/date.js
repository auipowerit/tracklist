import dayjs from "dayjs";

export function getCurrentDate() {
  const date = dayjs().format("dddd, MMMM D");
  return date;
}

/* 8:00 PM */
export function formatTime(time) {
  const formattedTime = new Date(`1970-01-01T${time}Z`).toLocaleTimeString(
    "en-US",
    { timeZone: "UTC", hour12: true, hour: "numeric", minute: "numeric" },
  );

  return formattedTime;
}

/* Jan 1 */
export function formatDateMDShort(date) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return formattedDate;
}

/* January 01 */
export function formatDateMDLong(date) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
  });

  return formattedDate;
}

/* January 1, 2025 */
export function formatDateMDYLong(date) {
  if (!date) return null;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return formattedDate;
}

/* Monday, January 1 */
export function formatDateDMD(date) {
  return dayjs(date).format("dddd, MMMM D");
}

/* 1 hour ago */
export function getTimeSince(date) {
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return minutes < 2 ? "A minute ago" : minutes + " minutes ago";
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return hours < 2 ? "An hour ago" : hours + " hours ago";
  }

  const days = Math.round(hours / 24);
  if (days < 7) {
    return days < 2 ? "A day ago" : days + " days ago";
  }

  const weeks = Math.round(days / 7);
  if (weeks < 4) {
    return weeks < 2 ? "A week ago" : weeks + " weeks ago";
  }

  const months = Math.round(days / 30.44);
  if (months < 12) {
    return months < 2 ? "A month ago" : months + " months ago";
  }

  const years = Math.round(months / 12);
  return years < 2 ? "A year ago" : years + " years ago";
}

/* 1h ago */
export function getTimeSinceShort(date) {
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return minutes + "m ago";
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return hours + "h ago";
  }

  const days = Math.round(hours / 24);
  if (days < 7) {
    return days + "d ago";
  }

  const weeks = Math.round(days / 7);
  if (weeks < 4) {
    return weeks + "w ago";
  }

  const months = Math.round(days / 30.44);
  if (months < 12) {
    return months + "m ago";
  }

  const years = Math.round(months / 12);
  return years + "y ago";
}

/* Today / Last 7 Days */
export function getTimeSinceDay(date) {
  const now = new Date();
  const days = Math.round((now - date) / 1000 / 60 / 60 / 24);

  if (days === 0) {
    return "Today";
  }

  if (days === 1) {
    return "Yesterday";
  }

  if (days <= 7) {
    return "Last 7 days";
  }

  if (days <= 30) {
    return "Last 30 days";
  }

  return "Older";
}
