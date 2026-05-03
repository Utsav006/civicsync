/**
 * Utility to generate "Add to Google Calendar" template URLs.
 * 
 * @param {string} title - The event title.
 * @param {string} details - The event description.
 * @param {string} location - The event location.
 * @param {string} startDate - The start date/time in YYYYMMDDTHHmmssZ format.
 * @param {string} endDate - The end date/time in YYYYMMDDTHHmmssZ format.
 * @returns {string} - The Google Calendar template URL.
 */
export function generateGoogleCalendarUrl(title, details, location, startDate, endDate) {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  
  const params = new URLSearchParams({
    text: title,
    details: details,
    location: location,
    dates: `${startDate}/${endDate}`
  });

  return `${baseUrl}&${params.toString()}`;
}
