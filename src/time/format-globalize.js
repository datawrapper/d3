// The date and time format (%c), date format (%x) and time format (%X).
var d3_time_formatDateTime = "%a %e %b %X %Y",
    d3_time_formatDate = "%d.%m.%Y",
    d3_time_formatTime = "%H:%M:%S";

// The weekday and month names.
var d3_time_days = Globalize.culture(__locale).calendar.days.names,
    d3_time_dayAbbreviations = Globalize.culture(__locale).calendar.days.namesAbbr,
    d3_time_months = Globalize.culture(__locale).calendar.months.names,
    d3_time_monthAbbreviations = Globalize.culture(__locale).calendar.months.namesAbbr;

